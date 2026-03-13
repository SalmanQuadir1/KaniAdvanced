// VoucherPrintTemplate.jsx
import React, { forwardRef } from 'react';

const VoucherPrintTemplate = forwardRef(({ voucherData }, ref) => {
  console.log('VoucherPrintTemplate rendering with data:', voucherData);

  if (!voucherData || Object.keys(voucherData).length === 0) {
    return (
      <div ref={ref} style={{ padding: '20px', textAlign: 'center' }}>
        <h2>No voucher data available</h2>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getYesNo = (value) => {
    return value ? 'Yes' : 'No';
  };

  const formatLocation = (location) => {
    if (!location) return 'N/A';
    if (typeof location === 'object') return location.label || location.address || 'N/A';
    return location;
  };

  return (
    <div 
      ref={ref} 
      style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        padding: '10mm',
        backgroundColor: 'white',
        color: '#000',
        boxSizing: 'border-box'
      }}
    >
      {/* Company Header - Page 1 */}
      <div style={{
        textAlign: 'center',
        marginBottom: '15px',
        paddingBottom: '10px',
        borderBottom: '3px double #333'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          margin: '0 0 5px 0',
          color: '#1e3c72',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          VOUCHER
        </h1>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '10px',
          fontSize: '12px'
        }}>
          <div style={{ textAlign: 'left' }}>
            <strong>Type:</strong> {voucherData.typeOfVoucher || 'N/A'}
          </div>
          <div style={{ 
            background: '#f0f0f0', 
            padding: '5px 15px', 
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '16px',
            border: '1px solid #333'
          }}>
            #{voucherData.generatedVoucherNo || 'N/A'}
          </div>
          <div style={{ textAlign: 'right' }}>
            <strong>Date:</strong> {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Basic Information Card - Always on Page 1 */}
      <div style={{
        border: '2px solid #1e3c72',
        borderRadius: '6px',
        marginBottom: '15px',
        overflow: 'hidden',
        pageBreakInside: 'avoid'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          padding: '8px 12px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '14px',
          textTransform: 'uppercase'
        }}>
          📋 Basic Information
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          padding: '12px',
          background: '#f9f9f9'
        }}>
          <div style={fieldStyle}>
            <span style={labelStyle}>Voucher Name:</span>
            <span style={valueStyle}>{voucherData.name || 'N/A'}</span>
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Abbreviation:</span>
            <span style={valueStyle}>{voucherData.abbreviation || 'N/A'}</span>
          </div>
          {/* <div style={fieldStyle}>
            <span style={labelStyle}>Status:</span>
            <span style={{
              ...valueStyle,
              color: voucherData.actVoucher === 'true' ? '#28a745' : '#dc3545',
              fontWeight: 'bold'
            }}>
              {voucherData.actVoucher === 'true' ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Parent ID:</span>
            <span style={valueStyle}>{voucherData.parentVoucherId || 'N/A'}</span>
          </div> */}
        </div>
      </div>

      {/* Voucher Settings Card - Page 1 */}
      <div style={{
        border: '2px solid #2a5298',
        borderRadius: '6px',
        marginBottom: '15px',
        overflow: 'hidden',
        pageBreakInside: 'avoid'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
          padding: '8px 12px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '14px',
          textTransform: 'uppercase'
        }}>
          ⚙️ Voucher Settings
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          padding: '12px',
          background: '#f9f9f9'
        }}>
          <div style={fieldStyle}>
            <span style={labelStyle}>Numbering Method:</span>
            <span style={valueStyle}>{voucherData.methodVouchNumbering || 'N/A'}</span>
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Numbering Behavior:</span>
            <span style={valueStyle}>{voucherData.numbInsertDelete || 'N/A'}</span>
          </div>
          {/* <div style={fieldStyle}>
            <span style={labelStyle}>Additional Numbering:</span>
            <span style={valueStyle}>{getYesNo(voucherData.setAdditionalNumb)}</span>
          </div>
         
          <div style={fieldStyle}>
            <span style={labelStyle}>Use Effective Date:</span>
            <span style={valueStyle}>{getYesNo(voucherData.dateForVchs)}</span>
          </div> */}
          {voucherData.dateForVchs && (
            <div style={fieldStyle}>
              <span style={labelStyle}>Effective Date:</span>
              <span style={valueStyle}>{formatDate(voucherData.effectiveDate)}</span>
            </div>
          )}
     
        </div>
      </div>

      {/* Force page break before Printing Details if content might overflow */}
      <div style={{ pageBreakBefore: 'always' }}></div>

      {/* Printing Details Card - Page 2 */}
      <div style={{
        border: '2px solid #4a6fa5',
        borderRadius: '6px',
        marginBottom: '15px',
        overflow: 'hidden',
        pageBreakInside: 'avoid'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #4a6fa5 0%, #6b8cae 100%)',
          padding: '8px 12px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '14px',
          textTransform: 'uppercase'
        }}>
          🖨️ Printing Details
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          padding: '12px',
          background: '#f9f9f9'
        }}>
          <div style={fieldStyle}>
            <span style={labelStyle}>Print After Saving:</span>
            <span style={valueStyle}>{getYesNo(voucherData.printVch)}</span>
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>POS Invoicing:</span>
            <span style={valueStyle}>{getYesNo(voucherData.posInvoicing)}</span>
          </div>
  
        </div>
      </div>

      {/* Location and Bank Details - Page 2 */}
      <div style={{
        border: '2px solid #6b8cae',
        borderRadius: '6px',
        marginBottom: '15px',
        overflow: 'hidden',
        pageBreakInside: 'avoid'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #6b8cae 0%, #8aadc4 100%)',
          padding: '8px 12px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '14px',
          textTransform: 'uppercase'
        }}>
          🏢 Location & Bank Details
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          padding: '12px',
          background: '#f9f9f9'
        }}>
          <div style={fieldStyle}>
            <span style={labelStyle}>Default Godown/Location:</span>
            <span style={valueStyle}>{formatLocation(voucherData.defaultGodownName)}</span>
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Default Print Title:</span>
            <span style={valueStyle}>{voucherData.defTitlePrint || 'N/A'}</span>
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Default Bank:</span>
            <span style={valueStyle}>{voucherData.defBank || 'N/A'}</span>
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Default Jurisdiction:</span>
            <span style={valueStyle}>{voucherData.defJurisdiction || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* POS Messages - Page 2 (if exists) */}
      {voucherData.posInvoicing && (
        <div style={{
          border: '2px solid #8aadc4',
          borderRadius: '6px',
          marginBottom: '15px',
          overflow: 'hidden',
          pageBreakInside: 'avoid'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #8aadc4 0%, #a9c9e0 100%)',
            padding: '8px 12px',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
            textTransform: 'uppercase'
          }}>
            💬 POS Messages
          </div>
          <div style={{
            padding: '12px',
            background: '#f9f9f9'
          }}>
            <div style={{ ...fieldStyle, marginBottom: '8px' }}>
              <span style={labelStyle}>Line 1:</span>
              <span style={valueStyle}>{voucherData.msgPrintOne || 'N/A'}</span>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>Line 2:</span>
              <span style={valueStyle}>{voucherData.msgPrintTwo || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Force page break before Statutory Details */}
      <div style={{ pageBreakBefore: 'always' }}></div>

      {/* Statutory Details Card - Page 3 */}
      <div style={{
        border: '2px solid #8b5a2b',
        borderRadius: '6px',
        marginBottom: '15px',
        overflow: 'hidden',
        pageBreakInside: 'avoid'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #8b5a2b 0%, #b8860b 100%)',
          padding: '8px 12px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '14px',
          textTransform: 'uppercase'
        }}>
          📊 Statutory Details
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          padding: '12px',
          background: '#f9f9f9'
        }}>
          <div style={fieldStyle}>
            <span style={labelStyle}>Default GST Registration:</span>
            <span style={valueStyle}>
              {voucherData.defGstRegistName || 'N/A'}
            </span>
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Common GST Numbering:</span>
            <span style={valueStyle}>{getYesNo(voucherData.vchNumbGstRegistration)}</span>
          </div>
     
        </div>
      </div>

      {/* GST Numbering Details - Page 3 (if available) */}
      {voucherData.gstDetails && voucherData.gstDetails.length > 0 && (
        <div style={{
          border: '2px solid #28a745',
          borderRadius: '6px',
          marginBottom: '15px',
          overflow: 'hidden',
          pageBreakInside: 'avoid'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            padding: '8px 12px',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
            textTransform: 'uppercase'
          }}>
            🔢 GST Numbering Details
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            padding: '12px',
            background: '#f9f9f9'
          }}>
            <div style={fieldStyle}>
              <span style={labelStyle}>Starting Number:</span>
              <span style={valueStyle}>{voucherData.gstDetails[0]?.startingNum || 'N/A'}</span>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>Width of Number Part:</span>
              <span style={valueStyle}>{voucherData.gstDetails[0]?.widthNumPart || 'N/A'}</span>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>Prefill with Zero:</span>
              <span style={valueStyle}>{voucherData.gstDetails[0]?.prefillZero ? 'Yes' : 'No'}</span>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>Prefix:</span>
              <span style={valueStyle}>{voucherData.gstDetails[0]?.prefixParticular || 'N/A'}</span>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>Suffix:</span>
              <span style={valueStyle}>{voucherData.gstDetails[0]?.suffixParticular || 'N/A'}</span>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>Restart Periodicity:</span>
              <span style={valueStyle}>{voucherData.gstDetails[0]?.restartPeriodicity || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Signature and Footer - Page 3 */}
      <div style={{
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderTop: '2px solid #333',
        paddingTop: '15px',
        pageBreakInside: 'avoid'
      }}>
        <div style={{ textAlign: 'center', width: '180px' }}>
          <div style={{ borderTop: '1px solid #333', marginTop: '25px', paddingTop: '5px', fontSize: '12px' }}>
            Authorized Signatory
          </div>
        </div>
        <div style={{ textAlign: 'center', width: '180px' }}>
          <div style={{ borderTop: '1px solid #333', marginTop: '25px', paddingTop: '5px', fontSize: '12px' }}>
            Receiver's Signature
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '10px', color: '#666' }}>
          <div>Generated: {new Date().toLocaleString()}</div>
          <div style={{ marginTop: '3px' }}>System Generated</div>
        </div>
      </div>
    </div>
  );
});

// Style objects for consistency
const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  borderBottom: '1px dotted #ccc',
  paddingBottom: '4px'
};

const labelStyle = {
  fontSize: '10px',
  color: '#666',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '2px'
};

const valueStyle = {
  fontSize: '12px',
  fontWeight: '500',
  color: '#333'
};

VoucherPrintTemplate.displayName = 'VoucherPrintTemplate';
export default VoucherPrintTemplate;