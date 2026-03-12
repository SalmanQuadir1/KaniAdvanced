import React from 'react';

const VoucherPrintTemplate = ({ voucherData, printRef }) => {
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

  return (
    <div ref={printRef} className="p-8 bg-white" style={{ width: '210mm', margin: '0 auto' }}>
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
        <h1 className="text-3xl font-bold uppercase">Voucher Details</h1>
        <p className="text-xl mt-2">Voucher Type: {voucherData.typeOfVoucher}</p>
        {voucherData.generatedVoucherNo && (
          <p className="text-lg font-semibold mt-1">Voucher No: {voucherData.generatedVoucherNo}</p>
        )}
      </div>

      {/* Basic Information Box */}
      <div className="mb-6 border-2 border-gray-800 rounded-lg overflow-hidden">
        <div className="bg-gray-200 px-4 py-2 border-b-2 border-gray-800">
          <h2 className="font-bold text-lg">Basic Information</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="border-r border-gray-300 pr-4">
            <p className="font-semibold text-gray-700">Voucher Name:</p>
            <p className="text-lg">{voucherData.name || 'N/A'}</p>
          </div>
          <div className="pl-4">
            <p className="font-semibold text-gray-700">Abbreviation:</p>
            <p className="text-lg">{voucherData.abbreviation || 'N/A'}</p>
          </div>
          <div className="border-r border-gray-300 pr-4">
            <p className="font-semibold text-gray-700">Status:</p>
            <p className="text-lg">{voucherData.actVoucher === 'true' ? 'Active' : 'Inactive'}</p>
          </div>
          <div className="pl-4">
            <p className="font-semibold text-gray-700">Parent Voucher ID:</p>
            <p className="text-lg">{voucherData.parentVoucherId || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Voucher Settings Box */}
      <div className="mb-6 border-2 border-gray-800 rounded-lg overflow-hidden">
        <div className="bg-gray-200 px-4 py-2 border-b-2 border-gray-800">
          <h2 className="font-bold text-lg">Voucher Settings</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4">
          <div>
            <p className="font-semibold text-gray-700">Numbering Method:</p>
            <p>{voucherData.methodVouchNumbering || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Numbering Behavior:</p>
            <p>{voucherData.numbInsertDelete || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Additional Numbering:</p>
            <p>{getYesNo(voucherData.setAdditionalNumb)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Show Unused Numbers:</p>
            <p>{getYesNo(voucherData.unusedVchNos)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Use Effective Date:</p>
            <p>{getYesNo(voucherData.dateForVchs)}</p>
          </div>
          {voucherData.dateForVchs && (
            <div>
              <p className="font-semibold text-gray-700">Effective Date:</p>
              <p>{formatDate(voucherData.effectiveDate)}</p>
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-700">Zero Value Transactions:</p>
            <p>{getYesNo(voucherData.zeroTransactionAllowed)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Optional Voucher Type:</p>
            <p>{getYesNo(voucherData.optionalVchType)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Narration in Voucher:</p>
            <p>{getYesNo(voucherData.narrationVchs)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Ledger Narration:</p>
            <p>{getYesNo(voucherData.narratLedgerVch)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Default Accounting:</p>
            <p>{getYesNo(voucherData.defAccounting)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Additional Cost Tracking:</p>
            <p>{getYesNo(voucherData.costPurchase)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">WhatsApp Notification:</p>
            <p>{getYesNo(voucherData.whatsAppVch)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Inter-Company Transfer:</p>
            <p>{getYesNo(voucherData.inteCompTransfer)}</p>
          </div>
        </div>
      </div>

      {/* Printing Details Box */}
      <div className="mb-6 border-2 border-gray-800 rounded-lg overflow-hidden">
        <div className="bg-gray-200 px-4 py-2 border-b-2 border-gray-800">
          <h2 className="font-bold text-lg">Printing Details</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4">
          <div>
            <p className="font-semibold text-gray-700">Print After Saving:</p>
            <p>{getYesNo(voucherData.printVch)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">POS Invoicing:</p>
            <p>{getYesNo(voucherData.posInvoicing)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Set/Alter Declaration:</p>
            <p>{getYesNo(voucherData.setAlterDecl)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Print Formal Receipt:</p>
            <p>{getYesNo(voucherData.printFormal)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Default Godown:</p>
            <p>{voucherData.defaultGodown || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Default Print Title:</p>
            <p>{voucherData.defTitlePrint || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Default Bank:</p>
            <p>{voucherData.defBank || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Default Jurisdiction:</p>
            <p>{voucherData.defJurisdiction || 'N/A'}</p>
          </div>
          {voucherData.posInvoicing && (
            <>
              <div className="col-span-2">
                <p className="font-semibold text-gray-700">POS Message Line 1:</p>
                <p>{voucherData.msgPrintOne || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold text-gray-700">POS Message Line 2:</p>
                <p>{voucherData.msgPrintTwo || 'N/A'}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Statutory Details Box */}
      <div className="mb-6 border-2 border-gray-800 rounded-lg overflow-hidden">
        <div className="bg-gray-200 px-4 py-2 border-b-2 border-gray-800">
          <h2 className="font-bold text-lg">Statutory Details</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4">
          <div>
            <p className="font-semibold text-gray-700">Default GST Registration:</p>
            <p>{voucherData.defGstRegist?.id || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Common Numbering for GST:</p>
            <p>{getYesNo(voucherData.vchNumbGstRegistration)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">GST Rate Details:</p>
            <p>{voucherData.gstratedetails || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">GST Description:</p>
            <p>{voucherData.gstDescription || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">HSN/SAC Code:</p>
            <p>{voucherData.hsn_Sac || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* GST Details Box (if available) */}
      {voucherData.gstDetails && voucherData.gstDetails.length > 0 && (
        <div className="mb-6 border-2 border-gray-800 rounded-lg overflow-hidden">
          <div className="bg-gray-200 px-4 py-2 border-b-2 border-gray-800">
            <h2 className="font-bold text-lg">GST Numbering Details</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4">
            <div>
              <p className="font-semibold text-gray-700">Starting Number:</p>
              <p>{voucherData.gstDetails[0]?.startingNum || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Width of Number Part:</p>
              <p>{voucherData.gstDetails[0]?.widthNumPart || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Prefill with Zero:</p>
              <p>{voucherData.gstDetails[0]?.prefillZero ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Prefix:</p>
              <p>{voucherData.gstDetails[0]?.prefixParticular || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Suffix:</p>
              <p>{voucherData.gstDetails[0]?.suffixParticular || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Restart Periodicity:</p>
              <p>{voucherData.gstDetails[0]?.restartPeriodicity || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-8 pt-4 border-t-2 border-gray-300 text-sm text-gray-600">
        <p>Generated on: {new Date().toLocaleString()}</p>
        <p className="mt-1">This is a system-generated voucher document</p>
      </div>
    </div>
  );
};

export default VoucherPrintTemplate;