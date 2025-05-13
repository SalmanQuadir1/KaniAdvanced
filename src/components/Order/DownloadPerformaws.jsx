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

  return (
    <Container className="mt-3">
      <Row>
        <Col md={4} className="mt-4">
          <h6><b>Kashmir Loom Company Pvt Ltd</b></h6>
          <h6>C65, Basement Nizamuddin East,</h6>
          <h6>New Delhi-110013, India</h6>
          <h6><b>GSTIN</b>:- <strong>07AABCK4463H1ZK</strong></h6>
          <h6><b>Email</b>:-&nbsp;<a href="mailto:admin@kashmirloom.com" style={{color:'black',textDecoration:'none'}}><strong>admin@kashmirloom.com</strong></a></h6>
          <h6><b>Tel</b>:- &nbsp;&nbsp;&nbsp; <strong>+91 1146502902</strong></h6>
        </Col>
        
        <Col md={4} className="mt-4 text-center">
          <img 
            style={{width:'280px',height:'30px'}} 
            src="//cdn.shopify.com/s/files/1/2429/1673/files/kashmir_loom_logo_CTP_4e3ef626-01bf-4fe0-8ba1-ca2d0f03a257_x20.png?v=1613708436" 
            alt="Kashmir Loom" 
          />
          <h5 className="mt-4">PRO FORMA INVOICE</h5>
        </Col>
        
        <Col md={4} className="mt-4">
          <Table bordered>
            <thead>
              <tr>
                <th>DATE</th>
                <th>PI #</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formatDate(proforma.date)}</td>
                <td>{proforma.pid}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row>
        <Col md={12} className="table-responsive">
          <Table bordered id="tbl2">
            <thead>
              <tr>
                <th>BILL TO</th>
                <th>SHIP TO</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{proforma.order.customer.billingTo}</td>
                <td>{proforma.order.customer.shippingAddress}</td>
              </tr>
              <tr>
                <td><b>Customer Purchase Order No:</b>&nbsp;&nbsp;{proforma.order.purchaseOrderNo}</td>
                <td><b>PO Date:</b>&nbsp;&nbsp;{proforma.order.poDate}</td>
              </tr>
              <tr id="cgst">
                <td colSpan="2"><b>CLIENT GST NO.</b>&nbsp;&nbsp;{proforma.order.customer.gstin}</td>
              </tr>
              <tr>
                <td><b>EMAIL:</b>&nbsp;{proforma.order.customer.emailId}</td>
                <td><b>EMAIL:</b>&nbsp;{proforma.order.customer.emailId}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row>
        <Col md={12} className="table-responsive">
          <Table bordered>
            <thead>
              <tr>
                <th>PO #/DATE</th>
                <th>PAYMENT TERMS</th>
                <th>SHIP DATE</th>
                <th>CURRENCY</th>
                <th>FREIGHT TERMS</th>
                <th>SHIP VIA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{proforma.order.poDate}</td>
                <td>{proforma.paymentTerms}</td>
                <td>{proforma.order.shippingDate}</td>
                <td>{proforma.currency}</td>
                <td>{proforma.freightTerms}</td>
                <td>{proforma.shipVia}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row>
        <Col md={12} className="table-responsive">
          <Table id="aaa">
            <tbody id="idd">
              <tr>
                <td className="td1"><strong>Reference Image</strong></td>
                <td className="bod" style={{width:'400px'}}><strong>Product Information</strong></td>
                <td className="td1 sz"><strong>Unit</strong></td>
                <td className="td1 sz"><strong>Qty</strong></td>
                <td className="td1" id="gstTaxt"><strong>GstTax%</strong></td>
                <td className="td1 sz"><strong>Wholesale</strong></td>
                <td className="td1" id="tvd1" style={{width:'150px'}}><strong>Total Value</strong></td>
              </tr>
              
              {proforma.proformaProduct.map((item, index) => (
                <tr key={index}>
                  <td className="td1">
                    {item.product.referenceImages && item.product.referenceImages.length > 0 && (
                      <img 
                        width="100" 
                        height="90" 
                        src={`${process.env.REACT_APP_API_URL}/product/getrefimage/${item.product.referenceImages[0]}`} 
                        alt="Product" 
                      />
                    )}
                  </td>
                  <td className="bod">{item.product.productId}</td>
                  <td className="td1">{item.product.units}</td>
                  <td className="td1">{item.orderQty}</td>
                  <td className="td1 gsttab" id="fgst" idd={item.gstTax}>{item.gstTax}</td>
                  <td className="td1">{item.taxibleValue}</td>
                  <td className="td1">{item.totalValue}</td>
                </tr>
              ))}
              
              <tr id="ttl">
                <td colSpan="3" className="td1 text-center"><b>Total</b></td>
                <td className="td1">{proforma.totalUnits}</td>
                <td className="td1 gsttab"></td>
                <td className="td1"></td>
                <td className="td1">{proforma.totalUnitsValue}</td>
              </tr>
              
              <tr>
                <td colSpan="4" className="text-right td1"><b>GST</b></td>
                <td className="gsttab td1"></td>
                <td className="td1"></td>
                <td className="td1">{proforma.gst}</td>
              </tr>
              
              <tr>
                <td colSpan="4" className="text-right td1"><b>Courier Charges</b></td>
                <td className="gsttab td1"></td>
                <td className="td1"></td>
                <td className="td1">{proforma.courierCharges}</td>
              </tr>
              
              <tr>
                <td colSpan="4" className="text-right td1"><b>Invoice Total</b></td>
                <td className="gsttab td1"></td>
                <td className="td1"></td>
                <td className="td1">{proforma.total}</td>
              </tr>
              
              <tr>
                <td colSpan="4" className="text-right td1"><b>Advance Received</b></td>
                <td className="gsttab td1"></td>
                <td className="td1"></td>
                <td className="td1">{proforma.advanceReceived}</td>
              </tr>
              
              <tr>
                <td colSpan="4" className="text-right td1"><b>Balance Payable</b></td>
                <td className="gsttab td1"></td>
                <td className="td1"></td>
                <td className="td1">{proforma.outstandingBalance}&nbsp;{proforma.currency}</td>
              </tr>
              
              <tr>
                <td className="td1" colSpan="7">
                  <h5>CLIENT INSTRUCTIONS:</h5>
                  <p>{proforma.order.clientInstruction}</p>
                </td>
              </tr>
              
              <tr>
                <td colSpan="7" className="td1">
                  <Table borderless id="tbl3">
                    <thead>
                      <tr>
                        <th className="text-uppercase ft text-center" colSpan="6">Shipping & Delivery instructions if any</th>
                        <th className="text-uppercase ft" colSpan="6">packing instructions if any</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-uppercase text-right" colSpan="1"><b>Shipping Account:</b></td>
                        <td colSpan="5">{proforma.shippingAccount}</td>
                        <td className="text-uppercase" colSpan="1"><b>Labels:</b></td>
                        <td colSpan="5">{proforma.order.tagsAndLabels}</td>
                      </tr>
                      
                      <tr>
                        <td className="text-uppercase text-right" colSpan="1"><b>Service:</b></td>
                        <td colSpan="5">{proforma.service}</td>
                        <td className="text-uppercase" colSpan="1"><b>Tags:</b></td>
                        <td colSpan="5">{proforma.tags}</td>
                      </tr>
                      
                      <tr>
                        <td className="text-uppercase text-right" colSpan="1"><b>Mode of Shipment:</b></td>
                        <td colSpan="5">{proforma.modeOfShipment}</td>
                        <td className="text-uppercase" colSpan="1"><b>Logo:</b></td>
                        <td colSpan="5">{proforma.logo}</td>
                      </tr>
                      
                      <tr>
                        <td className="text-uppercase" colSpan="6"></td>
                        <td className="text-uppercase" colSpan="1"><b>Cloth Bag:</b></td>
                        <td colSpan="5">{proforma.clothBags}</td>
                      </tr>
                      
                      <tr>
                        <td colSpan="7">
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