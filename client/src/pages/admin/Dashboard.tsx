import { useProducts } from "@/hooks/use-products";
import { useOrders } from "@/hooks/use-orders";
import { Package, ClipboardList, CheckCircle2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { data: products } = useProducts();
  const { data: orders } = useOrders();

  const totalProducts = products?.filter(p => !p.isArchived).length || 0;
  const availableProducts = products?.filter(p => !p.isArchived && p.status === "available").length || 0;
  
  const pendingOrders = orders?.filter(o => o.status === "pending").length || 0;
  const todayRevenue = orders?.reduce((acc, o) => {
    if (o.status !== "delivered") return acc;
    const orderTotal = (o.items as any[]).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return acc + orderTotal;
  }, 0) || 0;

  const stats = [
    { title: "Active Products", value: totalProducts, subtitle: `${availableProducts} available`, icon: Package, color: "text-blue-500", bg: "bg-blue-100" },
    { title: "Pending Orders", value: pendingOrders, subtitle: "Needs attention", icon: ClipboardList, color: "text-amber-500", bg: "bg-amber-100" },
    { title: "Completed Today", value: orders?.filter(o => o.status === "delivered").length || 0, subtitle: "Orders delivered", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-100" },
    { title: "Revenue (Delivered)", value: `₹${todayRevenue}`, subtitle: "Today's earnings", icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-100" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="rounded-2xl border-none shadow-md overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-20 ${stat.bg}`}></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders && orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm text-muted-foreground">{order.deliveryArea}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    ₹{(order.items as any[]).reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
