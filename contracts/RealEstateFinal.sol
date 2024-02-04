// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract RealEstate {
    //
    uint private contractBalance;

    struct Property {
        uint256 productID;
        address owner;
        uint256 price;
        string propertyTitle;
        string category;
        string images;
        string propertyAddress;
        string description;
        address[] reviewers;
        string[] reviews;
        bool upForSale;
    }

    //MAPPING
    mapping(uint256 => Property) private properties;
    uint256 public propertyIndex;

    //EVENTS
    event PropertyListed(
        uint256 indexed id,
        address indexed owner,
        uint256 price
    );
    event PropertySold(
        uint256 indexed id,
        address indexed oldOwner,
        address indexed newOwner,
        uint256 price
    );
    event PropertyResold(
        uint256 indexed id,
        address indexed oldOwner,
        address indexed newOwner,
        uint256 price
    );
    event FundsRefunded(
        address indexed recipient,
        uint256 amount,
        uint256 propertyId
    );

    //FUNCTIONS IN CONTRACT

    //this is putting up for sale basically
    //this is the tokenization process
    //a person is not exactly minting an nft but instead putting up metadata on blockchain
    //Before this function is triggered we need to apply the government verification

    function tokenize(
        address owner,
        uint256 price,
        string memory _propertyTitle,
        string memory _category,
        string memory _images,
        string memory _propertyAddress,
        string memory _description
    ) external returns (uint256) {
        require(price > 0, "price must be greater than 0");
        uint256 productId = propertyIndex++;
        Property storage property = properties[productId];
        property.productID = productId;
        property.owner = owner;
        property.price = price;
        property.propertyTitle = _propertyTitle;
        property.images = _images;
        property.propertyAddress = _propertyAddress;
        property.description = _description;
        property.category = _category;
        property.upForSale = false;
        emit PropertyListed(productId, owner, price);
        return productId;
    }

    //puts the property corresponding to the id up for sale
    function putForSale(
        address owner,
        uint256 productId
    ) external returns (string memory) {
        //ADD REQUIRE msg.sender later
        Property storage property = properties[productId];

        //only owner of that property can put for sale
        require(property.owner == owner, "you are not the owner");
        property.upForSale = true;
        return "property has been put up for sale";
    }

    function cancelPropertySale(
        address owner,
        uint256 productId
    ) external returns (string memory) {
        //If there are existing bids here
        //return all bids to respective owners
        Property storage property = properties[productId];

        //only owner of that property can put for sale
        require(property.owner == owner, "you are not the owner");
        property.upForSale = false;
        return "property is out from the marketplace";
    }

    //just some power
    function updateProperty(
        address owner,
        uint256 productId,
        string memory _propertyTitle,
        string memory _category,
        string memory _images,
        string memory _propertyAddress,
        string memory _description
    ) external returns (uint256) {
        Property storage property = properties[productId];
        require(property.owner == owner, "You are not the owner");
        property.productID = productId;
        property.propertyTitle = _propertyTitle;
        property.images = _images;
        property.propertyAddress = _propertyAddress;
        property.description = _description;
        property.category = _category;

        return productId;
    }

    //owner can update price of property
    function updatePrice(
        address owner,
        uint256 productId,
        uint256 price
    ) external returns (string memory) {
        Property storage property = properties[productId];

        require(property.owner == owner, "you are not the owner");
        property.price = price;

        return "price updated";
    }

    struct Bid {
        address buyer;
        uint256 propertyId;
        uint256 amount;
        bool cancelled;
        bool accepted;
    }

    // Add this mapping for storing bids
    mapping(uint256 => Bid) private bids;
    uint256 public bidIndex;

    // Modify the fundInitial function
    function fundInitial(uint256 propertyId) external payable {
        require(
            propertyId < propertyIndex &&
                properties[propertyId].upForSale == true,
            "Invalid propertyId"
        );

        // Create a unique bidId for each fundInitial call
        uint256 bidId = bidIndex++;

        // Store bid details in the mapping
        bids[bidId] = Bid({
            buyer: msg.sender,
            propertyId: propertyId,
            amount: msg.value,
            cancelled: false,
            accepted: false
        });

        // Update contract balance
        contractBalance += msg.value;
    }

    // Modify the cancelBuy function
    function cancelBuy(uint256 bidId) external {
        require(bidId < bidIndex, "Invalid bidId");

        Bid storage bid = bids[bidId];

        // Check if the sender is the buyer and the bid is not cancelled
        require(
            msg.sender == bid.buyer && !bid.cancelled,
            "Invalid cancellation"
        );

        // Mark the bid as cancelled
        bid.cancelled = true;

        // Update contract balance
        contractBalance -= bid.amount;

        // Transfer funds back to the buyer
        payable(msg.sender).transfer(bid.amount);

        emit FundsRefunded(msg.sender, bid.amount, bid.propertyId);
    }


    event ShowAllBids(Bid[] bids);
    function getAllBids(
        address owner,
        uint256 propertyId
    ) external returns (Bid[] memory) {
        // Check ownership and sale status
        require(
            properties[propertyId].owner == owner &&
                properties[propertyId].upForSale,
            "Invalid property ownership or not up for sale"
        );

        uint256 totalBids = bidIndex;
        uint256 bidCount = 0;
        uint256 currentIndex = 0;

        // Count the number of bids for the specified property
        for (uint256 i = 0; i < totalBids; i++) {
            Bid storage currentBid = bids[i];
            if (currentBid.propertyId == propertyId && !currentBid.cancelled) {
                bidCount += 1;
            }
        }

        // Create an array to store bids for the specified property
        Bid[] memory propertyBids = new Bid[](bidCount);

        // Populate the array with bids for the specified property
        for (uint256 i = 0; i < totalBids; i++) {
            Bid storage currentBid = bids[i];
            if (currentBid.propertyId == propertyId && !currentBid.cancelled) {
                propertyBids[currentIndex] = currentBid;
                currentIndex += 1;
            }
        }
        emit ShowAllBids(propertyBids);
        return propertyBids;
    }

    function acceptDeal(uint256 bidId) external {
        address seller = msg.sender;

        // Ensure that the caller is the owner of the property
        require(
            properties[bids[bidId].propertyId].owner == seller,
            "You are not the owner of this property"
        );

        // Ensure that the bid is not cancelled
        require(!bids[bidId].cancelled, "Bid has been cancelled");

        // Mark the bid as accepted
        bids[bidId].accepted = true;
    }

    // Add this function to your contract
    function finalize(
        address buyer,
        uint256 bidId,
        uint256 propertyId
    ) external {
        address seller = properties[propertyId].owner;
        Property storage property = properties[propertyId];
        Bid storage acceptedBid = bids[bidId];

        // Ensure that the caller is the buyer
        require(msg.sender == buyer, "You are not the owner of this property");

        // Ensure that the bid is accepted
        require(acceptedBid.accepted, "Bid has not been accepted");

        // Transfer funds to the seller
        uint256 amountToTransfer = acceptedBid.amount;
        contractBalance -= amountToTransfer;
        payable(seller).transfer(amountToTransfer);

        // Transfer ownership to the buyer
        property.owner = buyer;

        // Emit event for property sold
        emit PropertySold(propertyId, seller, buyer, acceptedBid.amount);

        // Refund other bids
        for (uint256 i = 0; i < bidIndex; i++) {
            if (i != bidId) {
                Bid storage otherBid = bids[i];

                // Ensure the other bid is not cancelled
                if (!otherBid.cancelled) {
                    // Refund the bid amount to the respective buyer
                    contractBalance -= otherBid.amount;
                    payable(otherBid.buyer).transfer(otherBid.amount);

                    // Mark the bid as cancelled
                    otherBid.cancelled = true;
                }
            }
        }
    }

    //this buy function instantly transfers ownership
    //What I want is first user will tokenize the asset
    // and then listProperty should be called only when it is up for sale

    //for front end
    //add additional logic that will fetch properties up for sale only

    //emit this also
    
    event PropertiesAll(Property[] properties);
    function getAllProperties() public returns (Property[] memory) {
        uint256 itemCount = propertyIndex;
        uint256 currentIndex = 0;

        Property[] memory items = new Property[](itemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            uint256 currentId = i;
            Property storage currentItem = properties[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }
        emit PropertiesAll(items);
        return items;
    }

    //emit this
    event PropertiesForSaleFetched(Property[] properties);
    function getAllPropertiesForSale() public returns (Property[] memory) {
        uint256 itemCount = propertyIndex;
        uint256 currentIndex = 0;

        // Dynamic array to store only properties for sale
        Property[] memory itemsForSale = new Property[](itemCount);

        for (uint256 i = 0; i < itemCount; i++) {
            uint256 currentId = i;
            Property storage currentItem = properties[currentId];

            if (currentItem.upForSale) {
                itemsForSale[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        // Create a new dynamic array with correct size containing only properties for sale
        Property[] memory result = new Property[](currentIndex);
        for (uint256 i = 0; i < currentIndex; i++) {
            result[i] = itemsForSale[i];
        }

        emit PropertiesForSaleFetched(result);
        return result;
    }


    function getProperty(
        uint256 id
    )
        external
        view
        returns (
            uint256,
            address,
            uint256,
            string memory,
            string memory,
            string memory,
            string memory,
            bool
        )
    {
        Property memory property = properties[id];

        return (
            property.productID,
            property.owner,
            property.price,
            property.propertyTitle,
            property.category,
            property.propertyAddress,
            property.description,
            property.upForSale
        );
    }

    event PropertiesFetched(Property[] properties);
    function getUserProperties(
        address user
    ) public returns (Property[] memory) {
        uint256 totalItemCount = propertyIndex;
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (properties[i].owner == user) {
                itemCount += 1;
            }
        }
        Property[] memory items = new Property[](itemCount);

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (properties[i].owner == user) {
                uint256 currentId = i;
                Property storage currentItem = properties[currentId];

                items[currentIndex] = currentItem;

                currentIndex += 1;
            }
        }
        emit PropertiesFetched(items);
        return items;
    }
}