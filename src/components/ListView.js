
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { contractABI, contract_address } from "../../contracts/NewContractDetails.js";


const ListView = ({ data }) => {
  const { enableWeb3, account, isWeb3Enabled } = useMoralis()
  
  const[bidId,SetBidId]=useState();
  const[propid,SetpropId]=useState();
  const[buyer,SetBuyer]=useState();

  const { runContractFunction: finalize } = useWeb3Contract({
    abi: contractABI,
    contractAddress: contract_address,
    functionName: "finalize",
    params: {"buyer":buyer,"bidId":bidId,"propertyId":propid},//state variable update
});

useEffect(() => {
  async function acceptFuncDeal() {            
  console.log(bidId)
  console.log(propid)
  console.log(buyer)
  await finalize();
  }

  acceptFuncDeal();

},[bidId,propid,buyer]);

  useEffect(() => {
    console.log("HI")
    if (isWeb3Enabled) {
      console.log(account)
    }
    enableWeb3()

  }, [isWeb3Enabled])



      const handleClick = async (buyer,bidId,propId) => {

      console.log("clicked");
      // console.log("id",id)
      SetBidId(bidId)
      SetpropId(propId)
      SetBuyer(buyer)
      // await getAllBids();
      }
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
           { data[index][6]?
            <button onClick={()=>{handleClick(data[index][1],data[index][0],data[index][3])}}  className="bg-blue-500 text-white px-4 py-2 rounded-md">Accept</button>:
            
            <div> </div>
            }
            <button className="bg-red-500 text-white px-4 py-2 rounded-md">Cancel</button>
          </div>
        ))}
      </div>
    );
  };
  
  export default ListView;
  