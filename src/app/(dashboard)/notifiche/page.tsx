'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/lib/context';
import MainLayout from '@/components/ui/main-layout';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle, FiBell } from 'react-icons/fi';

export default function NotifichePage() {
  const { isAuthenticated, notifiche, segnaNotificaComeLetta, eliminaNotifica, segnaNotificheComeLette } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const getIcona = (tipo: string) => {
    switch (tipo) {
      case 'warning':
        return <FiAlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <FiInfo className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <FiCheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <FiXCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FiBell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getVariante = (tipo: string) => {
    switch (tipo) {
      case 'warning':
        return 'warning';
      case 'info':
        return 'primary';
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      default:
        return 'default';
    }
  };

  const notificheNonLette = notifiche.filter(n => !n.letta).length;

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notifiche</h1>
          <p className="text-muted-foreground">Gestisci le tue notifiche e avvisi</p>
        </div>
        {notificheNonLette > 0 && (
          <Button variant="outline" onClick={segnaNotificheComeLette}>
            Segna tutte come lette
          </Button>
        )}
      </div>

      <Card title={`Notifiche (${notificheNonLette} non lette)`} className="mb-6">
        <div className="space-y-4">
          {notifiche.length === 0 ? (
            <div className="text-center py-8">
              <FiBell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg">Nessuna notifica</h3>
              <p className="text-muted-foreground">Non hai notifiche al momento.</p>
            </div>
          ) : (
            notifiche.map(notifica => (
              <div 
                key={notifica.id} 
                className={`flex items-start gap-3 p-4 border rounded-md ${notifica.letta ? 'bg-card' : 'bg-muted/20'}`}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  notifica.tipo === 'warning' ? 'bg-yellow-100' : 
                  notifica.tipo === 'info' ? 'bg-blue-100' : 
                  notifica.tipo === 'success' ? 'bg-green-100' : 
                  notifica.tipo === 'error' ? 'bg-red-100' : 'bg-muted'
                }`}>
                  {getIcona(notifica.tipo)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{notifica.titolo}</h4>
                    <Badge text={notifica.data} variant={getVariante(notifica.tipo)} className="flex-shrink-0" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notifica.messaggio}</p>
                  <div className="flex gap-2 mt-3">
                    {!notifica.letta && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => segnaNotificaComeLetta(notifica.id)}
                      >
                        Segna come letta
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => eliminaNotifica(notifica.id)}
                    >
                      Elimina
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card title="Impostazioni notifiche">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-2">
            <div>
              <h4 className="font-medium">Notifiche email</h4>
              <p className="text-sm text-muted-foreground">Ricevi notifiche via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-2">
            <div>
              <h4 className="font-medium">Notifiche in-app</h4>
              <p className="text-sm text-muted-foreground">Ricevi notifiche all'interno dell'app</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-2">
            <div>
              <h4 className="font-medium">Avvisi limite capacità</h4>
              <p className="text-sm text-muted-foreground">Ricevi avvisi quando raggiungi i limiti di capacità</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-2">
            <div>
              <h4 className="font-medium">Promemoria incontri</h4>
              <p className="text-sm text-muted-foreground">Ricevi promemoria prima degli incontri</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </Card>
    </MainLayout>
  );
}
