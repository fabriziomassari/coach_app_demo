'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/lib/context';
import MainLayout from '@/components/ui/main-layout';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Alert from '@/components/ui/alert';
import { FiSave, FiX, FiUser, FiMail, FiPhone, FiCheck } from 'react-icons/fi';

interface NuovaPersonaPageProps {
  params: {
    contrattoId: string;
  };
}

export default function NuovaPersonaPage({ params }: NuovaPersonaPageProps) {
  const router = useRouter();
  const { isAuthenticated, contratti, clienti, aggiungiPersonaAzienda } = useAppContext();
  
  const [contratto, setContratto] = useState<any>(null);
  const [cliente, setCliente] = useState<any>(null);
  
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [consensoICF, setConsensoICF] = useState(false);
  
  const [errori, setErrori] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
    
    const contrattoId = parseInt(params.contrattoId);
    const contrattoTrovato = contratti.find(c => c.id === contrattoId);
    
    if (contrattoTrovato) {
      setContratto(contrattoTrovato);
      
      // Trova il cliente associato al contratto
      const clienteTrovato = clienti.find(c => c.id === contrattoTrovato.clienteId);
      if (clienteTrovato) {
        setCliente(clienteTrovato);
        
        // Verifica che sia un'azienda
        if (clienteTrovato.tipo !== 'azienda') {
          // Se non è un'azienda, reindirizza alla pagina del contratto
          router.push(`/contratti/${contrattoId}`);
        }
      }
    } else {
      router.push('/contratti');
    }
  }, [isAuthenticated, router, params.contrattoId, contratti, clienti]);

  const validaForm = () => {
    const nuoviErrori: {[key: string]: string} = {};
    
    if (!nome.trim()) nuoviErrori.nome = 'Il nome è obbligatorio';
    if (!cognome.trim()) nuoviErrori.cognome = 'Il cognome è obbligatorio';
    if (!email.trim()) nuoviErrori.email = 'L\'email è obbligatoria';
    else if (!/^\S+@\S+\.\S+$/.test(email)) nuoviErrori.email = 'Formato email non valido';
    if (!telefono.trim()) nuoviErrori.telefono = 'Il telefono è obbligatorio';
    
    setErrori(nuoviErrori);
    return Object.keys(nuoviErrori).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contratto || !validaForm()) return;
    
    aggiungiPersonaAzienda({
      contrattoId: contratto.id,
      nome,
      cognome,
      email,
      telefono,
      consensoICF
    });
    
    router.push(`/contratti/${contratto.id}`);
  };

  if (!contratto || !cliente) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p>Caricamento...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Nuova Persona</h1>
          <p className="text-muted-foreground">
            Aggiungi una nuova persona al contratto "{contratto.nome}" con {cliente.nome}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push(`/contratti/${contratto.id}`)}
        >
          Torna al contratto
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nome *</label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Es. Mario"
                className={errori.nome ? 'border-red-500' : ''}
              />
              {errori.nome && <p className="text-red-500 text-sm mt-1">{errori.nome}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Cognome *</label>
              <Input
                value={cognome}
                onChange={(e) => setCognome(e.target.value)}
                placeholder="Es. Rossi"
                className={errori.cognome ? 'border-red-500' : ''}
              />
              {errori.cognome && <p className="text-red-500 text-sm mt-1">{errori.cognome}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Es. mario.rossi@azienda.com"
                className={errori.email ? 'border-red-500' : ''}
              />
              {errori.email && <p className="text-red-500 text-sm mt-1">{errori.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Telefono *</label>
              <Input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Es. +39 123 456 7890"
                className={errori.telefono ? 'border-red-500' : ''}
              />
              {errori.telefono && <p className="text-red-500 text-sm mt-1">{errori.telefono}</p>}
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="consensoICF"
              checked={consensoICF}
              onChange={(e) => setConsensoICF(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="consensoICF" className="text-sm">Consenso all'utilizzo dei dati personali per la certificazione ICF</label>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/contratti/${contratto.id}`)}
            >
              <FiX className="mr-2 h-4 w-4" />
              Annulla
            </Button>
            <Button type="submit">
              <FiSave className="mr-2 h-4 w-4" />
              Salva persona
            </Button>
          </div>
        </form>
      </Card>
    </MainLayout>
  );
}
