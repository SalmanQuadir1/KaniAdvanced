// PrintCreditDebit.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { BASE_URL, PRINTEntries_URL } from '../../../Constants/utils';

const PrintCreditDebit = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const { id, location } = useParams();
    const [noteData, setNoteData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNoteData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${BASE_URL}/credit-debit-note/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                const data = await response.json();
                console.log(data, "Credit/Debit Note Data");

                if (response.ok) {
                    setNoteData(data);
                } else {
                    setError('Failed to fetch data');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNoteData();
    }, [id, token]);

    useEffect(() => {
        if (noteData && !loading) {
            const timer = setTimeout(() => {
                window.print();
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [noteData, loading]);

    // Address configuration based on location parameter
    const getCompanyAddress = () => {
        const addresses = {
            delhi: {
                name: "Kashmir Loom Company Pvt Ltd",
                address: "C-65, Basement, Nizamuddin East, New Delhi",
                gstin: "07AABCK4463H1ZK",
                cin: "U74899DL2000PTC104407",
                contact: "+911146502902, 9810511952",
                email: "shop@kashmirloom.com",
                state: "Delhi",
                stateCode: "07"
            },
            srinagar: {
                name: "Kashmir Loom Company Pvt Ltd",
                address: "GULSHAN ANNEX, MUSKAN ROAD, LAL MANDI, SRINAGAR",
                gstin: "01AABCK4463H1ZW",
                cin: "U74899DL2000PTC104407",
                contact: "+911942313989, 9266577005",
                email: "shop@kashmirloom.com",
                state: "Jammu & Kashmir",
                stateCode: "01"
            }
        };

       const gstRegistration = noteData?.locationState?.toLowerCase() || '';

        if (gstRegistration.includes('delhi')) {
            return addresses.delhi;
        } else if (gstRegistration.includes('srinagar')) {
            return addresses.srinagar;
        }

        return addresses.srinagar;
    };

    const companyAddress = getCompanyAddress();

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '0.00';
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const numberToWords = (num) => {
        if (!num || isNaN(num)) return 'Zero Rupees Only';

        const number = parseFloat(num);
        if (number === 0) return 'Zero Rupees Only';

        const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        const thousands = ['', 'Thousand', 'Lakh', 'Crore'];

        const rupees = Math.floor(number);
        const paise = Math.round((number - rupees) * 100);

        const convertBelowHundred = (n) => {
            if (n === 0) return '';
            if (n < 10) return units[n];
            if (n < 20) return teens[n - 10];
            if (n < 100) {
                const ten = Math.floor(n / 10);
                const unit = n % 10;
                return tens[ten] + (unit > 0 ? ' ' + units[unit] : '');
            }
            return '';
        };

        const convertBelowThousand = (n) => {
            if (n === 0) return '';

            const hundred = Math.floor(n / 100);
            const remainder = n % 100;

            let words = '';
            if (hundred > 0) {
                words += units[hundred] + ' Hundred';
            }
            if (remainder > 0) {
                if (words !== '') words += ' ';
                words += convertBelowHundred(remainder);
            }
            return words;
        };

        const convertToWords = (n) => {
            if (n === 0) return 'Zero';

            let words = '';
            let crore = Math.floor(n / 10000000);
            let lakh = Math.floor((n % 10000000) / 100000);
            let thousand = Math.floor((n % 100000) / 1000);
            let hundred = n % 1000;

            if (crore > 0) {
                words += convertBelowThousand(crore) + ' Crore ';
            }
            if (lakh > 0) {
                words += convertBelowThousand(lakh) + ' Lakh ';
            }
            if (thousand > 0) {
                words += convertBelowThousand(thousand) + ' Thousand ';
            }
            if (hundred > 0) {
                words += convertBelowThousand(hundred);
            }

            return words.trim();
        };

        let result = '';

        if (rupees > 0) {
            result += convertToWords(rupees) + ' Rupee';
            if (rupees !== 1) result += 's';
        }

        if (paise > 0) {
            if (result !== '') result += ' and ';
            result += convertToWords(paise) + ' Paise';
        }

        if (result === '') result = 'Zero Rupees';

        return result + ' Only';
    };

    // Get note type display name
    const getNoteTypeDisplay = () => {
        if (!noteData?.noteType) return 'VOUCHER';
        
        switch(noteData.noteType) {
            case 'CREDIT_NOTE':
                return 'CREDIT NOTE';
            case 'DEBIT_NOTE':
                return 'DEBIT NOTE';
            case 'RECEIPT_VOUCHER':
                return 'RECEIPT VOUCHER';
            default:
                return noteData.noteType.replace('_', ' ');
        }
    };

    // Print styles
    const styles = {
        container: {
            fontFamily: "'Arial', sans-serif",
            fontSize: '12px',
            lineHeight: '1.3',
            color: '#000',
            padding: '15px',
            maxWidth: '210mm',
            margin: '0 auto',
            backgroundColor: '#fff'
        },
        header: {
            borderBottom: '2px solid #000',
            paddingBottom: '10px',
            marginBottom: '15px'
        },
        companyName: {
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '4px',
            textTransform: 'uppercase'
        },
        companyAddress: {
            fontSize: '11px',
            marginBottom: '2px'
        },
        invoiceTitle: {
            fontSize: '18px',
            fontWeight: 'bold',
            textAlign: 'center',
            margin: '15px 0',
            textTransform: 'uppercase'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '11px',
            marginBottom: '10px'
        },
        tableHeader: {
            border: '1px solid #000',
            padding: '6px 4px',
            textAlign: 'left',
            fontWeight: 'bold',
            backgroundColor: '#f0f0f0'
        },
        tableCell: {
            border: '1px solid #000',
            padding: '6px 4px',
            verticalAlign: 'top'
        },
        totalRow: {
            fontWeight: 'bold',
            backgroundColor: '#f8f8f8'
        },
        sectionTitle: {
            fontSize: '14px',
            fontWeight: 'bold',
            margin: '15px 0 10px 0',
            textAlign: 'center',
            textTransform: 'uppercase'
        },
        infoBox: {
            border: '1px solid #000',
            padding: '10px',
            marginBottom: '15px',
            backgroundColor: '#f9f9f9'
        },
        signatureArea: {
            marginTop: '50px',
            borderTop: '1px solid #000',
            paddingTop: '15px'
        },
        
        statusBadge: {
            display: 'inline-block',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 'bold',
            backgroundColor: noteData?.isSettled ? '#d4edda' : '#fff3cd',
            color: noteData?.isSettled ? '#155724' : '#856404',
            border: noteData?.isSettled ? '1px solid #c3e6cb' : '1px solid #ffeeba'
        }
    };

    if (loading) return (
        <Container className="text-center mt-5">
            <div>Loading voucher data...</div>
        </Container>
    );

    if (error) return (
        <Container className="text-center mt-5">
            <div>Error: {error}</div>
        </Container>
    );

    if (!noteData) return (
        <Container className="text-center mt-5">
            <div>No voucher data found</div>
        </Container>
    );

    return (
        <Container style={styles.container}>
            {/* Print Button (hidden during actual print) */}
            <div style={styles.printHide} className="text-center mb-3">
                <button
                    onClick={() => window.print()}
                    className="btn btn-primary"
                >
                    Print {getNoteTypeDisplay()}
                </button>
            </div>

            {/* Header Section */}
            <div style={styles.header}>
                <Row className="align-items-start">
                    <Col md={8} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        {/* Left side - Company Address */}
                        <div style={{ flex: 1 }}>
                            <div style={styles.companyName}>{companyAddress.name}</div>
                            <div style={styles.companyAddress}>{companyAddress.address}</div>
                            <div style={styles.companyAddress}>
                                <strong>GSTIN/UIN:</strong> {companyAddress.gstin}
                            </div>
                            <div style={styles.companyAddress}>
                                <strong>State Name:</strong> {companyAddress.state}, <strong>Code:</strong> {companyAddress.stateCode}
                            </div>
                            <div style={styles.companyAddress}>
                                <strong>CIN:</strong> {companyAddress.cin}
                            </div>
                            <div style={styles.companyAddress}>
                                <strong>Contact:</strong> {companyAddress.contact}
                            </div>
                            <div style={styles.companyAddress}>
                                <strong>E-Mail:</strong> {companyAddress.email}
                            </div>
                        </div>

                        {/* Right side - Logo */}
                        <div style={{ marginLeft: '20px', marginTop: '0' }}>
                            <img
                                src="/img/logo.png"
                                alt="Company Logo"
                                style={{
                                    width: '200px',
                                    height: '200px',
                                    objectFit: 'contain'
                                }}
                            />
                        </div>
                    </Col>

                    {/* Title Column */}
                    <Col md={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <div style={styles.invoiceTitle}>{getNoteTypeDisplay()}</div>
                    </Col>
                </Row>
            </div>

            {/* Settlement Status for Receipt Voucher */}
            {noteData.noteType === 'RECEIPT_VOUCHER' && (
                <div style={styles.infoBox}>
                    <Row>
                        <Col md={6}>
                            <strong>Settlement Status:</strong>{' '}
                            <span style={styles.statusBadge}>
                                {noteData.isSettled ? 'Settled' : 'Pending'}
                            </span>
                        </Col>
                        {noteData.isSettled && (
                            <>
                                <Col md={3}>
                                    <strong>Settlement Date:</strong> {formatDate(noteData.settlementDate)}
                                </Col>
                                <Col md={3}>
                                    <strong>Settlement Amount:</strong> ₹{formatCurrency(noteData.settlementAmount)}
                                </Col>
                            </>
                        )}
                    </Row>
                </div>
            )}

            {/* Payment/Bank Details for Receipt Voucher */}
            {noteData.noteType === 'RECEIPT_VOUCHER' && noteData.chequeNumber && (
                <div style={styles.infoBox}>
                    <Row>
                        <Col md={4}>
                            <strong>Cheque No.:</strong> {noteData.chequeNumber}
                        </Col>
                        <Col md={4}>
                            <strong>Bank Name:</strong> {noteData.bankName || 'N/A'}
                        </Col>
                        <Col md={4}>
                            <strong>Transaction ID:</strong> {noteData.transactionId || 'N/A'}
                        </Col>
                    </Row>
                </div>
            )}

            {/* Voucher Details Table */}
            <table style={styles.table}>
                <tbody>
                    <tr>
                        <td style={styles.tableHeader} width="25%">{noteData.noteType === 'RECEIPT_VOUCHER' ? 'Receipt No.' : 'Note No.'}</td>
                        <td style={styles.tableCell} width="25%">{noteData.noteNumber || '-'}</td>
                        <td style={styles.tableHeader} width="25%">Date</td>
                        <td style={styles.tableCell} width="25%">{formatDate(noteData.date)}</td>
                    </tr>
                    <tr>
                        <td style={styles.tableHeader}>Reference No.</td>
                        <td style={styles.tableCell}>{noteData.referenceNumber || '-'}</td>
                        <td style={styles.tableHeader}>Ledger </td>
                        <td style={styles.tableCell}>{noteData.ledgerName || '-'}</td>
                    </tr>
                    {/* <tr>
                        <td style={styles.tableHeader}>Reason</td>
                        <td style={styles.tableCell} colSpan="3">{noteData.reason || '-'}</td>
                    </tr> */}
                    <tr>
                        <td style={styles.tableHeader}>Narration</td>
                        <td style={styles.tableCell} colSpan="3">{noteData.narration || '-'}</td>
                    </tr>
                </tbody>
            </table>

            {/* Items Table */}
          {/* Items Table */}
{
    noteData.noteType === "RECEIPT_NOTE" ? (
        <>
            <div style={styles.sectionTitle}>RECEIPT DETAILS</div>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader} width="30%">From Ledger</th>
                        <th style={styles.tableHeader} width="30%">To Ledger</th>
                        <th style={styles.tableHeader} width="20%">Amount</th>
                        <th style={styles.tableHeader} width="20%">Narration</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={styles.tableCell}>
                            <strong>Ledger NAME:</strong> {noteData.ledgerName || '-'}<br/>
                            {/* You can fetch ledger name from your API if available */}
                        </td>
                        <td style={styles.tableCell}>
                            <strong>To Ledger NAME:</strong> {noteData.destinationLedgerName || '-'}<br/>
                            {/* You can fetch destination ledger name from your API if available */}
                        </td>
                        <td style={styles.tableCell}>
                            <strong>₹{formatCurrency(noteData.totalAmount)}</strong>
                        </td>
                        <td style={styles.tableCell}>
                            {noteData.narration || '-'}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Show additional receipt details if available */}
            {(noteData.chequeNumber || noteData.bankName || noteData.transactionId) && (
                <>
                    <div style={styles.sectionTitle}>PAYMENT DETAILS</div>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.tableHeader} width="25%">Cheque No.</th>
                                <th style={styles.tableHeader} width="25%">Bank Name</th>
                                <th style={styles.tableHeader} width="25%">Transaction ID</th>
                                <th style={styles.tableHeader} width="25%">Settlement Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={styles.tableCell}>{noteData.chequeNumber || '-'}</td>
                                <td style={styles.tableCell}>{noteData.bankName || '-'}</td>
                                <td style={styles.tableCell}>{noteData.transactionId || '-'}</td>
                                <td style={styles.tableCell}>{formatDate(noteData.settlementDate)}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            )}
        </>
    ) : (
        <>
            <div style={styles.sectionTitle}>ITEM DETAILS</div>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader} width="5%">Sl No.</th>
                        <th style={styles.tableHeader} width="20%">Item Type</th>
                        <th style={styles.tableHeader} width="25%">Description</th>
                        <th style={styles.tableHeader} width="8%">HSN Code</th>
                        <th style={styles.tableHeader} width="8%">Qty</th>
                        <th style={styles.tableHeader} width="8%">Rate</th>
                        <th style={styles.tableHeader} width="8%">Disc.%</th>
                        <th style={styles.tableHeader} width="10%">Taxable Value</th>
                        <th style={styles.tableHeader} width="8%">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {noteData.items && noteData.items.length > 0 ? (
                        noteData.items.map((item, index) => (
                            <tr key={index}>
                                <td style={styles.tableCell}>{index + 1}</td>
                                <td style={styles.tableCell}>{item.itemType || 'PRODUCT'}</td>
                                <td style={styles.tableCell}>{item.description || '-'}</td>
                                <td style={styles.tableCell}>{item?.hsnCode?.hsnCodeName || item.hsnCode || '-'}</td>
                                <td style={styles.tableCell}>{item.quantity || 0}</td>
                                <td style={styles.tableCell}>₹{formatCurrency(item.rate)}</td>
                                <td style={styles.tableCell}>{item.discountPercentage || 0}%</td>
                                <td style={styles.tableCell}>₹{formatCurrency(item.taxableValue)}</td>
                                <td style={styles.tableCell}>₹{formatCurrency(item.totalAmount)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td style={styles.tableCell} colSpan="9" className="text-center">No items found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    )
}
           

            {/* Tax Details Table */}
            {(noteData.totalCgst > 0 || noteData.totalSgst > 0 || noteData.totalIgst > 0) && (
                <>
                    <div style={styles.sectionTitle}>TAX DETAILS</div>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.tableHeader} width="25%">Tax Type</th>
                                <th style={styles.tableHeader} width="25%">Rate</th>
                                <th style={styles.tableHeader} width="25%">Amount</th>
                                <th style={styles.tableHeader} width="25%">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {noteData.items?.map((item, index) => (
                                <React.Fragment key={index}>
                                    {item.cgstAmount > 0 && (
                                        <tr>
                                            <td style={styles.tableCell}>CGST</td>
                                            <td style={styles.tableCell}>{item.cgstRate}%</td>
                                            <td style={styles.tableCell}>₹{formatCurrency(item.cgstAmount)}</td>
                                            <td style={styles.tableCell} rowSpan={item.sgstAmount > 0 ? 2 : 1}>
                                                ₹{formatCurrency(item.cgstAmount + item.sgstAmount + item.igstAmount)}
                                            </td>
                                        </tr>
                                    )}
                                    {item.sgstAmount > 0 && (
                                        <tr>
                                            <td style={styles.tableCell}>SGST</td>
                                            <td style={styles.tableCell}>{item.sgstRate}%</td>
                                            <td style={styles.tableCell}>₹{formatCurrency(item.sgstAmount)}</td>
                                        </tr>
                                    )}
                                    {item.igstAmount > 0 && (
                                        <tr>
                                            <td style={styles.tableCell}>IGST</td>
                                            <td style={styles.tableCell}>{item.igstRate}%</td>
                                            <td style={styles.tableCell}>₹{formatCurrency(item.igstAmount)}</td>
                                            <td style={styles.tableCell}>₹{formatCurrency(item.igstAmount)}</td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr style={styles.totalRow}>
                                <td style={styles.tableCell} colSpan="2" className="text-right"><strong>Total CGST</strong></td>
                                <td style={styles.tableCell}><strong>₹{formatCurrency(noteData.totalCgst)}</strong></td>
                                <td style={styles.tableCell} rowSpan="3"><strong>₹{formatCurrency(noteData.totalGst)}</strong></td>
                            </tr>
                            <tr style={styles.totalRow}>
                                <td style={styles.tableCell} colSpan="2" className="text-right"><strong>Total SGST</strong></td>
                                <td style={styles.tableCell}><strong>₹{formatCurrency(noteData.totalSgst)}</strong></td>
                            </tr>
                            <tr style={styles.totalRow}>
                                <td style={styles.tableCell} colSpan="2" className="text-right"><strong>Total IGST</strong></td>
                                <td style={styles.tableCell}><strong>₹{formatCurrency(noteData.totalIgst)}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </>
            )}

            {/* Summary Table */}
            <table style={styles.table}>
                <tbody>
                    <tr>
                        <td style={styles.tableHeader} width="50%">Total Amount (Without GST)</td>
                        <td style={styles.tableCell} width="50%"><strong>₹{formatCurrency(noteData.totalWithoutGst)}</strong></td>
                    </tr>
                    <tr>
                        <td style={styles.tableHeader}>Total GST Amount</td>
                        <td style={styles.tableCell}><strong>₹{formatCurrency(noteData.totalGst)}</strong></td>
                    </tr>
                    <tr style={styles.totalRow}>
                        <td style={styles.tableHeader}>Grand Total</td>
                        <td style={styles.tableCell}><strong>₹{formatCurrency(noteData.totalAmount)}</strong></td>
                    </tr>
                </tbody>
            </table>

            {/* Amount in Words */}
            <div style={styles.sectionTitle}>
                Amount (in words): INR {numberToWords(noteData.totalAmount)}
            </div>

            {/* Export Information */}
            {noteData.isExport && (
                <div style={styles.infoBox}>
                    <Row>
                        <Col md={4}>
                            <strong>Export Currency:</strong> {noteData.currency || 'INR'}
                        </Col>
                        <Col md={4}>
                            <strong>Currency Value:</strong> {formatCurrency(noteData.currencyValue)}
                        </Col>
                        <Col md={4}>
                            <strong>Total in {noteData.currency}:</strong> {formatCurrency(noteData.totalCurrencyValue)}
                        </Col>
                    </Row>
                </div>
            )}

            {/* Declaration and Signatures */}
            <div style={styles.signatureArea}>
                <Row>
                    <Col md={6}>
                        <div style={styles.sectionTitle}>Declaration</div>
                        <div style={styles.companyAddress}>
                            We hereby certify that the information provided is true and correct.
                        </div>
                        <div style={{ marginTop: '40px' }}>
                            <strong>Receiver's Seal and Signature</strong>
                        </div>
                    </Col>
                    <Col md={6} className="text-end">
                        <div style={{ marginTop: '40px' }}>
                            <strong>For {companyAddress.name}</strong>
                        </div>
                        <div style={{ marginTop: '40px' }}>
                            <strong>Authorised Signatory</strong>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '10px' }}>
                <div><strong>SUBJECT TO {companyAddress.state.toUpperCase()} COURTS ONLY JURISDICTION</strong></div>
                <div>This is a Computer Generated {getNoteTypeDisplay()}</div>
            </div>
        </Container>
    );
};

export default PrintCreditDebit;