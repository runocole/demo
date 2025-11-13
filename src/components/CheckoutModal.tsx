import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "../hooks/use-toast";
import type { CustomerInfo, CartItem } from "../types/product";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (info: CustomerInfo) => void;
  cart?: CartItem[];
}

export const CheckoutModal = ({ open, onClose, onComplete, cart = [] }: CheckoutModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    state: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onComplete(formData);
    setFormData({
      name: "",
      email: "",
      phone: "",
      state: "",
    });
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-black text-white border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Checkout</DialogTitle>
        </DialogHeader>

        <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
          <h3 className="font-semibold mb-3 text-white">Order Summary</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-white">
                  {item.name} x {item.quantity}
                </span>
                <span className="font-medium text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between font-bold text-lg">
            <span className="text-white">Total:</span>
            <span className="text-primary">${calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-gray-900 text-white border-gray-700 placeholder-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-gray-900 text-white border-gray-700 placeholder-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">
                Phone <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-gray-900 text-white border-gray-700 placeholder-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-white">
                State
              </Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="bg-gray-900 text-white border-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-700 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-white hover:bg-primary/90"
            >
              Complete Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};