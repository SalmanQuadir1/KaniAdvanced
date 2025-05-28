import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { VIEW_PENDINGFORBILLBYID, VERIFY_STOCK_JOURNAL, UPDATE_PENDINGFORBILLBYID } from '../../Constants/utils';

const UpdatePendingForBill = () => {
    const [billData, setBillData] = useState({
        supplierName: '',
        supplierId: null,
        orders: []
    });
    const [selectedOrders, setSelectedOrders] = useState([]);
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const { id } = useParams();

    const getPendingForBill = async () => {
        try {
            const response = await fetch(`${VIEW_PENDINGFORBILLBYID}/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        
            if (!response.ok) throw new Error("Failed to fetch pending bills");
        
            const data = await response.json();
            console.log("API Response:", data);
            
            // Transform the orders data into a more usable format
            const transformedOrders = data.orders.map(orderGroup => {
                const orderNumbers = Object.keys(orderGroup).filter(key => key !== 'physicalBillNo');
                const orders = orderNumbers.flatMap(orderNo => orderGroup[orderNo]);
                
                return {
                    physicalBillNo: orderGroup.physicalBillNo,
                    orders: orders,
                    // Use the first order's details for common fields
                    orderNo: orderNumbers.join(', '), // Combine all order numbers
                    date: orders[0]?.updatedAt,
                    supplierName: data.supplierName,
                    supplierId: data.supplierId
                };
            });
            
            setBillData({
                supplierName: data.supplierName,
                supplierId: data.supplierId,
                orders: transformedOrders
            });
        } catch (error) {
            console.error("Error fetching pending bills:", error);
            toast.error("Failed to load pending bills");
        }
    };

    useEffect(() => {
        getPendingForBill();
    }, [id]);

    const handleCheckboxChange = (index, isChecked) => {
        setSelectedOrders(prev => 
            isChecked 
                ? [...prev, index] 
                : prev.filter(i => i !== index)
        );
    };

    const handleSubmit = async (values) => {
        // Prepare data in the exact format required
        const payload = selectedOrders.map(index => {
            const orderGroup = billData.orders[index];
            const firstOrder = orderGroup.orders[0];
            console.log(firstOrder,"firssstorderrr"); // Take the first order as representative
            console.log(values,"values=+++++++");
            return {
                supplierId: billData.supplierId,
                orderId: firstOrder.orderId, // Using the first order's ID
                productsId: orderGroup.orders.map(o => o.productId).join(','), // Combine all product IDs
                totalBillAmount: orderGroup.orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
                physicalBillNo: values[`physicalBillNo_${index}`] || '',
                orderNo:firstOrder.orderNo

            };
        });
    
        if (payload.length === 0) {
            toast.error("Please select at least one order group");
            return;
        }
    
        console.log("Payload being sent:", payload);
    
        // try {
        //     const response = await fetch(`${UPDATE_PENDINGFORBILLBYID}/${id}`, {
        //         method: 'PUT',
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authorization": `Bearer ${token}`
        //         },
        //         body: JSON.stringify(payload)
        //     });
    
        //     const data = await response.json();
        //     if (response.ok) {
        //         toast.success("Orders updated successfully");
        //         navigate("/Recieved/pendingForBill");
        //     } else {
        //         toast.error(data.errorMessage || "Failed to update orders");
        //     }
        // } catch (error) {
        //     console.error('Error updating orders:', error);
        //     toast.error("An error occurred while updating orders");
        // }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Order/Update Pending Bills" />
            <div>
                <Formik
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                    initialValues={{}}
                >
                    {({ values, setFieldValue }) => (
                        <Form>
                            <div className="flex flex-col gap-9">
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                        <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                            Update Pending Bills
                                        </h3>
                                    </div>
                                    <div className="p-6.5">
                                        <div className="mb-4">
                                            <h4 className="text-lg font-semibold dark:text-white">
                                                Supplier: {billData.supplierName}
                                            </h4>
                                        </div>
                                        
                                        <div className="shadow-md rounded-lg mt-3 overflow-auto">
                                            <table className="min-w-full leading-normal">
                                                <thead>
                                                    <tr className="bg-slate-300 dark:bg-slate-700 dark:text-white">
                                                        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                                                            Select
                                                        </th>
                                                        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                                                            Date
                                                        </th>
                                                        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                                                            Order No(s)
                                                        </th>
                                                        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                                                            Product IDs
                                                        </th>
                                                        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                                                            Cost
                                                        </th>
                                                        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                                                            Received Quantity
                                                        </th>
                                                        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                                                            Total Bill Amount
                                                        </th>
                                                        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                                                            Physical Bill No
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
    {billData.orders?.map((orderGroup, index) => {
        // Calculate totals
        const totalQty = orderGroup.orders.reduce((sum, order) => sum + (order.receivedQty || 0), 0);
        const totalCost = orderGroup.orders.reduce((sum, order) => sum + (order.productCost || 0), 0);
        const totalBillAmount = orderGroup.orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const productIds = orderGroup.orders.map(order => order.productId).join(', ');

        return (
            <tr key={index} className="border-b border-gray-200">
                <td className="px-5 py-5 text-sm">
                    <input
                        type="checkbox"
                        checked={selectedOrders.includes(index)}
                        onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                </td>
                <td className="px-5 py-5 text-sm">
                    {orderGroup.date && new Date(orderGroup.date).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    })}
                </td>
                <td className="px-5 py-5 text-sm">
                    {orderGroup.orderNo}
                </td>
                <td className="px-5 py-5 text-sm">
                    {productIds}
                </td>
                <td className="px-5 py-5 text-sm">
                    {totalCost}
                </td>
                <td className="px-5 py-5 text-sm">
                    {totalQty}
                </td>
                <td className="px-5 py-5 text-sm">
                    {totalBillAmount}
                </td>
                <td className="px-5 py-5 text-sm">
                    {orderGroup.physicalBillNo ? (
                        // Show existing physical bill number if it exists
                        orderGroup.physicalBillNo
                    ) : (
                        // Show input field if physicalBillNo is null or undefined
                        <Field
                            name={`physicalBillNo_${index}`}
                            className="w-full bg-white dark:bg-form-input dark:text-white rounded border-[1.5px] border-stroke py-2 px-3 text-black"
                            placeholder="Enter Physical Bill No"
                        />
                    )}
                </td>
            </tr>
        );
    })}
</tbody>
                                            </table>
                                        </div>
                                        <div className="flex justify-center mt-4">
                                            <button
                                                type="submit"
                                                disabled={selectedOrders.length === 0}
                                                className={`w-1/3 px-6 py-2 text-white rounded-lg shadow focus:outline-none ${
                                                    selectedOrders.length > 0
                                                        ? "bg-primary hover:bg-primary-dark"
                                                        : "bg-slate-600 cursor-not-allowed"
                                                }`}
                                            >
                                                Update Selected Orders
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </DefaultLayout>
    );
};

export default UpdatePendingForBill;