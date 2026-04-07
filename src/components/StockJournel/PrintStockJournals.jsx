import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PrintStockJournals = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { stockJournal } = location.state || {};

  useEffect(() => {
    if (!stockJournal) {
      navigate("/stock/ViewStockTransfer");
      return;
    }
    // Auto open print dialog after a short delay (ensures DOM is fully rendered)
    setTimeout(() => {
      window.print();
    }, 200);
  }, [stockJournal, navigate]);

  if (!stockJournal) return null;

  const { voucherNo, createdDate, journalStatus, transferProducts = [] } = stockJournal;

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString();
  };

  // Company details (replace with your actual data)
  const company = {
    name: "Craft Flow Erp",
    logo: "/img/logo.png", // put your logo in public folder or use an icon


  };

  return (
    <div className="print-container">
      {/* Print-only styles */}
      <style>
        {`
        @page {
  margin: 0; /* Removes default browser page margins */
}
           @media print {
  body {
    margin: 0 !important;
    padding: 0 !important;
    display: block !important; /* Override screen flex centering */
    background: white;
  }
  .print-container {
    margin: 0 !important;
    padding: 20px !important;
    box-shadow: none;
    border-radius: 0;
  }
            .no-print {
              display: none;
            }
            table {
              page-break-inside: avoid;
            }
            tr {
              page-break-inside: avoid;
            }
          }
          /* Screen styles - no scrollbars, centered */
          body {
            margin: 0;
            padding: 0;
            background: #f0f2f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .print-container {
            max-width: 1200px;
            margin: 20px auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 35px -10px rgba(0,0,0,0.1);
            overflow: hidden;
            padding: 40px;
          }
          @media print {
            .print-container {
              margin: 0;
              padding: 20px;
              box-shadow: none;
              border-radius: 0;
            }
          }
          .company-header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin-bottom: 30px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
          }
          .company-logo {
            width: 60px;
            height: 60px;
            background: #3b82f6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 28px;
            font-weight: bold;
          }
          .company-name {
            font-size: 28px;
            font-weight: 800;
            color: #1e293b;
            letter-spacing: -0.5px;
          }
          .company-address {
            font-size: 12px;
            color: #64748b;
            margin-top: 4px;
          }
          .title {
            text-align: center;
            margin: 20px 0;
          }
          .title h2 {
            font-size: 24px;
            font-weight: 700;
            color: #0f172a;
            margin: 0;
          }
          .title p {
            color: #475569;
            margin-top: 6px;
          }
          .info-grid {
            display: flex;
            justify-content: space-between;
            background: #f8fafc;
            border-radius: 16px;
            padding: 20px;
            margin: 25px 0;
            flex-wrap: wrap;
            gap: 16px;
          }
          .info-item {
            flex: 1;
            min-width: 150px;
          }
          .info-label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            color: #64748b;
            letter-spacing: 0.5px;
          }
          .info-value {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
            margin-top: 6px;
            word-break: break-word;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
            font-size: 13px;
          }
          th {
            background: #f1f5f9;
            padding: 12px 10px;
            text-align: left;
            font-weight: 700;
            color: #334155;
            border-bottom: 2px solid #e2e8f0;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
            color: #1e293b;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 30px;
            font-size: 11px;
            font-weight: 600;
            text-transform: capitalize;
          }
          .status-pending { background: #fef9c3; color: #854d0e; }
          .status-accepted { background: #dcfce7; color: #166534; }
          .status-rejected { background: #fee2e2; color: #991b1b; }
          .footer {
            text-align: center;
            margin-top: 35px;
            padding-top: 20px;
            border-top: 1px dashed #cbd5e1;
            font-size: 11px;
            color: #94a3b8;
          }
          @media print {
            .company-logo { background: #3b82f6 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .status-pending, .status-accepted, .status-rejected { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            th { background: #f1f5f9 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .info-grid { background: #f8fafc !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        `}
      </style>

      {/* Auto-print hint (visible only on screen) */}
      <div className="no-print" style={{ textAlign: "center", marginBottom: 20, color: "#3b82f6" }}>
        ⏳ Preparing print preview... Print dialog will open automatically.
        <button
          onClick={() => window.print()}
          style={{ marginLeft: 12, padding: "6px 12px", cursor: "pointer" }}
        >
          Print now
        </button>
      </div>

      {/* Printable content */}
      <div className="company-header">
        <div className="company-logo">
          {/* You can use an <img> instead: <img src="/logo.png" alt="logo" style={{width:50}}/> */}
          📦
        </div>
        <div>
          <div className="company-name">{company.name}</div>
          <div className="company-address">{company.address}</div>
        </div>
      </div>

      <div className="title">
        <h2>Stock Transfer Journal</h2>
        <p>Verification Report</p>
      </div>

      <div className="info-grid">
        <div className="info-item">
          <div className="info-label">Voucher No.</div>
          <div className="info-value">{voucherNo || "—"}</div>
        </div>
        <div className="info-item">
          <div className="info-label">Created Date</div>
          <div className="info-value">{formatDate(createdDate)}</div>
        </div>
        <div className="info-item">
          <div className="info-label">Journal Status</div>
          <div className="info-value" style={{ textTransform: "capitalize" }}>
            {journalStatus?.toLowerCase() || "—"}
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Source Location</th>
            <th>Destination Location</th>
            <th>Transfer Qty</th>
            <th>Accepted Qty</th>
            <th>Rejected Qty</th>
            <th>Status</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {transferProducts.map((item) => {
            let statusClass = "status-pending";
            const status = (item.transferStatus || "").toLowerCase();
            if (status === "accepted" || status === "fully_accepted") statusClass = "status-accepted";
            else if (status === "rejected") statusClass = "status-rejected";

            return (
              <tr key={item.id}>
                <td>{item.product?.productId || item.product?.id || "—"}</td>
                <td>{item.product?.name || "—"}</td>
                <td>
                  {item.sourceLocation?.address
                    ? `${item.sourceLocation.address}${item.sourceLocation.city ? ", " + item.sourceLocation.city : ""}`
                    : "—"}
                </td>
                <td>
                  {item.destinationLocation?.address
                    ? `${item.destinationLocation.address}${item.destinationLocation.city ? ", " + item.destinationLocation.city : ""}`
                    : "—"}
                </td>
                <td>{item.transferQty ?? "—"}</td>
                <td>{item.acceptedQty ?? "—"}</td>
                <td>{item.rejectedQty ?? "—"}</td>
                <td>
                  <span className={`status-badge ${statusClass}`}>
                    {item.transferStatus?.replace("_", " ") || "—"}
                  </span>
                </td>
                <td>{item.remarks || "—"}</td>
              </tr>
            );
          })}
          {transferProducts.length === 0 && (
            <tr>
              <td colSpan="9" style={{ textAlign: "center", padding: 40 }}>
                No products found in this journal.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="footer">
        Generated on {new Date().toLocaleString()} • This is a system‑generated report
      </div>
    </div>
  );
};

export default PrintStockJournals;