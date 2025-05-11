'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext, PersonaAzienda } from '@/lib/context';
import MainLayout from '@/components/ui/main-layout';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Alert from '@/components/ui/alert';
import { FiSave, FiX, FiUser, FiMail, FiPhone, FiCheck } from 'react-icons/fi';

interface ModificaPersonaPageProps {
  params: {
    id: string;
  };
}

export default function ModificaPersonaPage({ params }: ModificaPersonaPageProps) {
  const router = useRouter();
  const { isAuthenticated, personeAzienda, contratti, clienti, modificaPersonaAzienda, eliminaPersonaAzienda, getPersonaById } = useAppContext();
  
  const [persona, setPersona] = useState<PersonaAzienda | null>(null);
  const [contratto, setContratto] = useState<any>(null);
  const [cliente, setCliente] = useState<any>(null);
  
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [consensoICF, setConsensoICF] = useState(false);
  
  const [confermaEliminazione, setConfermaEliminazione] = useState(false);
  const [errori, setErrori] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
    
    const id = parseInt(params.id);
    const personaTrovata = getPersonaById(id);
    
    if (personaTrovata) {
      setPersona(personaTrovata);
      
      // Trova il contratto associato
      const contrattoTrovato = contratti.find(c => c.id === personaTrovata.contrattoId);
      setContratto(contrattoTrovato);
      
      // Trova il cliente associato al contratto
      if (contrattoTrovato) {
        const clienteTrovato = clienti.find(c => c.id === contrattoTrovato.clienteId);
        setCliente(clienteTrovato);
      }
      
      // Imposta i valori per la modifica
      setNome(personaTrovata.nome);
      setCognome(personaTrovata.cognome);
      setEmail(personaTrovata.email);
      setTelefono(personaTrovata.telefono);
      setConsensoICF(personaTrovata.consensoICF);
    } else {
      router.push('/contratti');
    }
  }, [isAuthenticated, router, params.id, personeAzienda, contratti, clienti, getPersonaById]);

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
    
    if (!persona || !validaForm()) return;
    
    modificaPersonaAzienda(persona.id, {
      nome,
      cognome,
      email,
      telefono,
      consensoICF
    });
    
    router.push(`/contratti/${persona.contrattoId}`);
  };

  const handleElimina = () => {
    if (!persona) return;
    
    eliminaPersonaAzienda(persona.id);
    router.push(`/contratti/${persona.contrattoId}`);
  };

  if (!persona || !contratto || !cliente) {
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
          <h1 className="text-2xl font-bold">Modifica Persona</h1>
          <p className="text-muted-foreground">
            Modifica i dati di {persona.nome} {persona.cognome} per il contratto "{contratto.nome}"
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="destructive" 
            onClick={() => setConfermaEliminazione(true)}
          >
            Rimuovi persona
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push(`/contratti/${persona.contrattoId}`)}
          >
            Torna al contratto
          </Button>
        </div>
      </div>

      {confermaEliminazione && (
        <Alert 
          type="warning" 
          title="Conferma rimozione"
          className="mb-6"
        >
          <p className="mb-4">Sei sicuro di voler rimuovere questa persona dal contratto? Questa azione non può essere annullata.</p>
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setConfermaEliminazione(false)}
            >
              Annulla
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleElimina}
            >
              Conferma rimozione
            </Button>
          </div>
        </Alert>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nome *</label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={errori.nome ? 'border-red-500' : ''}
              />
              {errori.nome && <p className="text-red-500 text-sm mt-1">{errori.nome}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Cognome *</label>
              <Input
                value={cognome}
                onChange={(e) => setCognome(e.target.value)}
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
                className={errori.email ? 'border-red-500' : ''}
              />
              {errori.email && <p className="text-red-500 text-sm mt-1">{errori.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Telefono *</label>
              <Input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
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
              onClick={() => router.push(`/contratti/${persona.contrattoId}`)}
            >
              <FiX className="mr-2 h-4 w-4" />
              Annulla
            </Button>
            <Button type="submit">
              <FiSave className="mr-2 h-4 w-4" />
              Salva modifiche
            </Button>
          </div>
        </form>
      </Card>
    </MainLayout>
  );
}
