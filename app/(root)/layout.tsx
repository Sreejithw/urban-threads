import Footer from "@/components/ui/common/footer";
import Header from "@/components/ui/common/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 wrapper">
        { children }
      </main>
      <Footer />
    </div>
  );
}
