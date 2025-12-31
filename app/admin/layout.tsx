import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth-guard";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Security Check (Server-Side)
    // If not admin, this throws or redirects internally
    try {
        await requireAdmin();
    } catch (error) {
        console.error("Admin access required:", error);
        // Double safety net
        redirect("/");
    }

    return (
        <div className="flex min-h-screen flex-col space-y-6">
            <div className="border-b">
                <div className="flex h-16 items-center px-4 md:px-8">
                    <div className="font-bold text-xl mr-8">ADMIN STORE</div>
                    <AdminNav />
                </div>
            </div>
            <div className="flex-1 space-y-4 p-8 pt-6">
                {children}
            </div>
        </div>
    );
}