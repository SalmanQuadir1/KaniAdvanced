import React from 'react';

const SupplierModal = ({
  suppliers,
  selectedSuppliers,
  handleCheckboxChange,
  closeModal,
  handleSubmit,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      {/* Modal Content */}
      <div className="bg-slate-100 rounded-lg shadow-lg p-5 w-[500px]">
        <h2 className="text-lg font-bold mb-3">Select Suppliers</h2>
        <ul>
          {suppliers.map((supplier) => (
            <li key={supplier.id} className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={selectedSuppliers.includes(supplier.id)}
                onChange={() => handleCheckboxChange(supplier.id)}
              />
              <label>{supplier.name}</label>
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
