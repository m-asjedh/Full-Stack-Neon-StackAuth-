import { UserButton } from "@stackframe/stack";
import { BarChart, Package, Plus, Settings } from "lucide-react";
import Link from "next/link";

export default function Sidebar({
  currenPath = "/dashboard",
}: {
  currenPath: string;
}) {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Add Product", href: "/add-product", icon: Plus },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white min-h-screen p-6 z-10">
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart className="w-6 h-6 text-purple-400" />
          <span className="text-lg font-bold">Next NeonStack</span>
        </div>
      </div>

      <nav className="space-y-1">
        <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
          Inventory
        </div>
        <div>
          {navigation.map((item, key) => {
            const Icon = item.icon;
            const isActive = currenPath === item.href;
            return (
              <Link
                href={item.href}
                key={key}
                className={`flex items-centers space-x-3 px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-purple-100 text-gray-900"
                    : "text-gray-300 hover:bg-gray-800 "
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
        <div className="flex items-center justify-between text-gray-300">
          <UserButton showUserInfo />
        </div>
      </div>
    </div>
  );
}
