'use client';

import Link from 'next/link';
import { FiHome, FiFileText, FiUsers, FiCalendar, FiSettings, FiBell } from 'react-icons/fi';

export default function Sidebar() {
  return (
    <aside className="bg-sidebar-background text-sidebar-foreground w-64 min-h-screen p-4 hidden md:block relative">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Coach Time</h2>
        <p className="text-sm text-sidebar-foreground/70">Gestione tempo professionale</p>
      </div>
      
      <nav className="space-y-2">
        <Link 
          href="/dashboard" 
          className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-sidebar-accent group"
        >
          <FiHome className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        
        <Link 
          href="/contratti" 
          className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-sidebar-accent group"
        >
          <FiFileText className="h-5 w-5" />
          <span>Contratti</span>
        </Link>
        
        <Link 
          href="/clienti" 
          className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-sidebar-accent group"
        >
          <FiUsers className="h-5 w-5" />
          <span>Clienti</span>
        </Link>
        
        <Link 
          href="/agenda" 
          className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-sidebar-accent group"
        >
          <FiCalendar className="h-5 w-5" />
          <span>Agenda</span>
        </Link>
        
        <div className="pt-6 mt-6 border-t border-sidebar-border">
          <Link 
            href="/notifiche" 
            className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-sidebar-accent group"
          >
            <FiBell className="h-5 w-5" />
            <span>Notifiche</span>
          </Link>
          
          <Link 
            href="/profilo" 
            className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-sidebar-accent group"
          >
            <FiSettings className="h-5 w-5" />
            <span>Impostazioni</span>
          </Link>
        </div>
      </nav>
      
      <div className="mt-8 pt-6 border-t border-sidebar-border">
        <div className="bg-sidebar-accent p-4 rounded-lg">
          <h3 className="font-medium mb-1">Impegni di oggi</h3>
          <p className="text-sm text-sidebar-foreground/70">3 sessioni di coaching</p>
          <div className="mt-2 text-xs bg-sidebar-primary text-sidebar-primary-foreground px-2 py-1 rounded-full inline-block">
            Prossima: 14:30
          </div>
        </div>
      </div>
    </aside>
  );
}
