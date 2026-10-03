'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Camera, Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from './Button';

export function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <Camera className="w-8 h-8 text-primary group-hover:animate-bounce-soft" />
              <span className="font-extrabold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PothoBooth
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-primary font-semibold transition-colors">
              Beranda
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-primary font-semibold transition-colors">
              Harga
            </Link>
            <Link href="/history" className="text-gray-600 hover:text-primary font-semibold transition-colors">
              Riwayat
            </Link>
            
            {session ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-pink-100">
                <div className="flex items-center gap-2">
                  {session.user?.image ? (
                    <img src={session.user.image} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-primary" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-primary">
                      <User size={16} />
                    </div>
                  )}
                  <span className="font-medium text-sm text-gray-700">{session.user?.name?.split(' ')[0]}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-gray-500 hover:text-red-500">
                  <LogOut size={18} />
                </Button>
              </div>
            ) : (
              <Button onClick={() => signIn('google')} variant="primary" size="sm" className="ml-4 shadow-md">
                Login
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-primary focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-pink-100 px-4 pt-2 pb-4 space-y-3 shadow-lg">
          <Link 
            href="/" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-pink-50"
            onClick={() => setIsOpen(false)}
          >
            Beranda
          </Link>
          <Link 
            href="/pricing" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-pink-50"
            onClick={() => setIsOpen(false)}
          >
            Harga
          </Link>
          <Link 
            href="/history" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-pink-50"
            onClick={() => setIsOpen(false)}
          >
            Riwayat
          </Link>
          
          <div className="pt-4 border-t border-pink-100">
            {session ? (
              <div className="flex items-center justify-between px-3">
                <div className="flex items-center gap-3">
                  {session.user?.image ? (
                    <img src={session.user.image} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-primary" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-primary">
                      <User size={20} />
                    </div>
                  )}
                  <span className="font-medium text-gray-800">{session.user?.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  <LogOut size={20} />
                </Button>
              </div>
            ) : (
              <Button onClick={() => signIn('google')} variant="primary" className="w-full justify-center">
                Login Sekarang
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
