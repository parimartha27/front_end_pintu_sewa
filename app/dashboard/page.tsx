"use client"; // Pastikan ini ada di baris pertama
import DashboardBody from "@/components/layout/dashboard/Body";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import useAuth from "@/hooks/auth/useAuth";

const Dashboard = () => {
  const { token, userId, isLoading } = useAuth();

  // Tampilkan loading spinner jika masih loading
  if (isLoading) {
    return <div className="text-center p-8">Memuat...</div>;
  }

  return (
    <>
      <Navbar token={token} />
      <DashboardBody userIds={userId} />
      <Footer />
    </>
  );
};

export default Dashboard;