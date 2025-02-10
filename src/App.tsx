import { useState,useEffect} from 'react';
import { Layout } from './components/Layout';
import { Profile } from './components/Profile';
import { Registration } from './components/Registration';
import { ProductList } from './components/ProductList';
import { Cart } from './components/Cart';
import { OrderConfirmation } from './components/OrderConfirmation';
import { Product, CartItem, User } from './types';
import {getDocs,collection} from 'firebase/firestore'
import {db} from './firebase'


function App() {
  const [user, setUser] = useState<User | null>(null);
  const [category, setCategory] = useState<'vegetables' | 'groceries' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [confirmedItems, setConfirmedItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      console.log(user)
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      setProducts(productsList);
    };
    fetchProducts();
  }, []);
  
    const filteredProducts = products.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleUpdateCartQuantity = (productId: string, change: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleCheckout = () => {
    setConfirmedItems([...cartItems]);
    setShowCart(false);
    setShowOrderConfirmation(true);
  };

  const handleContinueShopping = () => {
    setShowOrderConfirmation(false);
    setCartItems([]);
  };

  if (!user) {
    return <Registration onComplete={setUser} />;
  }

  return (
    <Layout
      cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      onCartClick={() => setShowCart(true)}
      onProfileClick={() => setShowProfile(!setShowProfile)}
    >
      {showProfile ? (
        <Profile />
      ):(
      <div className="space-y-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setCategory('all')}
            className={`px-4 py-2 rounded-lg ${
              category === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setCategory('vegetables')}
            className={`px-4 py-2 rounded-lg ${
              category === 'vegetables'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Vegetables
          </button>
          <button
            onClick={() => setCategory('groceries')}
            className={`px-4 py-2 rounded-lg ${
              category === 'groceries'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Groceries
          </button>
        </div>

        <ProductList
           products={filteredProducts}
          category={category}
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onSearch={setSearchQuery}
        />

        {showCart && (
          <Cart
            items={cartItems}
            onClose={() => setShowCart(false)}
            onUpdateQuantity={handleUpdateCartQuantity}
            onCheckout={handleCheckout}
          />
        )}

        {showProfile && (
          <Profile/>
        )}

        {showOrderConfirmation && user && (
          <OrderConfirmation
            items={confirmedItems}
            user={user}
            onClose={handleContinueShopping}
          />
        )}
      </div>
      )}
    </Layout>
  );
}

export default App;