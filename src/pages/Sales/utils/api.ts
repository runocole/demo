// src/pages/Sales/utils/api.ts
import axios from "axios";
import type { Sale, Customer, Tool, GroupedTool, SoldSerialInfo } from "../types";

const API_URL = "http://localhost:8000/api";

const getAxiosConfig = () => {
  const token = localStorage.getItem("access");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const api = {
  // Sales
  getSales: () => 
    axios.get<Sale[]>(`${API_URL}/sales/`, getAxiosConfig()),
  
  createSale: (payload: any) => 
    axios.post<Sale>(`${API_URL}/sales/`, payload, getAxiosConfig()),
  
  updateSaleStatus: (saleId: number, status: string) => 
    axios.patch(`${API_URL}/sales/${saleId}/`, { payment_status: status }, getAxiosConfig()),

  // Customers
  getCustomers: () => 
    axios.get<Customer[]>(`${API_URL}/customers/`, getAxiosConfig()),

  // Tools
  getTools: () => 
    axios.get<Tool[]>(`${API_URL}/tools/`, getAxiosConfig()),
  
  getTool: (toolId: string) => 
    axios.get<Tool>(`${API_URL}/tools/${toolId}/`, getAxiosConfig()),
  
  getGroupedTools: (category: string, equipmentType?: string) => {
    const params = new URLSearchParams({ category });
    if (equipmentType) {
      params.append('equipment_type', equipmentType);
    }
    return axios.get<GroupedTool[]>(`${API_URL}/tools/grouped/?${params}`, getAxiosConfig());
  },
  
  assignRandomTool: (toolName: string, category: string, equipmentType?: string) => 
    axios.post(`${API_URL}/tools/assign-random/`, {
      tool_name: toolName,
      category,
      equipment_type: equipmentType
    }, getAxiosConfig()),
  
  getSoldSerials: (toolId: string) => 
    axios.get<SoldSerialInfo[]>(`${API_URL}/tools/${toolId}/sold-serials/`, getAxiosConfig()),

  // Email
  sendSaleEmail: (email: string, name: string, items: any[], total: number, invoiceNumber?: string) => 
    axios.post(`${API_URL}/send-sale-email/`, {
      to_email: email,
      subject: `Your Invoice ${invoiceNumber ? `- ${invoiceNumber}` : ''}`,
      message: `Hello ${name},\n\nThank you for your purchase! Here's your invoice:\n\n${items.map(item => 
        `• ${item.equipment} - ₦${parseFloat(item.cost).toLocaleString()}`
      ).join('\n')}\n\nTotal: ₦${total.toLocaleString()}\n\nPayment link: [Paystack Link Here]\n\nBest regards,\nOTIC Surveys`,
    }, getAxiosConfig()),
};

export { api };