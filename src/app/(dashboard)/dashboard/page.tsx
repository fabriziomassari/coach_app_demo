'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/lib/context';
import MainLayout from '@/components/ui/main-layout';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Alert from '@/components/ui/alert';
import { FiCalendar, FiUsers, FiFileText, FiClock, FiAlertCircle, FiCheck } from 'react-icons/fi';

export default function Dashboard() {
  const { isAuthenticated, incontri, clienti, contratti, notifiche, registraIncontroCompletato } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Filtra gli incontri di oggi
  const oggi = new Date();
  const incontriOggi = incontri.filter(incontro => 
    incontro.data.getDate() === oggi.getDate() &&
    incontro.data.getMonth() === oggi.getMonth() &&
    incontro.data.getFullYear() === oggi.getFullYear() &&
    incontro.stato === 'pianificato'
  );

  // Filtra i contratti attivi
  const contrattiAttivi = contratti.filter(contratto => contratto.stato === 'attivo');

  // Calcola le statistiche
  const impegniSettimanali = incontri.filter(incontro => {
    const dataIncontro = new Date(incontro.data);
    const inizioSettimana = new Date();
    inizioSettimana.setDate(oggi.getDate() - oggi.getDay() + 1);
    inizioSettimana.setHours(0, 0, 0, 0);
    
    const fineSettimana = new Date(inizioSettimana);
    fineSettimana.setDate(inizioSettimana.getDate() + 6);
    fineSettimana.setHours(23, 59, 59, 999);
    
    return dataIncontro >= inizioSettimana && dataIncontro <= fineSettimana;
  }).length;

  const impegniMensili = incontri.filter(incontro => {
    const dataIncontro = new Date(incontro.data);
    return dataIncontro.getMonth() === oggi.getMonth() && 
           dataIncontro.getFullYear() === oggi.getFullYear();
  }).length;

  // Funzione per gestire il completamento di un incontro
  const handleCompletaIncontro = (incontroId: number) => {
    registraIncontroCompletato(incontroId);
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Benvenuto nel tuo spazio di lavoro</p>
      </div>

      <Alert type="info" title="Benvenuto nella demo">
        Questa è una versione dimostrativa dell'app di gestione del tempo per coach professionisti.
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card title="Impegni di oggi">
          <div className="space-y-4">
            {incontriOggi.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">Nessun impegno per oggi</p>
            ) : (
              incontriOggi.map(incontro => (
                <div key={incontro.id} className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Sessione di coaching</h4>
                    <p className="text-sm text-muted-foreground">{incontro.nomeCliente}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge text={`${incontro.oraInizio} - ${incontro.oraFine}`} variant="primary" />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCompletaIncontro(incontro.id)}
                    >
                      <FiCheck className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
            
            <Button className="w-full" variant="outline">
              <FiCalendar className="mr-2 h-4 w-4" />
              Visualizza agenda completa
            </Button>
          </div>
        </Card>
        
        <Card title="Contratti attivi">
          <div className="space-y-4">
            {contrattiAttivi.map(contratto => (
              <div key={contratto.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <FiFileText />
                  </div>
                  <div>
                    <h4 className="font-medium">{contratto.nome}</h4>
                    <p className="text-sm text-muted-foreground">{contratto.persone} persone</p>
                  </div>
                </div>
                <Badge text="In corso" variant="success" />
              </div>
            ))}
            
            <Button className="w-full" variant="outline">
              <FiFileText className="mr-2 h-4 w-4" />
              Gestisci contratti
            </Button>
          </div>
        </Card>
        
        <Card title="Statistiche">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Impegno settimanale</span>
                <span className="text-sm text-muted-foreground">{impegniSettimanali}/20</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(impegniSettimanali / 20) * 100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Impegno mensile</span>
                <span className="text-sm text-muted-foreground">{impegniMensili}/60</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(impegniMensili / 60) * 100}%` }}></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg text-center">
                <FiUsers className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                {/* <h4 className="text-2xl font-bold">{contratti.reduce((acc, curr) => acc + curr.persone, 0)}</h4> */}
                <h4 className="text-2xl font-bold">{clienti.length}</h4>
                <p className="text-xs text-muted-foreground">Clienti totali</p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg text-center">
                <FiClock className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <h4 className="text-2xl font-bold">{impegniSettimanali * 2}</h4>
                <p className="text-xs text-muted-foreground">Ore settimanali</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card title="Notifiche">
          <div className="space-y-4">
            {notifiche.filter(n => !n.letta).slice(0, 2).map(notifica => (
              <div key={notifica.id} className="flex items-start gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  notifica.tipo === 'warning' ? 'bg-yellow-100 text-yellow-600' : 
                  notifica.tipo === 'info' ? 'bg-blue-100 text-blue-600' : 
                  notifica.tipo === 'success' ? 'bg-green-100 text-green-600' : 'bg-muted'
                }`}>
                  <FiAlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium">{notifica.titolo}</h4>
                  <p className="text-sm text-muted-foreground">{notifica.messaggio}</p>
                </div>
                <Badge text={notifica.data} variant={
                  notifica.tipo === 'warning' ? 'warning' : 
                  notifica.tipo === 'info' ? 'primary' : 
                  notifica.tipo === 'success' ? 'success' : 'default'
                } className="flex-shrink-0" />
              </div>
            ))}
            
            <Button className="w-full" variant="outline">
              <FiAlertCircle className="mr-2 h-4 w-4" />
              Visualizza tutte le notifiche
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
