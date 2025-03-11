import Footer from "@/components/ui/common/footer";
import Header from "@/components/ui/common/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="min-h-screen bg-black text-white">
        { children }
      </main>
      <Footer />
    </div>
  );
}
