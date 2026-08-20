import React from 'react';
import { X, Download, ExternalLink, FileText } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptSrc?: string;
  receiptName?: string;
  txId?: string | number;
  claimantName?: string;
  paymentMethod?: string;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  receiptSrc,
  receiptName = 'payment_receipt.jpg',
  txId,
  claimantName,
  paymentMethod,
}) => {
  if (!isOpen) return null;

  const isImage = receiptSrc && (receiptSrc.startsWith('data:image') || receiptSrc.match(/\.(jpeg|jpg|gif|png|webp)/i));

  const handleDownload = () => {
    if (!receiptSrc) return;
    const a = document.createElement('a');
    a.href = receiptSrc;
    a.download = receiptName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      id="receipt-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        id="receipt-modal-content"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Receipt Viewer {txId && <span className="text-xs text-blue-400 font-mono">({txId})</span>}
            </h3>
            {claimantName && (
              <p className="text-xs text-slate-400">
                Claimant: <span className="text-slate-200 font-semibold">{claimantName}</span> • Method: <span className="text-blue-400 font-semibold">{paymentMethod}</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {receiptSrc && (
              <button
                id="btn-download-receipt-modal"
                onClick={handleDownload}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Download Receipt"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            <button
              id="btn-close-receipt-modal"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center bg-slate-950/40">
          {receiptSrc ? (
            isImage ? (
              <div className="relative max-w-full rounded-2xl overflow-hidden border border-slate-800 bg-black/40 shadow-inner">
                <img
                  src={receiptSrc}
                  alt="Payment Receipt"
                  className="max-h-[60vh] max-w-full object-contain mx-auto"
                />
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 max-w-md">
                <FileText className="w-16 h-16 text-blue-400 mx-auto mb-3" />
                <p className="text-sm font-bold text-white mb-1">{receiptName}</p>
                <p className="text-xs text-slate-400 mb-4">Document / File Receipt Attachment</p>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
                >
                  <Download className="w-3.5 h-3.5" /> Download / Open Attachment
                </button>
              </div>
            )
          ) : (
            <div className="text-center py-12 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No receipt image attached to this record.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span className="truncate max-w-[280px] font-mono">{receiptName}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
