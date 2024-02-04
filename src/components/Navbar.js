// components/Navbar.js


import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';

import Link from "next/link";
import styles from "../styles/landing.module.css";
import app from '../firebaseConfig';

const Navbar = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const auth = getAuth(app);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      setCurrentUser(user);
    });
    (async () => {



      if (currentUser) {
        const uid = currentUser.uid;
        const response = await fetch(`/api/user/check-if-user-exists-uid?uid=${uid}`);
        const data = await response.json();

        if (data.userExists) {
          setIsSignedIn(true);
        } else {
          setIsSignedIn(false);
        }
      }
    })();
    return () => unsubscribe();
  }, [currentUser]);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('You have been logged out.');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  return (
    <nav className={`bg-gray-800 p-4 fixed top-0 w-full z-50 border-b-2 border-white text-white ${styles.nav}`}>
      <div className="flex justify-between items-center">
        <div className="flex justify-between items-center space-x-4 ">
          <div className="border-white border-2 px-6 py-2 rounded-2xl hover:border-cyan-400 hover:text-cyan-400">
            <Link href="/">Home</Link>
          </div>
          <div className="border-white border-2 px-6 py-2 rounded-2xl hover:border-cyan-400 hover:text-cyan-400">
            <Link href="/buyAssets">Buy Assets</Link>
          </div>
          <div className="border-white border-2 px-6 py-2 rounded-2xl hover:border-cyan-400 hover:text-cyan-400">
            <Link href="/myAssets">My Assets</Link>
          </div>
          {isLoggedIn && isSignedIn ? (
            <>
              <div className="border-white border-2 px-6 py-2 rounded-2xl hover:border-cyan-400 hover:text-cyan-400">
                <Link href="/tokenize">Tokenize</Link>
              </div>
              <div className="border-white border-2 px-6 py-2 rounded-2xl hover:border-cyan-400 hover:text-cyan-400">
                <Link href="/myBids">My Bids</Link>
              </div>
              <div className="border-white border-2 px-6 py-2 rounded-2xl hover:border-cyan-400 hover:text-cyan-400">
                <Link href="/bidOpennings">Bid Openings</Link>
              </div>
              {/* <Link href="/my-assets">My Assets</Link>
              <Link href="/sell">Sell</Link> */}

            </>
          ) : (
            <div></div>
          )}
        </div>
        {/* <div className="flex items-center">

          {isLoggedIn && isSignedIn ? (
            // If the user is logged in, show "Logout" option

            <button
              className={` $  bg-red-500 hover:bg-red-700 text-white font-bold flex items-center justify-center w-20 h-8 p-4 rounded-2xl`}
              onClick={handleLogout}
            >
              Logout
            </button>


          ) : (
            // If the user is not logged in, show "Login" option
            <Link href="/login">Login</Link>
          )}
        </div> */}
        <div className="flex items-center">
          {isLoggedIn && isSignedIn ? (
            // If the user is logged in, show "Logout" option
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold flex items-center justify-center w-20 h-8 p-4 rounded-2xl"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            // If the user is not logged in, show "Login" option
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold flex items-center justify-center w-20 h-8 p-4 rounded-2xl"
            >
              <Link href="/login">Login</Link>
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
