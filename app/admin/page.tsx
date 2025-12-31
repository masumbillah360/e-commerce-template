import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/db"; // Use our optimized singleton
import { orders, products } from "@/db/schema";
import { sql } from "drizzle-orm";

export default async function AdminDashboardPage() {
    await requireAdmin();

    // Parallel data fetching for performance
    const [productCount] = await db.select({ count: sql<number>`count(*)` }).from(products);
    const [orderCount] = await db.select({ count: sql<number>`count(*)` }).from(orders);

    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Overview of your store.</p>

            <div className="grid gap-4 grid-cols-3 mt-8">
                <div className="p-6 border rounded-xl shadow-sm">
                    <h3 className="font-semibold text-sm">Total Revenue</h3>
                    <div className="text-2xl font-bold">$0.00</div>
                </div>
                <div className="p-6 border rounded-xl shadow-sm">
                    <h3 className="font-semibold text-sm">Products</h3>
                    <div className="text-2xl font-bold">{productCount?.count ?? 0}</div>
                </div>
                <div className="p-6 border rounded-xl shadow-sm">
                    <h3 className="font-semibold text-sm">Orders</h3>
                    <div className="text-2xl font-bold">{orderCount?.count ?? 0}</div>
                </div>
            </div>
        </div>
    );
}