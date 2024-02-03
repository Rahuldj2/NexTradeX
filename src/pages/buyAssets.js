import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import { motion } from 'framer-motion';
import styles from "../styles/myAssets.module.css";
import FormComponent from '../components/FormComponentForSale';

const BuyAssets = () => {
  const [form, setForm] = useState(false);
  const [assets, setAssets] = useState([]);
  const [passetsid, setAssetid] = useState('');
  const [passettype, setAssetType] = useState('');
  const [pgovt_price, setgovtPrice] = useState('');
  const [passet_location, setAssetLocation] = useState('');
 
  const cardVariants = {
    initial: { scale: 1, boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)' },
    hover: {
      scale: 1.15,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/assets/get-up-for-sale-assets');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setAssets(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
      </div>
      <div className='bg-black text-xxl h-16 text-center font-serif font-bold'>Market Place</div>

      <div className='bg-white min-h-screen h-fit p-2 flex flex-wrap items-center justify-around'>
        {assets.map((item, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
            className={`v=bg-white p-3 rounded-2xl shadow-md border-2 border-black flex flex-col justify-between w-80 h-96 mt-10 ${form ? 'filter blur-md':''}`}
          >
            <img src={item.image} alt={`Asset ${index + 1}`} />
            <hr className="mb-2"></hr>
            <div className="text-gray-900 mb-4">
              <ul className="list-disc list-inside">
              <li style={{ color: '#0D0D0E' }}>
                  <span style={{ color: 'grey' }}>{item.propertyTitle}</span>
                </li>
                <li style={{ color: '#71717a' }}>
                  <span style={{ color: 'grey' }}>Asset Id:- {item.asset_id}</span>
                </li>
                <li style={{ color: '#71717a' }}>
                  <span style={{ color: 'grey' }}>Asset Type:- {item.asset_type}</span>
                </li>
                <li style={{ color: '#71717a' }}>
                  <span style={{ color: 'grey' }}>Asset Location:- {item.propertyAddress}</span>
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
