import React from 'react';
import { Github, Twitter, GlobeLock } from 'lucide-react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 w-full flex flex-col md:flex-row justify-center items-center p-4 bg-background text-foreground">
      <div className="w-full max-w-xl flex flex-col md:flex-row justify-around items-center space-y-4 md:space-y-0 md:space-x-4">
        <Link href="https://github.com/SecurityQQ/zuvillage-assessments" className="flex items-center text-center cursor-pointer transform hover:scale-110 transition-transform duration-300">
          <Github className="w-6 h-6" />
          <span className="ml-2 px-2 py-1 text-sm bg-green-500 text-white rounded-full">Open Source</span>
        </Link>
        <Link href="https://x.com/vargastartup" className="flex items-center text-center cursor-pointer transform hover:scale-110 transition-transform duration-300">
          <Twitter className="w-6 h-6" />
          <span className="ml-2 px-2 py-1 text-sm bg-green-500 text-white rounded-full">Follow Alex</span>
        </Link>
        <Link href="https://zuvillage-georgia.framer.website" className="flex items-center text-center cursor-pointer transform hover:scale-110 transition-transform duration-300">
          <GlobeLock className="w-6 h-6" />
          <span className="ml-2 px-2 py-1 text-sm bg-green-500 text-white rounded-full">Made during a ZuVillage Hack Day</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
