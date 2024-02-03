

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import app from '../firebaseConfig';
import {

  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
} from 'firebase/firestore';
import Navbar from '../components/Navbar';






const auth = getAuth(app);

const Signup = ({ phoneNumber }) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email_id: '',
    aadhar_number: '',
    
    agreeTerms: true,

  });





  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {

      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      console.error('User is not authenticated.');
      return;
    }

    const phoneNumber = router.query.phoneNumber;
    const uid = currentUser.uid;  // Get UID of signed-in user

    try {
      const response = await fetch('/api/user/create-new-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          uid: uid,
          aadhar_number: formData.aadhar_number,
          phone_number: phoneNumber,
          email_id: formData.email_id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      console.log('Form data submitted successfully!');
      router.push('/myAssets');
    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };

  return (
    <div >
      <div className={`h-64 `}>
        <Navbar />
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="m-auto p-10 rounded-md  max-w-md w-full items-center"
      >
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md px-8 py-8  rounded-md shadow-lg shadow-black border-opacity-50 hover:border-opacity-100 transition duration-300 transform hover:scale-101"
        >
          <div className="my-6">
            <label className="block flex flex-col">
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </label>
          </div>

          <div className="my-6">
            <label className="block flex flex-col">
              E-mail:
              <input
                type="mail"
                name="email_id"
                value={formData.email_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </label>
          </div>

      
          <div className="my-6">
            <label className="block flex flex-col">
             Aadhar Number:
              <input
                type="text"
                name="aadhar_number"
                value={formData.aadhar_number}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </label>
          </div>
         

          <div className="my-6">
            <label className="block flex items-center">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mr-2"
              />
              I agree to the terms and conditions
            </label>
          </div>

          <div className="my-6 flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white p-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:shadow-md"
            >
              Submit
            </button>
          </div>
        </form>
      </motion.div>

      {/* <div>
        <Footer />
      </div> */}
    </div>
  );
};

export default Signup;
