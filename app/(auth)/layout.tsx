export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-center min-h-screen w-full bg-[url('/images/loginPage.jpg')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 w-full">
        { children }
      </div>
    </div>
  );
}
