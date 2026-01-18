import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-black font-sans text-gray-200">
            <AdminSidebar />
            <div className="flex-1 ml-64 bg-black">
                <main className="p-8 md:p-12 max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
