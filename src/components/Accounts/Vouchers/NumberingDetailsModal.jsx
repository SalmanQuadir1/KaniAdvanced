import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { MdOutlineCancel } from "react-icons/md";
import { TiTickOutline } from "react-icons/ti";
const NumberingDetailsModal = ({ show, onHide, onSubmit }) => {
    const [formData, setFormData] = useState({
        startingNum: '',
        widthNumPart: '',
        prefillZero: false,
       
        restartNumAppForm: '',
        restartNumStartNum: '',
        restartPeriodicity: '',
     
   
        prefixAppForm: '',
        prefixParticular: '',

     
        suffixAppForm: '',
        suffixParticular: '',
    });

 
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleNestedChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onHide();
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="xl"
            centered
            backdrop="static"
            style={{
                position: 'fixed',
                top: 0,
           
              
                zIndex: 30000,
                backgroundColor: 'rgba(0,0,0,0.5)'
            }}
            className='h-[900px] w-[1800px] ml-[100px]  pt-16'
        >
            <Modal.Header className="bg-slate-50 relative w-[1100px]">
                <Modal.Title className="font-semibold text-xl font-satoshi text-center mt-2 w-full">
                    Additional Numbering Details
                </Modal.Title>
                <button
                    onClick={onHide}
                    className="absolute right-4 top-4 text-red-500 hover:text-red-700 focus:outline-none"
                    aria-label="Close"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </Modal.Header>

            <Modal.Body className="bg-slate-100 max-h-[70vh] w-[1100px] overflow-y-auto">
                <div className="grid grid-cols-1 gap-4">
                    {/* Starting Number Section */}
                    <div className="border-b pb-2 mb-2 m-2">
                        <div className="grid grid-cols-3 gap-4 mt-2">
                            <div>
                                <label className="block text-sm font-medium">Starting Number</label>
                                <input
                                    type="text"
                                    className="w-full rounded border p-2"
                                    value={formData.startingNum}
                                    onChange={handleChange}
                                    name="startingNum"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Width of Numerical Part</label>
                                <input
                                    type="text"
                                    className="w-full rounded border p-2"
                                    value={formData.widthNumPart}
                                    onChange={handleChange}
                                    name="widthNumPart"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="prefillZero"
                                    checked={formData.prefillZero}
                                    onChange={handleChange}
                                    name="prefillZero"
                                    className="mr-2"
                                />
                                <label htmlFor="prefillZero">Prefill with zero</label>
                            </div>
                        </div>
                    </div>

                    {/* Tables Section */}
                    <div className="m-2 grid grid-cols-3 gap-4">
                        {/* Restart Numbering */}
                        <div className="col-span-1">
                            <h3 className="font-bold mb-2">Restart Numbering</h3>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border p-2">Applicable From</th>
                                        <th className="border p-2">Starting No</th>
                                        <th className="border p-2">Periodicity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border p-2">
                                            <input
                                                type="date"
                                                className="w-full"
                                                value={formData.restartNumAppForm}
                                                onChange={handleChange}
                                                name="restartNumAppForm"
                                            />
                                        </td>
                                        <td className="border p-2">
                                            <input
                                                type="text"
                                                className="w-full"
                                                value={formData.restartNumStartNum}
                                                onChange={handleChange}
                                                name="restartNumStartNum"
                                            />
                                        </td>
                                        <td className="border p-2">
                                            <select
                                                className="w-full"
                                                value={formData.restartPeriodicity}
                                                onChange={handleChange}
                                                name="restartPeriodicity"
                                            >
                                                <option value="1 Yearly">1 Yearly</option>
                                                <option value="Monthly">Monthly</option>
                                                <option value="Quarterly">Quarterly</option>
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Prefix Details */}
                        <div className="col-span-1">
                            <h3 className="font-bold mb-2">Prefix Details</h3>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border p-2">Applicable From</th>
                                        <th className="border p-2">Particulars</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border p-2">
                                            <input
                                                type="date"
                                                className="w-full"
                                                value={formData.prefixAppForm}
                                                onChange={handleChange}
                                                name="prefixAppForm"
                                            />
                                        </td>
                                        <td className="border p-2">
                                            <input
                                                type="text"
                                                className="w-full"
                                                value={formData.prefixParticular}
                                                onChange={handleChange}
                                                name="prefixParticular"
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Suffix Details */}
                        <div className="col-span-1">
                            <h3 className="font-bold mb-2">Suffix Details</h3>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border p-2">Applicable From</th>
                                        <th className="border p-2">Particulars</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border p-2">
                                            <input
                                                type="date"
                                                className="w-full"
                                                value={formData.suffixAppForm}
                                                onChange={handleChange}
                                                name="suffixAppForm"
                                            />
                                        </td>
                                        <td className="border p-2">
                                            <input
                                                type="text"
                                                className="w-full"
                                                value={formData.suffixParticular}
                                                onChange={handleChange}
                                                name="suffixParticular"
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer className=' flex bg-slate-200 w-[1100px] gap-5 p-4'>
                <MdOutlineCancel color='red' size={30} onClick={onHide}/>
             
                <TiTickOutline color='green' size={30} onClick={handleSubmit}/>
             
            </Modal.Footer>
        </Modal>
    );
};

export default NumberingDetailsModal;