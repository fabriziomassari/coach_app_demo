'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext, Cliente } from '@/lib/context';
import MainLayout from '@/components/ui/main-layout';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Alert from '@/components/ui/alert';
import { FiSave, FiX, FiPlus, FiDollarSign, FiFileText, FiClock, FiCalendar, FiCheck, FiUsers } from 'react-icons/fi';

export default function NuovoContrattoPage() {
  const router = useRouter();
  const { isAuthenticated, clienti, aggiungiNotifica } = useAppContext();
  
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('Sessione di coaching');
  const [clienteId, setClienteId] = useState<number | ''>('');
  const [incontriTotali, setIncontriTotali] = useState<number>(10);
  const [giornoMinimo, setGiornoMinimo] = useState<number>(7);
  const [durataMinuti, setDurataMinuti] = useState<number>(60);
  const [importo, setImporto] = useState<number>(0);
  const [reportFinale, setReportFinale] = useState<boolean>(false);
  const [quadripartitoIniziale, setQuadripartitoIniziale] = useState<boolean>(false);
  const [quadripartitoIntermedio, setQuadripartitoIntermedio] = useState<boolean>(false);
  const [quadripartitoFinale, setQuadripartitoFinale] = useState<boolean>(false);
  const [datiFatturazione, setDatiFatturazione] = useState<string>('');
  
  const [errori, setErrori] = useState<{[key: string]: string}>({});
  const [clientiAttivi, setClientiAttivi] = useState<Cliente[]>([]);
  const [tipoCliente, setTipoCliente] = useState<'individuale' | 'azienda' | ''>('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
    
    // Filtra solo i clienti attivi
    setClientiAttivi(clienti.filter(c => c.attivo));
  }, [isAuthenticated, router, clienti]);

  // Aggiorna il tipo di cliente quando viene selezionato un cliente
  useEffect(() => {
    if (clienteId !== '') {
      const cliente = clienti.find(c => c.id === clienteId);
      if (cliente) {
        setTipoCliente(cliente.tipo);
        
        // Imposta un nome predefinito per il contratto basato sul nome del cliente
        if (!nome) {
          setNome(`Coaching ${cliente.tipo === 'azienda' ? 'Aziendale' : 'Individuale'} ${cliente.nome}`);
        }
      }
    } else {
      setTipoCliente('');
    }
  }, [clienteId, clienti, nome]);

  const validaForm = () => {
    const nuoviErrori: {[key: string]: string} = {};
    
    if (!nome.trim()) nuoviErrori.nome = 'Il nome del contratto è obbligatorio';
    if (clienteId === '') nuoviErrori.clienteId = 'Seleziona un cliente';
    if (!incontriTotali || incontriTotali <= 0) nuoviErrori.incontriTotali = 'Inserisci un numero valido di incontri';
    if (!giornoMinimo || giornoMinimo <= 0) nuoviErrori.giornoMinimo = 'Inserisci un numero valido di giorni';
    if (!durataMinuti || durataMinuti <= 0) nuoviErrori.durataMinuti = 'Inserisci una durata valida in minuti';
    if (!importo || importo < 0) nuoviErrori.importo = 'Inserisci un importo valido';
    if (!datiFatturazione.trim()) nuoviErrori.datiFatturazione = 'Inserisci i dati di fatturazione';
    
    setErrori(nuoviErrori);
    return Object.keys(nuoviErrori).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validaForm()) return;
    
    // Qui dovremmo chiamare la funzione per aggiungere un nuovo contratto
    // che sarà implementata nel contesto
    
    // Per ora, mostriamo solo una notifica e torniamo alla pagina dei contratti
    aggiungiNotifica({
      tipo: 'success',
      titolo: 'Contratto creato',
      messaggio: `Il contratto "${nome}" è stato creato con successo.`
    });
    
    router.push('/contratti');
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Nuovo Contratto</h1>
          <p className="text-muted-foreground">Crea un nuovo contratto con un cliente</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Cliente *</label>
                <select
                  className={`w-full p-2 border rounded-md ${errori.clienteId ? 'border-red-500' : 'border-gray-300'}`}
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value ? parseInt(e.target.value) : '')}
                >
                  <option value="">Seleziona un cliente</option>
                  <optgroup label="Aziende">
                    {clientiAttivi
                      .filter(c => c.tipo === 'azienda')
                      .map(c => (
                        <option key={c.id} value={c.id}>{c.nome}</option>
                      ))
                    }
                  </optgroup>
                  <optgroup label="Clienti individuali">
                    {clientiAttivi
                      .filter(c => c.tipo === 'individuale')
                      .map(c => (
                        <option key={c.id} value={c.id}>{c.nome}</option>
                      ))
                    }
                  </optgroup>
                </select>
                {errori.clienteId && <p className="text-red-500 text-sm mt-1">{errori.clienteId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nome contratto *</label>
                <Input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Es. Coaching Aziendale ABC"
                  className={errori.nome ? 'border-red-500' : ''}
                />
                {errori.nome && <p className="text-red-500 text-sm mt-1">{errori.nome}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tipo di contratto *</label>
                <Input
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  placeholder="Es. Sessione di coaching"
                  className={errori.tipo ? 'border-red-500' : ''}
                />
                {errori.tipo && <p className="text-red-500 text-sm mt-1">{errori.tipo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Importo (€) *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="text-gray-400" />
                  </div>
                  <Input
                    type="number"
                    value={importo}
                    onChange={(e) => setImporto(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className={`pl-10 ${errori.importo ? 'border-red-500' : ''}`}
                  />
                </div>
                {errori.importo && <p className="text-red-500 text-sm mt-1">{errori.importo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Dati di fatturazione *</label>
                <textarea
                  value={datiFatturazione}
                  onChange={(e) => setDatiFatturazione(e.target.value)}
                  placeholder="Es. Fattura mensile, pagamento a 30gg"
                  className={`w-full p-2 border rounded-md ${errori.datiFatturazione ? 'border-red-500' : 'border-gray-300'}`}
                  rows={3}
                />
                {errori.datiFatturazione && <p className="text-red-500 text-sm mt-1">{errori.datiFatturazione}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Numero totale di incontri *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiFileText className="text-gray-400" />
                  </div>
                  <Input
                    type="number"
                    value={incontriTotali}
                    onChange={(e) => setIncontriTotali(parseInt(e.target.value) || 0)}
                    placeholder="10"
                    className={`pl-10 ${errori.incontriTotali ? 'border-red-500' : ''}`}
                  />
                </div>
                {errori.incontriTotali && <p className="text-red-500 text-sm mt-1">{errori.incontriTotali}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Giorni minimi tra incontri *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-gray-400" />
                  </div>
                  <Input
                    type="number"
                    value={giornoMinimo}
                    onChange={(e) => setGiornoMinimo(parseInt(e.target.value) || 0)}
                    placeholder="7"
                    className={`pl-10 ${errori.giornoMinimo ? 'border-red-500' : ''}`}
                  />
                </div>
                {errori.giornoMinimo && <p className="text-red-500 text-sm mt-1">{errori.giornoMinimo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Durata incontro (minuti) *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiClock className="text-gray-400" />
                  </div>
                  <Input
                    type="number"
                    value={durataMinuti}
                    onChange={(e) => setDurataMinuti(parseInt(e.target.value) || 0)}
                    placeholder="60"
                    className={`pl-10 ${errori.durataMinuti ? 'border-red-500' : ''}`}
                  />
                </div>
                {errori.durataMinuti && <p className="text-red-500 text-sm mt-1">{errori.durataMinuti}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium mb-1">Opzioni aggiuntive</label>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="reportFinale"
                    checked={reportFinale}
                    onChange={(e) => setReportFinale(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="reportFinale" className="text-sm">Report finale</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="quadripartitoIniziale"
                    checked={quadripartitoIniziale}
                    onChange={(e) => setQuadripartitoIniziale(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="quadripartitoIniziale" className="text-sm">Quadripartito iniziale</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="quadripartitoIntermedio"
                    checked={quadripartitoIntermedio}
                    onChange={(e) => setQuadripartitoIntermedio(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="quadripartitoIntermedio" className="text-sm">Quadripartito intermedio</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="quadripartitoFinale"
                    checked={quadripartitoFinale}
                    onChange={(e) => setQuadripartitoFinale(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="quadripartitoFinale" className="text-sm">Quadripartito finale</label>
                </div>
              </div>
            </div>
          </div>

          {tipoCliente === 'azienda' && (
            <Alert type="info" title="Gestione persone">
              <p>Dopo aver creato il contratto, potrai aggiungere le persone dell'azienda coinvolte.</p>
            </Alert>
          )}
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/contratti')}
            >
              <FiX className="mr-2 h-4 w-4" />
              Annulla
            </Button>
            <Button type="submit">
              <FiSave className="mr-2 h-4 w-4" />
              Salva contratto
            </Button>
          </div>
        </form>
      </Card>
    </MainLayout>
  );
}
