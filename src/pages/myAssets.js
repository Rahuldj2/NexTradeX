import React from 'react'
import Navbar from "../components/Navbar";
import { motion } from 'framer-motion';
import styles from "../styles/myAssets.module.css";
// import { useState } from 'react';
import FormComponent from '../components/FormComponentForSale';
import assets from './api/myAssetsTestAPI';
import { useRouter } from 'next/router';


import { useMoralis } from "react-moralis";
import { useEffect,useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { contractABI, contract_address } from "../../contracts/NewContractDetails.js";
import { fetchData } from 'next-auth/client/_utils';
const myAssets = () => {
  const router = useRouter();
    const [form, setForm] = useState(false);
    const [asset, setAsset] = useState(assets);

    const{enableWeb3,account,isWeb3Enabled}=useMoralis()
    useEffect(()=>{
      console.log("HI")
      if (isWeb3Enabled)
      {
        console.log("ok")
          return
      }
      enableWeb3()

  },[isWeb3Enabled])

    // console.log(asset);
    const fetchData = async () => {
      try {
        const response = await fetch('/api/swagger/fetchUserProperty');
        const data = await response.json();
        // console.log(data);
        return data;
      } catch (error) {
        console.error('Error:', error);
      }
    };
    


    const {runContractFunction: getUserProperties}=useWeb3Contract({
      abi:contractABI,
      contractAddress:contract_address,
      functionName:"getUserProperties",
      params:{"user":account}
  })
const handleClick = async () => {
console.log("clicked");
  await getUserProperties();
 const kuch =  await fetchData();
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
            <button style={{marginTop:"100px"}}onClick={() => {handleClick()}} className='bg-black text-white h-16 w-32 rounded-md mt-2 ml-2'>check</button>
            <div className='bg-black text-xxl h-16 text-center font-serif font-bold'>My Assets</div>

            <div className='bg-white min-h-screen h-fit p-2 flex flex-wrap items-center justify-around'>

                {/* loop through the assets and display them here  */}

                {asset.map((item, index) => {
                    return (
                        <motion.div
                        key={index}
                        variants={cardVariants}
                        initial="initial"
                        whileHover="hover"
                        className="bg-white p-3 rounded-2xl shadow-md border-2 border-black flex flex-col justify-between w-80 h-96 mt-10 "
                      >
                 <img src = { asset[index].image}/>
                        <hr className="mb-2"></hr>
                        <div className="text-gray-900 mb-4">
                          <ul className="list-disc list-inside">
                            <li style={{ color: '#71717a' }}>
                              <span style={{ color: 'grey' }}> Asset Id:-   {asset[index].asset_id}</span>
                            </li>
                            <li style={{ color: '#71717a' }}>
                              <span style={{ color: 'grey' }}> Asset Type:-    {asset[index].asset_type}</span>
                            </li>
                            <li style={{ color: '#71717a' }}>
                              <span style={{ color: 'grey' }}> Asset Location:-  {asset[index].location}</span>
                            </li>
                            <li style={{ color: '#71717a' }}>
                              <span style={{ color: 'grey' }}>Bullet Point 4</span>
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
