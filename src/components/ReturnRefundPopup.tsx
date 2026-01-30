import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ReturnRefundPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReturnRefundPopup: React.FC<ReturnRefundPopupProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Add slight delay for animation
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-2xl bg-white rounded-lg shadow-2xl transform transition-transform duration-300 ${
        isVisible ? 'scale-100' : 'scale-95'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-black">
            Return & Refund Policy
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4 text-sm text-black">
            <p>
              At OTIC Geosystems, we are committed to providing high-quality products and excellent customer service. 
              If you are not completely satisfied with your purchase, you may return or request a refund under the following conditions.
            </p>

            <div>
              <p className="font-semibold mb-2">Return Timeframes:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Equipment can be returned within thirty days of purchase</li>
                <li>Accessories can be returned within ten days of purchase</li>
                <li>All items must be returned in their original condition, unused, and with all original packaging, manuals, and accessories</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2">Non-Returnable Items:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Products that have been used, damaged, or altered</li>
                <li>Items purchased on clearance or as final sale</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2">Refund Process:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Once your return is received and inspected, we will notify you of the approval or rejection of your refund</li>
                <li>Approved refunds will be processed to the original method of payment within seven to ten business days</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2">Exchanges:</p>
              <p>If you received a defective or damaged product, you may request an exchange instead of a refund. Exchanges are subject to product availability.</p>
            </div>

            <div>
              <p className="font-semibold mb-2">Shipping Costs:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Shipping costs for returning items are the responsibility of the customer</li>
                <li>Free return shipping only if the product is defective or the return is due to our error</li>
                <li>Refunds do not include original shipping fees</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2">How to Initiate a Return:</p>
              <p>To initiate a return or refund, please contact our customer support at <a href="mailto:support@oticgs.com" className="text-blue-600 hover:underline">support@oticgs.com</a> with your order details. Our team will guide you through the return process.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded transition-colors"
          >
            Close Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnRefundPopup;