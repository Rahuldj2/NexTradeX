import { useEffect, useState } from 'react';
import { getDummyData } from './api/dummydata';
import ListView from '../components/ListView';
import  Navbar  from '../components/Navbar';

const MyBids = () => {
  const [data, setData] = useState([]);
 
  
  useEffect(() => {
    const fetchData = async () => {
      const dummyData = await getDummyData();
      setData(dummyData);
    };

    fetchData();
  }, []);

  return (

    <div  className="flex flex-col justify-center h-full bg-white">
        <div className={`h-20`}>
        <Navbar />
      </div>
    <div className="min-h-screen flex pt-16 justify-center bg-gray-100">
      <ListView data={data} />
    </div>
    </div>
  );
};

export default MyBids;
