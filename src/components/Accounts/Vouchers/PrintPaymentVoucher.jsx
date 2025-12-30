// PrintPaymentVoucher.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { PRINTPAYMENT_URL } from '../../../Constants/utils';

const PrintPaymentVoucher = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const { id, location } = useParams();
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${PRINTPAYMENT_URL}/fetch/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                const data = await response.json();
                console.log("Payment Data:", data);

                if (response.ok) {
                    setPaymentData(data);
                } else {
                    setError('Failed to fetch payment voucher data');
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

        // Determine location based on GST registration or location param
        const gstRegistration = paymentData?.gstRegistration?.toLowerCase() || '';
        const loc = location?.toLowerCase() || '';

        if (gstRegistration.includes('delhi') || loc.includes('delhi')) {
            return addresses.delhi;
        } else if (gstRegistration.includes('srinagar') || loc.includes('srinagar')) {
            return addresses.srinagar;
        }

        // Default to delhi if not specified
        return addresses.delhi;
    };

    const companyAddress = getCompanyAddress();

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
        voucherTitle: {
            fontSize: '22px',
            fontWeight: 'bold',
            textAlign: 'center',
            margin: '15px 0',
            textTransform: 'uppercase',
            color: '#2c3e50'
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
        },
        amountBox: {
            border: '2px solid #000',
            padding: '15px',
            margin: '20px 0',
            backgroundColor: '#f9f9f9'
        },
        amountWords: {
            fontSize: '13px',
            fontWeight: 'bold',
            marginBottom: '5px'
        },
        amountFigure: {
            fontSize: '20px',
            fontWeight: 'bold',
            textAlign: 'center',
            margin: '10px 0'
        }
    };

    if (loading) return (
        <Container className="text-center mt-5">
            <div>Loading payment voucher data...</div>
        </Container>
    );

    if (error) return (
        <Container className="text-center mt-5">
            <div>Error: {error}</div>
        </Container>
    );

    if (!paymentData) return (
        <Container className="text-center mt-5">
            <div>No payment voucher data found</div>
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
                    Print Payment Voucher
                </button>
            </div>

            {/* Header Section */}
            <div style={styles.header}>
                <Row className="align-items-start">
                    <Col md={8} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        {/* Company Address */}
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

                        {/* Logo */}
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

                    {/* Voucher Title */}
                    <Col md={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <div style={styles.voucherTitle}>PAYMENT VOUCHER</div>
                    </Col>
                </Row>
            </div>

            {/* Voucher Details */}
            <table style={styles.table}>
                <tbody>
                    <tr>
                        <td style={styles.tableHeader} width="25%">Voucher No.</td>
                        <td style={styles.tableCell} width="25%">
                            {paymentData.recieptNumber || paymentData.id || 'N/A'}
                        </td>
                        <td style={styles.tableHeader} width="25%">Date</td>
                        <td style={styles.tableCell} width="25%">
                            {formatDateTime(paymentData.paymentDate)}
                        </td>
                    </tr>
                    <tr>
                        <td style={styles.tableHeader}>Voucher Type</td>
                        <td style={styles.tableCell} colSpan="3">
                            {paymentData.voucherName} ({paymentData.voucherAbbreviation || 'Payment'})
                        </td>
                    </tr>
                    <tr>
                        <td style={styles.tableHeader}>GST Registration</td>
                        <td style={styles.tableCell} colSpan="3">
                            {paymentData.gstRegistration || companyAddress.state}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Payment Details - Two Column Layout */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader} width="50%">PAID FROM</th>
                        <th style={styles.tableHeader} width="50%">PAID TO </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={styles.tableCell}>
                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                {paymentData.ledgerName || 'N/A'}
                            </div>
                            {/* <div>
                                <strong>Ledger ID:</strong> {paymentData.ledgerId || 'N/A'}
                            </div> */}
                        </td>
                        <td style={styles.tableCell}>
                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                {paymentData.toLedgerName || 'N/A'}
                            </div>
                            <div>
                                {/* <strong>Ledger ID:</strong> {paymentData.toLedgerId || 'N/A'} */}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Amount in Box */}
            <div style={styles.amountBox}>
                <div style={styles.amountWords}>
                    Amount in Words: {numberToWords(paymentData.amount)}
                </div>
                <div style={styles.amountFigure}>
                    ₹ {formatCurrency(paymentData.amount)}
                </div>
                <div style={{ textAlign: 'center', fontSize: '11px' }}>
                    (Rupees {formatCurrency(paymentData.amount)} Only)
                </div>
            </div>

            {/* Narration */}
            <table style={styles.table}>
                <tbody>
                    <tr>
                        <td style={styles.tableHeader} width="20%">Narration</td>
                        <td style={styles.tableCell}>
                            {paymentData.narration || 'No narration provided'}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Accounting Entry Summary */}
            <div style={styles.sectionTitle}>Accounting Entry</div>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader}>Particulars</th>
                        <th style={styles.tableHeader}>Debit (₹)</th>
                        <th style={styles.tableHeader}>Credit (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={styles.tableCell}>
                            <strong>Dr.</strong> {paymentData.toLedgerName}
                        </td>
                        <td style={styles.tableCell}>
                            {formatCurrency(paymentData.amount)}
                        </td>
                        <td style={styles.tableCell}>-</td>
                    </tr>
                    <tr>
                        <td style={styles.tableCell}>
                            <strong>Cr.</strong> {paymentData.ledgerName}
                        </td>
                        <td style={styles.tableCell}>-</td>
                        <td style={styles.tableCell}>
                            {formatCurrency(paymentData.amount)}
                        </td>
                    </tr>
                    <tr style={styles.totalRow}>
                        <td style={styles.tableCell}>
                            <strong>TOTAL</strong>
                        </td>
                        <td style={styles.tableCell}>
                            <strong>{formatCurrency(paymentData.amount)}</strong>
                        </td>
                        <td style={styles.tableCell}>
                            <strong>{formatCurrency(paymentData.amount)}</strong>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Additional Information */}
            <table style={styles.table}>
                <tbody>
                    <tr>
                        <td style={styles.tableHeader} width="20%">Voucher ID</td>
                        <td style={styles.tableCell}>{paymentData.voucherId || 'N/A'}</td>
                        <td style={styles.tableHeader} width="20%">Payment ID</td>
                        <td style={styles.tableCell}>{paymentData.id || 'N/A'}</td>
                    </tr>
                </tbody>
            </table>

            {/* Signatures */}
            {/* <div style={styles.signatureArea}>
                <Row>
                    <Col md={4}>
                        <div style={{ marginTop: '40px' }}>
                            <strong>Prepared By</strong><br />
                            <div style={{ borderTop: '1px solid #000', width: '150px', marginTop: '30px' }}></div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div style={{ marginTop: '40px' }}>
                            <strong>Checked By</strong><br />
                            <div style={{ borderTop: '1px solid #000', width: '150px', marginTop: '30px' }}></div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div style={{ marginTop: '40px' }}>
                            <strong>Authorised Signatory</strong><br />
                            <div style={{ borderTop: '1px solid #000', width: '150px', marginTop: '30px' }}></div>
                        </div>
                    </Col>
                </Row>
            </div> */}

            {/* Received Stamp */}
            <div style={{ 
                position: 'relative', 
                marginTop: '40px',
                padding: '20px',
                border: '2px dashed #000',
                textAlign: 'center',
                minHeight: '100px'
            }}>
                <div style={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-45deg)',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'rgba(0,0,0,0.2)',
                    opacity: '0.6'
                }}>
                    RECEIVED
                </div>
                <div style={{ position: 'relative', zIndex: '1' }}>
                    <strong>Received the above payment</strong><br />
                    <div style={{ marginTop: '30px' }}>
                        <strong>Receiver's Signature & Stamp</strong>
                    </div>
                </div>
            </div>

            {/* Footer */}
            {/* <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '10px' }}>
                <div><strong>SUBJECT TO {companyAddress.state.toUpperCase()} COURTS ONLY JURISDICTION</strong></div>
                <div>This is a Computer Generated Payment Voucher</div>
                <div>Printed on: {new Date().toLocaleString('en-IN')}</div>
            </div> */}
        </Container>
    );
};

export default PrintPaymentVoucher;