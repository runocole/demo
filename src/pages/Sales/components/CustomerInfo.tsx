// src/pages/Sales/components/CustomerInfo.tsx
import type { Customer } from "../types";

interface CustomerInfoProps {
  customer: Customer | null;
}

export const CustomerInfo = ({ customer }: CustomerInfoProps) => {
  if (!customer) {
    return (
      <div className="bg-yellow-900/20 p-4 rounded-md mb-4 border border-yellow-700">
        <h3 className="font-semibold text-yellow-300 mb-2">No Customer Selected</h3>
        <p className="text-sm text-yellow-300">
          Please search and select a customer above.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-blue-900/20 p-4 rounded-md mb-4 border border-blue-700">
      <h3 className="font-semibold text-blue-300 mb-2">Customer Information</h3>
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
        <div>
          <span className="font-medium text-blue-300">Name:</span> {customer.name}
        </div>
        <div>
          <span className="font-medium text-blue-300">Email:</span> {customer.email}
        </div>
        <div>
          <span className="font-medium text-blue-300">Phone:</span> {customer.phone}
        </div>
        <div>
          <span className="font-medium text-blue-300">State:</span> {customer.state}
        </div>
      </div>
    </div>
  );
};