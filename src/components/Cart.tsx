import { X, Plus, Minus, Truck } from 'lucide-react';
import {useEffect} from 'react'
import { useState } from 'react';
import { CartItem } from '../types';
import {collection, addDoc, serverTimestamp } from 'firebase/firestore';
import {db} from '../firebase';


interface CartProps {
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, change: number) => void;
  onCheckout: () => void;
}

  export function Cart({ items, onClose, onUpdateQuantity, onCheckout }: CartProps) {
    const total=items.reduce((sum, item) => sum + (item.price-(item.price * (item.discount / 100))) * item.quantity, 0);
    //
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
  
    useEffect(() => {
      const userId = localStorage.getItem('currentUserId');
      setCurrentUser(userId);
    }, []);

    useEffect(() => {
      const handleBackButton = (event: PopStateEvent) => {
        event.preventDefault();
        onClose(); // Close the cart and show the product list
      };
    
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', handleBackButton);
    
      return () => {
        window.removeEventListener('popstate', handleBackButton);
      };
    }, [onClose]);
  
    const handleCheckout = async () => {
    const itemsBelowMin = items.filter((item) => item.quantity < item.min);
    if (itemsBelowMin.length > 0) {
      const itemNames = itemsBelowMin.map((item) => item.name).join(', ');
      const itemMin =itemsBelowMin.map((item)=>item.min).join(', ');
      alert(`You can't purchase ${itemNames} less than ${itemMin} unit. Please increase to the minimum required quantity.`);
      return;
    }
      if (!currentUser) {
        alert('Please complete registration first');
        return;
      }
  
      setSubmitting(true);
      setError('');
      
      try {
        const ordersRef = await addDoc(collection(db, 'users', currentUser, 'orders'),{
          items: items.map(item => ({
            name: item.name,
            price: item.price - (item.price * (item.discount / 100)),
            quantity: item.quantity,
            unit: item.unit
          })),
            total,
            createdAt: serverTimestamp(),
            status: 'pending'
          });
          onCheckout();
        } catch (err) {
          console.error('Checkout error:', err);
          setError('Failed to complete checkout. Please try again.');
        } finally {
          setSubmitting(false);
        }
      };

  if (items.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-lg w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Cart</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <p className="text-center text-gray-500">Your cart is empty</p>
        </div>
      </div>
    );
  }

return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg max-w-lg w-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Cart</h2>
        
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <h2 className="text-sm font-semibold"><div className="flex items-center text-emerald-700">Free  <Truck size={20}/>  Delivery</div></h2>
      <div className="max-h-96 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center py-4 border-b">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="ml-4 flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-gray-500">₹{item.price-(item.price * (item.discount / 100))}/{item.unit}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onUpdateQuantity(item.id, -1)}
                className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, 1)}
                className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <button
          onClick={handleCheckout}
          disabled={submitting}
          className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          {submitting ? 'Processing Order...' : 'Proceed to Checkout'}
        </button>
        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}
      </div>
    </div>
  </div>
);
}