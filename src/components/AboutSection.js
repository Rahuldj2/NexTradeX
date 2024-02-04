// components/AboutSection.js

import React from "react";
import arrow from '@/assets/image-removebg.png'
import styles from '../styles/landing.module.css'

const AboutSection = () => {
  return (
    <div className='h-screen pt-20'>

      <div className="h-1/3 w-full  flex">
        <div className="w-1/3 h-full flex justify-center  py-4 px-8">
          <div className={`rounded-3xl h-full w-full bg-indigo-100 text-white border-2 border-amber-500 max-w-96 ${styles.head5}`}>
            <div className="h-1/5 text-center text-3xl flex text-amber-400 justify-center pt-2">Tokenize</div>
            <div className="p-4 text-center">

              Tokenization of assets is the revolutionary process of converting physical assets into digital tokens, providing accessibility, liquidity, and fractional ownership.


            </div>

          </div>
        </div>
        <div className="w-1/3 h-full max-w-96"></div>
        <div className="w-1/3 h-full max-w-96"></div>
      </div>

      <div className="h-1/3 w-full flex ">
        <div className="w-1/3 h-full flex justify-end items-start">
          <img src={arrow.src} className="h-3/4" />
        </div>
        <div className="w-1/3 h-full flex justify-center py-4 px-8 ">
          <div className={`rounded-3xl h-full w-full bg-indigo-100 text-white border-2 border-amber-500  max-w-96 ${styles.head5}`}>

            <div className="h-1/5 text-center text-3xl text-amber-400 flex justify-center pt-2">Buy</div>
            <div className="p-4 text-center">


              Seamless buying: Acquire digital asset tokens effortlessly, enhancing accessibility and enabling fractional ownership in the dynamic real estate marketplace.


            </div>

          </div>
        </div>
        <div className="w-1/3 h-full"></div>
      </div>

      <div className="h-1/3 w-full flex">
        <div className="w-1/3 h-full "></div>
        <div className="w-1/3 h-full flex justify-end items-start">
          <img src={arrow.src} className="h-3/4" />
        </div>
        <div className="w-1/3 h-full flex justify-center py-4 px-8">
          <div className={`rounded-3xl h-full w-full bg-indigo-100 text-white border-2 border-amber-500 max-w-96 ${styles.head5}`}>

            <div className="h-1/5 text-center text-3xl flex justify-center text-amber-400 pt-2">Sell</div>
            <div className="p-4 text-center">


              Effortless selling: Easily trade digital asset tokens, unlocking value and   providing flexibility within the decentralized real estate marketplace.


            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
