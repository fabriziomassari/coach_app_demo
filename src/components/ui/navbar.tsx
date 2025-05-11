'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX, FiBell, FiUser, FiCalendar, FiLogOut } from 'react-icons/fi';
import { useAppContext } from '@/lib/context';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, notifiche } = useAppContext();
  const router = useRouter();
  
  const notificheNonLette = notifiche.filter(n => !n.letta).length;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Coach Time</span>
            </Link>
          </div>
          
          {isAuthenticated && (
            <>
              {/* Desktop menu */}
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark">
                  Dashboard
                </Link>
                <Link href="/contratti" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark">
                  Contratti
                </Link>
                <Link href="/clienti" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark">
                  Clienti
                </Link>
                <Link href="/agenda" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark">
                  Agenda
                </Link>
              </div>
              
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/notifiche" className="text-white p-2 rounded-full hover:bg-primary-dark relative">
                  <FiBell className="h-5 w-5" />
                  {notificheNonLette > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                      {notificheNonLette}
                    </span>
                  )}
                </Link>
                <Link href="/profilo" className="text-white p-2 rounded-full hover:bg-primary-dark">
                  <FiUser className="h-5 w-5" />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-white p-2 rounded-full hover:bg-primary-dark"
                >
                  <FiLogOut className="h-5 w-5" />
                </button>
              </div>
            </>
          )}
          
          {/* Mobile menu button */}
          {isAuthenticated && (
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-dark focus:outline-none"
              >
                {isOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isAuthenticated && isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/dashboard" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-dark"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/contratti" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-dark"
              onClick={() => setIsOpen(false)}
            >
              Contratti
            </Link>
            <Link 
              href="/clienti" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-dark"
              onClick={() => setIsOpen(false)}
            >
              Clienti
            </Link>
            <Link 
              href="/agenda" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-dark"
              onClick={() => setIsOpen(false)}
            >
              Agenda
            </Link>
            <Link 
              href="/profilo" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-dark"
              onClick={() => setIsOpen(false)}
            >
              Profilo
            </Link>
            <Link 
              href="/notifiche" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-dark"
              onClick={() => setIsOpen(false)}
            >
              Notifiche
              {notificheNonLette > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                  {notificheNonLette}
                </span>
              )}
            </Link>
            <button
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-primary-dark"
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
