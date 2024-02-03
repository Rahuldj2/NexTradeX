import React, { use } from 'react'
import Navbar from "../components/Navbar";
import { motion } from 'framer-motion';
import styles from "../styles/myAssets.module.css";
// import { useState } from 'react';
import FormComponent from '../components/FormComponentForSale';
import assets from './api/myAssetsTestAPI';
import { useRouter } from 'next/router';


import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { contractABI, contract_address } from "../../contracts/NewContractDetails.js";
import { fetchData } from 'next-auth/client/_utils';
const myAssets = () => {
  const router = useRouter();
  const [form, setForm] = useState(false);
  const [asset, setAsset] = useState(assets);
// const[badiList, setbadiList]= useState([]);
const [userProperties, setUserProperties] = useState([]);

const [uniqueUserProperties, setUniqueUserProperties] = useState([]);

  const { enableWeb3, account, isWeb3Enabled } = useMoralis()

  useEffect(() => {
    console.log(uniqueUserProperties)
    //THIS IS THE FINAL OUTPUT
  }, [uniqueUserProperties]);
  useEffect(() => { 
    console.log("inside use effect")
    console.log(userProperties);
    const keyMap = new Map();
    const uniqueUserPropertiesList = [];


    for (let i=0;i<userProperties.length;i++)
    {
      const currentKey = userProperties[i][0];
      if (!keyMap.has(currentKey)) {
        // Add key to map and value=true
        keyMap.set(currentKey, true);
  
        // Add the entire array to the list
        uniqueUserPropertiesList.push(userProperties[i]);
  
        console.log("Found unique key:", currentKey);
        console.log("Corresponding array:", userProperties[i]);
  
        // If you want to break out of the loop after finding the first unique key, uncomment the next line
        // break;
      }

      // console.log(userProperties[i][0]);
    }
    setUniqueUserProperties(uniqueUserPropertiesList)
    // const uniquePropertiesSet = new Set(userProperties.map(arr => JSON.stringify(arr)));
    // setUniqueUserProperties(uniquePropertiesSet);
    // console.log("uniquePropertiesSet",uniqueUserProperties);
  }, [userProperties]);


  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch('/api/swagger/fetchUserProperty');
        const data = await response.json();
        const userPropertiesArray = [];
const res = data.result;
console.log("res",res);
 for(let i=0;i<res.length;i++)
 {
  if(res[i].data.properties.length>0)
  {
    for (let j = 0; j < res[i].data.properties.length; j++)
    {
      const adnarValaArray = res[i].data.properties[j];
      if (account.toLowerCase() === adnarValaArray[1].toLowerCase()) {
        //make a global array where this adnarValaArray is completely pushed into this global array 
        //which will be used to display the assets
        userPropertiesArray.push(adnarValaArray);
       
      }
    }
    // const adnarValaArray = res[i].data.properties[0];
    // if (account.toLowerCase() === adnarValaArray[1].toLowerCase()) {
    //   //make a global array where this adnarValaArray is completely pushed into this global array 
    //   //which will be used to display the assets
    //   userPropertiesArray.push(adnarValaArray);
     
    // }


    
  }
 
 }
  setUserProperties(userPropertiesArray);

        return data;
      } catch (error) {
        console.error('Error:', error);
      }
    };

    
     // console.log("nanamamamammamam")
      // const templist = [];
      // templist.push(adnarValaArray);
      // setbadiList(templist);

      
    // console.log(adnarValaArray)

//     if(adnarValaArray[1].toLowerCase()===account.toLowerCase()){
//       // console.log("nanamamamammamam")
// const templist=[];
//  templist.push(adnarValaArray);
//  setbadiList(templist);
//     }
//     console.log("badilist",badiList);

    const fetchDataAndUpdateState = async () => {
      const data = await fetchData();
    //  console.log("hereprinting", data.result);
      // Now you can use 'data' in your component state or for further processing
    };

    var check = false;
    console.log("HI");
    if (isWeb3Enabled) {
      console.log("ok");
      check = true;
    }

    if (!check) {
      enableWeb3();
    }

    getUserProperties();
    fetchDataAndUpdateState();

  }, [isWeb3Enabled]);



  // console.log(asset);



  const { runContractFunction: getUserProperties } = useWeb3Contract({
    abi: contractABI,
    contractAddress: contract_address,
    functionName: "getUserProperties",
    params: { "user": account }
  })
  const handleClick = async () => {
    console.log("clicked");
    await getUserProperties();
    const kuch = await fetchData();
    console.log(kuch);
  }


  const cardVariants = {
    initial: { scale: 1, boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)' },
    hover: {
      scale: 1.15,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };
  return (
    <div className='h-screen'>
      <div className='h-16'>
        <Navbar />

      </div>

      <div style={{ marginTop: '200px' }}>
        {
          account ? (
            <>
              <div>Connected to {account}</div>
              {/* <button onClick={handleClick}>make a property</button> */}
            </>
          ) : (<button onClick={async () => { await enableWeb3() }}>Connect</button>)
        }

      </div>
      <button style={{ marginTop: "100px" }} onClick={() => { handleClick() }} className='bg-black text-white h-16 w-32 rounded-md mt-2 ml-2'>check</button>
      <div className='bg-black text-xxl h-16 text-center font-serif font-bold'>My Assets</div>

      <div className='bg-white min-h-screen h-fit p-2 flex flex-wrap items-center justify-around'>

        {/* loop through the assets and display them here  */}

        {uniqueUserProperties.map((item, index) => {
          return (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="initial"
              whileHover="hover"
              className="bg-white p-3 rounded-2xl shadow-md border-2 border-black flex flex-col justify-between w-80 h-96 mt-10 "
            >
              <img src={asset[0].image} />
              <hr className="mb-2"></hr>
              <div className="text-gray-900 mb-4">
                <ul className="list-disc list-inside">
                  <li style={{ color: '#71717a' }}>
                    <span style={{ color: 'grey' }}> Asset Id:-   {uniqueUserProperties[index][0]}</span>
                  </li>
                  <li style={{ color: '#71717a' }}>
                    <span style={{ color: 'grey' }}> Asset Type:-    {uniqueUserProperties[index][4]}</span>
                  </li>
                  <li style={{ color: '#71717a' }}>
                    <span style={{ color: 'grey' }}> Asset Location:-  {uniqueUserProperties[index][6]}</span>
                  </li>
                  <li style={{ color: '#71717a' }}>
                    <span style={{ color: 'grey' }}>{uniqueUserProperties[index][7]}</span>
                  </li>
                </ul>
                <div className="mt-6 mb-2 flex items-center justify-center">
                  <button
                    onClick={() => router.push('/tokenize')}

                    className="font-medium bg-white border border-violet-900
   text-violet-900 px-6 py-2 rounded-md  hover:bg-violet-900 hover:text-white focus:outline-none focus:ring focus:border-blue-300"
                  >
                    Tokenize
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}





        {/* loop ends  */}

        {
          form ? <div className={styles.form}>
            <div className='h-12 p-2 bg-red-200 text-center'>Up for sale form</div>
            <FormComponent setForm={setForm} />
          </div> : <></>
        }

      </div>



    </div>
  )
}

export default myAssets