const ListView = ({ data }) => {
    return (
      <div className=" ml-10 mr-10 w-full mx-auto">
        {data.map((item) => (
          <div key={item.id} className="bg-white p-4 mb-4 rounded-md shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{item.title}</h2>
              <p className="text-gray-500">{item.subtitle}</p>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">View</button>
          </div>
        ))}
      </div>
    );
  };
  
  export default ListView;
  