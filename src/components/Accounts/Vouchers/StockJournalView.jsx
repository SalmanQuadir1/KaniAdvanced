import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import Breadcrumb from '../../Breadcrumbs/Breadcrumb'
import { VIEW_STOCKJOURNALL_URL } from "../../../Constants/utils";
import Pagination from '../../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPrint } from "react-icons/fa";

const StockJournalView = () => {
    const { id } = useParams();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const theme = useSelector(state => state?.persisted?.theme);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = currentUser;
    const [voucherData, setVoucherData] = useState([]);
    const navigate = useNavigate();

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 1,
        currentPage: 0,
        itemsPerPage: 10,
    });

    const getVoucher = async (page = 0) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${VIEW_STOCKJOURNALL_URL}?page=${page}&size=10`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server responded with ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log("Received stock journal data:", data);

            if (!data?.content) {
                setVoucherData([]);
            } else {
                setVoucherData(data.content);
            }

            setPagination({
                totalItems: data?.totalElements || 0,
                data: data?.content || [],
                totalPages: data?.totalPages || 1,
                currentPage: data?.number !== undefined ? data.number : 0,
                itemsPerPage: data?.size || 10,
            });

        } catch (error) {
            console.error("Error fetching stock journal:", error);
            toast.error(error.message || "Failed to fetch stock journal");
            setVoucherData([]);
            setPagination(prev => ({
                ...prev,
                totalItems: 0,
                data: [],
                totalPages: 1,
                currentPage: 0
            }));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getVoucher(0);
    }, []);

    const handlePageChange = (newPage) => {
        console.log("Page change requested:", newPage);
        setPagination((prev) => ({ ...prev, currentPage: newPage - 1 }));
        getVoucher(newPage - 1);
    };

    const renderTableRows = () => {
        if (isLoading) {
            return (
                <tr className='bg-white dark:bg-slate-700 dark:text-white'>
                    <td colSpan="9" className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                        <p className="text-gray-900 whitespace-no-wrap">Loading...</p>
                    </td>
                </tr>
            );
        }

        if (!voucherData || voucherData.length === 0) {
            return (
                <tr className='bg-white dark:bg-slate-700 dark:text-white'>
                    <td colSpan="9" className="px-5 py-5 border-b border-gray-200 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap text-center">No Stock Journal Entries Found</p>
                    </td>
                </tr>
            );
        }

        const startingSerialNumber = (pagination.currentPage * pagination.itemsPerPage) + 1;

        return voucherData.map((item, index) => (
            <tr key={item.id || index} className='bg-white dark:bg-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-600'>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">{startingSerialNumber + index}</p>
                </td>

                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap font-medium">{item?.stockVoucherNo || '-'}</p>
                </td>

                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">{item?.product?.productId || '-'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item?.product?.productDescription || ''}</p>
                </td>

                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">{item?.product?.barcode || '-'}</p>
                </td>

                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">{item?.qty || 0}</p>
                </td>

                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">₹ {item?.value?.toFixed(2) || '0.00'}</p>
                </td>

                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">{item?.location?.locationName || '-'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item?.location?.city || ''}, {item?.location?.state || ''}</p>
                </td>

                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 dark:text-white whitespace-no-wrap">
                        {new Date(item?.createdDate)?.toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })}
                    </p>
                </td>
{/* 
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="flex text-gray-900 whitespace-no-wrap">
                        <FaPrint
                            size={17}
                            className="text-teal-500 hover:text-teal-700 mx-2 cursor-pointer"
                            onClick={() => navigate(`/printstockjournal/${item.id}`)}
                            title="Print Stock Journal"
                        />
                    </p>
                </td> */}
            </tr>
        ));
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Stock Journal / View Entries" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                <div className="pt-5">
                    <div className='flex justify-between items-center mb-4 px-4'>
                        <h2 className="text-xl font-semibold leading-tight dark:text-white">
                            Stock Journal Entries
                        </h2>
                        <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success dark:bg-white dark:text-slate-800">
                            TOTAL ENTRIES: {pagination.totalItems}
                        </p>
                    </div>

                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr className='bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-white uppercase tracking-wider">S.No</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-white uppercase tracking-wider">Voucher No</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-white uppercase tracking-wider">Product</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-white uppercase tracking-wider">Barcode</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-white uppercase tracking-wider">Quantity</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-white uppercase tracking-wider">Value (₹)</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-white uppercase tracking-wider">Location</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-white uppercase tracking-wider">Created Date</th>
                                        {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-white uppercase tracking-wider">Actions</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTableRows()}
                                </tbody>
                            </table>
                        </div>
                        
                        {pagination.totalPages > 1 && (
                            <div className="mt-4">
                                <Pagination 
                                    totalPages={pagination.totalPages} 
                                    currentPage={pagination.currentPage + 1} 
                                    handlePageChange={handlePageChange} 
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default StockJournalView