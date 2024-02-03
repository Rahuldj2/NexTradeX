// import React, { useState} from 'react';

import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import { motion } from 'framer-motion';
import styles from "../styles/myAssets.module.css";
import FormComponent from '../components/FormComponentForSale';
import assets from './api/myAssetsTestAPI';
import { useMoralis } from "react-moralis";
// import { useEffect, useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { contractABI, contract_address } from "../../contracts/NewContractDetails.js";


const BuyAssets = () => {




















  const [form, setForm] = useState(false);

  const [asset, setAsset] = useState(assets);
  const [passetsid, setAssetid] = useState('');
  const [passettype, setAssetType] = useState('');
  const [pgovt_price, setgovtPrice] = useState('');
  const [passet_location, setAssetLocation] = useState('');
  const { enableWeb3, account, isWeb3Enabled } = useMoralis()
  const [upSaleProperties, setSaleProperties] = useState([]);

  const [uniqueUserProperties, setUniqueUserProperties] = useState([]);
  const cardVariants = {
    initial: { scale: 1, boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)' },
    hover: {
      scale: 1.15,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

    useEffect(()=>{
      console.log("HI")
      if (isWeb3Enabled)
      {
        console.log("saassa");
      }
      enableWeb3()

  },[isWeb3Enabled])

  // useEffect=(()=>{
  //   console.log(upSaleProperties)
  // },[upSaleProperties])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/swagger/fetchMarketPlace');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        // console.log(data);
        const res = data.result;
      console.log("res",res);
      const userPropertiesArray = [];
        for(let i=0;i<res.length;i++)
        {
            if(res[i].data.properties.length>0)
            {
              for (let j = 0; j < res[i].data.properties.length; j++)
              {
                const adnarValaArray = res[i].data.properties[j];
                userPropertiesArray.push(adnarValaArray);
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
    console.log("BHAIYYA YE HAI FINAL LELO PLS")
    console.log(uniqueUserProperties)
    //THIS IS THE FINAL OUTPUT
  }, [uniqueUserProperties]);

  useEffect(() => {
    console.log(upSaleProperties)
    const keyMap = new Map();
    const uniqueUserPropertiesList = [];


    for (let i=0;i<upSaleProperties.length;i++)
    {
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
  // Assuming this function is triggered on a button click or some other event
const handleClick = (item) => {
  setForm(prevForm => !prevForm); // Toggle the form state
  setAssetid(item.asset_id); // Set the asset ID
  setAssetLocation(item.propertyAddress);
  setAssetType(item.asset_type);
  setgovtPrice(item.govt_price);
};

  return (
    <div className='h-screen'>
      <div className='h-16'>
        <Navbar />
        <div style={{marginTop:'200px'}}>
        {
            account ?(
                <>
                <div>Connected to {account}</div>
                {/* <button onClick={handleClick}>make a property</button> */}
                </>
            ):(<button onClick={async ()=>{await enableWeb3()}}>Connect</button>)
        }
        </div>
      </div>
      <div className='bg-black text-xxl h-16 text-center font-serif font-bold'>Market Place</div>

      <div className='bg-white min-h-screen h-fit p-2 flex flex-wrap items-center justify-around'>
        {uniqueUserProperties.map((item, index) => (
        {uniqueUserProperties.map((item, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
            className={`v=bg-white p-3 rounded-2xl shadow-md border-2 border-black flex flex-col justify-between w-80 h-96 mt-10 ${form ? 'filter blur-md':''}`}
          >
            <img src={asset[0].image} alt={`Asset ${index + 1}`} />
            <hr className="mb-2"></hr>
            <div className="text-gray-900 mb-4">
              <ul className="list-disc list-inside">
              <li style={{ color: '#0D0D0E' }}>
                  <span style={{ color: 'grey' }}>{uniqueUserProperties[index][7]}</span>
                </li>
                <li style={{ color: '#71717a' }}>
                  <span style={{ color: 'grey' }}>Asset Id:- {uniqueUserProperties[index][0]}</span>
                </li>
                <li style={{ color: '#71717a' }}>
                  <span style={{ color: 'grey' }}>Asset Type:- {uniqueUserProperties[index][4]}</span>
                </li>
                <li style={{ color: '#71717a' }}>
                  <span style={{ color: 'grey' }}>Asset Location:- {uniqueUserProperties[index][6]}</span>
                </li>
                
              </ul>
              <div className="mt-6 mb-2 flex items-center justify-center">
              
                <button onClick={() => handleClick(item)}
                  className="font-medium bg-white border border-violet-900 text-violet-900 px-6 py-2 rounded-md hover:bg-violet-900 hover:text-white focus:outline-none focus:ring focus:border-blue-300"
                >
                  Mark as Up for Sale
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {form ? (
          <div className={styles.form}>
            <div className='h-12 p-2 bg-red-200 text-center'>Up for sale form</div>
            <FormComponent setForm={setForm} asset_id={passetsid} location={passet_location} asset_type={passettype}  govt_price={pgovt_price}/>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default BuyAssets;
