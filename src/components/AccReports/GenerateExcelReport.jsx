import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Add this function to your component
const GenerateExcelReport = () => {
    if (!reportData) {
        toast.error("No data available to generate report");
        return;
    }

    try {
        // Prepare data for Excel in the format shown in screenshot
        const excelData = [];
        
        // Header with company info and date range
        excelData.push(['Profit & Loss Account']);
        excelData.push([`For the period from ${currentFilters.fromDate} to ${currentFilters.toDate}`]);
        excelData.push([]); // Empty row
        
        // Left Side Headers (Expenses) and Right Side Headers (Incomes)
        excelData.push(['Particulars', 'Amount (₹)', 'Particulars', 'Amount (₹)']);
        
        // Helper function to add rows with proper alignment
        const addRow = (leftParticular, leftAmount, rightParticular = '', rightAmount = '') => {
            excelData.push([
                leftParticular || '',
                leftAmount !== undefined && leftAmount !== null ? formatAmountForExcel(leftAmount) : '',
                rightParticular || '',
                rightAmount !== undefined && rightAmount !== null ? formatAmountForExcel(rightAmount) : ''
            ]);
        };
        
        // Add Opening Stock
        if (reportData.openingStock?.ledgers?.length > 0) {
            addRow(reportData.openingStock.groupName, '');
            reportData.openingStock.ledgers.forEach(ledger => {
                addRow(`  ${ledger.ledgerName}`, ledger.closingBalance);
            });
            addRow('', '');
        }
        
        // Add Purchases
        if (reportData.purchaseAccounts?.ledgers?.length > 0) {
            addRow(reportData.purchaseAccounts.groupName, '');
            reportData.purchaseAccounts.ledgers.forEach(ledger => {
                addRow(`  ${ledger.ledgerName}`, ledger.closingBalance);
            });
            addRow('', '');
        }
        
        // Add Direct Expenses
        if (reportData.directExpenses?.ledgers?.length > 0) {
            addRow(reportData.directExpenses.groupName, '');
            reportData.directExpenses.ledgers.forEach(ledger => {
                addRow(`  ${ledger.ledgerName}`, ledger.closingBalance);
            });
            addRow('', '');
        }
        
        // Calculate Total Debits (Left side)
        const totalDebits = reportData.leftTotal || 0;
        
        // Right Side - Incomes
        let maxRows = Math.max(
            reportData.openingStock?.ledgers?.length || 0,
            reportData.purchaseAccounts?.ledgers?.length || 0,
            reportData.salesAccounts?.ledgers?.length || 0,
            reportData.closingStock?.ledgers?.length || 0,
            reportData.directExpenses?.ledgers?.length || 0,
            reportData.directIncomes?.ledgers?.length || 0,
            reportData.indirectExpenses?.ledgers?.length || 0,
            reportData.indirectIncomes?.ledgers?.length || 0
        );
        
        // Rebuild the Excel data with proper left/right alignment
        const formattedData = [];
        formattedData.push(['Profit & Loss Account']);
        formattedData.push([`For the period from ${currentFilters.fromDate} to ${currentFilters.toDate}`]);
        formattedData.push([]);
        formattedData.push(['Particulars', 'Amount (₹)', 'Particulars', 'Amount (₹)']);
        
        // Collect all sections for left and right
        const leftSections = [];
        const rightSections = [];
        
        // Left Side Sections
        if (reportData.openingStock?.ledgers?.length > 0) {
            leftSections.push({
                title: reportData.openingStock.groupName,
                items: reportData.openingStock.ledgers,
                total: reportData.openingStock.totalAmount
            });
        }
        
        if (reportData.purchaseAccounts?.ledgers?.length > 0) {
            leftSections.push({
                title: reportData.purchaseAccounts.groupName,
                items: reportData.purchaseAccounts.ledgers,
                total: reportData.purchaseAccounts.totalAmount
            });
        }
        
        if (reportData.directExpenses?.ledgers?.length > 0) {
            leftSections.push({
                title: reportData.directExpenses.groupName,
                items: reportData.directExpenses.ledgers,
                total: reportData.directExpenses.totalAmount
            });
        }
        
        if (reportData.indirectExpenses?.ledgers?.length > 0) {
            leftSections.push({
                title: reportData.indirectExpenses.groupName,
                items: reportData.indirectExpenses.ledgers,
                total: reportData.indirectExpenses.totalAmount
            });
        }
        
        // Right Side Sections
        if (reportData.salesAccounts?.ledgers?.length > 0) {
            rightSections.push({
                title: reportData.salesAccounts.groupName,
                items: reportData.salesAccounts.ledgers,
                total: reportData.salesAccounts.totalAmount
            });
        }
        
        if (reportData.directIncomes?.ledgers?.length > 0) {
            rightSections.push({
                title: reportData.directIncomes.groupName,
                items: reportData.directIncomes.ledgers,
                total: reportData.directIncomes.totalAmount
            });
        }
        
        if (reportData.closingStock?.ledgers?.length > 0) {
            rightSections.push({
                title: reportData.closingStock.groupName,
                items: reportData.closingStock.ledgers,
                total: reportData.closingStock.totalAmount
            });
        }
        
        if (reportData.indirectIncomes?.ledgers?.length > 0) {
            rightSections.push({
                title: reportData.indirectIncomes.groupName,
                items: reportData.indirectIncomes.ledgers,
                total: reportData.indirectIncomes.totalAmount
            });
        }
        
        // Calculate max rows needed
        let leftRowIndex = 0;
        let rightRowIndex = 0;
        const maxRows_needed = Math.max(
            leftSections.reduce((sum, section) => sum + section.items.length + 1, 0),
            rightSections.reduce((sum, section) => sum + section.items.length + 1, 0)
        );
        
        // Build rows
        for (let i = 0; i < maxRows_needed + 5; i++) {
            let leftParticular = '';
            let leftAmount = '';
            let rightParticular = '';
            let rightAmount = '';
            
            // Fill left side
            let currentLeftRow = 0;
            for (const section of leftSections) {
                if (currentLeftRow === i) {
                    leftParticular = section.title;
                    break;
                }
                currentLeftRow++;
                
                for (const item of section.items) {
                    if (currentLeftRow === i) {
                        leftParticular = `  ${item.ledgerName}`;
                        leftAmount = item.closingBalance;
                        break;
                    }
                    currentLeftRow++;
                }
                if (leftParticular) break;
                
                if (currentLeftRow === i && section.total !== undefined) {
                    leftParticular = `Total ${section.title}`;
                    leftAmount = section.total;
                    break;
                }
                currentLeftRow++;
            }
            
            // Fill right side
            let currentRightRow = 0;
            for (const section of rightSections) {
                if (currentRightRow === i) {
                    rightParticular = section.title;
                    break;
                }
                currentRightRow++;
                
                for (const item of section.items) {
                    if (currentRightRow === i) {
                        rightParticular = `  ${item.ledgerName}`;
                        rightAmount = item.closingBalance;
                        break;
                    }
                    currentRightRow++;
                }
                if (rightParticular) break;
                
                if (currentRightRow === i && section.total !== undefined) {
                    rightParticular = `Total ${section.title}`;
                    rightAmount = section.total;
                    break;
                }
                currentRightRow++;
            }
            
            if (leftParticular || rightParticular) {
                formattedData.push([
                    leftParticular,
                    leftAmount !== '' ? formatAmountForExcel(leftAmount) : '',
                    rightParticular,
                    rightAmount !== '' ? formatAmountForExcel(rightAmount) : ''
                ]);
            }
        }
        
        // Add totals row
        formattedData.push([]);
        formattedData.push([
            'Total (Debit)',
            formatAmountForExcel(reportData.leftTotal || 0),
            'Total (Credit)',
            formatAmountForExcel(reportData.rightTotal || 0)
        ]);
        
        // Add Gross Profit/Loss
        formattedData.push([]);
        if (reportData.grossProfit !== null && reportData.grossProfit > 0) {
            formattedData.push([
                'Gross Profit',
                formatAmountForExcel(reportData.grossProfit),
                '',
                ''
            ]);
        } else if (reportData.grossLoss !== null && reportData.grossLoss > 0) {
            formattedData.push([
                'Gross Loss',
                formatAmountForExcel(reportData.grossLoss),
                '',
                ''
            ]);
        }
        
        // Add Net Profit/Loss
        formattedData.push([]);
        if (reportData.netProfit !== null && reportData.netProfit > 0) {
            formattedData.push([
                'Net Profit',
                formatAmountForExcel(reportData.netProfit),
                '',
                ''
            ]);
        } else if (reportData.netLoss !== null && reportData.netLoss > 0) {
            formattedData.push([
                'Net Loss',
                formatAmountForExcel(reportData.netLoss),
                '',
                ''
            ]);
        }
        
        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet(formattedData);
        
        // Set column widths
        ws['!cols'] = [
            { wch: 40 },  // Column A - Particulars
            { wch: 15 },  // Column B - Amount
            { wch: 40 },  // Column C - Particulars
            { wch: 15 }   // Column D - Amount
        ];
        
        // Style the worksheet (basic styling)
        const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:D1');
        for (let row = range.s.r; row <= range.e.r; row++) {
            for (let col = range.s.c; col <= range.e.c; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                if (!ws[cellAddress]) continue;
                
                // Make header rows bold
                if (row === 0 || row === 3) {
                    ws[cellAddress].s = {
                        font: { bold: true, sz: 12 },
                        alignment: { horizontal: 'center' }
                    };
                }
                
                // Style total rows
                if (formattedData[row] && formattedData[row][0]?.toString().includes('Total')) {
                    ws[cellAddress].s = {
                        font: { bold: true },
                        fill: { fgColor: { rgb: "E0E0E0" } }
                    };
                }
                
                // Style profit/loss rows
                if (formattedData[row] && (
                    formattedData[row][0]?.toString().includes('Gross') ||
                    formattedData[row][0]?.toString().includes('Net')
                )) {
                    ws[cellAddress].s = {
                        font: { bold: true, color: { rgb: "00B050" } },
                        fill: { fgColor: { rgb: "E2F0D9" } }
                    };
                }
            }
        }
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Profit & Loss Statement');
        
        // Generate Excel file
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `Profit_Loss_Statement_${currentFilters.fromDate}_to_${currentFilters.toDate}.xlsx`);
        
        toast.success("Excel report generated successfully");
    } catch (error) {
        console.error("Error generating Excel:", error);
        toast.error("Error generating Excel report");
    }
};

// Helper function to format amounts for Excel
const formatAmountForExcel = (amount) => {
    if (amount === undefined || amount === null) return '';
    return Number(amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};