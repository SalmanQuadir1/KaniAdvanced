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
                // Hide GST-related elements
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

    // Custom CSS styles
    const styles = {
        table: {
            border: '1px solid #dee2e6',
            borderCollapse: 'collapse'
        },
        th: {
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            padding: '8px',
            textAlign: 'left'
        },
        td: {
            border: '1px solid #dee2e6',
            padding: '8px'
        },
        companyHeader: {
            color: '#343a40',
            marginBottom: '0.5rem'
        },
        invoiceHeader: {
            color: '#495057',
            fontWeight: 'bold'
        },
        totalRow: {
            backgroundColor: '#f8f9fa',
            fontWeight: 'bold'
        },
        productImage: {
            width: '100px',
            height: '90px',
            objectFit: 'cover'
        }
    };

    return (
        <Container className="mt-3" style={{ fontFamily: 'Arial, sans-serif' }}>
            <Row>
                <Col md={4} className="mt-4">
                    <h6 style={styles.companyHeader}><b>Kashmir Loom Company Pvt Ltd</b></h6>
                    <h6 style={styles.companyHeader}>C65, Basement Nizamuddin East,</h6>
                    <h6 style={styles.companyHeader}>New Delhi-110013, India</h6>
                    <h6 style={styles.companyHeader}><b>GSTIN</b>:- <strong>07AABCK4463H1ZK</strong></h6>
                    <h6 style={styles.companyHeader}><b>Email</b>:-&nbsp;<a href="mailto:admin@kashmirloom.com" style={{ color: 'black', textDecoration: 'none' }}><strong>admin@kashmirloom.com</strong></a></h6>
                    <h6 style={styles.companyHeader}><b>Tel</b>:- &nbsp;&nbsp;&nbsp; <strong>+91 1146502902</strong></h6>
                </Col>

                <Col md={4} className="mt-4 text-center">
                    <img
                        style={{ width: '280px', height: '30px' }}
                        src="//cdn.shopify.com/s/files/1/2429/1673/files/kashmir_loom_logo_CTP_4e3ef626-01bf-4fe0-8ba1-ca2d0f03a257_x20.png?v=1613708436"
                        alt="Kashmir Loom"
                    />
                    <h5 className="mt-4" style={styles.invoiceHeader}>PRO FORMA INVOICE</h5>
                </Col>

                <Col md={4} className="mt-4">
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

            <Row className="mt-3">
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
                                <td style={styles.td}><b>Customer Purchase Order No:</b>&nbsp;&nbsp;{proforma.order.purchaseOrderNo}</td>
                                <td style={styles.td}><b>PO Date:</b>&nbsp;&nbsp;{proforma.order.poDate}</td>
                            </tr>
                            <tr id="cgst">
                                <td style={styles.td} colSpan="2"><b>CLIENT GST NO.</b>&nbsp;&nbsp;{proforma.order.customer.gstin}</td>
                            </tr>
                            <tr>
                                <td style={styles.td}><b>EMAIL:</b>&nbsp;{proforma.order.customer.emailId}</td>
                                <td style={styles.td}><b>EMAIL:</b>&nbsp;{proforma.order.customer.emailId}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <Row className="mt-3">
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

            <Row className="mt-3">
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
                                <td style={styles.td} colSpan="4" className="text-right"><b>GST</b></td>
                                <td style={styles.td} className="gsttab"></td>
                                <td style={styles.td}></td>
                                <td style={styles.td}>{proforma.gst}</td>
                            </tr>

                            <tr>
                                <td style={styles.td} colSpan="4" className="text-right"><b>Courier Charges</b></td>
                                <td style={styles.td} className="gsttab"></td>
                                <td style={styles.td}></td>
                                <td style={styles.td}>{proforma.courierCharges}</td>
                            </tr>

                            <tr style={styles.totalRow}>
                                <td style={styles.td} colSpan="4" className="text-right"><b>Invoice Total</b></td>
                                <td style={styles.td} className="gsttab"></td>
                                <td style={styles.td}></td>
                                <td style={styles.td}>{proforma.total}</td>
                            </tr>

                            <tr>
                                <td style={styles.td} colSpan="4" className="text-right"><b>Advance Received</b></td>
                                <td style={styles.td} className="gsttab"></td>
                                <td style={styles.td}></td>
                                <td style={styles.td}>{proforma.advanceReceived}</td>
                            </tr>

                            <tr style={styles.totalRow}>
                                <td style={styles.td} colSpan="4" className="text-right"><b>Balance Payable</b></td>
                                <td style={styles.td} className="gsttab"></td>
                                <td style={styles.td}></td>
                                <td style={styles.td}>{proforma.outstandingBalance}&nbsp;{proforma.currency}</td>
                            </tr>

                            <tr>
                                <td style={styles.td} colSpan="7">
                                    <h5>CLIENT INSTRUCTIONS:</h5>
                                    <p>{proforma.order.clientInstruction}</p>
                                </td>
                            </tr>

                            <tr>
                                <td style={styles.td} colSpan="7">
                                    <Table borderless>
                                        <thead>
                                            <tr>
                                                <th style={styles.th} className="text-uppercase text-center" colSpan="6">Shipping & Delivery instructions if any</th>
                                                <th style={styles.th} className="text-uppercase" colSpan="6">packing instructions if any</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={styles.td} className="text-uppercase text-right" colSpan="1"><b>Shipping Account:</b></td>
                                                <td style={styles.td} colSpan="5">{proforma.shippingAccount}</td>
                                                <td style={styles.td} className="text-uppercase" colSpan="1"><b>Labels:</b></td>
                                                <td style={styles.td} colSpan="5">{proforma.order.tagsAndLabels}</td>
                                            </tr>

                                            <tr>
                                                <td style={styles.td} className="text-uppercase text-right" colSpan="1"><b>Service:</b></td>
                                                <td style={styles.td} colSpan="5">{proforma.service}</td>
                                                <td style={styles.td} className="text-uppercase" colSpan="1"><b>Tags:</b></td>
                                                <td style={styles.td} colSpan="5">{proforma.tags}</td>
                                            </tr>

                                            <tr>
                                                <td style={styles.td} className="text-uppercase text-right" colSpan="1"><b>Mode of Shipment:</b></td>
                                                <td style={styles.td} colSpan="5">{proforma.modeOfShipment}</td>
                                                <td style={styles.td} className="text-uppercase" colSpan="1"><b>Logo:</b></td>
                                                <td style={styles.td} colSpan="5">{proforma.logo}</td>
                                            </tr>

                                            <tr>
                                                <td style={styles.td} className="text-uppercase" colSpan="6"></td>
                                                <td style={styles.td} className="text-uppercase" colSpan="1"><b>Cloth Bag:</b></td>
                                                <td style={styles.td} colSpan="5">{proforma.clothBags}</td>
                                            </tr>

                                            <tr>
                                                <td style={styles.td} colSpan="7">
                                                    <p><strong>All our products are hand made by artisans,slight variations are the nature of the craft.These enhance the individuality of each product.</strong></p>
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