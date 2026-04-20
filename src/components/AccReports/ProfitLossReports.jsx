import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
import { DOWNLOADAC_PROFITLOSS_REPORT } from "../../Constants/utils";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaDownload } from 'react-icons/fa6';
import { FiEye } from 'react-icons/fi';

import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const ProfitLossReports = () => {
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [isDataFetched, setIsDataFetched] = useState(false);

    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;

    const [currentFilters, setCurrentFilters] = useState({
        fromDate: '',
        toDate: ''
    });

    // Function to fetch report data
    const fetchReportData = async (values) => {
        setLoading(true);
        
        try {
            const response = await fetch(`${DOWNLOADAC_PROFITLOSS_REPORT}/preview`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch report data");
            }
            
            const data = await response.json();
            console.log(data, "API Response");
            
            setReportData(data);
            setIsDataFetched(true);
            toast.success("Report loaded successfully");
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while fetching the report");
            setReportData(null);
        } finally {
            setLoading(false);
        }
    };

    // Handle View button click
    const handleViewReport = async (values) => {
        setCurrentFilters({
            fromDate: values.fromDate,
            toDate: values.toDate
        });
        await fetchReportData(values);
    };

    // Handle CSV download
    // const handleGenerateCsv = async (values) => {
    //     try {
    //         const response = await fetch(`${DOWNLOADAC_PROFITLOSS_REPORT}/download`, {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });

    //         if (!response.ok) {
    //             const errorText = await response.text();
    //             throw new Error(errorText || "Failed to download report");
    //         }

    //         const blob = await response.blob();
    //         const url = window.URL.createObjectURL(blob);
    //         const link = document.createElement("a");
    //         link.href = url;
    //         link.setAttribute("download", `profit_loss_report_${new Date().toISOString().split('T')[0]}.xlsx`);
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //         window.URL.revokeObjectURL(url);

    //         toast.success("Report downloaded successfully");
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("An error occurred while downloading the report");
    //     }
    // };

  const handleGenerateCsv = async (values) => {
    if (!reportData) {
        toast.warning("Please view the report first before downloading");
        return;
    }
    await generateExcelReport();

};

    // Render Opening Stock Table
    const renderOpeningStockTable = () => {
        if (!reportData?.openingStock || reportData.openingStock.ledgers.length === 0) return null;

        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3">
                    <h3 className="text-white font-semibold text-lg">{reportData.openingStock.groupName}</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Particulars</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {reportData.openingStock.ledgers.map((ledger, idx) => (
                                <tr key={`opening-${idx}`} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">
                                        {ledger.ledgerName}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300">
                                        ₹{ledger.closingBalance?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50 dark:bg-slate-700/30 font-semibold">
                                <td className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-white">Total</td>
                                <td className="px-6 py-3 text-sm text-right font-bold text-gray-900 dark:text-white">
                                    ₹{reportData.openingStock.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // Render Purchase Accounts Table
    const renderPurchaseTable = () => {
        if (!reportData?.purchaseAccounts || reportData.purchaseAccounts.ledgers.length === 0) return null;

        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3">
                    <h3 className="text-white font-semibold text-lg">{reportData.purchaseAccounts.groupName}</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Particulars</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {reportData.purchaseAccounts.ledgers.map((ledger, idx) => (
                                <tr key={`purchase-${idx}`} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">
                                        {ledger.ledgerName}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300">
                                        ₹{ledger.closingBalance?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50 dark:bg-slate-700/30 font-semibold">
                                <td className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-white">Total</td>
                                <td className="px-6 py-3 text-sm text-right font-bold text-gray-900 dark:text-white">
                                    ₹{reportData.purchaseAccounts.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // Render Direct Expenses Table
    const renderDirectExpensesTable = () => {
        if (!reportData?.directExpenses || reportData.directExpenses.ledgers.length === 0) return null;

        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
                <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-3">
                    <h3 className="text-white font-semibold text-lg">{reportData.directExpenses.groupName}</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Particulars</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {reportData.directExpenses.ledgers.map((ledger, idx) => (
                                <tr key={`direct-exp-${idx}`} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">
                                        {ledger.ledgerName}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300">
                                        ₹{ledger.closingBalance?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50 dark:bg-slate-700/30 font-semibold">
                                <td className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-white">Total</td>
                                <td className="px-6 py-3 text-sm text-right font-bold text-gray-900 dark:text-white">
                                    ₹{reportData.directExpenses.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // Render Indirect Expenses Table
    const renderIndirectExpensesTable = () => {
        if (!reportData?.indirectExpenses || reportData.indirectExpenses.ledgers.length === 0) return null;

        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3">
                    <h3 className="text-white font-semibold text-lg">{reportData.indirectExpenses.groupName}</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Particulars</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {reportData.indirectExpenses.ledgers.map((ledger, idx) => (
                                <tr key={`indirect-exp-${idx}`} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">
                                        {ledger.ledgerName}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300">
                                        ₹{ledger.closingBalance?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50 dark:bg-slate-700/30 font-semibold">
                                <td className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-white">Total</td>
                                <td className="px-6 py-3 text-sm text-right font-bold text-gray-900 dark:text-white">
                                    ₹{reportData.indirectExpenses.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // Render Sales Accounts Table
    const renderSalesTable = () => {
        if (!reportData?.salesAccounts || reportData.salesAccounts.ledgers.length === 0) return null;

        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-3">
                    <h3 className="text-white font-semibold text-lg">{reportData.salesAccounts.groupName}</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Particulars</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {reportData.salesAccounts.ledgers.map((ledger, idx) => (
                                <tr key={`sales-${idx}`} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">
                                        {ledger.ledgerName}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300">
                                        ₹{ledger.closingBalance?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50 dark:bg-slate-700/30 font-semibold">
                                <td className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-white">Total</td>
                                <td className="px-6 py-3 text-sm text-right font-bold text-gray-900 dark:text-white">
                                    ₹{reportData.salesAccounts.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // Render Direct Incomes Table
    const renderDirectIncomesTable = () => {
        if (!reportData?.directIncomes || reportData.directIncomes.ledgers.length === 0) return null;

        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-3">
                    <h3 className="text-white font-semibold text-lg">{reportData.directIncomes.groupName}</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Particulars</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {reportData.directIncomes.ledgers.map((ledger, idx) => (
                                <tr key={`direct-inc-${idx}`} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">
                                        {ledger.ledgerName}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300">
                                        ₹{ledger.closingBalance?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50 dark:bg-slate-700/30 font-semibold">
                                <td className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-white">Total</td>
                                <td className="px-6 py-3 text-sm text-right font-bold text-gray-900 dark:text-white">
                                    ₹{reportData.directIncomes.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // Render Closing Stock Table
    

    const renderClosingStockTable = () => {
        if (!reportData?.closingStock || reportData.closingStock.ledgers.length === 0) return null;

        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-3">
                    <h3 className="text-white font-semibold text-lg">{reportData.closingStock.groupName}</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Particulars</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {reportData.closingStock.ledgers.map((ledger, idx) => (
                                <tr key={`closing-${idx}`} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">
                                        {ledger.ledgerName}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300">
                                        ₹{ledger.closingBalance?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50 dark:bg-slate-700/30 font-semibold">
                                <td className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-white">Total</td>
                                <td className="px-6 py-3 text-sm text-right font-bold text-gray-900 dark:text-white">
                                    ₹{reportData.closingStock.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // Render Indirect Incomes Table
    const renderIndirectIncomesTable = () => {
        if (!reportData?.indirectIncomes || reportData.indirectIncomes.ledgers.length === 0) return null;

        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-3">
                    <h3 className="text-white font-semibold text-lg">{reportData.indirectIncomes.groupName}</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Particulars</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {reportData.indirectIncomes.ledgers.map((ledger, idx) => (
                                <tr key={`indirect-inc-${idx}`} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">
                                        {ledger.ledgerName}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-300">
                                        ₹{ledger.closingBalance?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50 dark:bg-slate-700/30 font-semibold">
                                <td className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-white">Total</td>
                                <td className="px-6 py-3 text-sm text-right font-bold text-gray-900 dark:text-white">
                                    ₹{reportData.indirectIncomes.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // Render Gross Profit/Loss Card
    const renderGrossProfitLoss = () => {
        if (reportData?.grossProfit === null && reportData?.grossLoss === null) return null;

        const isProfit = reportData?.grossProfit !== null;
        const amount = isProfit ? reportData.grossProfit : reportData.grossLoss;
        const title = isProfit ? 'Gross Profit' : 'Gross Loss';
        const bgGradient = isProfit 
            ? 'from-emerald-500 to-emerald-600' 
            : 'from-rose-500 to-rose-600';

        return (
            <div className={`bg-gradient-to-r ${bgGradient} rounded-xl shadow-lg p-6 text-white mb-6`}>
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className="text-2xl font-bold">₹{amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</p>
                </div>
            </div>
        );
    };

    // Render Net Profit/Loss Card
    const renderNetProfitLoss = () => {
        if (reportData?.netProfit === null && reportData?.netLoss === null) return null;

        const isProfit = reportData?.netProfit !== null;
        const amount = isProfit ? reportData.netProfit : reportData.netLoss;
        const title = isProfit ? 'Net Profit' : 'Net Loss';
        const bgGradient = isProfit 
            ? 'from-emerald-600 to-emerald-700' 
            : 'from-rose-600 to-rose-700';

        return (
            <div className={`bg-gradient-to-r ${bgGradient} rounded-xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-300`}>
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold">{title}</h3>
                    <p className="text-3xl font-bold">₹{amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</p>
                </div>
            </div>
        );
    };

    // Render Summary Cards
    const renderSummaryCards = () => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Total Debit </h3>
                        <p className="text-2xl font-bold">₹{reportData?.leftTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</p>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Total Credit </h3>
                        <p className="text-2xl font-bold">₹{reportData?.rightTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</p>
                    </div>
                </div>
            </div>
        );
    };



    ///report fromfrontend

  

// Add this function to your component


// Add this function to your component


const generateExcelReport = async () => {
    if (!reportData) {
        toast.error("No data available to generate report");
        return;
    }

    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Profit & Loss Statement');
        
        // Set worksheet properties
        worksheet.properties.defaultRowHeight = 25;
        worksheet.columns = [
            { header: 'Particulars', key: 'leftParticular', width: 45 },
            { header: 'Amount (₹)', key: 'leftAmount', width: 18, style: { numFmt: '#,##0.00' } },
            { header: 'Particulars', key: 'rightParticular', width: 45 },
            { header: 'Amount (₹)', key: 'rightAmount', width: 18, style: { numFmt: '#,##0.00' } }
        ];
        
        // Merge cells for title
        worksheet.mergeCells('A1:D1');
        worksheet.mergeCells('A2:D2');
        
        // Add title rows
        const titleRow = worksheet.getCell('A1');
        titleRow.value = 'PROFIT & LOSS ACCOUNT';
        titleRow.font = { bold: true, size: 16, name: 'Arial' };
        titleRow.alignment = { horizontal: 'center', vertical: 'middle' };
        
        const periodRow = worksheet.getCell('A2');
        periodRow.value = `For the period from ${currentFilters.fromDate} to ${currentFilters.toDate}`;
        periodRow.font = { bold: true, size: 12 };
        periodRow.alignment = { horizontal: 'center', vertical: 'middle' };
        
        // Add header row
        const headerRow = worksheet.addRow(['PARTICULARS', 'AMOUNT (₹)', 'PARTICULARS', 'AMOUNT (₹)']);
        headerRow.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF1F4E79' }
        };
        headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
        headerRow.eachCell((cell) => {
            cell.border = {
                top: { style: 'medium' },
                bottom: { style: 'medium' },
                left: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
        
        // Helper to add styled row with both left and right content
        const addStyledRow = (leftText, leftAmount, rightText, rightAmount, isBold = false, isTotal = false) => {
            const row = worksheet.addRow([leftText || '', leftAmount || '', rightText || '', rightAmount || '']);
            
            // Style left column
            const leftCell = row.getCell(1);
            leftCell.font = { bold: isBold, size: isBold ? 11 : 10 };
            leftCell.alignment = { horizontal: 'left', vertical: 'middle' };
            if (isTotal) {
                leftCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE2F0D9' }
                };
            }
            
            // Style left amount column
            const leftAmountCell = row.getCell(2);
            leftAmountCell.font = { bold: isBold };
            leftAmountCell.alignment = { horizontal: 'right', vertical: 'middle' };
            leftAmountCell.numFmt = '#,##0.00';
            if (isTotal && leftAmount) {
                leftAmountCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE2F0D9' }
                };
            }
            
            // Style right column
            const rightCell = row.getCell(3);
            rightCell.font = { bold: isBold, size: isBold ? 11 : 10 };
            rightCell.alignment = { horizontal: 'left', vertical: 'middle' };
            if (isTotal) {
                rightCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE2F0D9' }
                };
            }
            
            // Style right amount column
            const rightAmountCell = row.getCell(4);
            rightAmountCell.font = { bold: isBold };
            rightAmountCell.alignment = { horizontal: 'right', vertical: 'middle' };
            rightAmountCell.numFmt = '#,##0.00';
            if (isTotal && rightAmount) {
                rightAmountCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE2F0D9' }
                };
            }
            
            // Add borders to all cells in row
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
                };
            });
            
            return row;
        };
        
        // Prepare left and right sections data
        const leftSectionRows = [];
        const rightSectionRows = [];
        
        // Build left section rows (Debit side)
        if (reportData.openingStock?.ledgers?.length > 0) {
            leftSectionRows.push({ text: reportData.openingStock.groupName?.toUpperCase(), amount: null, isBold: true, isTotal: false });
            reportData.openingStock.ledgers.forEach(ledger => {
                leftSectionRows.push({ text: `  ${ledger.ledgerName}`, amount: ledger.closingBalance, isBold: false, isTotal: false });
            });
            leftSectionRows.push({ text: `Total ${reportData.openingStock.groupName?.toUpperCase()}`, amount: reportData.openingStock.totalAmount, isBold: true, isTotal: true });
        }
        
        if (reportData.purchaseAccounts?.ledgers?.length > 0) {
            leftSectionRows.push({ text: reportData.purchaseAccounts.groupName?.toUpperCase(), amount: null, isBold: true, isTotal: false });
            reportData.purchaseAccounts.ledgers.forEach(ledger => {
                leftSectionRows.push({ text: `  ${ledger.ledgerName}`, amount: ledger.closingBalance, isBold: false, isTotal: false });
            });
            leftSectionRows.push({ text: `Total ${reportData.purchaseAccounts.groupName?.toUpperCase()}`, amount: reportData.purchaseAccounts.totalAmount, isBold: true, isTotal: true });
        }
        
        if (reportData.directExpenses?.ledgers?.length > 0) {
            leftSectionRows.push({ text: reportData.directExpenses.groupName?.toUpperCase(), amount: null, isBold: true, isTotal: false });
            reportData.directExpenses.ledgers.forEach(ledger => {
                leftSectionRows.push({ text: `  ${ledger.ledgerName}`, amount: ledger.closingBalance, isBold: false, isTotal: false });
            });
            leftSectionRows.push({ text: `Total ${reportData.directExpenses.groupName?.toUpperCase()}`, amount: reportData.directExpenses.totalAmount, isBold: true, isTotal: true });
        }
        
        if (reportData.indirectExpenses?.ledgers?.length > 0) {
            leftSectionRows.push({ text: reportData.indirectExpenses.groupName?.toUpperCase(), amount: null, isBold: true, isTotal: false });
            reportData.indirectExpenses.ledgers.forEach(ledger => {
                leftSectionRows.push({ text: `  ${ledger.ledgerName}`, amount: ledger.closingBalance, isBold: false, isTotal: false });
            });
            leftSectionRows.push({ text: `Total ${reportData.indirectExpenses.groupName?.toUpperCase()}`, amount: reportData.indirectExpenses.totalAmount, isBold: true, isTotal: true });
        }
        
        // Build right section rows (Credit side)
        if (reportData.salesAccounts?.ledgers?.length > 0) {
            rightSectionRows.push({ text: reportData.salesAccounts.groupName?.toUpperCase(), amount: null, isBold: true, isTotal: false });
            reportData.salesAccounts.ledgers.forEach(ledger => {
                rightSectionRows.push({ text: `  ${ledger.ledgerName}`, amount: ledger.closingBalance, isBold: false, isTotal: false });
            });
            rightSectionRows.push({ text: `Total ${reportData.salesAccounts.groupName?.toUpperCase()}`, amount: reportData.salesAccounts.totalAmount, isBold: true, isTotal: true });
        }
        
        if (reportData.directIncomes?.ledgers?.length > 0) {
            rightSectionRows.push({ text: reportData.directIncomes.groupName?.toUpperCase(), amount: null, isBold: true, isTotal: false });
            reportData.directIncomes.ledgers.forEach(ledger => {
                rightSectionRows.push({ text: `  ${ledger.ledgerName}`, amount: ledger.closingBalance, isBold: false, isTotal: false });
            });
            rightSectionRows.push({ text: `Total ${reportData.directIncomes.groupName?.toUpperCase()}`, amount: reportData.directIncomes.totalAmount, isBold: true, isTotal: true });
        }
        
        if (reportData.closingStock?.ledgers?.length > 0) {
            rightSectionRows.push({ text: reportData.closingStock.groupName?.toUpperCase(), amount: null, isBold: true, isTotal: false });
            reportData.closingStock.ledgers.forEach(ledger => {
                rightSectionRows.push({ text: `  ${ledger.ledgerName}`, amount: ledger.closingBalance, isBold: false, isTotal: false });
            });
            rightSectionRows.push({ text: `Total ${reportData.closingStock.groupName?.toUpperCase()}`, amount: reportData.closingStock.totalAmount, isBold: true, isTotal: true });
        }
        
        if (reportData.indirectIncomes?.ledgers?.length > 0) {
            rightSectionRows.push({ text: reportData.indirectIncomes.groupName?.toUpperCase(), amount: null, isBold: true, isTotal: false });
            reportData.indirectIncomes.ledgers.forEach(ledger => {
                rightSectionRows.push({ text: `  ${ledger.ledgerName}`, amount: ledger.closingBalance, isBold: false, isTotal: false });
            });
            rightSectionRows.push({ text: `Total ${reportData.indirectIncomes.groupName?.toUpperCase()}`, amount: reportData.indirectIncomes.totalAmount, isBold: true, isTotal: true });
        }
        
        // Combine left and right rows (side by side)
        const maxRows = Math.max(leftSectionRows.length, rightSectionRows.length);
        
        for (let i = 0; i < maxRows; i++) {
            const left = leftSectionRows[i] || {};
            const right = rightSectionRows[i] || {};
            
            addStyledRow(
                left.text || '',
                left.amount,
                right.text || '',
                right.amount,
                left.isBold || right.isBold,
                left.isTotal || right.isTotal
            );
        }
        
        // Add totals row
       
        
        // Add empty row for spacing
        worksheet.addRow([]);
        
        // Add Gross Profit/Loss
        if (reportData.grossProfit !== null && reportData.grossProfit > 0) {
            addStyledRow('GROSS PROFIT', reportData.grossProfit, '', '', true, true);
        } else if (reportData.grossLoss !== null && reportData.grossLoss > 0) {
            addStyledRow('GROSS LOSS', reportData.grossLoss, '', '', true, true);
        }
        
        // Add Net Profit/Loss
        if (reportData.netProfit !== null && reportData.netProfit > 0) {
            addStyledRow('NET PROFIT', reportData.netProfit, '', '', true, true);
        } else if (reportData.netLoss !== null && reportData.netLoss > 0) {
            addStyledRow('NET LOSS', reportData.netLoss, '', '', true, true);
        }

         addStyledRow('TOTAL (DEBIT)', reportData.leftTotal, 'TOTAL (CREDIT)', reportData.rightTotal, true, true);
        
        // Generate buffer and download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        saveAs(blob, `Profit_Loss_Statement_${currentFilters.fromDate}_to_${currentFilters.toDate}.xlsx`);
        
        toast.success("Excel report generated successfully");
    } catch (error) {
        console.error("Error generating Excel:", error);
        toast.error("Error generating Excel report");
    }
};

// Update your download handler
// const handleGenerateExcel = async (values) => {
//     if (!reportData) {
//         toast.warning("Please view the report first before downloading");
//         return;
//     }
//     generateExcelReport();
// };

// Ultra bold styling for professional look




    // Render loading state
    if (loading) {
        return (
            <DefaultLayout>
                <Breadcrumb pageName="Report/Profit & Loss Reports" />
                <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800 min-h-screen">
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Loading report data...</p>
                        </div>
                    </div>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Report/Profit & Loss Reports" />
            <div className="container mx-auto px-4 sm:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
                <div className="pt-5 pb-10">
                    {/* Header */}
                    <div className='flex justify-between items-center mb-8'>
                        <h2 className="text-2xl font-bold leading-tight text-gray-800 dark:text-white">
                            Profit & Loss Report
                        </h2>
                    </div>

                    {/* Filter Section */}
                    <div className='bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8'>
                        <Formik
                            initialValues={{
                                fromDate: '',
                                toDate: '',
                            }}
                        >
                            {({ values }) => (
                                <Form>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="mb-2.5 block text-black dark:text-white font-medium">
                                                From Date
                                            </label>
                                            <Field
                                                name='fromDate'
                                                type="date"
                                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2.5 block text-black dark:text-white font-medium">
                                                To Date
                                            </label>
                                            <Field
                                                name='toDate'
                                                type="date"
                                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => handleViewReport(values)}
                                            className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
                                            disabled={loading}
                                        >
                                            <FiEye size={18} />
                                            View Report
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleGenerateCsv(values)}
                                            className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-success text-white font-medium hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
                                            disabled={loading}
                                        >
                                            <FaDownload size={18} />
                                            Generate Report
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>

                    {/* Report Content */}
                    {isDataFetched && reportData && (
                        <div className="space-y-8">
                            {/* Summary Cards */}
                            {renderSummaryCards()}

                            {/* Two Column Layout for Debit and Credit Sides */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column - Debit Side */}
                                <div className="space-y-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-1 h-8 bg-red-500 rounded-full mr-3"></div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Debit Side (Expenses & Losses)</h3>
                                    </div>
                                    {renderOpeningStockTable()}
                                    {renderPurchaseTable()}
                                    {renderDirectExpensesTable()}
                                    {renderIndirectExpensesTable()}
                                </div>

                                {/* Right Column - Credit Side */}
                                <div className="space-y-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-1 h-8 bg-green-500 rounded-full mr-3"></div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Credit Side (Incomes & Profits)</h3>
                                    </div>
                                    {renderSalesTable()}
                                    {renderDirectIncomesTable()}
                                    {renderClosingStockTable()}
                                    {renderIndirectIncomesTable()}
                                </div>
                            </div>

                            {/* Gross Profit/Loss - Full Width */}
                            <div className="w-full">
                                {renderGrossProfitLoss()}
                            </div>

                            {/* Net Profit/Loss - Full Width */}
                            <div className="w-full">
                                {renderNetProfitLoss()}
                            </div>
                        </div>
                    )}

                    {/* No Data State */}
                    {isDataFetched && !reportData && (
                        <div className="text-center py-12">
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-8">
                                <p className="text-gray-500 dark:text-gray-400 text-lg">No data found for the selected filters</p>
                            </div>
                        </div>
                    )}

                    {/* Initial State */}
                    {!isDataFetched && !loading && (
                        <div className="text-center py-12">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
                                <p className="text-gray-500 dark:text-gray-400 text-lg">Select dates and click "View Report" to load data</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DefaultLayout>
    )
}

export default ProfitLossReports;