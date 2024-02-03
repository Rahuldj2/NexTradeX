import React from "react";
import { useMoralis } from "react-moralis";
import { useEffect,useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { contractABI, contract_address } from "../../contracts/ContractDetails.js";
const ContractTest = () => {
    const{enableWeb3,account,isWeb3Enabled}=useMoralis()
    const [Price,setPrice] = useState('');
    useEffect(()=>{
        console.log("HI")
        if (isWeb3Enabled)
        {
            setPrice("100000000000000000")
            return
        }
        enableWeb3()

    },[isWeb3Enabled])

    // address owner,
    //     uint256 price,
    //     string memory _propertyTitle,
    //     string memory _category,
    //     string memory _images,
    //     string memory _propertyAddress,
    //     string memory _description

    const {runContractFunction: listProperty}=useWeb3Contract({
        abi:contractABI,
        contractAddress:contract_address,
        functionName:"listProperty",
        params:{"owner":account,"price":Price,"_propertyTitle":"test1","_category":"test1","_images":"test1","_propertyAddress":"test11","_description":"testonlinefrontend"}
    })
    const handleClick=async()=>{
        await listProperty()
    }
    return <div>
        {
            account ?(
                <>
                <div>Connected to {account}</div>
                <button onClick={handleClick}>make a property</button>
                </>
            ):(<button onClick={async ()=>{await enableWeb3()}}>Connect</button>)
        }
        
    </div>
}

export default ContractTest;
