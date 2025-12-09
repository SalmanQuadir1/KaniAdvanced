// PrintPosEntryPayment.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { PRINTEntries_URL } from '../../../Constants/utils';

const PrintPosEntryPayment = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const { id, location } = useParams(); // location will be 'delhi' or 'srinagar'
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);




    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${PRINTEntries_URL}/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                const data = await response.json();
                console.log(data, "jhjhjh");


                if (response.ok) {
                    setPaymentData(data);
                } else {
                    setError('Failed to fetch data');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentData();
    }, [id, token]);

    useEffect(() => {
        if (paymentData && !loading) {
            // Small delay to ensure DOM is ready before printing
            const timer = setTimeout(() => {
                window.print();
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [paymentData, loading]);

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

        // Get GST registration from payment data
        const gstRegistration = paymentData?.gstRegistration?.toLowerCase() || '';

        // Determine location based on GST registration
        if (gstRegistration.includes('delhi')) {
            return addresses.delhi;
        } else if (gstRegistration.includes('srinagar')) {
            return addresses.srinagar;
        }

        // Default to srinagar if not specified or invalid
        return addresses.srinagar;
    };

    const companyAddress = getCompanyAddress();

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    const formatCurrency = (amount) => {
        if (!amount) return '0.00';
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

        // Separate rupees and paise
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

        // Convert rupees
        if (rupees > 0) {
            result += convertToWords(rupees) + ' Rupee';
            if (rupees !== 1) result += 's';
        }

        // Convert paise
        if (paise > 0) {
            if (result !== '') result += ' and ';
            result += convertToWords(paise) + ' Paise';
        }

        if (result === '') result = 'Zero Rupees';

        return result + ' Only';
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
            fontSize: '12px',
            fontWeight: 'bold',
            margin: '10px 0 5px 0'
        },
        signatureArea: {
            marginTop: '50px',
            borderTop: '1px solid #000',
            paddingTop: '15px'
        },
        printHide: {
            '@media print': {
                display: 'none'
            }
        }
    };

    if (loading) return (
        <Container className="text-center mt-5">
            <div>Loading invoice data...</div>
        </Container>
    );

    if (error) return (
        <Container className="text-center mt-5">
            <div>Error: {error}</div>
        </Container>
    );

    if (!paymentData) return (
        <Container className="text-center mt-5">
            <div>No invoice data found</div>
        </Container>
    );

    console.log(paymentData, "okok");


    return (
        <Container style={styles.container}>
            {/* Print Button (hidden during actual print) */}
            <div style={styles.printHide} className="text-center mb-3">
                <button
                    onClick={() => window.print()}
                    className="btn btn-primary"
                >
                    Print Invoice
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

                        {/* Right side - Logo (inside same column as address) */}
                        <div style={{ marginLeft: '20px', marginTop: '0' }}>
                            <img
                                src="/img/logo.png"
                                alt="Company Logo"
                                style={{
                                    width: '90px',
                                    height: '90px',
                                    objectFit: 'contain'
                                }}
                            />
                        </div>
                    </Col>

                    {/* Separate column for TAX INVOICE title */}
                    <Col md={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <div style={styles.invoiceTitle}>Sale INVOICE</div>
                    </Col>
                </Row>
            </div>

            {/* Consignee and Buyer Section */}
    

            {/* Invoice Details */}
            <table style={styles.table}>
                <tbody>


                    <tr>
                        <td style={styles.tableHeader} width="25%">Bill No.</td>
                        <td style={styles.tableCell} width="25%">{paymentData.recieptNumber}</td>
                        <td style={styles.tableHeader} width="25%">Dated</td>
                        <td style={styles.tableCell} width="25%">{formatDate(paymentData.date)}</td>
                    </tr>

                  

                    {
                        paymentData.isExport === true && (
                            <tr>
                                <td style={styles.tableHeader}>LUT/Bond Details</td>
                                <td style={styles.tableCell} colSpan="5">
                                   <span className='font-semibold'> LUT No:</span> {paymentData?.lut?.lutNumber || '-'} <br/>
                                  <span className='font-semibold'>  From:</span> {paymentData?.lut?.fromDate || '-'} <br/>
                                  <span className='font-semibold'>  To:</span> {paymentData?.lut?.toDate || '-'}
                                </td>
                            </tr>
                        )
                    }
                 
                </tbody>
            </table>

            {/* Products Table */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader} width="5%">Sl No.</th>
                        <th style={styles.tableHeader} width="40%">Description of Goods</th>
                        <th style={styles.tableHeader} width="10%">HSN/SAC</th>
                        <th style={styles.tableHeader} width="8%">Quantity</th>
                        <th style={styles.tableHeader} width="10%">Rate(inc. Of Tax)</th>
                        <th style={styles.tableHeader} width="10%">Rate</th>
                        <th style={styles.tableHeader} width="10%">Disc. %</th>
                        <th style={styles.tableHeader} width="12%">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {paymentData.paymentDetails?.map((product, index) => (
                        <tr key={index}>
                            <td style={styles.tableCell}>{index + 1}</td>
                            <td style={styles.tableCell}>{product.productDescription}</td>
                            <td style={styles.tableCell}>{product?.hsnCode?.hsnCodeName}</td>
                            <td style={styles.tableCell}>{product.quantity} {product.unit}</td>
                            <td style={styles.tableCell}>₹{formatCurrency(product.exclusiveGst)}</td>
                            <td style={styles.tableCell}>₹{formatCurrency(product.mrp)}</td>
                            <td style={styles.tableCell}>{product.discount || '0'}%</td>
                            <td style={styles.tableCell}>
                                ₹{formatCurrency((product.mrp * product.quantity) * (1 - (product.discount / 100)))}
                            </td>
                        </tr>
                    ))}

                    {/* Totals and Taxes */}
                    <tr style={styles.totalRow}>
                        <td style={styles.tableCell} colSpan="3" className="text-right">Total</td>
                        <td style={styles.tableCell} colSpan="1" className="text-left">{
                            paymentData.paymentDetails.reduce((sum, item) => sum + item.quantity, 0)
                        }
                        </td>

                        <td style={styles.tableCell} className='text-right' colSpan="4">
                            ₹{formatCurrency(
                                paymentData.paymentDetails?.reduce((sum, item) => {
                                    const itemTotal = (item.mrp * item.quantity) * (1 - ((item.discount || 0) / 100));
                                    return sum + itemTotal;
                                }, 0)
                            )}
                        </td>
                    </tr>

                    {paymentData.taxDetails?.map((tax, index) => (
                        <tr key={`tax-${index}`}>
                            <td style={styles.tableCell} colSpan="6" className="text-right">
                                {tax.name} @ {tax.rate}%
                            </td>
                            <td style={styles.tableCell}>₹{formatCurrency(tax.amount)}</td>
                        </tr>
                    ))}
                    {
                        paymentData.totalIgst > 0 && (
                            <tr style={styles.totalRow}>
                                <td style={styles.tableCell} colSpan="6" className="text-right">
                                    <strong>Total IGST</strong>
                                </td>
                                <td colSpan="2" style={styles.tableCell}>
                                    <strong>₹{formatCurrency(paymentData.totalIgst)}</strong>
                                </td>
                            </tr>
                        )
                    }
                    {
                        paymentData.totalCgst > 0 && (
                            <tr style={styles.totalRow}>
                                <td style={styles.tableCell} colSpan="6" className="text-right">
                                    <strong>Total CGST</strong>
                                </td>
                                <td colSpan="2" style={styles.tableCell}>
                                    <strong>₹{formatCurrency(paymentData.totalCgst)}</strong>
                                </td>
                            </tr>
                        )
                    }
                    {
                        paymentData.totalSgst > 0 && (
                            <tr style={styles.totalRow}>
                                <td style={styles.tableCell} colSpan="6" className="text-right">
                                    <strong>Total SGST</strong>
                                </td>
                                <td colSpan="2" style={styles.tableCell}>
                                    <strong>₹{formatCurrency(paymentData.totalSgst)}</strong>
                                </td>
                            </tr>
                        )
                    }
                    <tr style={styles.totalRow}>
                        <td style={styles.tableCell} colSpan="6" className="text-right">
                            <strong>Total Gst</strong>
                        </td>
                        <td colSpan="2" style={styles.tableCell}>
                            <strong>₹{formatCurrency(paymentData.totalGst)}</strong>
                        </td>
                    </tr>

                    <tr style={styles.totalRow}>
                        <td style={styles.tableCell} colSpan="6" className="text-right">
                            <strong>Total Amount</strong>
                        </td>
                        <td colSpan="2" style={styles.tableCell}>
                            <strong>₹{formatCurrency(paymentData.totalAmount)}</strong>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Amount in Words */}
            <div style={styles.sectionTitle}>
                Amount Chargeable (in words): INR {numberToWords(paymentData.totalAmount)}
            </div>

            {/* HSN Summary */}
            {/* HSN Summary Section - Simplified */}
            {(() => {
                // Separate CGST/SGST and IGST items
                const cgstSgstItems = [];
                const igstItems = [];

                if (paymentData.paymentDetails && paymentData.paymentDetails.length > 0) {
                    paymentData.paymentDetails.forEach(item => {
                        if (item.hsnCode && item.hsnCode.hsnCodeName) {
                            const gstCalc = item.gstCalculation || {};
                            const quantity = item.quantity || 1;
                            const taxableValue = (item.exclusiveGst || 0) * quantity;

                            if (gstCalc.type === 'CGST+SGST') {
                                cgstSgstItems.push({
                                    hsnCode: item.hsnCode.hsnCodeName,
                                    taxableValue: taxableValue,
                                    cgstRate: gstCalc.cgstRate || 0,
                                    sgstRate: gstCalc.sgstRate || 0,
                                    cgstAmount: (gstCalc.cgstAmount || 0) * quantity,
                                    sgstAmount: (gstCalc.sgstAmount || 0) * quantity,
                                    totalTax: (gstCalc.totalGstAmount || 0) * quantity
                                });
                            } else if (gstCalc.type === 'IGST') {
                                igstItems.push({
                                    hsnCode: item.hsnCode.hsnCodeName,
                                    taxableValue: taxableValue,
                                    igstRate: gstCalc.igstRate || 0,
                                    igstAmount: (gstCalc.totalGstAmount || 0) * quantity,
                                    totalTax: (gstCalc.totalGstAmount || 0) * quantity
                                });
                            }
                        }
                    });
                }

                return (
                    <>
                        {/* CGST/SGST Table */}
                        {cgstSgstItems.length > 0 && (
                            <>
                                <div style={styles.sectionTitle}>HSN Summary (CGST+SGST)</div>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.tableHeader}>HSN/SAC</th>
                                            <th style={styles.tableHeader}>Taxable Value</th>
                                            <th style={styles.tableHeader}>CGST Rate</th>
                                            <th style={styles.tableHeader}>CGST Amount</th>
                                            <th style={styles.tableHeader}>SGST Rate</th>
                                            <th style={styles.tableHeader}>SGST Amount</th>
                                            <th style={styles.tableHeader}>Total Tax</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cgstSgstItems.map((item, index) => (
                                            <tr key={index}>
                                                <td style={styles.tableCell}>{item.hsnCode}</td>
                                                <td style={styles.tableCell}>₹{formatCurrency(item.taxableValue)}</td>
                                                <td style={styles.tableCell}>{item.cgstRate}%</td>
                                                <td style={styles.tableCell}>₹{formatCurrency(item.cgstAmount)}</td>
                                                <td style={styles.tableCell}>{item.sgstRate}%</td>
                                                <td style={styles.tableCell}>₹{formatCurrency(item.sgstAmount)}</td>
                                                <td style={styles.tableCell}>₹{formatCurrency(item.totalTax)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}

                      
                    </>
                );
            })()}

            {/* Tax Amount in Words */}
            <div style={styles.sectionTitle}>
                Tax Amount (in words): INR {numberToWords(paymentData.totalGst)}
            </div>

            {/* Declaration and Signatures */}
            <div style={styles.signatureArea}>
                <Row>
                    <Col md={6}>
                        <div style={styles.sectionTitle}>Declaration</div>
                        <div style={styles.companyAddress}>
                            Unused goods can be exchanged within 14 days from date of invoice.
                        </div>
                        <div style={{ marginTop: '40px' }}>
                            <strong>Customer's Seal and Signature</strong>
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
                <div>This is a Computer Generated Invoice</div>
            </div>
        </Container>
    );
};

export default PrintPosEntryPayment;