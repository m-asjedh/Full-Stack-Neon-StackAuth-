import { prisma } from "@/lib/prisma";
import Sidebar from "../components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { TrendingUp } from "lucide-react";
import ProductsChart from "../components/products-chart";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userId = user.id;

  const [totalProducts, lowStockProducts, allProducts, recentProducts] =
    await Promise.all([
      prisma.product.count({
        where: {
          userId,
        },
      }),
      prisma.product.count({
        where: {
          userId,
          lowStockAt: { not: null },
          quantity: { lte: 5 },
        },
      }),
      prisma.product.findMany({
        where: {
          userId,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.product.findMany({
        where: {
          userId,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const totalValue = allProducts.reduce(
    (sum, product) => sum + Number(product.price) * Number(product.quantity),
    0
  );

  const now = new Date();
  const weeklyProductsData = [];

  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekLabel = `${String(weekStart.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(weekStart.getDate()).padStart(2, "0")}`;
    const weekProducts = allProducts.filter((product) => {
      const productDate = new Date(product.createdAt);
      return productDate >= weekStart && productDate <= weekEnd;
    });

    weeklyProductsData.push({
      week: weekLabel,
      products: weekProducts.length,
    });
  }

  return (
    <div>
      <Sidebar currenPath="/dashboard" />
      <main className="ml-64 p-8">
        {/*Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Dashboard</h1>
              <p className="text-sm text-gray-500">
                Welcome back, Here is your overview of your inventory.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/*Key Metrics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Key Metrics
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {totalProducts}
                </div>
                <div className="text-sm text-gray-500">Total Products</div>
                <div className="flex items-center justify-center gap-2 mt-1 text-xs text-green-600">
                  <span>+{totalProducts}</span>
                  <TrendingUp className="w-3 h-3 text-green-600" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  ${Number(totalValue).toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">Total Value</div>
                <div className="flex items-center justify-center gap-2 mt-1 text-xs text-green-600">
                  <span>+ ${Number(totalValue).toFixed(2)}</span>
                  <TrendingUp className="w-3 h-3 text-green-600" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {lowStockProducts}
                </div>
                <div className="text-sm text-gray-500">Low Stock</div>
                <div className="flex items-center justify-center gap-2 mt-1 text-xs text-green-600">
                  <span>+{lowStockProducts}</span>
                  <TrendingUp className="w-3 h-3 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/*INvenotry overtime */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2>New Products Per Week</h2>
            </div>
            <div className="h-48">
              <ProductsChart data={weeklyProductsData} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/*Stock Levels */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 ">
                Stock Levels
              </h2>
            </div>
            <div className="space-y-4">
              {recentProducts.map((product, key) => {
                const stockLevel =
                  product.quantity === 0
                    ? 0
                    : product.quantity <= (product.lowStockAt || 5)
                    ? 1
                    : 2;
                const bgColors = [
                  "bg-red-500",
                  "bg-yellow-500",
                  "bg-green-500",
                ];
                const textColors = [
                  "text-red-500",
                  "text-yellow-500",
                  "text-green-500",
                ];
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${bgColors[stockLevel]}`}
                      />
                      <span className="text-sm font-medium">
                        {product.name}
                      </span>
                    </div>
                    <div
                      className={`text-sm font-medium ${textColors[stockLevel]}`}
                    >
                      {product.quantity} units
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
