
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { contractABI, contract_address } from "../../contracts/NewContractDetails.js";


const ListView = ({ data }) => {
  const { enableWeb3, account, isWeb3Enabled } = useMoralis()
  
    const[bidId,SetBidId]=useState();

    const { runContractFunction: acceptDeal } = useWeb3Contract({
        abi: contractABI,
        contractAddress: contract_address,
        functionName: "acceptDeal",
        params: { "bidId": bidId},//state variable update
    });

    useEffect(() => {
        async function acceptFuncDeal() {            
        console.log(bidId)
        await acceptDeal();
        }

        acceptFuncDeal();

    },[bidId]);
  const handleClick = async (id) => {
    console.log("clicked");
    console.log("id",id)
    SetBidId(id)
    // await getAllBids();
  }

 

  useEffect(() => {
    console.log("HI")
    if (isWeb3Enabled) {
      console.log(account)
    }
    enableWeb3()

  }, [isWeb3Enabled])

  if (!data || !Array.isArray(data)) {
    return <div>No data to display.</div>;
  }
    return (

      
      <div className=" ml-10 mr-10 w-full mx-auto">
        {data.map((item,index) => (
          <div key={item.id} className="bg-white p-4 mb-4 rounded-md shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-xl text-black font-bold">Property Index :- {data[index][3]}</h2>
              <p className="text-gray-500">Price :- {data[index][4]}</p>
            </div>
          
            <button onClick={()=>{handleClick(data[index][0])}}  className="bg-blue-500 text-white px-4 py-2 rounded-md">Accept</button>:
            
          
            <button className="bg-red-500 text-white px-4 py-2 rounded-md">Cancel</button>
          </div>
        ))}
      </div>
    );
  };
  
  export default ListView;
  