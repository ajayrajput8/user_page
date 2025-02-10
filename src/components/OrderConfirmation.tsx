import { Check, MapPin, Phone, User } from 'lucide-react';
import { CartItem, User as UserType } from '../types';

interface OrderConfirmationProps {
  items: CartItem[];
  user: UserType;
  onClose: () => void;
}

export function OrderConfirmation({ items, user, onClose }: OrderConfirmationProps) {
  const total = items.reduce((sum, item) => sum + (item.price-(item.price * (item.discount / 100)) )* item.quantity, 0);
  const orderNumber = Math.random().toString(36).substring(2, 10).toUpperCase();


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 my-40">
        <div className="text-center mb-6">
          <div className="mx-auto w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <Check className="text-emerald-600" size={16} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Order Placed!</h2>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center text-gray-600">
              <User size={16} className="mr-2" />
              <span>{user.name}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Phone size={16} className="mr-2" />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-2" />
              <span>Delivery to location near <a
                href={`https://maps.google.com/?q=${user?.location.latitude},${user?.location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline"
              >
                Your Location
              </a>
              </span>
            </div>
          </div>
         {/*max-h-96 overflow-y-auto border rounded-lg divide-y*/}
          <div className="max-h-48 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between p-4">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × ₹{item.price-(item.price * (item.discount / 100))}/{item.unit}
                  </p>
                </div>
                <span className="font-medium">₹{((item.price-(item.price * (item.discount / 100))) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between p-4 font-bold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}