import { use, useEffect, useState } from 'react';
import { getDummyData } from './api/dummydata';
import ListView from '../components/ListView';
import  Navbar  from '../components/Navbar';

import { useMoralis } from "react-moralis";
// import { useEffect, useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { contractABI, contract_address } from "../../contracts/NewContractDetails.js";
import { m } from 'framer-motion';



const MyBids = () => {
  const [data, setData] = useState([]);
  const [upSaleProperties, setSaleProperties] = useState([]);
  const { enableWeb3, account, isWeb3Enabled } = useMoralis()
  const[myBids,SetBids]=useState()
  const [uniqueUserProperties, setUniqueUserProperties] = useState([]);
  useEffect(() => {
    console.log("ACCESS USING myBids state variable")
    console.log(myBids)
  },[myBids]);



  useEffect(() => {
    console.log("BHAIYYA YE HAI FINAL LELO PLS")
    console.log(uniqueUserProperties)

    const finalMyBids=[]
    for (let i=0;i<uniqueUserProperties.length;i++)
    {
      console.log("namaste")
      if(uniqueUserProperties[i][0].toLowerCase()===account.toLowerCase())
      {
        finalMyBids.push(uniqueUserProperties[i])
      }
    }
    SetBids(finalMyBids)
    //THIS IS THE FINAL OUTPUT
  }, [uniqueUserProperties]);

  const { runContractFunction: getAllBids } = useWeb3Contract({
    abi: contractABI,
    contractAddress: contract_address,
    functionName: "getAllBids",
    params: { "owner": account,"propertyId":0 }
  })

  useEffect(() => {

    
    const fetchData = async () => {
      try {
        await getAllBids();
        const response = await fetch('/api/swagger/fetchBids');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        // console.log(data);
        const res = data.result;
        console.log("res", res);
        const userPropertiesArray = [];
        for (let i = 0; i < res.length; i++) {
          if (res[i].data.bids.length > 0) {
            for (let j = 0; j < res[i].data.bids.length; j++) {
              const adnarValaArray = res[i].data.bids[j];
              console.log("kya bhai pls")
              console.log(account)
              console.log(adnarValaArray[0])
              // if (account.toLowerCase()===adnarValaArray[0].toLowerCase())
              // {
              //     console.log("api hai bhai")
              //     console.log(adnarValaArray)
                  userPropertiesArray.push(adnarValaArray);
              // }
              // }
            }
          }

        }
        setSaleProperties(userPropertiesArray)

        // setAssets(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  
  useEffect(() => {
    console.log(upSaleProperties)
    const keyMap = new Map();
    const uniqueUserPropertiesList = [];


    for (let i = 0; i < upSaleProperties.length; i++) {
      const currentKey = upSaleProperties[i][0];
      if (!keyMap.has(currentKey)) {
        // Add key to map and value=true
        keyMap.set(currentKey, true);

        // Add the entire array to the list
        uniqueUserPropertiesList.push(upSaleProperties[i]);

        console.log("Found unique key:", currentKey);
        console.log("Corresponding array:", upSaleProperties[i]);

        // If you want to break out of the loop after finding the first unique key, uncomment the next line
        // break;
      }

      // console.log(userProperties[i][0]);
    }
    setUniqueUserProperties(uniqueUserPropertiesList)
    // const uniquePropertiesSet = n


  }, [upSaleProperties]);

  useEffect(() => {
    console.log("HI")
    if (isWeb3Enabled) {
      console.log(account);
    }
    enableWeb3()

  }, [isWeb3Enabled])
  return (

    <div  className="flex flex-col justify-center h-full bg-white">
        <div className={`h-20`}>
        <Navbar />
      </div>
    <div className="min-h-screen flex pt-16 justify-center bg-gray-100">
      <ListView data={data} />
    </div>
    </div>
  );
};

export default MyBids;
