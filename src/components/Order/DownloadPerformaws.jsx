import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Container, Row, Col } from 'react-bootstrap';
import { VIEW_PROFORMABYID } from '../../Constants/utils';
import { useSelector } from 'react-redux';

const DownloadPerformaws = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const { id } = useParams();
    const [proforma, setProforma] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProforma = async () => {
            try {
                const response = await fetch(`${VIEW_PROFORMABYID}/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setProforma(data);
                    setLoading(false);
                }
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProforma();
    }, [id]);

    useEffect(() => {
        if (proforma) {
            const hasGST = proforma.proformaProduct.some(item => item.gstTax > 0);
            if (!hasGST) {
                const gstElements = document.querySelectorAll('.gsttab');
                gstElements.forEach(el => el.style.display = 'none');
                document.getElementById('gstTaxt').style.display = 'none';
                document.getElementById('cgst').style.display = 'none';
            }
            window.print();
        }
    }, [proforma]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!proforma) return <div>No data found</div>;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    // Enhanced CSS styles with smaller fonts and modern styling
    const styles = {
        container: {
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontSize: '12px',
            lineHeight: '1.4',
            color: '#333'
        },
        table: {
            border: '1px solid #e0e0e0',
            borderCollapse: 'collapse',
            fontSize: '11px'
        },
        th: {
            backgroundColor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            padding: '6px 8px',
            textAlign: 'left',
            fontWeight: '600',
            color: '#444'
        },
        td: {
            border: '1px solid #e0e0e0',
            padding: '6px 8px',
            verticalAlign: 'middle'
        },
        companyHeader: {
            color: '#333',
            marginBottom: '0.3rem',
            fontSize: '11px',
            fontWeight: '500'
        },
        invoiceHeader: {
            color: '#2c3e50',
            fontWeight: '600',
            fontSize: '14px',
            letterSpacing: '0.5px',
            marginTop: '15px'
        },
        totalRow: {
            backgroundColor: '#f8f9fa',
            fontWeight: '600'
        },
        productImage: {
            width: '80px',
            height: '70px',
            objectFit: 'cover',
            borderRadius: '2px'
        },
        logo: {
            width: '220px',
            height: '25px',
            filter: 'contrast(1.2)'
        },
        sectionTitle: {
            fontSize: '11px',
            fontWeight: '600',
            color: '#2c3e50',
            marginBottom: '4px'
        },
        boldText: {
            fontWeight: '600'
        },
        subtleText: {
            color: '#666'
        }
    };

    return (
        <Container className="mt-2" style={styles.container}>
            <Row>
                <Col md={4} className="mt-3">
                    <h6 style={styles.companyHeader}><b>Kashmir Loom Company Pvt Ltd</b></h6>
                    <h6 style={styles.companyHeader}>C65, Basement Nizamuddin East,</h6>
                    <h6 style={styles.companyHeader}>New Delhi-110013, India</h6>
                    <h6 style={styles.companyHeader}><b>GSTIN</b>: <span style={styles.boldText}>07AABCK4463H1ZK</span></h6>
                    <h6 style={styles.companyHeader}><b>Email</b>: <a href="mailto:admin@kashmirloom.com" style={{ color: '#333', textDecoration: 'none' }}><span style={styles.boldText}>admin@kashmirloom.com</span></a></h6>
                    <h6 style={styles.companyHeader}><b>Tel</b>: <span style={styles.boldText}>+91 1146502902</span></h6>
                </Col>

                <Col md={4} className="mt-3 text-center">
                    <img
                        style={styles.logo}
                        src="//cdn.shopify.com/s/files/1/2429/1673/files/kashmir_loom_logo_CTP_4e3ef626-01bf-4fe0-8ba1-ca2d0f03a257_x20.png?v=1613708436"
                        alt="Kashmir Loom"
                    />
                    <h5 className="mt-3" style={styles.invoiceHeader}>PRO FORMA INVOICE</h5>
                </Col>

                <Col md={12} className="mt-3">
                    <Table bordered style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>DATE</th>
                                <th style={styles.th}>PI #</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={styles.td}>{formatDate(proforma.date)}</td>
                                <td style={styles.td}>{proforma.pid}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col md={12} className="table-responsive">
                    <Table bordered style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>BILL TO</th>
                                <th style={styles.th}>SHIP TO</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={styles.td}>{proforma.order.customer.billingTo}</td>
                                <td style={styles.td}>{proforma.order.customer.shippingAddress}</td>
                            </tr>
                            <tr>
                                <td style={styles.td}><span style={styles.boldText}>Customer Purchase Order No:</span> {proforma.order.purchaseOrderNo}</td>
                                <td style={styles.td}><span style={styles.boldText}>PO Date:</span> {proforma.order.poDate}</td>
                            </tr>
                            <tr id="cgst">
                                <td style={styles.td} colSpan="2"><span style={styles.boldText}>CLIENT GST NO.</span> {proforma.order.customer.gstin}</td>
                            </tr>
                            <tr>
                                <td style={styles.td}><span style={styles.boldText}>EMAIL:</span> {proforma.order.customer.emailId}</td>
                                <td style={styles.td}><span style={styles.boldText}>EMAIL:</span> {proforma.order.customer.emailId}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col md={12} className="table-responsive">
                    <Table bordered style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>PO #/DATE</th>
                                <th style={styles.th}>PAYMENT TERMS</th>
                                <th style={styles.th}>SHIP DATE</th>
                                <th style={styles.th}>CURRENCY</th>
                                <th style={styles.th}>FREIGHT TERMS</th>
                                <th style={styles.th}>SHIP VIA</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={styles.td}>{proforma.order.poDate}</td>
                                <td style={styles.td}>{proforma.paymentTerms}</td>
                                <td style={styles.td}>{proforma.order.shippingDate}</td>
                                <td style={styles.td}>{proforma.currency}</td>
                                <td style={styles.td}>{proforma.freightTerms}</td>
                                <td style={styles.td}>{proforma.shipVia}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col md={12} className="table-responsive">
                    <Table bordered style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Reference Image</th>
                                <th style={styles.th}>Product Information</th>
                                <th style={styles.th}>Unit</th>
                                <th style={styles.th}>Qty</th>
                                <th style={styles.th} id="gstTaxt">GstTax%</th>
                                <th style={styles.th}>Wholesale</th>
                                <th style={styles.th}>Total Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proforma.proformaProduct.map((item, index) => (
                                <tr key={index}>
                                    <td style={styles.td}>
                                        {item.product.referenceImages && item.product.referenceImages.length > 0 && (
                                            <img
                                                style={styles.productImage}
                                                src={`${process.env.REACT_APP_API_URL}/product/getrefimage/${item.product.referenceImages[0]}`}
                                                alt="Product"
                                            />
                                        )}
                                    </td>
                                    <td style={styles.td}>{item.product.productId}</td>
                                    <td style={styles.td}>{item.product.units}</td>
                                    <td style={styles.td}>{item.orderQty}</td>
                                    <td style={styles.td} className="gsttab" id="fgst" idd={item.gstTax}>{item.gstTax}</td>
                                    <td style={styles.td}>{item.taxibleValue}</td>
                                    <td style={styles.td}>{item.totalValue}</td>
                                </tr>
                            ))}

                            <tr style={styles.totalRow}>
                                <td style={styles.td} colSpan="3" className="text-center"><b>Total</b></td>
                                <td style={styles.td}>{proforma.totalUnits}</td>
                                <td style={styles.td} className="gsttab"></td>
                                <td style={styles.td}></td>
                                <td style={styles.td}>{proforma.totalUnitsValue}</td>
                            </tr>

                            <tr>
                                <td style={styles.td} colSpan="4" className="text-right"><span style={styles.boldText}>GST</span></td>
                                <td style={styles.td} className="gsttab"></td>
                                <td style={styles.td}></td>
                                <td style={styles.td}>{proforma.gst}</td>
                            </tr>

                            <tr>
                                <td style={styles.td} colSpan="4" className="text-right"><span style={styles.boldText}>Courier Charges</span></td>
                                <td style={styles.td} className="gsttab"></td>
                                <td style={styles.td}></td>
                                <td style={styles.td}>{proforma.courierCharges}</td>
                            </tr>

                            <tr style={styles.totalRow}>
                                <td style={styles.td} colSpan="4" className="text-right"><span style={styles.boldText}>Invoice Total</span></td>
                                <td style={styles.td} className="gsttab"></td>
                                <td style={styles.td}></td>
                                <td style={styles.td}>{proforma.total}</td>
                            </tr>

                            <tr>
                                <td style={styles.td} colSpan="4" className="text-right"><span style={styles.boldText}>Advance Received</span></td>
                                <td style={styles.td} className="gsttab"></td>
                                <td style={styles.td}></td>
                                <td style={styles.td}>{proforma.advanceReceived}</td>
                            </tr>

                            <tr style={styles.totalRow}>
                                <td style={styles.td} colSpan="4" className="text-right"><span style={styles.boldText}>Balance Payable</span></td>
                                <td style={styles.td} className="gsttab"></td>
                                <td style={styles.td}></td>
                                <td style={styles.td}>{proforma.outstandingBalance}&nbsp;{proforma.currency}</td>
                            </tr>

                            <tr>
                                <td style={styles.td} colSpan="7">
                                    <h6 style={styles.sectionTitle}>CLIENT INSTRUCTIONS:</h6>
                                    <p style={{ fontSize: '11px', marginBottom: '0' }}>{proforma.order.clientInstruction}</p>
                                </td>
                            </tr>

                            <tr>
                                <td style={styles.td} colSpan="7">
                                    <Table borderless style={{ marginBottom: '0' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ ...styles.th, fontSize: '10px' }} className="text-uppercase text-center" colSpan="6">Shipping & Delivery instructions if any</th>
                                                <th style={{ ...styles.th, fontSize: '10px' }} className="text-uppercase" colSpan="6">packing instructions if any</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={styles.td} className="text-uppercase text-right" colSpan="1"><span style={styles.boldText}>Shipping Account:</span></td>
                                                <td style={styles.td} colSpan="5">{proforma.shippingAccount}</td>
                                                <td style={styles.td} className="text-uppercase" colSpan="1"><span style={styles.boldText}>Labels:</span></td>
                                                <td style={styles.td} colSpan="5">{proforma.order.tagsAndLabels}</td>
                                            </tr>

                                            <tr>
                                                <td style={styles.td} className="text-uppercase text-right" colSpan="1"><span style={styles.boldText}>Service:</span></td>
                                                <td style={styles.td} colSpan="5">{proforma.service}</td>
                                                <td style={styles.td} className="text-uppercase" colSpan="1"><span style={styles.boldText}>Tags:</span></td>
                                                <td style={styles.td} colSpan="5">{proforma.tags}</td>
                                            </tr>

                                            <tr>
                                                <td style={styles.td} className="text-uppercase text-right" colSpan="1"><span style={styles.boldText}>Mode of Shipment:</span></td>
                                                <td style={styles.td} colSpan="5">{proforma.modeOfShipment}</td>
                                                <td style={styles.td} className="text-uppercase" colSpan="1"><span style={styles.boldText}>Logo:</span></td>
                                                <td style={styles.td} colSpan="5">{proforma.logo}</td>
                                            </tr>

                                            <tr>
                                                <td style={styles.td} className="text-uppercase" colSpan="6"></td>
                                                <td style={styles.td} className="text-uppercase" colSpan="1"><span style={styles.boldText}>Cloth Bag:</span></td>
                                                <td style={styles.td} colSpan="5">{proforma.clothBags}</td>
                                            </tr>

                                            <tr>
                                                <td style={styles.td} colSpan="7">
                                                    <p style={{ fontSize: '10px', fontStyle: 'italic', marginBottom: '0' }}>
                                                        <strong>All our products are hand made by artisans, slight variations are the nature of the craft. These enhance the individuality of each product.</strong>
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default DownloadPerformaws;