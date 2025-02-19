import { Search, Plus, Minus } from 'lucide-react';
import { Product, CartItem } from '../types';

interface ProductListProps {
  products: Product[];
  category: 'vegetables' | 'groceries' | 'all';
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  onSearch: (query: string) => void;
}

export function ProductList({
  products,
  category,
  cartItems,
  onAddToCart,
  onRemoveFromCart,
  onSearch,
}: ProductListProps) {

  const sortedProducts = [...products].sort((a, b) => (b.pin === 'Yes' ? 1 : 0) - (a.pin === 'Yes' ? 1 : 0));

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((product) => {
          const cartItem = cartItems.find((item) => item.id === product.id);
          //gpt
          const discountPrice = product.price - (product.price * (product.discount / 100));

          
          return (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                {product.min>1 && (
                <span className="text-red-500 text-sm font-medium">Atleast {product.min?product.min:1} {product.unit}</span>)}
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-gray-500 line-through">₹{product.price}</span>
                  <span className="text-emerald-600 font-semibold">₹{discountPrice.toFixed(2)}/{product.unit}</span>
                  <span className="text-red-500 text-sm font-medium">{product.discount}% off</span>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  {cartItem ? (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => onRemoveFromCart(product.id)}
                        className="p-1 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-medium">{cartItem.quantity}</span>
                      <button
                        onClick={() => onAddToCart(product)}
                        className="p-1 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAddToCart(product)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

