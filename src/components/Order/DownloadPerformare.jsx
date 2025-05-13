import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Logo from '/img/logo.png';
import { useSelector } from 'react-redux';
import { VIEW_PROFORMABYID } from '../../Constants/utils';
import { Col, Container, Table } from 'react-bootstrap';

const DownloadPerformare = () => {
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
            }
            window.print();
        }
    }, [proforma]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!proforma) return <div>No data found</div>;

    // Enhanced CSS styles with consistent table borders
    const styles = {
        container: {
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontSize: '12px',
            lineHeight: '1.4',
            color: '#333',
            padding: '20px'
        },
        table: {
            border: '1px solid #000',
            borderCollapse: 'collapse',
            width: '100%',
            marginBottom: '20px'
        },
        th: {
            backgroundColor: '#f5f5f5',
            border: '1px solid #000',
            padding: '8px',
            textAlign: 'left',
            fontWeight: '600'
        },
        td: {
            border: '1px solid #000',
            padding: '8px',
            verticalAlign: 'middle'
        },
        companyHeader: {
            marginBottom: '0.3rem',
            fontSize: '11px',
            fontWeight: '500'
        },
        invoiceHeader: {
            fontWeight: '600',
            fontSize: '14px',
            textAlign: 'center',
            margin: '15px 0'
        },
        logo: {
            width: '100px',
            height: '55px',
            filter: 'contrast(1.2)'
        },
        borderedCell: {
            border: '1px solid #000'
        },
        noBorderCell: {
            border: 'none'
        }
    };
console.log(proforma,"kite");
    return (
        <Container style={styles.container}>
            <h4 style={styles.invoiceHeader}>PRO FORMA INVOICE</h4>

            <div className="row mb-4">
                <div className="col-md-8">
                    <h6><b>Kashmir Loom Company Pvt Ltd</b></h6>
                    <h6>C65, Basement Nizamuddin East,</h6>
                    <h6>New Delhi-110013, India</h6>
                    <h6><b>GSTIN</b>: <strong>07AABCK4463H1ZK</strong></h6>
                    <h6><b>Email</b>: <a href="mailto:admin@kashmirloom.com" style={{color:'black',textDecoration:'none'}}><strong>admin@kashmirloom.com</strong></a></h6>
                    <h6><b>Tel</b>: <strong>+91 1146502902</strong></h6>
                </div>
                <div className="col-md-4 text-right">
                    <img style={styles.logo} src={Logo} alt="Logo" />
                </div>
            </div>

            <Table bordered style={styles.table}>
                <thead> 
                    <tr>
                        <th style={styles.th}>DATE</th>
                        <th style={styles.th}>PI #</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={styles.td}>{new Date(proforma?.date).toLocaleDateString('en-CA')}</td>
                        <td style={styles.td}>{proforma?.pid}</td>
                    </tr>
                </tbody>
            </Table>

            <Table bordered style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>BILL TO</th>
                        <th style={styles.th}>SHIP TO</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={styles.td}>{proforma?.order?.customer?.billTo}</td>
                        <td style={styles.td}>{proforma?.order?.customer?.shippingAddress}</td>
                    </tr>
                    <tr>
                        <td style={styles.td}>EMAIL: {proforma?.order?.customer?.email}</td>
                        <td style={styles.td}>EMAIL: {proforma?.order?.customer?.email}</td>
                    </tr>
                </tbody>
            </Table>

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
                        <td style={styles.td}>{proforma?.order?.poDate}</td>
                        <td style={styles.td}>{proforma?.paymentTerms}</td>
                        <td style={styles.td}>{proforma?.order?.shippingDate}</td>
                        <td style={styles.td}>{proforma?.currency}</td>
                        <td style={styles.td}>{proforma?.freightTerms}</td>
                        <td style={styles.td}>{proforma?.shipVia}</td>
                    </tr>
                </tbody>
            </Table>

            <Table bordered style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Reference Image</th>
                        <th style={styles.th}>Product Information</th>
                        <th style={styles.th}>Unit</th>
                        <th style={styles.th}>Qty</th>
                        <th style={styles.th}>MRP</th>
                        <th style={styles.th}>Discount%</th>
                        <th style={styles.th}>Discounted Price</th>
                        <th style={styles.th}>Taxable Value</th> 
                        <th style={styles.th}>Total Value</th>
                    </tr>
                </thead>
                <tbody>
                    {proforma?.proformaProduct?.map((item, index) => (
                        <tr key={index}>
                            <td style={styles.td}>
                                {item?.product?.referenceImages?.length > 0 && (
                                    <img 
                                        width="100" 
                                        height="90" 
                                        src={`/product/getrefimage/${item.product.referenceImages[0]}`} 
                                        alt="Product Reference" 
                                    />
                                )}
                            </td>
                            <td style={styles.td}>{item?.product?.productId}</td>
                            <td style={styles.td}>{item?.product?.units}</td>
                            <td style={styles.td}>{item?.orderQty}</td>
                            <td style={styles.td}>{item?.rate}</td>
                            <td style={styles.td}>{item?.discount}</td>
                            <td style={styles.td}>{item?.discountedPrice}</td>
                            <td style={styles.td}>{item?.taxibleValue}</td>
                            <td style={styles.td}>{item?.totalValue}</td>
                        </tr>
                    ))}
                    
                    <tr>
                        <td style={styles.td} colSpan="3" className="text-center"><b>Total</b></td>
                        <td style={styles.td}>{proforma?.totalUnits}</td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}>{proforma?.totalUnitsValue}</td>
                    </tr>
                    
                    <tr>
                        <td style={styles.td} colSpan="5" className="text-right"><b>GST</b></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}>{proforma?.gst}</td>
                    </tr>
                    
                    <tr>
                        <td style={styles.td} colSpan="5" className="text-right"><b>Courier Charges</b></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}>{proforma?.courierCharges}</td>
                    </tr>
                    
                    <tr>
                        <td style={styles.td} colSpan="5" className="text-right"><b>Invoice Total</b></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}>{proforma?.total}</td>
                    </tr>
                    
                    <tr>
                        <td style={styles.td} colSpan="5" className="text-right"><b>Advance Received</b></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}>{proforma?.advanceReceived}</td>
                    </tr>
                    
                    <tr>
                        <td style={styles.td} colSpan="5" className="text-right"><b>Balance Payable</b></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}>{proforma?.outstandingBalance}&nbsp;{proforma?.currency}</td>
                    </tr>
                    
                    <tr>
                        <td style={styles.td} colSpan="9">
                            <h5>CLIENT INSTRUCTIONS:</h5>
                            <p>{proforma?.order?.clientInstruction}</p>
                        </td>
                    </tr>
                </tbody>
            </Table>

            <Table bordered style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th} colSpan="6">Shipping & Delivery instructions if any</th>
                        <th style={styles.th} colSpan="6">Packing instructions if any</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={styles.td} colSpan="1" className="text-right"><b>Shipping Account:</b></td>
                        <td style={styles.td} colSpan="5">{proforma?.shippingAccount}</td>
                        <td style={styles.td} colSpan="1"><b>Labels:</b></td>
                        <td style={styles.td} colSpan="5">{proforma?.order?.tagsAndLabels}</td>
                    </tr>
                    
                    <tr>
                        <td style={styles.td} colSpan="1" className="text-right"><b>Service:</b></td>
                        <td style={styles.td} colSpan="5">{proforma?.service}</td>
                        <td style={styles.td} colSpan="1"><b>Tags:</b></td>
                        <td style={styles.td} colSpan="5">{proforma?.tags}</td>
                    </tr>
                    
                    <tr>
                        <td style={styles.td} colSpan="1" className="text-right"><b>Mode of Shipment:</b></td>
                        <td style={styles.td} colSpan="5">{proforma?.modeOfShipment}</td>
                        <td style={styles.td} colSpan="1"><b>Logo:</b></td>
                        <td style={styles.td} colSpan="5">{proforma?.logo}</td>
                    </tr>
                    
                    <tr>
                        <td style={styles.td} colSpan="6"></td>
                        <td style={styles.td} colSpan="1"><b>Cloth Bag:</b></td>
                        <td style={styles.td} colSpan="5">{proforma?.clothBags}</td>
                    </tr>
                    
                    <tr>
                        <td style={styles.td} colSpan="12">
                            <p><strong>All our products are hand made by artisans, slight variations are the nature of the craft. These enhance the individuality of each product.</strong></p>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </Container>
    );
};

export default DownloadPerformare;