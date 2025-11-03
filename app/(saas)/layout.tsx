import Navbar from "@/components/admin-panel/navbar";
import Footer from "@/components/landing/footer";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="mt-16">{children}</main>
      <Footer />
    </>
  );
}
