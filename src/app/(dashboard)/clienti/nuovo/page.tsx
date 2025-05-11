'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/lib/context';
import MainLayout from '@/components/ui/main-layout';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { FiSave, FiX } from 'react-icons/fi';

export default function NuovoClientePage() {
  const router = useRouter();
  const { aggiungiCliente } = useAppContext();
  
  const [tipo, setTipo] = useState<'individuale' | 'azienda'>('individuale');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [persone, setPersone] = useState<number>(1);
  const [errori, setErrori] = useState<{[key: string]: string}>({});

  const validaForm = () => {
    const nuoviErrori: {[key: string]: string} = {};
    
    if (!nome.trim()) nuoviErrori.nome = 'Il nome è obbligatorio';
    if (!email.trim()) nuoviErrori.email = 'L\'email è obbligatoria';
    else if (!/^\S+@\S+\.\S+$/.test(email)) nuoviErrori.email = 'Formato email non valido';
    if (!telefono.trim()) nuoviErrori.telefono = 'Il telefono è obbligatorio';
    if (tipo === 'azienda' && (!persone || persone < 1)) nuoviErrori.persone = 'Inserire un numero valido di persone';
    
    setErrori(nuoviErrori);
    return Object.keys(nuoviErrori).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validaForm()) return;
    
    const nuovoCliente = {
      nome,
      email,
      telefono,
      tipo,
      ...(tipo === 'azienda' && { persone }),
      attivo: true
    };
    
    aggiungiCliente(nuovoCliente);
    router.push('/clienti');
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Nuovo Cliente</h1>
          <p className="text-muted-foreground">Aggiungi un nuovo cliente o azienda</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo di cliente</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tipo"
                    value="individuale"
                    checked={tipo === 'individuale'}
                    onChange={() => setTipo('individuale')}
                    className="mr-2"
                  />
                  Cliente individuale
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tipo"
                    value="azienda"
                    checked={tipo === 'azienda'}
                    onChange={() => setTipo('azienda')}
                    className="mr-2"
                  />
                  Azienda
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {tipo === 'individuale' ? 'Nome e Cognome' : 'Nome Azienda'}
              </label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder={tipo === 'individuale' ? 'Es. Mario Rossi' : 'Es. Azienda ABC'}
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
            
            {tipo === 'azienda' && (
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
              Salva
            </Button>
          </div>
        </form>
      </Card>
    </MainLayout>
  );
}
