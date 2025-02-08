import { Clock} from "lucide-react";

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

const OrderCard = ({ order }: { order: Order }) => {
  return (
    <div className="border rounded-lg p-4 mb-3 shadow-sm bg-white">
      <div className="flex justify-between items-start mb-2">
        {/* Order ID and Date */}
        <div>
          <h3 className="font-medium text-gray-800">
            Order #{order.id.slice(0, 6)}
          </h3>
          <p className="text-sm text-gray-500 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {order.createdAt?.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Order Status */}
        <span
          className={`px-2 py-1 rounded-full text-sm font-semibold ${
            order.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {order.status === "pending" ? "Pending" : "Completed"}
        </span>
      </div>

      {/* Order Items */}
      <div className="space-y-2">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-gray-700">{item.name}</span>
            <span className="text-gray-600">
              ₹{item.price} x {item.quantity} {item.unit}
            </span>
          </div>
        ))}
      </div>

      {/* Order Total */}
      <div className="mt-4 pt-2 border-t flex justify-between">
        <span className="font-medium text-gray-800">Total</span>
        <span className="font-semibold text-gray-900">₹{order.total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderCard;
