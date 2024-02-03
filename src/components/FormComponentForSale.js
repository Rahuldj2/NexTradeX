// FormComponent.js
import React, { useState } from 'react';

const FormComponent = ({ setForm ,asset_id,location,asset_type,govt_price}) => {
    const [formData, setFormData] = useState({
        area: '',
        governmentRice: '',
        markedPrice: '',
        tokenPrize: '',
        dueDate: '',
        agreeTerms: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform your form submission logic here
        setForm(false);

        console.log(formData);
    };

    const close = () => {
        setForm(false);
    }

    return (
      
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
       <div className="text-xl font-bold ml-12">
            Asset id : {asset_id}
            <br></br>
            
            
            Government Price : {govt_price}
            <br></br>
            Asset Type : {asset_type}
            <br></br>
            Asset Location : {location}
        </div>
            <div className="mt-4">
                <label className="block">
                    Area:
                    <br />
                    <input type="text" name="area" value={formData.area} onChange={handleChange} className="border p-1" />
                </label>
            </div>

            <div className="mt-4">
                <label className="block">
                    Government Price:
                    <br />
                    <input type="text" name="governmentRice" value={formData.governmentRice} onChange={handleChange} className="border p-1" />
                </label>
            </div>

            <div className="mt-4">
                <label className="block">
                    Your Price:
                    <br />
                    <input type="text" name="markedPrice" value={formData.markedPrice} onChange={handleChange} className="border p-1" />
                </label>
            </div>

            <div className="mt-4">
                <label className="block">
                    <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="mr-2" />
                    I agree to the terms and conditions
                </label>
            </div>

            <div className="mt-4">
                <button type="submit" className="bg-blue-500 text-white p-2 px-3 rounded-xl">

                    Create Bid
                </button>
                <button onClick={() => { close }} className="bg-red-500 text-white p-2 px-4 ml-4 rounded-xl">Close</button>

            </div>
        </form>
        
    );
};

export default FormComponent;