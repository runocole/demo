// src/pages/Sales/components/SalesTable.tsx
import { Edit, Eye } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import type { Sale, Tool } from "../types";
import { getSerialValue, isSerialNumbersObject } from "../utils/serialHelpers";

interface SalesTableProps {
  sales: Sale[];
  tools: Tool[];
  loading: boolean;
  onEditStatus: (sale: Sale) => void;
  onViewSerials: (tool: Tool) => void;
}

const SalesTable = ({ sales, tools, loading, onEditStatus, onViewSerials }: SalesTableProps) => {
  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-gray-400 text-center py-4">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-slate-700 bg-slate-800">
                  {[
                    "Client",
                    "Phone",
                    "State", 
                    "Items",
                    "Serial Numbers",
                    "Total Cost",
                    "Date Sold",
                    "Sales Invoice",
                    "Import Invoice",
                    "Payment Plan",
                    "Initial Deposit",
                    "Payment Months", 
                    "Expiry",
                    "Status",
                    "Actions",
                  ].map((col) => (
                    <th key={col} className="p-3 text-white font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="text-center p-4 text-gray-400">
                      No records yet. Add a sale to begin.
                    </td>
                  </tr>
                ) : (
                  sales.map((sale) => (
                    <tr 
                      key={sale.id} 
                      className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors text-gray-300"
                    >
                      <td className="p-3 text-white">{sale.name}</td>
                      <td className="p-3">{sale.phone}</td>
                      <td className="p-3">{sale.state}</td>
                      <td className="p-3">
                        <div className="max-w-xs">
                          {sale.items?.map((item, index) => (
                            <div key={index} className="text-xs mb-1 text-gray-300">
                              • {item.equipment}
                            </div>
                          )) || "No items"}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="max-w-xs">
                          {sale.items?.map((item, index) => {
                            if (item.serial_set && item.serial_set.length > 0) {
                              const isBaseRoverCombo = item.category === "Receiver" && 
                                                      (item.equipment.toLowerCase().includes("base and rover") || 
                                                        item.serial_set.length > 1);
                              
                              return (
                                <div key={index} className="text-xs mb-2">
                                  <div className="text-blue-300 font-medium">{item.equipment}:</div>
                                  <div className="ml-2 space-y-1">
                                    {item.serial_set.map((serial, serialIndex) => (
                                      <div key={serialIndex} className="text-gray-300">
                                        <span className="text-blue-400">
                                          {isBaseRoverCombo ? `Receiver ${serialIndex + 1}:` : 'Receiver:'}
                                        </span> {serial}
                                      </div>
                                    ))}
                                    
                                    {item.datalogger_serial && (
                                      <div className="text-gray-300">
                                        <span className="text-green-400">Data Logger:</span> {item.datalogger_serial}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                            
                            const soldTool = tools.find(t => t.id === item.tool_id);
                            if (soldTool && soldTool.serials && isSerialNumbersObject(soldTool.serials)) {
                              const toolDescription = soldTool.description || soldTool.box_type || "";
                              const isBaseAndRover = toolDescription.toLowerCase().includes("base and rover");
                              
                              return (
                                <div key={index} className="text-xs mb-2">
                                  <div className="text-blue-300 font-medium">{item.equipment}:</div>
                                  <div className="ml-2 space-y-1">
                                    {isBaseAndRover && (
                                      <>
                                        {getSerialValue(soldTool.serials, 'receiver1') && (
                                          <div className="text-gray-300">
                                            <span className="text-blue-400">Receiver 1:</span> {getSerialValue(soldTool.serials, 'receiver1')}
                                          </div>
                                        )}
                                        {getSerialValue(soldTool.serials, 'receiver2') && (
                                          <div className="text-gray-300">
                                            <span className="text-blue-400">Receiver 2:</span> {getSerialValue(soldTool.serials, 'receiver2')}
                                          </div>
                                        )}
                                      </>
                                    )}
                                    
                                    {(toolDescription.toLowerCase().includes("base") || 
                                      toolDescription.toLowerCase().includes("rover")) && 
                                      !isBaseAndRover && (
                                      <>
                                        {getSerialValue(soldTool.serials, 'receiver') && (
                                          <div className="text-gray-300">
                                            <span className="text-blue-400">Receiver:</span> {getSerialValue(soldTool.serials, 'receiver')}
                                          </div>
                                        )}
                                        {getSerialValue(soldTool.serials, 'data_logger') && (
                                          <div className="text-gray-300">
                                            <span className="text-green-400">Data Logger:</span> {getSerialValue(soldTool.serials, 'data_logger')}
                                          </div>
                                        )}
                                      </>
                                    )}
                                    
                                    {!toolDescription.toLowerCase().includes("base") && 
                                     !toolDescription.toLowerCase().includes("rover") && (
                                      <>
                                        {getSerialValue(soldTool.serials, 'receiver') && (
                                          <div className="text-gray-300">
                                            <span className="text-blue-400">Receiver:</span> {getSerialValue(soldTool.serials, 'receiver')}
                                          </div>
                                        )}
                                        {getSerialValue(soldTool.serials, 'data_logger') && (
                                          <div className="text-gray-300">
                                            <span className="text-green-400">Data Logger:</span> {getSerialValue(soldTool.serials, 'data_logger')}
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                            
                            return (
                              <div key={index} className="text-xs mb-2">
                                <div className="text-blue-300 font-medium">{item.equipment}:</div>
                                <div className="ml-2 text-gray-500 italic">
                                  No serials recorded
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-white">₦{parseFloat(sale.total_cost).toLocaleString()}</td>
                      <td className="p-3">
                        {sale.date_sold ? sale.date_sold.split('T')[0] : "-"}
                      </td>
                      <td className="p-3 text-green-300">{sale.invoice_number || "-"}</td>
                      <td className="p-3 text-yellow-300">{sale.import_invoice || "-"}</td>
                      <td className="p-3">{sale.payment_plan || "-"}</td>
                      <td className="p-3">
                        {sale.initial_deposit ? `₦${parseFloat(sale.initial_deposit).toLocaleString()}` : "-"}
                      </td>
                      <td className="p-3">{sale.payment_months || "-"}</td>
                      <td className="p-3">{sale.expiry_date || "-"}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            sale.payment_status === "completed"
                              ? "bg-green-900/50 text-green-300 border border-green-700"
                              : sale.payment_status === "installment"
                              ? "bg-blue-900/50 text-blue-300 border border-blue-700"
                              : sale.payment_status === "failed"
                              ? "bg-red-900/50 text-red-300 border border-red-700"
                              : "bg-gray-900/50 text-gray-300 border border-gray-700"
                          }`}
                        >
                          {sale.payment_status || "pending"}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEditStatus(sale)}
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                            title="Edit payment status"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (sale.items.length > 0) {
                                const tool = tools.find(t => t.id === sale.items[0].tool_id);
                                if (tool) {
                                  onViewSerials(tool);
                                }
                              }
                            }}
                            className="text-green-400 hover:text-green-300 hover:bg-green-900/30"
                            title="View serial numbers"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { SalesTable };