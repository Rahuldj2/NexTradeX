import React , {useState, useRef, useEffect} from 'react'
import styles from "../styles/Tokenize.module.css"
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAuth,  onAuthStateChanged} from 'firebase/auth';
import app from '../firebaseConfig';
import {getStorage ,ref ,uploadBytes,getDownloadURL} from 'firebase/storage'
import axios from 'axios'
// import middleware from '../cors'

import { useMoralis } from "react-moralis";
import { useWeb3Contract } from "react-moralis";
import { contractABI, contract_address } from "../../contracts/NewContractDetails.js";
const Tokenize = () => {
  const{enableWeb3,account,isWeb3Enabled}=useMoralis()
    const [Price,setPrice] = useState('');
    const[returnedId,setReturnedId]=useState(0)
    useEffect(()=>{
        console.log("HI")
        if (isWeb3Enabled)
        {
            setPrice("100000000000000000")
            return
        }
        enableWeb3()

    },[isWeb3Enabled])

    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      assetType: '',
      assetId: '',
      walletId: '',
      location: '',
      district: '',
      zip: '',
    });

    const[returnedPropId,setReturnedPropId]=useState(0)

    const [uploadedImages, setUploadedImages] = useState([]);
    const [capturedImage, setCapturedImage] = useState(null);
    const [uploadedSelfie,setUploadedSelfie]= useState(null)
    const [selfieBlob,setSelfieBlob]=useState(null);
    const [isCameraOpen, setIsCameraOpen] = useState(true);
    const [clearButton,setClearButton]= useState(false);
    
    const [user, setUser] = useState(null); // Initialize user state
const [loading, setLoading] = useState(true); // Initialize loading state
const [error, setError] = useState(null);
const [pimageurl,setPImageUrl]=useState('');
    const auth = getAuth(app);
 
    const storage = getStorage(app);
   
    // const videoRef = useRef(null);
    let videoRef  =useRef(null)
         let photoRef =useRef(null)
         
         useEffect(() => {
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
          }, (error) => {
            setError(error);
            setLoading(false);
          });
        
          // Clean up the subscription when the component unmounts
          return () => unsubscribe();
        }, [auth]);

      



        const fetchData = async () => {
          try {
            const response = await fetch('/api/fetchData');
            const data = await response.json();
            // console.log(data);
            return data;
          } catch (error) {
            console.error('Error:', error);
          }
        };
        
        


        
            const getUserCamera =() =>
            {
                navigator.mediaDevices.getUserMedia({
                    video:true
                })

          .then((stream)=>{
              let video = videoRef.current
              video.srcObject =stream
              video.play()
              mediaStreamRef.current = stream;
          }
          )
          .catch((error)=>{
              console.error(error)
          }
          )
      }


            const handleInputChange = (e) => {
              const { name, value } = e.target;
              setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
              }));
            };


           

            const markTokenizetrue = async (propId) => {
              try {
                const response = await axios.post('/api/assets/mark-tokenize', {
                  asset_id: formData.assetId,
                  // add solidity id here
                  solidity_id:propId
                });
          
                if (response.status === 201) {
                  console.log('Asset updated successfully:', response.data);
                  // Do something with the updated asset data if needed
                } else {
                  console.error('Failed to update asset:', response.data.message);
                }
              } catch (error) {
                console.error('Error updating asset:', error);
              }

            }




            const handleImageUpload = async (propId) => {
             await handleImageSubmission();
              console.log("length",uploadedImages.length)
              if (uploadedImages[0] && user) {
             
                const storageRef = ref(storage, `property_images/${user.uid}/${propId}`);
                await uploadBytes(storageRef, uploadedImages[0]);
          
                // Retrieve download URL
               const downloadURL = await getDownloadURL(storageRef);
               setPImageUrl(downloadURL);
               console.log(downloadURL);
               console.log("hm")
               console.log(pimageurl);
                // Do something with the download URL
              }
            }

    const {runContractFunction: tokenize}=useWeb3Contract({
      abi:contractABI,
      contractAddress:contract_address,
      functionName:"tokenize",
      params:{"owner":account,"price":Price,"_propertyTitle":"Latest property","_category":formData.assetType,"_images":"test1","_propertyAddress":formData.location,"_description":"testonlinefrontend"}
  })

    const handleSubmit = async () => {
      console.log(formData)
  const uid = user ? user.uid : null;


  console.log(uid)
  const formdetails = {
    uid: uid,
    asset_id: formData.assetId,
    // Add other data needed for the API request

          };
      
          try {
            const response = await fetch('/api/assets/asset-user-map', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formdetails),
            });
      
            if (response.ok) {
              const data = await response.json();
      
              // Do something with the data from the API response
              console.log(data);
              if (data.result) {
                // setReturnedId(propertyId)
                // console.log(propertyId)
                // console.log(returnedId)
                const transactionMined=await tokenize();
                // console.log(transactionMined)
                const propertyIdResult=await fetchData();
                console.log(propertyIdResult.result.length)

               // setReturnedPropId(propertyIdResult.result.length);
                await handleImageUpload(propertyIdResult.result.length);
await markTokenizetrue(propertyIdResult.result.length);
              }
              else
              {

              }

      // Continue with your form submission logic if needed
      console.log('Form submitted!');
    } else {
      console.error('API request failed:', response.statusText);
    }
  } catch (error) {
    console.error('Error during API request:', error);
  }
    // check if asset exists in the database



    // Handle form submission logic here
    // You can access the form data using the state variables (e.g., uploadedImages, uploadedSelfie, etc.)
    console.log('Form submitted!');
  };
            // Add this function to close the camera
const closeCamera = () => {
    let video = videoRef.current;
  
    // Stop the stream and remove it from the video element
    if (video.srcObject) {
      const stream = video.srcObject;
      const tracks = stream.getTracks();
  
      tracks.forEach(track => track.stop());
      video.srcObject = null;
    }
    setIsCameraOpen(false);
    // You may also want to hide or remove the video element
    // depending on your UI/UX design
  };

  const toggleCamera = () => {
    if (isCameraOpen) {
      closeCamera();
    } else {
      openCamera();
    }
  };

  const openCamera = () => {
    getUserCamera();
    setIsCameraOpen(true);
  };

  const handleCapture = () => {
    if (capturedImage) {
      setUploadedSelfie(capturedImage); // Save the captured image to uploadedSelfie state
      setCapturedImage(null); // Reset capturedImage state for the next capture
    }
  };


             //take picture method 
             const takePicture = () => {
              let width = 600;
              let height = width / (16 / 11);
              let photo = photoRef.current;
              let video = videoRef.current;
            
              // Set the photo width and height
              photo.width = width;
              photo.height = height;
            
              let ctx = photo.getContext('2d');
              ctx.drawImage(video, 0, 0, photo.width, photo.height);
            
              photo.toBlob((blob) => {
                setSelfieBlob(blob);
                setCapturedImage(URL.createObjectURL(blob)); // Save the captured image
              });
            
              setClearButton(true);
            };

             
           
            
          
         useEffect(() =>
         {
            getUserCamera()
         
          
           
         },[])
    
    const handleImageSubmission = () => {
      // Assuming you have file input elements with IDs 'file1' and 'file2'
      const fileInput1 = document.getElementById('file1');
      const fileInput2 = document.getElementById('file2');
      
      if (fileInput1 && fileInput2 ) {
        const file1 = fileInput1.files[0];
        const file2 = fileInput2.files[0];
  
        if (file1 && file2) {
          // Convert images to blobs and store in state
          const blob1 = new Blob([file1], { type: file1.type });
          const blob2 = new Blob([file2], { type: file2.type });
  
          setUploadedImages([blob1, blob2]);
  
          // You can also perform additional actions with the blobs if needed
          // For example, you might want to upload them to a server.
          // You can use the FormData API for this purpose.
          const formData = new FormData();
          formData.append('image1', blob1, 'image1.jpg');
          formData.append('image2', blob2, 'image2.jpg');
  
       

          
        //  let videoRef  =useRef(null)
        //     const getUserCamera =() =>
        //     {
        //         navigator.mediaDevices.getUserMedia({
        //             video:true
        //         })
        //         .then((stream)=>{
        //             let video = videoRef.current
        //             video.srcObject =stream
        //             video.play()
        //         }
        //         )
        //         .catch((error)=>{
        //             console.error(error)
        //         }
        //         )
        //     }
        //  useEffect(() =>
        //  {
        //     getUserCamera()
        //  },[videoRef])
    
        }
      }
    };

    const clearPicture = () => {
        let photo = photoRef.current;
        let ctx = photo.getContext('2d');
        ctx.clearRect(0, 0, photo.width, photo.height); // Clear the canvas
        setClearButton(false)
      };
   
    return (
      <div>
        <Navbar/>
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
        <div className="h-fit">
    <div className="w-full flex justify-center items-center h-screen bg-sky-50 overflow-y-auto"> 

       <form className="w-1/2 h-screen mt-60">
      <div className="flex flex-wrap -mx-3 mb-6 pt-4">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
            First Name
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            id="grid-first-name"
            type="text"
            name="firstName"
            placeholder="Rohit"
            value={formData.firstName}
            onChange={handleInputChange}
          />

        </div>
        <div className="w-full md:w-1/2 px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
            Last Name
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-last-name"
            type="text"
            name="lastName"
            placeholder="Tripathi"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
      </div>
      {/* for email id  */}
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
            Email Id
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-password"
            type="email"
            name="email"
            placeholder="abc@gmail.com"
            value={formData.email}
            onChange={handleInputChange}
          />
    
        </div>
      </div>
      
      <div className="asset-type flex flex-wrap -mx-3 mb-6">
  <div className="w-full px-3">
    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="asset-type">
      Asset Type
    </label>
    <div className="relative">
      <select
        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        id="asset-type"
        name="assetType"
        value={formData.assetType}
        onChange={handleInputChange}
      >
        <option value="" disabled>Select Asset Type</option>
        {/* Leave the options empty initially */}
          <option>Cryptocurrency</option>
        <option>Stocks</option>
        <option>Bonds</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  </div>
</div>
  {/* for assset id */}
  <div className="walletid flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
            Asset Id
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-password"
            type="text"
            placeholder='a1b2c3@#'
            value={formData.assetId}
            name='assetId'
            onChange={handleInputChange}
          />
          
        </div>
      </div>






   
      {/* for wallet id */}
      <div className="walletid flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
            Wallet Id
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-password"
            type="password"
            placeholder='**************'
            name='walletId'
          />
          
        </div>
      </div>
     { /* files uploading section*/ }
     <div className="file-upload-section flex flex-wrap -mx-3 mb-4">
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="file1">
        Upload File 1
      </label>
      <input
        type="file"
        id="file1"
        
        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
      />
    </div>
    <div className="w-full md:w-1/2 px-3">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="file2">
        Upload File 2
      </label>
      <input
        type="file"
        id="file2"
        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
      />
    </div>

    <button onClick={handleImageSubmission} className={`ml-4 ${isCameraOpen ? 'bg-red-500 hover:bg-red-700 mt-3 mb-3' : 'bg-green-500 hover:bg-green-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-transform transform`} type="button">
           image
          </button>
  </div>

 
     {/*files uploadind section ends here */}
   
      {/* selfie time  */}
      
      <div className="walletid flex flex-wrap -mx-3 mb-6">
        <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ml-3 mt-4'>Upload Selfie here</label>
     
      <video className={`container ${styles.selfie_video}`} ref={videoRef}></video>
      {/* <button onClick={takePicture} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-transform transform"
          type="button">Take Selfie</button> */}
          <div className="flex  ">
          <button onClick={takePicture} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-transform transform mt-3 mb-3" type="button">Take Selfie</button>
          <button onClick={toggleCamera} className={`ml-4 ${isCameraOpen ? 'bg-red-500 hover:bg-red-700 mt-3 mb-3' : 'bg-green-500 hover:bg-green-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-transform transform`} type="button">
            {isCameraOpen ? 'Close Camera' : 'Open Camera'}
          </button>

         
        </div>
{/* <button onClick={closeCamera} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-transform transform ml-4" type="button">Close Camera</button> */}

          <canvas className={styles.selfie_video} ref={photoRef}></canvas>
          {clearButton ?
           <div>
           <button onClick={clearPicture} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-transform transform mt-3 mb-3" type="button">Clear</button>
           <button onClick={handleCapture} className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-transform transform mt-3 mb-3" type="button">
    Capture
  </button>
           </div>
           : <></>}
       
     </div>

   












      {/* end of selfie */}
      <div className="flex flex-wrap -mx-3 mb-2 pt-8">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
            Location
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-city"
            type="text"
            placeholder="Keshav Nagar"
            value={formData.location}
            onChange={handleInputChange}
            name='location'
          />
        </div>

        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
           District
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-city"
            type="text"
            placeholder="Kanpur"
            value={formData.district}
            onChange={handleInputChange}
            name='district'
          />
        </div>
        
        
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-zip">
            Zip
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-zip"
            type="text"
            placeholder="208014"
            value={formData.zip}
            onChange={handleInputChange}
            name='zip'
          />
        </div>
      </div>

      <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-red-700 text-white font-bold py-2 px-4 mb-3 rounded focus:outline-none focus:shadow-outline transition-transform transform"
            type="button"
          >
            Submit
          </button>
        </div>
    </form>
    </div>
   <Footer/>
    </div>
      </div>

  )
}

export default Tokenize