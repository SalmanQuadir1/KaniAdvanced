import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
import { DOWNLOADAC_PROFITLOSS_REPORT } from "../../Constants/utils";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaDownload } from 'react-icons/fa6';
import { FiEye } from 'react-icons/fi';

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
    const handleGenerateCsv = async (values) => {
        try {
            const response = await fetch(`${DOWNLOADAC_PROFITLOSS_REPORT}/download`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to download report");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `profit_loss_report_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Report downloaded successfully");
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while downloading the report");
        }
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