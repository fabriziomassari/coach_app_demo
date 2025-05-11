'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/lib/context';
import MainLayout from '@/components/ui/main-layout';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Alert from '@/components/ui/alert';
import { FiUser, FiMail, FiPhone, FiLock, FiSave, FiBell } from 'react-icons/fi';

export default function ProfiloPage() {
  const { isAuthenticated, profilo, aggiornaProfiloUtente } = useAppContext();
  const router = useRouter();
  
  const [nome, setNome] = useState(profilo.nome);
  const [email, setEmail] = useState(profilo.email);
  const [telefono, setTelefono] = useState(profilo.telefono);
  const [password, setPassword] = useState('');
  const [confermaPassword, setConfermaPassword] = useState('');
  const [maxGiornaliero, setMaxGiornaliero] = useState(profilo.maxGiornaliero);
  const [maxSettimanale, setMaxSettimanale] = useState(profilo.maxSettimanale);
  const [maxMensile, setMaxMensile] = useState(profilo.maxMensile);
  const [notificheEmail, setNotificheEmail] = useState(profilo.notificheEmail);
  const [notificheApp, setNotificheApp] = useState(profilo.notificheApp);
  const [salvato, setSalvato] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Aggiorna i campi quando il profilo cambia
  useEffect(() => {
    setNome(profilo.nome);
    setEmail(profilo.email);
    setTelefono(profilo.telefono);
    setMaxGiornaliero(profilo.maxGiornaliero);
    setMaxSettimanale(profilo.maxSettimanale);
    setMaxMensile(profilo.maxMensile);
    setNotificheEmail(profilo.notificheEmail);
    setNotificheApp(profilo.notificheApp);
  }, [profilo]);

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    // Aggiorna il profilo
    aggiornaProfiloUtente({
      nome,
      email,
      telefono
    });
    
    // Mostra messaggio di successo
    setSalvato(true);
    setTimeout(() => setSalvato(false), 3000);
  };

  const handleSubmitLimiti = (e: React.FormEvent) => {
    e.preventDefault();
    // Aggiorna i limiti
    aggiornaProfiloUtente({
      maxGiornaliero,
      maxSettimanale,
      maxMensile
    });
    
    // Mostra messaggio di successo
    setSalvato(true);
    setTimeout(() => setSalvato(false), 3000);
  };

  const handleSubmitNotifiche = (e: React.FormEvent) => {
    e.preventDefault();
    // Aggiorna le preferenze di notifica
    aggiornaProfiloUtente({
      notificheEmail,
      notificheApp
    });
    
    // Mostra messaggio di successo
    setSalvato(true);
    setTimeout(() => setSalvato(false), 3000);
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profilo</h1>
        <p className="text-muted-foreground">Gestisci le tue informazioni personali e impostazioni</p>
      </div>

      {salvato && (
        <Alert type="success" title="Modifiche salvate">
          Le modifiche al tuo profilo sono state salvate con successo.
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2 space-y-6">
          <Card title="Informazioni personali">
            <form onSubmit={handleSubmitInfo} className="space-y-4">
              <Input
                label="Nome e Cognome"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Inserisci il tuo nome e cognome"
              />
              
              <Input
                label="Email"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Inserisci la tua email"
              />
              
              <Input
                label="Telefono"
                id="telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Inserisci il tuo numero di telefono"
              />
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-4">Modifica password</h3>
                
                <div className="space-y-4">
                  <Input
                    label="Nuova password"
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Inserisci la nuova password"
                  />
                  
                  <Input
                    label="Conferma password"
                    id="conferma-password"
                    type="password"
                    value={confermaPassword}
                    onChange={(e) => setConfermaPassword(e.target.value)}
                    placeholder="Conferma la nuova password"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit">
                  <FiSave className="mr-2 h-4 w-4" />
                  Salva modifiche
                </Button>
              </div>
            </form>
          </Card>
          
          <Card title="Limiti di capacità">
            <form onSubmit={handleSubmitLimiti} className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Imposta i limiti massimi di impegni che puoi gestire nei diversi periodi.
                Il sistema ti avviserà quando stai per raggiungere questi limiti.
              </p>
              
              <Input
                label="Massimo impegni giornalieri"
                id="max-giornaliero"
                type="number"
                min="1"
                max="10"
                value={maxGiornaliero}
                onChange={(e) => setMaxGiornaliero(parseInt(e.target.value))}
              />
              
              <Input
                label="Massimo impegni settimanali"
                id="max-settimanale"
                type="number"
                min="1"
                max="40"
                value={maxSettimanale}
                onChange={(e) => setMaxSettimanale(parseInt(e.target.value))}
              />
              
              <Input
                label="Massimo impegni mensili"
                id="max-mensile"
                type="number"
                min="1"
                max="120"
                value={maxMensile}
                onChange={(e) => setMaxMensile(parseInt(e.target.value))}
              />
              
              <div className="flex justify-end">
                <Button type="submit">
                  <FiSave className="mr-2 h-4 w-4" />
                  Salva modifiche
                </Button>
              </div>
            </form>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card title="Il tuo profilo">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <FiUser className="h-12 w-12" />
              </div>
              
              <h3 className="font-medium text-lg">{nome}</h3>
              <p className="text-muted-foreground">Coach professionista</p>
              
              <div className="w-full mt-6 space-y-2">
                <div className="flex items-center">
                  <FiMail className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">{email}</span>
                </div>
                
                <div className="flex items-center">
                  <FiPhone className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">{telefono}</span>
                </div>
              </div>
            </div>
          </Card>
          
          <Card title="Preferenze notifiche">
            <form onSubmit={handleSubmitNotifiche} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifiche email</h4>
                  <p className="text-sm text-muted-foreground">Ricevi notifiche via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notificheEmail}
                    onChange={() => setNotificheEmail(!notificheEmail)}
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifiche in-app</h4>
                  <p className="text-sm text-muted-foreground">Ricevi notifiche all'interno dell'app</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notificheApp}
                    onChange={() => setNotificheApp(!notificheApp)}
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit">
                  <FiSave className="mr-2 h-4 w-4" />
                  Salva modifiche
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
