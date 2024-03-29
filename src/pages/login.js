

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import firebase from 'firebase/app';
import 'firebase/auth';
import Navbar from '../components/Navbar';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import app from '../firebaseConfig';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  getDoc,
} from 'firebase/firestore';



const auth = getAuth(app);


const AuthPage = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpSent, setOtpSent] = useState(false); // New state to track OTP status

  const handleSendOtp = async () => {
    try {
      const recaptcha = new RecaptchaVerifier(auth, 'recaptcha', {});
      console.log("jere");
      const totphoneNumber = '+' + countryCode + phoneNumber;
      console.log(totphoneNumber)
      const confirmation = await signInWithPhoneNumber(auth, totphoneNumber, recaptcha);
      console.log(confirmation)
      setConfirmationResult(confirmation);
      setOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };






  const handleVerifyOtp = async () => {
    try {
      await confirmationResult.confirm(verificationCode);
  
      // Check if the user exists in the Supabase database
      const enteredPhoneNumber = phoneNumber;
  
      const response = await fetch(`/api/user/check-if-user-exists?phone_number=${enteredPhoneNumber}`);
      const data = await response.json();
  
      if (data.userExists) {
        // User with the entered phone number exists in the database
        router.push('/myAssets');
      } else {
        // User with the entered phone number does not exist in the database
        router.push({
          pathname: '/signup',
          query: { phoneNumber: enteredPhoneNumber },
        });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };







  return (
    <div className="flex flex-col justify-center h-full bg-white">
      <div className={`h-20`}>
        <Navbar />
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white mt-10 mb-10 m-auto p-10 rounded-md shadow-md shadow-black max-w-md h-full w-full items-center"
      >
        {/* Country Code Selection */}
        <div className="mb-6">
          <label htmlFor="countryCode" className="block text-gray-600 mb-2">
            Country Code
          </label>
          <select
            id="countryCode"
            name="countryCode"
            onChange={(e) => setCountryCode(e.target.value)}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="1">+1 (US)</option>
            <option value="44">+44 (UK)</option>
            <option value="91">+91 (India)</option>
            {/* Add more options as needed */}
          </select>
        </div>

        {/* Phone Number Input */}
        <div className="mb-6">
          <label htmlFor="phoneNumber" className="block text-gray-600 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter your phone number"
          />
        </div>

        {
          (!otpSent ? <div id='recaptcha'>

          </div> : null)
        }
        {/* Button to Get OTP or Verify OTP based on the OTP status */}
        {otpSent ? (
          // OTP Sent, show OTP input field and Verify OTP button
          <div className="mb-6">
            <label htmlFor="verificationCode" className="block text-gray-600 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              id="verificationCode"
              name="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter the verification code"
            />
            <button
              type="button"
              onClick={handleVerifyOtp}
              className="bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300 mt-4"
            >
              Verify OTP
            </button>
          </div>
        ) : (
          // OTP Not Sent, show Get OTP button
          <button
            type="button"
            onClick={handleSendOtp}
            className="bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
          >
            Get OTP
          </button>
        )}
      </motion.div>
      <div>
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default AuthPage;
