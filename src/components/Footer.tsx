import React from 'react';
import { Github, Twitter, GlobeLock } from 'lucide-react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 w-full flex flex-col md:flex-row justify-center items-center p-4 bg-background text-foreground">
      <div className="w-full max-w-2xl flex flex-row md:flex-row justify-around items-center space-y-4 md:space-y-0 md:space-x-4">
        <Link href="https://github.com/SecurityQQ/zuvillage-assessments" className="flex items-center text-center cursor-pointer transform hover:scale-110 transition-transform duration-300">
          <Github className="w-6 h-6" />
          <span className="ml-2 px-2 py-1 text-sm bg-green-500 text-white rounded-full hidden md:inline">Open Source</span>
        </Link>
        <Link href="https://x.com/vargastartup" className="flex items-center text-center cursor-pointer transform hover:scale-110 transition-transform duration-300" style={{"marginTop": '0px'}}>
          <Twitter className="w-6 h-6" />
          <span className="ml-2 px-2 py-1 text-sm bg-green-500 text-white rounded-full hidden md:inline">Follow Alex</span>
        </Link>
        <Link href="https://zuvillage-georgia.framer.website" className="flex items-center text-center cursor-pointer transform hover:scale-110 transition-transform duration-300" style={{"marginTop": '0px'}}>
          <GlobeLock className="w-6 h-6" />
          <span className="ml-2 px-2 py-1 text-sm bg-green-500 text-white rounded-full hidden md:inline">Made during a ZuVillage Hack Day</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
