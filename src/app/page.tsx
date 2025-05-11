'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/lib/context';
import Button from '@/components/ui/button';
import { FiArrowRight } from 'react-icons/fi';

export default function HomePage() {
  const { isAuthenticated } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/90 to-primary">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Coach Time</h1>
          <p className="text-xl md:text-2xl mb-8">
            La soluzione completa per la gestione del tempo dei coach professionisti
          </p>
          <p className="text-lg mb-12">
            Organizza i tuoi impegni, gestisci i contratti con i clienti e ottimizza il tuo tempo di lavoro
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => router.push('/login')}
            >
              Accedi alla demo
              <FiArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-white">
            <h2 className="text-xl font-bold mb-4">Gestione Contratti</h2>
            <p>Crea e gestisci contratti con clienti individuali e aziende, definendo parametri personalizzati per ogni collaborazione.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-white">
            <h2 className="text-xl font-bold mb-4">Pianificazione Intelligente</h2>
            <p>Ottimizza il tuo tempo con la pianificazione automatica degli incontri, rispettando i limiti di capacità e le pause necessarie.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-white">
            <h2 className="text-xl font-bold mb-4">Monitoraggio Avanzato</h2>
            <p>Visualizza statistiche dettagliate sul tuo impegno lavorativo e ricevi notifiche quando stai per raggiungere i tuoi limiti di capacità.</p>
          </div>
        </div>
        
        <div className="mt-24 text-center text-white">
          <p className="text-sm">
            © 2025 Coach Time - App dimostrativa per la gestione del tempo dei coach professionisti
          </p>
        </div>
      </div>
    </div>
  );
}
