import { useEffect, useState } from 'react';
import { MapPin, Phone, User,Package,LocateIcon,Trash,Edit,X,MapPinned} from 'lucide-react';
import {doc, getDoc, collection, getDocs, query, orderBy,updateDoc,deleteDoc } from 'firebase/firestore';
import {db} from '../firebase'

interface Order {
  id: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    unit: string;
  }>;
  total: number;
  status: string;
  createdAt: Date;
}

interface Prof{
  onClose: ()=>void;
}

export function Profile({onClose}: Prof) {
  const [userData, setUserData] = useState<{
    name: string;
    phone: string;
    manualLoc: string;
    location: { latitude: number; longitude: number };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedOrder,setCompletedOrder]=useState<Order[]>([]);
  const [pendingOrder,setPendingOrder]=useState<Order[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ name: '', phone: '', manualLoc: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('currentUserId');
        if (!userId) {
          setError('No user found. Please complete registration first.');
          return;
        }

        // Fetch user profile
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as any);
          setEditedData({
            name: userDoc.data().name,
            phone: userDoc.data().phone,
            manualLoc: userDoc.data().manualLoc,
          });
        }

        // Fetch user orders
        const ordersQuery = query(
          collection(db, 'users', userId, 'orders'),
          orderBy('createdAt', 'desc')
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const mappedOrders =ordersSnapshot.docs.map(doc => {
          const data = doc.data();
          return{
          id: doc.id,
          items: doc.data().items,
          total: doc.data().total,
          status: doc.data().status,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
          } as Order;
        });
        setPendingOrder(mappedOrders.filter((order) => order.status === "pending"));
        setCompletedOrder(mappedOrders.filter((order) => order.status === "completed"));
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
  
  const handleEdit = async () => {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) return;
    try {
      await updateDoc(doc(db, 'users', userId), editedData);
      setUserData((prevUserData) => ({
        ...prevUserData!, // Preserve existing values
        name: editedData.name,
        phone: editedData.phone,
        manualLoc: editedData.manualLoc,
        location: prevUserData?.location || { latitude: 0, longitude: 0 },
      }));
      setIsEditing(false);
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) return;
    try {
      await deleteDoc(doc(db, 'users', userId, 'orders', orderId));
      setPendingOrder(prev => prev.filter(order => order.id !== orderId));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="relative bg-white rounded-lg shadow-sm p-6">
            <button
                onClick={onClose}
                className="absolute -top-8 -right-2 text-red-500 p-2 hover:text-red-700 transition"
              >
              <div className='flex item-center space-x-1'>
                <span>Close Profile</span>
                <X size={24} />
              </div>
              </button>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Your Profile</h1>
          <button
              onClick={() => setIsEditing(true)}
              className="bg-emerald-200 hover:bg-gray-300 transition p-2 sm:p-2.5 rounded-lg"
            >
              <Edit className="w-4 h-4 sm:w-5 sm:h-5" size={12} />
            </button>
          </div> 
          
          {isEditing ? (
            <>
              <input type="text" value={editedData.name} onChange={e => setEditedData({ ...editedData, name: e.target.value })} className="border p-2 rounded w-full" />
              <input type="text" value={editedData.phone} onChange={e => setEditedData({ ...editedData, phone: e.target.value })} className="border p-2 rounded w-full mt-2" />
              <input type="text" value={editedData.manualLoc} onChange={e => setEditedData({ ...editedData, manualLoc: e.target.value })} className="border p-2 rounded w-full mt-2" />
              <button onClick={handleEdit} className="bg-emerald-600 text-white p-2 rounded mt-2 w-full sm:w-auto">Save</button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
              <User className="text-emerald-600" size={20} />
              <span className="text-gray-700">{userData?.name}</span>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="text-emerald-600" size={20} />
              <span className="text-gray-700">{userData?.phone}</span>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="text-emerald-600" size={20} />
              <span className="text-gray-700">{userData?.manualLoc}</span>
            </div>

            <div className="flex items-center space-x-3">
              <MapPinned className="text-emerald-600" size={20} />
              <a
                href={`https://maps.google.com/?q=${userData?.location.latitude},${userData?.location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline"
              >
                View on Map
              </a>
            </div>

              
            </div>
          )}
        </div>

        {/* Order History */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4">Order History</h2>
          <h2 className="text-xl font-semibold mb-4">Pending Order</h2>
             
          {pendingOrder.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingOrder.map(order => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">Order #{order.id.slice(0, 6)}</h3>
                      <p className="text-sm text-gray-500">
                      {order.createdAt?.toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        order.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {order.status}
                      </span>
                      <button onClick={() => handleDeleteOrder(order.id)} className="px-2 py-1 rounded-full text-sm text-red-600 hover:bg-red-100">
                        <Trash size={24} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.name}</span>
                        <span>₹{item.price} x {item.quantity} {item.unit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-2 border-t flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-semibold">₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/*Completed*/}
          <h2 className="text-xl font-semibold mb-4">   </h2>
          <h2 className="text-xl font-semibold mb-4">   </h2>
          <h2 className="text-xl font-semibold mb-4">Completed Order</h2>
          {completedOrder.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedOrder.map(order => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">Order #{order.id.slice(0, 6)}</h3>
                      <p className="text-sm text-gray-500">
                      {order.createdAt?.toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      order.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.name}</span>
                        <span>₹{item.price} x {item.quantity} {item.unit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-2 border-t flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-semibold">₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl text-center font-semibold mb-4">Contact Us</h2>
          
          <div className="space-y-4"> 
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Reach us if having any issue:</p>
              <p className="text-l mt-2 font-medium">support@sabkimandi.com</p>
              <p className="text-l mt-2">+91 8839231754</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

