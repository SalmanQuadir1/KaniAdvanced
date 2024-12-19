import React, { useEffect, useState } from 'react';
import { GET_PRODUCTBYID_URL } from '../../Constants/utils';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const SupplierModal = ({
  suppliers,
  selectedSuppliers,
  handleCheckboxChange,
  closeModal,
  handleSubmit,
  id
}) => {
    const [supplierList, setsupplierList] = useState([])

    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;


    useEffect(() => {
        
        const getSupplier = async (page) => {
            try {
                const response = await fetch(`${GET_PRODUCTBYID_URL}/suppliers/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setsupplierList(data);
             
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch Design");
            }
        };







        getSupplier()
    }, [id])
    
console.log(supplierList,"listttt");
    
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      {/* Modal Content */}
      <div className="bg-slate-100 rounded-lg shadow-lg p-5 w-[500px]">
        <h2 className="text-lg font-bold mb-3">Select Suppliers</h2>
       
        <ul>
          {supplierList.map((supplier) => (
            <li key={supplier.id} className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={selectedSuppliers.includes(supplier?.supplierName)}
                onChange={() => handleCheckboxChange(supplier?.supplierName)}
              />
              <label>{supplier?.supplierName}</label>
            </li>
          ))}
        </ul>

        {/* Modal Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={closeModal} className="bg-gray-300 px-4 py-1 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierModal;