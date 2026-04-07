// PrintStockJournal.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { BASE_URL, PRINTEntries_URL } from '../../../Constants/utils';

const PrintStockJournal = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const { id, location } = useParams();
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${BASE_URL}/stock-voucher/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                const data = await response.json();
                console.log(data, "Stock Voucher Data");

                if (response.ok) {
                    setStockData(data);
                } else {
                    setError('Failed to fetch data');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStockData();
    }, [id, token]);

    useEffect(() => {
        if (stockData && !loading) {
            const timer = setTimeout(() => {
                window.print();
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [stockData, loading]);

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

        // Default to srinagar if location param is provided, otherwise check stockData
        if (location) {
            
            return addresses[location] || addresses.srinagar;
        }

        // Use location from stock data if available
        if (stockData?.location?.locationName?.toLowerCase().includes('delhi')) {
            return addresses.delhi;
        }

        return addresses.srinagar;
    };
console.log(stockData,"6666666");

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
            padding: '8px 4px',
            textAlign: 'left',
            fontWeight: 'bold',
            backgroundColor: '#f0f0f0'
        },
        tableCell: {
            border: '1px solid #000',
            padding: '8px 4px',
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
            textAlign: 'center'
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
            <div>Loading stock voucher data...</div>
        </Container>
    );

    if (error) return (
        <Container className="text-center mt-5">
            <div>Error: {error}</div>
        </Container>
    );

    if (!stockData) return (
        <Container className="text-center mt-5">
            <div>No stock voucher data found</div>
        </Container>
    );

    // Calculate total quantity and value from lines
    const totalDestinationQty = stockData.lines?.reduce((sum, line) => sum + (line.qty || 0), 0) || 0;
    const totalDestinationValue = stockData.lines?.reduce((sum, line) => sum + (line.value || 0), 0) || 0;

    return (
        <Container style={styles.container}>
            {/* Print Button (hidden during actual print) */}
            <div style={styles.printHide} className="text-center mb-3">
                <button
                    onClick={() => window.print()}
                    className="btn btn-primary"
                >
                    Print Stock Journal
                </button>
            </div>

            {/* Header Section */}
            <div style={styles.header}>
                <Row className="align-items-start">
                    <Col md={8} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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

                        {/* <div style={{ marginLeft: '20px', marginTop: '0' }}>
                            <img
                                src="/img/logo.png"
                                alt="Company Logo"
                                style={{
                                    width: '200px',
                                    height: '200px',
                                    objectFit: 'contain'
                                }}
                            />
                        </div> */}
                    </Col>

                    <Col md={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <div style={styles.invoiceTitle}>STOCK JOURNAL</div>
                    </Col>
                </Row>
            </div>

            {/* Voucher Details */}
            <table style={styles.table}>
                <tbody>
                    <tr>
                        <td style={styles.tableHeader} width="25%">Voucher No.</td>
                        <td style={styles.tableCell} width="25%">{stockData.stockVoucherNo || '-'}</td>
                        <td style={styles.tableHeader} width="25%">Date</td>
                        <td style={styles.tableCell} width="25%">{formatDate(stockData.createdDate)}</td>
                    </tr>
                </tbody>
            </table>

            {/* Source Location Section */}
            <div style={styles.sectionTitle}>SOURCE LOCATION</div>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader} width="5%">Sl No.</th>
                        <th style={styles.tableHeader} width="35%">Location Details</th>
                        <th style={styles.tableHeader} width="25%">Product Description</th>
                        <th style={styles.tableHeader} width="15%">Quantity</th>
                        <th style={styles.tableHeader} width="20%">Value (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={styles.tableCell}>1</td>
                        <td style={styles.tableCell}>
                            <strong>{stockData.location?.locationName || 'N/A'}</strong><br />
                            {stockData.location?.address || ''}<br />
                            {stockData.location?.city || ''}, {stockData.location?.state || ''} - {stockData.location?.pinCode || ''}<br />
                            {/* <strong>GSTIN:</strong> {stockData.location?.gstin || 'N/A'} */}
                        </td>
                        <td style={styles.tableCell}>
                            <strong>{stockData.product?.productDescription || 'N/A'}</strong><br />
                            <small>Product ID: {stockData.product?.productId || 'N/A'}</small><br />
                            <small>Barcode: {stockData.product?.barcode || 'N/A'}</small>
                        </td>
                        <td style={styles.tableCell}>{stockData.qty || 0}</td>
                        <td style={styles.tableCell}>₹{formatCurrency(stockData.value)}</td>
                    </tr>
                </tbody>
            </table>

            {/* Destination Locations Section */}
            <div style={styles.sectionTitle}>DESTINATION LOCATIONS</div>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader} width="5%">Sl No.</th>
                        <th style={styles.tableHeader} width="35%">Location Details</th>
                        <th style={styles.tableHeader} width="25%">Product Description</th>
                        <th style={styles.tableHeader} width="15%">Quantity</th>
                        <th style={styles.tableHeader} width="20%">Value (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    {stockData.lines && stockData.lines.length > 0 ? (
                        stockData.lines.map((line, index) => (
                            <tr key={line.id || index}>
                                <td style={styles.tableCell}>{index + 1}</td>
                                <td style={styles.tableCell}>
                                    <strong>{line.location?.locationName || 'N/A'}</strong><br />
                                    {line.location?.address || ''}<br />
                                    {line.location?.city || ''}, {line.location?.state || ''} - {line.location?.pinCode || ''}<br />
                                    {/* <strong>GSTIN:</strong> {line.location?.gstin || 'N/A'} */}
                                </td>
                                <td style={styles.tableCell}>
                                    <strong>{line.product?.productDescription || 'N/A'}</strong><br />
                                    <small>Product ID: {line.product?.productId || 'N/A'}</small><br />
                                    <small>Barcode: {line.product?.barcode || 'N/A'}</small>
                                </td>
                                <td style={styles.tableCell}>{line.qty || 0}</td>
                                <td style={styles.tableCell}>₹{formatCurrency(line.value)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td style={styles.tableCell} colSpan="5" className="text-center">No destination locations found</td>
                        </tr>
                    )}
                </tbody>
                
                {/* Summary Row */}
                {stockData.lines && stockData.lines.length > 0 && (
                    <tfoot>
                        <tr style={styles.totalRow}>
                            <td style={styles.tableCell} colSpan="3" className="text-right"><strong>Total (Destinations)</strong></td>
                            <td style={styles.tableCell}><strong>{totalDestinationQty}</strong></td>
                            <td style={styles.tableCell}><strong>₹{formatCurrency(totalDestinationValue)}</strong></td>
                        </tr>
                    </tfoot>
                )}
            </table>

            {/* Summary Section */}
            <table style={styles.table}>
                <tbody>
                    <tr style={styles.totalRow}>
                        <td style={styles.tableHeader} width="50%">Source Total Quantity</td>
                        <td style={styles.tableCell} width="50%"><strong>{stockData.qty || 0}</strong></td>
                    </tr>
                    <tr style={styles.totalRow}>
                        <td style={styles.tableHeader}>Source Total Value</td>
                        <td style={styles.tableCell}><strong>₹{formatCurrency(stockData.value)}</strong></td>
                    </tr>
                    <tr style={styles.totalRow}>
                        <td style={styles.tableHeader}>Destination Total Quantity</td>
                        <td style={styles.tableCell}><strong>{totalDestinationQty}</strong></td>
                    </tr>
                    <tr style={styles.totalRow}>
                        <td style={styles.tableHeader}>Destination Total Value</td>
                        <td style={styles.tableCell}><strong>₹{formatCurrency(totalDestinationValue)}</strong></td>
                    </tr>
                </tbody>
            </table>

            {/* Declaration and Signatures */}
            <div style={styles.signatureArea}>
                <Row>
                    <Col md={6}>
                        <div style={styles.sectionTitle}>Declaration</div>
                        <div style={styles.companyAddress}>
                            We hereby certify that the goods transferred are as per records.
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
                <div>This is a Computer Generated Stock Journal</div>
            </div>
        </Container>
    );
};

export default PrintStockJournal;