'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext, Cliente } from '@/lib/context';
import MainLayout from '@/components/ui/main-layout';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Input from '@/components/ui/input';
import { FiPlus, FiSearch, FiFilter, FiUser, FiUsers, FiMail, FiPhone, FiEdit, FiFileText } from 'react-icons/fi';

export default function ClientiPage() {
  const { isAuthenticated, clienti, contratti } = useAppContext();
  const router = useRouter();
  const [filtro, setFiltro] = useState('');
  const [mostraSoloAttivi, setMostraSoloAttivi] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Filtra i clienti in base al testo di ricerca e allo stato attivo
  const clientiFiltrati = clienti.filter(cliente => {
    const corrispondeFiltro = cliente.nome.toLowerCase().includes(filtro.toLowerCase()) || 
                             cliente.email.toLowerCase().includes(filtro.toLowerCase());
    const corrispondeStato = mostraSoloAttivi ? cliente.attivo : true;
    return corrispondeFiltro && corrispondeStato;
  });

  // Filtra i clienti per tipo
  const aziende = clientiFiltrati.filter(cliente => cliente.tipo === 'azienda');
  const individuali = clientiFiltrati.filter(cliente => cliente.tipo === 'individuale');

  // Funzione per contare i contratti attivi per cliente
  const contaContrattiAttivi = (clienteId: number) => {
    return contratti.filter(c => c.clienteId === clienteId && c.stato === 'attivo' && c.attivo).length;
  };

  const handleNuovoCliente = () => {
    router.push('/clienti/nuovo');
  };

  const handleNuovaAzienda = () => {
    router.push('/clienti/nuovo?tipo=azienda');
  };

  const handleDettaglioCliente = (id: number) => {
    router.push(`/clienti/${id}`);
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Clienti</h1>
          <p className="text-muted-foreground">Gestisci i tuoi clienti e le aziende</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleNuovaAzienda}>
            <FiUsers className="mr-2 h-4 w-4" />
            Nuova Azienda
          </Button>
          <Button onClick={handleNuovoCliente}>
            <FiPlus className="mr-2 h-4 w-4" />
            Nuovo Cliente
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input 
            placeholder="Cerca clienti..." 
            className="w-full"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={mostraSoloAttivi} 
              onChange={() => setMostraSoloAttivi(!mostraSoloAttivi)}
              className="mr-2"
            />
            Mostra solo attivi
          </label>
          <Button variant="outline" className="flex items-center">
            <FiFilter className="mr-2 h-4 w-4" />
            Filtri
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card title="Aziende" className="mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Nome</th>
                  <th className="text-left py-3 px-4 font-medium">Contratti attivi</th>
                  <th className="text-left py-3 px-4 font-medium">Stato</th>
                  <th className="text-left py-3 px-4 font-medium">Contatto</th>
                  <th className="text-left py-3 px-4 font-medium">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {aziende.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-muted-foreground">
                      Nessuna azienda trovata
                    </td>
                  </tr>
                ) : (
                  aziende.map(azienda => (
                    <tr key={azienda.id} className={`border-b hover:bg-muted/50 ${!azienda.attivo ? 'opacity-60' : ''}`}>
                      <td className="py-3 px-4">{azienda.nome}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <FiFileText className="mr-2 h-4 w-4 text-muted-foreground" />
                          {contaContrattiAttivi(azienda.id)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge 
                          text={azienda.attivo ? "Attivo" : "Disattivato"} 
                          variant={azienda.attivo ? "success" : "default"} 
                        />
                      </td>
                      <td className="py-3 px-4">{azienda.email}</td>
                      <td className="py-3 px-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDettaglioCliente(azienda.id)}
                        >
                          <FiEdit className="mr-2 h-4 w-4" />
                          Modifica
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Clienti individuali" className="mb-6">
          {individuali.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">
              Nessun cliente individuale trovato
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {individuali.map(cliente => (
                <div 
                  key={cliente.id} 
                  className={`bg-card border rounded-lg p-4 hover:shadow-md transition-shadow ${!cliente.attivo ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                      <FiUser className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{cliente.nome}</h4>
                      <p className="text-sm text-muted-foreground">Cliente individuale</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <FiMail className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>{cliente.email}</span>
                    </div>
                    <div className="flex items-center">
                      <FiPhone className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>{cliente.telefono}</span>
                    </div>
                    <div className="flex items-center">
                      <FiFileText className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Contratti attivi: {contaContrattiAttivi(cliente.id)}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <Badge 
                      text={cliente.attivo ? "Attivo" : "Disattivato"} 
                      variant={cliente.attivo ? "primary" : "default"} 
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDettaglioCliente(cliente.id)}
                    >
                      <FiEdit className="mr-2 h-4 w-4" />
                      Modifica
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}
