// pages/index.js

import React, { useRef } from "react";
import Navbar from "../components/Navbar";
import { useSession } from "next-auth/react";
import crypto from "../assets/cryptoassets.jpeg";
import realstate from "../assets/realstate.jpeg";
import loan from "../assets/loan.jpeg";
import cars from "../assets/cars.jpeg";
import AboutSection from "../components/AboutSection";
import styles from '../styles/landing.module.css'
import building from "../assets/building.jpeg";
import bitcoin from "../assets/bitcoin.jpg";
import wallet from "../assets/wallet.jpeg";
import bc from "../assets/nft.jpeg";
import Link from "next/link";

import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'


const Home = () => {
  const { data: session } = useSession();
  console.log(crypto)

  function Cube() {

    const mesh = useRef(null);

    useFrame((state, delta) => {
      mesh.current.rotation.x += delta * 0.25;
      mesh.current.rotation.y += delta * 0.25;
      mesh.current.rotation.z += delta * 0.25;

    })

    const texture_1 = useLoader(TextureLoader, crypto.src);
    const texture_2 = useLoader(TextureLoader, building.src);
    const texture_3 = useLoader(TextureLoader, bitcoin.src);
    const texture_4 = useLoader(TextureLoader, wallet.src);
    const texture_5 = useLoader(TextureLoader, bc.src);
    const texture_6 = useLoader(TextureLoader, crypto.src);




    return (
      <mesh ref={mesh}>
        <boxGeometry args={[3.5, 3.5, 3.5]} />
        <meshStandardMaterial map={texture_1} attach="material-0" />
        <meshStandardMaterial map={texture_2} attach="material-1" />
        <meshStandardMaterial map={texture_3} attach="material-2" />
        <meshStandardMaterial map={texture_4} attach="material-3" />
        <meshStandardMaterial map={texture_5} attach="material-4" />
        <meshStandardMaterial map={texture_6} attach="material-5" />

      </mesh>
    )
  }

  return (
    <div>
      <Navbar />
      <div className={`h-screen ${styles.bgi}`}>
        {session ? (
          <>

            <div>
              <div className="container mx-auto">
                <p className="text-xl">Welcome {session.user.email}</p>
                {/* Your content for signed-in users */}
                <p>welcome</p>
              </div>

            </div>
          </>
        ) : (
          <>

            {/* Your content for non-signed-in users */}
            <div className={`h-screen flex `}>
              <div className={`h-full w-1/2 ${styles.he} flex items-center justify-end `}>

                <div className={`max-w-xl py-10 mr-4 pr-4  ${styles.head}`}>
                  <div className="text-white font-semibold text-4xl ">
                    Best Way to Buy and Sell with <span className="text-blue-400"> Cryptocurrency </span>Assets
                  </div>
                  <div className="text-white mt-4">
                    <span className="font-bold text-amber-500">Nex Trade X</span> - Shaping a world where paperwork is history, fraud is fiction, and asset transfers are instant. Welcome to the future of real estate.
                    No more paper work, no more waiting, no fraud and no more hassle. Trade your assets with ease and security.
                  </div>
                  <button className="text-white py-2 px-4 border-white border-2 rounded-3xl mt-8 bg-indigo-950">
                    <Link href="/tokenize">Tokenize Asset</Link>

                  </button>
                </div>


              </div>
              <div className={`h-full w-1/2 flex flex-col`}>

                <div className={`h-4/5 w-full flex pt-24 pr-40 items-end ${styles.he2}`}>

                  {/* <img src={crypto.src} alt="crypto" className="rounded-3xl h-1/2 border-2 border-white" /> */}
                  <Canvas >
                    <ambientLight intensity={2} />
                    <directionalLight position={[2, 1, 1]} />
                    <Cube />
                  </Canvas>



                </div>

                <div className={`h-1/5 w-full ${styles.he3}`}>

                </div>

              </div>
            </div>

            <div className={`h-screen ${styles.bg}`}>
              <AboutSection />
            </div>

            {/* Mint your assets and trade seamlessly */}

            <div className={`h-screen pt-4 pb-20 ${styles.head}`}>
              <div className="text-sky-400 text-5xl text-center font-medium">Our Features For Convenience</div>
              <div className="flex justify-around mt-16">
                <div className={`h-48 w-1/5 border-2 border-teal-500 rounded-3xl ${styles.he4}`}>
                  <div className="h-4/5 p-4 flex justify-center">

                    <img src={realstate.src} />

                  </div>

                  <div className="text-white text-center">Buy and Sell Real State with one Click</div>

                </div>

                <div className={`h-48 w-1/5 border-2 border-teal-500 rounded-3xl ${styles.he4}`}>
                  <div className="h-4/5 p-4 flex justify-center">

                    <img src={cars.src} />

                  </div>

                  <div className="text-white text-center">Look for a Vechicle with one click</div>

                </div>

                <div className={`h-48 w-1/5 border-2 border-teal-500 rounded-3xl ${styles.he4}`}>
                  <div className="h-4/5 p-4 flex justify-center">

                    <img src={loan.src} />

                  </div>

                  <div className="text-white text-center">Aquired Loan with no risk of frauds</div>

                </div>

              </div>

              <div className={`h-1/3 w-4/5 border-teal-500 border-2 m-auto mt-12 p-8 text-white rounded-3xl ${styles.he1}`}>


                <span className="text-amber-500 font-semibold">Nex Trade X</span> pioneers a transformative approach to real estate through asset tokenization. Our platform revolutionizes property ownership, enabling users to convert physical assets into digital tokens for seamless buying and selling. This innovative process enhances accessibility, liquidity, and fractional ownership, breaking down traditional barriers in the real estate market. With a commitment to minimizing paperwork, fraud, and time delays, Nex Trade X reshapes the landscape by merging blockchain technology with real-world assets. Join us in redefining the future of real estate transactions, where efficiency, security, and inclusivity converge to create a dynamic and accessible marketplace.

              </div>

            </div>






          </>
        )}
      </div>
    </div>
  );



};

export default Home;
