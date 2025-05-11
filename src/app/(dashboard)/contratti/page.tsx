'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/lib/context';
import MainLayout from '@/components/ui/main-layout';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import { FiEdit, FiPlus, FiUser, FiUsers } from 'react-icons/fi';

export default function ContrattiPage() {
  const { isAuthenticated, contratti, clienti, personeAzienda } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Ottieni il nome del cliente per un contratto
  const getNomeCliente = (clienteId: number) => {
    const cliente = clienti.find(c => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente sconosciuto';
  };

  // Ottieni il tipo di cliente per un contratto
  const getTipoCliente = (clienteId: number) => {
    const cliente = clienti.find(c => c.id === clienteId);
    return cliente ? cliente.tipo : 'sconosciuto';
  };

  // Conta le persone associate a un contratto
  const contaPersoneContratto = (contrattoId: number) => {
    return personeAzienda.filter(p => p.contrattoId === contrattoId && p.attivo).length;
  };

  // Filtra i contratti attivi
  const contrattiAttivi = contratti.filter(c => c.attivo);

  // Raggruppa i contratti per tipo di cliente
  const contrattiAziendali = contrattiAttivi.filter(c => getTipoCliente(c.clienteId) === 'azienda');
  const contrattiIndividuali = contrattiAttivi.filter(c => getTipoCliente(c.clienteId) === 'individuale');

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestione Contratti</h1>
          <p className="text-muted-foreground">Visualizza e gestisci i contratti con i tuoi clienti</p>
        </div>
        <Button onClick={() => router.push('/contratti/nuovo')}>
          <FiPlus className="mr-2 h-4 w-4" />
          Nuovo Contratto
        </Button>
      </div>

      <div className="space-y-8">
        <Card title="Contratti Aziendali" className="mb-6">
          {contrattiAziendali.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">
              Nessun contratto aziendale attivo
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Nome</th>
                    <th className="text-left py-3 px-4 font-medium">Azienda</th>
                    <th className="text-left py-3 px-4 font-medium">Persone</th>
                    <th className="text-left py-3 px-4 font-medium">Progresso</th>
                    <th className="text-left py-3 px-4 font-medium">Importo</th>
                    <th className="text-left py-3 px-4 font-medium">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {contrattiAziendali.map(contratto => (
                    <tr key={contratto.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{contratto.nome}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <FiUsers className="mr-2 h-4 w-4 text-muted-foreground" />
                          {getNomeCliente(contratto.clienteId)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {contaPersoneContratto(contratto.id)} persone
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{contratto.incontriCompletati}/{contratto.incontriTotali}</span>
                            <span>{Math.round((contratto.incontriCompletati / contratto.incontriTotali) * 100)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(contratto.incontriCompletati / contratto.incontriTotali) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">€ {contratto.importo.toLocaleString('it-IT')}</td>
                      <td className="py-3 px-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => router.push(`/contratti/${contratto.id}`)}
                        >
                          <FiEdit className="mr-2 h-4 w-4" />
                          Gestisci
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card title="Contratti Individuali" className="mb-6">
          {contrattiIndividuali.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">
              Nessun contratto individuale attivo
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contrattiIndividuali.map(contratto => (
                <div 
                  key={contratto.id} 
                  className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                      <FiUser className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{contratto.nome}</h4>
                      <p className="text-sm text-muted-foreground">{getNomeCliente(contratto.clienteId)}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progresso</span>
                      <span>{Math.round((contratto.incontriCompletati / contratto.incontriTotali) * 100)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(contratto.incontriCompletati / contratto.incontriTotali) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Incontri:</span>
                      <span>{contratto.incontriCompletati}/{contratto.incontriTotali}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Durata:</span>
                      <span>{contratto.durataMinuti} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Importo:</span>
                      <span>€ {contratto.importo.toLocaleString('it-IT')}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => router.push(`/contratti/${contratto.id}`)}
                    >
                      <FiEdit className="mr-2 h-4 w-4" />
                      Gestisci
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
