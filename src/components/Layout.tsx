import { ReactNode } from 'react';
import Navigation from './Navigation';
import { Toaster } from "@/components/ui/toaster"
import Footer from './Footer';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Navigation />
      <main>{children}</main>

      <Toaster />
    </div>
  );
};

export default Layout;
