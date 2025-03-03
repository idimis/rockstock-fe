"use client";

import Link from "next/link";

const AdminSidebar = () => {
  return (
    <aside className="bg-white shadow-md w-64 p-4 hidden lg:block">
      <h2 className="text-lg font-semibold mb-4">Dashboard Admin</h2>
      <ul className="space-y-2">
        <li className="p-2 rounded-lg cursor-pointer hover:bg-gray-200 active:bg-gray-300 transition">
          <Link href="/dashboard/admin">📊 Dashboard Overview</Link>
        </li>
        <SidebarSection 
          title="📦 Order Management" 
          links={[
            { name: "All Orders", path: "/dashboard/admin/orders" },
            { name: "Pending Payments", path: "/dashboard/admin/orders/pending-payment" },
            { name: "Awaiting Payment Confirmation", path: "/dashboard/admin/orders/awaiting-confirmation" },
            { name: "Processing Orders", path: "/dashboard/admin/orders/processing" },
            { name: "Shipped Orders", path: "/dashboard/admin/orders/shipped" },
            { name: "Confirmed Orders", path: "/dashboard/admin/orders/confirmed" },
            { name: "Cancelled Orders", path: "/dashboard/admin/orders/cancelled" }
          ]}
        />
        <SidebarSection 
          title="🏢 Warehouse Management" 
          links={[
            { name: "Manage Warehouse", path: "/dashboard/admin/warehouse" },
            { name: "Stock Transfer Requests", path: "/dashboard/admin/warehouse/transfers" }
          ]}
        />
        <SidebarSection 
          title="📦 Stock & Inventory" 
          links={[
            { name: "Manage Stock", path: "/dashboard/admin/stock" }
          ]}
        />
        <SidebarSection 
          title="🛒 Product Management" 
          links={[
            { name: "Manage Products", path: "/dashboard/admin/products" }
          ]}
        />
        <SidebarSection 
          title="👥 Admin Management" 
          links={[
            { name: "Settings", path: "/dashboard/admin/admin-management" },
            { name: "Assign Admin", path: "/dashboard/admin/admin-management/assign-admin" },
           
          ]}
        />
        {/* <SidebarSection 
          title="🚛 Shipping & Logistics" 
          links={[
            { name: "Shipping Costs", path: "/dashboard/admin/shipping" }
          ]}
        /> */}
        <SidebarSection 
          title="📈 Reports & Analytics" 
          links={[
            { name: "Sales Report", path: "/dashboard/admin/reports" }
          ]}
        />
        <SidebarSection 
          title="⚙️ Settings" 
          links={[
            { name: "Account Settings", path: "/dashboard/admin/settings" }
          ]}
        />
        <li className="p-2 rounded-lg cursor-pointer hover:bg-gray-200 active:bg-gray-300 transition">
          <Link href="/">🏠 Back to Homepage</Link>
        </li>
        <li className="p-2 rounded-lg cursor-pointer text-red-500 hover:bg-red-100 active:bg-red-200 transition">
          <Link href="/logout">🚪 Logout</Link>
        </li>
      </ul>
    </aside>
  );
};

interface SidebarSectionProps {
  title: string;
  links: { name: string; path: string }[];
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, links }) => (
  <div>
    <h3 className="text-sm font-semibold mt-4 mb-2">{title}</h3>
    <ul className="space-y-1">
      {links.map((link, index) => (
        <li key={index} className="p-2 rounded-lg cursor-pointer hover:bg-gray-200 active:bg-gray-300 transition">
          <Link href={link.path}>{link.name}</Link>
        </li>
      ))}
    </ul>
  </div>
);

export default AdminSidebar;
