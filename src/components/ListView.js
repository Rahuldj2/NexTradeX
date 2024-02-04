const ListView = ({ data }) => {

  if (!data || !Array.isArray(data)) {
    return <div>No data to display.</div>;
  }
    return (

      
      <div className=" ml-10 mr-10 w-full mx-auto">
        {data.map((item,index) => (
          <div key={item.id} className="bg-white p-4 mb-4 rounded-md shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Property Index :- {data[index][1]}</h2>
              <p className="text-gray-500">Price :- {data[index][2]}</p>
            </div>
           { data[index][4]?
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Accept</button>:
            
            <div> </div>
            }
            <button className="bg-red-500 text-white px-4 py-2 rounded-md">Cancel</button>
          </div>
        ))}
      </div>
    );
  };
  
  export default ListView;
  