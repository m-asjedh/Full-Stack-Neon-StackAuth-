import { prisma } from "@/lib/prisma";
import Sidebar from "../components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userId = user.id;

  const [totalProducts, lowStockProducts, allProducts] = await Promise.all([
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
  ]);

  const recentProducts = await prisma.product.findMany({
    where: {
      userId,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const totalValue = allProducts.reduce(
    (sum, product) => sum + Number(product.price) * Number(product.quantity),
    0
  );

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
                return (
                  <div key={key} className="">
                    <div className="">
                      <span>{product.name}</span>
                    </div>
                    <div className="">{product.quantity} units</div>
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
