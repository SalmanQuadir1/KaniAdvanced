import React from 'react';
import { FiEdit, FiTrash2 } from "react-icons/fi";

const ViewTable = ({ title, units, totalItems, handleDelete, handleUpdate, pagination, searchvalue }) => {
    if (totalItems < 1) return (<><hr className='text-slate-300' /><p className='text-slate-400 text-2xl text-center py-5'>No {title} Available</p></>);

    // Function to generate table headers dynamically
    console.log(pagination.itemsPerPage + 1, "heyyy");
    const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;
    const renderTableHeaders = () => {

        if (!units || units.length === 0) return null;
        const headers = Object.keys(units[0]).map(header => header === 'id' ? 'Sno' : header);
        return headers
          .map((header, index) => (
            <th
              key={index}
              className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider text-center"
            >
              {header}
            </th>
          ))
          .concat(
            <th
              key={headers.length} // Use length of headers as key for the 'Actions' header
              className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
            >
              Actions
            </th>,
          );
    };

    // Function to generate table rows dynamically
    // Function to generate table rows dynamically
    const renderTableRows = () => {


        if (!units || units.length === 0) return null;
        return units.map((item, rowIndex) => {
            const updatedItem = { ...item, id: startingSerialNumber + rowIndex }; // Update id value with index + 1
            return (
                <tr key={rowIndex} className='bg-white dark:bg-slate-700 dark:text-white'>
                    {Object.values(updatedItem).map((value, colIndex) => (
                        <td key={colIndex} className="px-5 py-5 border-b border-gray-200 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">{value}</p>
                        </td>
                    ))}
                    <td key={Object.keys(updatedItem).length} className="px-5 py-5 border-b border-gray-200 text-sm">
                        <p className="flex text-gray-900 whitespace-no-wrap">
                            <FiEdit size={17} className='text-teal-500 hover:text-teal-700 mx-2' onClick={(e) => handleUpdate(e, item)} title={`Edit ${title}`} />  |
                            <FiTrash2 size={17} className='text-red-500 hover:text-red-700 mx-2' onClick={(e) => handleDelete(e, item.id)} title={`Delete  ${title}`} />
                        </p>
                    </td>
                </tr>
            );
        });
    };


    return (
        <div className="container mx-auto px-4 sm:px-8">


            <div className="pt-5">
                <div className='flex justify-between'>
                    <h2 className="text-2xl font-semibold leading-tight text-center">View {title} </h2>
                    <p
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium 
                            bg-success text-success dark:bg-white dark:text-slate-800`
                        }
                    >
                        Total {title} : {totalItems}
                    </p>
                </div>
                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                    <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr className='bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                    {renderTableHeaders()}
                                </tr>
                            </thead>
                            <tbody>
                                {renderTableRows()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewTable;
