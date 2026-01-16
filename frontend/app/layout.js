import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'E-Shop',
  description: 'Best E-commerce platform',
};

import { CartProvider } from '../context/CartContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <CartProvider>
          <Navbar />
          <main className="flex-grow pb-10">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
