'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext, Cliente } from '@/lib/context';
import MainLayout from '@/components/ui/main-layout';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Alert from '@/components/ui/alert';
import { FiSave, FiX, FiTrash2 } from 'react-icons/fi';

interface ModificaClientePageProps {
  params: {
    id: string;
  };
}

export default function ModificaClientePage({ params }: ModificaClientePageProps) {
  const router = useRouter();
  const { clienti, modificaCliente, eliminaCliente, getClienteById } = useAppContext();
  
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [persone, setPersone] = useState<number>(1);
  const [errori, setErrori] = useState<{[key: string]: string}>({});
  const [confermaEliminazione, setConfermaEliminazione] = useState(false);

  useEffect(() => {
    const id = parseInt(params.id);
    const clienteTrovato = getClienteById(id);
    
    if (clienteTrovato) {
      setCliente(clienteTrovato);
      setNome(clienteTrovato.nome);
      setEmail(clienteTrovato.email);
      setTelefono(clienteTrovato.telefono);
      if (clienteTrovato.persone) {
        setPersone(clienteTrovato.persone);
      }
    } else {
      router.push('/clienti');
    }
  }, [params.id, getClienteById, router]);

  const validaForm = () => {
    const nuoviErrori: {[key: string]: string} = {};
    
    if (!nome.trim()) nuoviErrori.nome = 'Il nome è obbligatorio';
    if (!email.trim()) nuoviErrori.email = 'L\'email è obbligatoria';
    else if (!/^\S+@\S+\.\S+$/.test(email)) nuoviErrori.email = 'Formato email non valido';
    if (!telefono.trim()) nuoviErrori.telefono = 'Il telefono è obbligatorio';
    if (cliente?.tipo === 'azienda' && (!persone || persone < 1)) nuoviErrori.persone = 'Inserire un numero valido di persone';
    
    setErrori(nuoviErrori);
    return Object.keys(nuoviErrori).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cliente || !validaForm()) return;
    
    const clienteAggiornato = {
      nome,
      email,
      telefono,
      ...(cliente.tipo === 'azienda' && { persone })
    };
    
    modificaCliente(cliente.id, clienteAggiornato);
    router.push('/clienti');
  };

  const handleElimina = () => {
    if (!cliente) return;
    
    eliminaCliente(cliente.id);
    router.push('/clienti');
  };

  if (!cliente) {
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
          <h1 className="text-2xl font-bold">Modifica Cliente</h1>
          <p className="text-muted-foreground">Aggiorna i dati del cliente</p>
        </div>
        <Button 
          variant="destructive" 
          onClick={() => setConfermaEliminazione(true)}
        >
          <FiTrash2 className="mr-2 h-4 w-4" />
          Elimina
        </Button>
      </div>

      {confermaEliminazione && (
        <Alert 
          type="warning" 
          title="Conferma eliminazione"
          className="mb-6"
        >
          <p className="mb-4">Sei sicuro di voler eliminare questo cliente? Questa azione non può essere annullata.</p>
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
              Conferma eliminazione
            </Button>
          </div>
        </Alert>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tipo di cliente
              </label>
              <div className="p-2 bg-muted rounded">
                {cliente.tipo === 'individuale' ? 'Cliente individuale' : 'Azienda'}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Il tipo di cliente non può essere modificato</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {cliente.tipo === 'individuale' ? 'Nome e Cognome' : 'Nome Azienda'}
              </label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder={cliente.tipo === 'individuale' ? 'Es. Mario Rossi' : 'Es. Azienda ABC'}
                className={errori.nome ? 'border-red-500' : ''}
              />
              {errori.nome && <p className="text-red-500 text-sm mt-1">{errori.nome}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Es. mario.rossi@email.com"
                className={errori.email ? 'border-red-500' : ''}
              />
              {errori.email && <p className="text-red-500 text-sm mt-1">{errori.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Telefono</label>
              <Input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Es. +39 123 456 7890"
                className={errori.telefono ? 'border-red-500' : ''}
              />
              {errori.telefono && <p className="text-red-500 text-sm mt-1">{errori.telefono}</p>}
            </div>
            
            {cliente.tipo === 'azienda' && (
              <div>
                <label className="block text-sm font-medium mb-1">Numero di persone</label>
                <Input
                  type="number"
                  min="1"
                  value={persone}
                  onChange={(e) => setPersone(parseInt(e.target.value) || 0)}
                  className={errori.persone ? 'border-red-500' : ''}
                />
                {errori.persone && <p className="text-red-500 text-sm mt-1">{errori.persone}</p>}
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/clienti')}
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
