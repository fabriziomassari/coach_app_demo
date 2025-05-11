'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext, Contratto, PersonaAzienda } from '@/lib/context';
import MainLayout from '@/components/ui/main-layout';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';
import { FiSave, FiX, FiPlus, FiTrash2, FiEdit, FiUser, FiUsers, FiFileText, FiClock, FiCalendar, FiCheck } from 'react-icons/fi';

interface DettaglioContrattoPageProps {
  params: {
    id: string;
  };
}

export default function DettaglioContrattoPage({ params }: DettaglioContrattoPageProps) {
  const router = useRouter();
  const { 
    isAuthenticated, 
    contratti, 
    clienti, 
    personeAzienda,
    aggiungiNotifica 
  } = useAppContext();
  
  const [contratto, setContratto] = useState<Contratto | null>(null);
  const [cliente, setCliente] = useState<any>(null);
  const [personeDelContratto, setPersoneDelContratto] = useState<PersonaAzienda[]>([]);
  const [activeTab, setActiveTab] = useState<'dettagli' | 'persone'>('dettagli');
  
  // Stato per la modifica
  const [inModifica, setInModifica] = useState(false);
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [incontriTotali, setIncontriTotali] = useState<number>(0);
  const [giornoMinimo, setGiornoMinimo] = useState<number>(0);
  const [durataMinuti, setDurataMinuti] = useState<number>(0);
  const [importo, setImporto] = useState<number>(0);
  const [reportFinale, setReportFinale] = useState<boolean>(false);
  const [quadripartitoIniziale, setQuadripartitoIniziale] = useState<boolean>(false);
  const [quadripartitoIntermedio, setQuadripartitoIntermedio] = useState<boolean>(false);
  const [quadripartitoFinale, setQuadripartitoFinale] = useState<boolean>(false);
  const [datiFatturazione, setDatiFatturazione] = useState<string>('');
  const [stato, setStato] = useState<'attivo' | 'completato' | 'archiviato'>('attivo');
  
  // Stato per nuova persona
  const [mostraFormPersona, setMostraFormPersona] = useState(false);
  const [nuovaPersona, setNuovaPersona] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    consensoICF: false
  });
  
  const [errori, setErrori] = useState<{[key: string]: string}>({});
  const [erroriPersona, setErroriPersona] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
    
    const id = parseInt(params.id);
    const contrattoTrovato = contratti.find(c => c.id === id);
    
    if (contrattoTrovato) {
      setContratto(contrattoTrovato);
      
      // Trova il cliente associato
      const clienteTrovato = clienti.find(c => c.id === contrattoTrovato.clienteId);
      setCliente(clienteTrovato);
      
      // Se è un'azienda, trova le persone associate al contratto
      if (clienteTrovato && clienteTrovato.tipo === 'azienda') {
        const persone = personeAzienda.filter(p => p.contrattoId === contrattoTrovato.id && p.attivo);
        setPersoneDelContratto(persone);
      }
      
      // Imposta i valori per la modifica
      setNome(contrattoTrovato.nome);
      setTipo(contrattoTrovato.tipo);
      setIncontriTotali(contrattoTrovato.incontriTotali);
      setGiornoMinimo(contrattoTrovato.giornoMinimo);
      setDurataMinuti(contrattoTrovato.durataMinuti);
      setImporto(contrattoTrovato.importo);
      setReportFinale(contrattoTrovato.reportFinale);
      setQuadripartitoIniziale(contrattoTrovato.quadripartitoIniziale);
      setQuadripartitoIntermedio(contrattoTrovato.quadripartitoIntermedio);
      setQuadripartitoFinale(contrattoTrovato.quadripartitoFinale);
      setDatiFatturazione(contrattoTrovato.datiFatturazione);
      setStato(contrattoTrovato.stato);
    } else {
      router.push('/contratti');
    }
  }, [isAuthenticated, router, params.id, contratti, clienti, personeAzienda]);

  const validaForm = () => {
    const nuoviErrori: {[key: string]: string} = {};
    
    if (!nome.trim()) nuoviErrori.nome = 'Il nome del contratto è obbligatorio';
    if (!incontriTotali || incontriTotali <= 0) nuoviErrori.incontriTotali = 'Inserisci un numero valido di incontri';
    if (!giornoMinimo || giornoMinimo <= 0) nuoviErrori.giornoMinimo = 'Inserisci un numero valido di giorni';
    if (!durataMinuti || durataMinuti <= 0) nuoviErrori.durataMinuti = 'Inserisci una durata valida in minuti';
    if (!importo || importo < 0) nuoviErrori.importo = 'Inserisci un importo valido';
    if (!datiFatturazione.trim()) nuoviErrori.datiFatturazione = 'Inserisci i dati di fatturazione';
    
    setErrori(nuoviErrori);
    return Object.keys(nuoviErrori).length === 0;
  };

  const validaFormPersona = () => {
    const nuoviErrori: {[key: string]: string} = {};
    
    if (!nuovaPersona.nome.trim()) nuoviErrori.nome = 'Il nome è obbligatorio';
    if (!nuovaPersona.cognome.trim()) nuoviErrori.cognome = 'Il cognome è obbligatorio';
    if (!nuovaPersona.email.trim()) nuoviErrori.email = 'L\'email è obbligatoria';
    else if (!/^\S+@\S+\.\S+$/.test(nuovaPersona.email)) nuoviErrori.email = 'Formato email non valido';
    if (!nuovaPersona.telefono.trim()) nuoviErrori.telefono = 'Il telefono è obbligatorio';
    
    setErroriPersona(nuoviErrori);
    return Object.keys(nuoviErrori).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validaForm()) return;
    
    // Qui dovremmo chiamare la funzione per modificare il contratto
    // che sarà implementata nel contesto
    
    // Per ora, mostriamo solo una notifica e usciamo dalla modalità modifica
    aggiungiNotifica({
      tipo: 'success',
      titolo: 'Contratto aggiornato',
      messaggio: `Il contratto "${nome}" è stato aggiornato con successo.`
    });
    
    setInModifica(false);
  };

  const handleAggiungiPersona = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validaFormPersona()) return;
    
    // Qui dovremmo chiamare la funzione per aggiungere una persona
    // che sarà implementata nel contesto
    
    // Per ora, mostriamo solo una notifica e nascondiamo il form
    aggiungiNotifica({
      tipo: 'success',
      titolo: 'Persona aggiunta',
      messaggio: `${nuovaPersona.nome} ${nuovaPersona.cognome} è stato aggiunto al contratto.`
    });
    
    // Resetta il form
    setNuovaPersona({
      nome: '',
      cognome: '',
      email: '',
      telefono: '',
      consensoICF: false
    });
    
    setMostraFormPersona(false);
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

  const percentualeCompletamento = Math.round((contratto.incontriCompletati / contratto.incontriTotali) * 100);

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{contratto.nome}</h1>
          <p className="text-muted-foreground">
            {cliente.tipo === 'azienda' ? 'Contratto aziendale' : 'Contratto individuale'} con {cliente.nome}
          </p>
        </div>
        <div className="flex gap-2">
          {!inModifica && (
            <Button onClick={() => setInModifica(true)}>
              <FiEdit className="mr-2 h-4 w-4" />
              Modifica
            </Button>
          )}
          <Button variant="outline" onClick={() => router.push('/contratti')}>
            <FiX className="mr-2 h-4 w-4" />
            Torna ai contratti
          </Button>
        </div>
      </div>

      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'dettagli' ? 'border-b-2 border-primary' : ''}`}
          onClick={() => setActiveTab('dettagli')}
        >
          Dettagli contratto
        </button>
        {cliente.tipo === 'azienda' && (
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'persone' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('persone')}
          >
            Persone ({personeDelContratto.length})
          </button>
        )}
      </div>

      {activeTab === 'dettagli' && (
        <>
          {inModifica ? (
            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Cliente</label>
                      <div className="p-2 bg-muted rounded flex items-center">
                        {cliente.tipo === 'azienda' ? (
                          <FiUsers className="mr-2 h-4 w-4" />
                        ) : (
                          <FiUser className="mr-2 h-4 w-4" />
                        )}
                        {cliente.nome}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Il cliente non può essere modificato</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Nome contratto *</label>
                      <Input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className={errori.nome ? 'border-red-500' : ''}
                      />
                      {errori.nome && <p className="text-red-500 text-sm mt-1">{errori.nome}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo di contratto *</label>
                      <Input
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        className={errori.tipo ? 'border-red-500' : ''}
                      />
                      {errori.tipo && <p className="text-red-500 text-sm mt-1">{errori.tipo}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Importo (€) *</label>
                      <Input
                        type="number"
                        value={importo}
                        onChange={(e) => setImporto(parseFloat(e.target.value) || 0)}
                        className={errori.importo ? 'border-red-500' : ''}
                      />
                      {errori.importo && <p className="text-red-500 text-sm mt-1">{errori.importo}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Stato</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={stato}
                        onChange={(e) => setStato(e.target.value as 'attivo' | 'completato' | 'archiviato')}
                      >
                        <option value="attivo">Attivo</option>
                        <option value="completato">Completato</option>
                        <option value="archiviato">Archiviato</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Dati di fatturazione *</label>
                      <textarea
                        value={datiFatturazione}
                        onChange={(e) => setDatiFatturazione(e.target.value)}
                        className={`w-full p-2 border rounded-md ${errori.datiFatturazione ? 'border-red-500' : 'border-gray-300'}`}
                        rows={3}
                      />
                      {errori.datiFatturazione && <p className="text-red-500 text-sm mt-1">{errori.datiFatturazione}</p>}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Numero totale di incontri *</label>
                      <Input
                        type="number"
                        value={incontriTotali}
                        onChange={(e) => setIncontriTotali(parseInt(e.target.value) || 0)}
                        className={errori.incontriTotali ? 'border-red-500' : ''}
                      />
                      {errori.incontriTotali && <p className="text-red-500 text-sm mt-1">{errori.incontriTotali}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Giorni minimi tra incontri *</label>
                      <Input
                        type="number"
                        value={giornoMinimo}
                        onChange={(e) => setGiornoMinimo(parseInt(e.target.value) || 0)}
                        className={errori.giornoMinimo ? 'border-red-500' : ''}
                      />
                      {errori.giornoMinimo && <p className="text-red-500 text-sm mt-1">{errori.giornoMinimo}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Durata incontro (minuti) *</label>
                      <Input
                        type="number"
                        value={durataMinuti}
                        onChange={(e) => setDurataMinuti(parseInt(e.target.value) || 0)}
                        className={errori.durataMinuti ? 'border-red-500' : ''}
                      />
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
                
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setInModifica(false)}
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h2 className="text-xl font-semibold mb-4">Informazioni generali</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="font-medium flex items-center">
                      {cliente.tipo === 'azienda' ? (
                        <FiUsers className="mr-2 h-4 w-4" />
                      ) : (
                        <FiUser className="mr-2 h-4 w-4" />
                      )}
                      {cliente.nome}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo di contratto</p>
                    <p className="font-medium">{contratto.tipo}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Stato</p>
                    <Badge 
                      text={
                        contratto.stato === 'attivo' ? 'Attivo' : 
                        contratto.stato === 'completato' ? 'Completato' : 'Archiviato'
                      } 
                      variant={
                        contratto.stato === 'attivo' ? 'success' : 
                        contratto.stato === 'completato' ? 'primary' : 'default'
                      } 
                    />
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Importo</p>
                    <p className="font-medium">€ {contratto.importo.toLocaleString('it-IT')}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Dati di fatturazione</p>
                    <p>{contratto.datiFatturazione}</p>
                  </div>
                </div>
              </Card>
              
              <Card>
                <h2 className="text-xl font-semibold mb-4">Dettagli incontri</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Progresso</p>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{contratto.incontriCompletati}/{contratto.incontriTotali} incontri</span>
                      <span>{percentualeCompletamento}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${percentualeCompletamento}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Giorni minimi tra incontri</p>
                    <p className="font-medium flex items-center">
                      <FiCalendar className="mr-2 h-4 w-4" />
                      {contratto.giornoMinimo} giorni
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Durata incontro</p>
                    <p className="font-medium flex items-center">
                      <FiClock className="mr-2 h-4 w-4" />
                      {contratto.durataMinuti} minuti
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Opzioni aggiuntive</p>
                    <ul className="list-disc list-inside">
                      {contratto.reportFinale && <li>Report finale</li>}
                      {contratto.quadripartitoIniziale && <li>Quadripartito iniziale</li>}
                      {contratto.quadripartitoIntermedio && <li>Quadripartito intermedio</li>}
                      {contratto.quadripartitoFinale && <li>Quadripartito finale</li>}
                      {!contratto.reportFinale && !contratto.quadripartitoIniziale && 
                       !contratto.quadripartitoIntermedio && !contratto.quadripartitoFinale && 
                       <li>Nessuna opzione aggiuntiva</li>}
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </>
      )}

      {activeTab === 'persone' && cliente.tipo === 'azienda' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Persone coinvolte nel contratto</h2>
            <Button onClick={() => setMostraFormPersona(true)}>
              <FiPlus className="mr-2 h-4 w-4" />
              Aggiungi persona
            </Button>
          </div>

          {mostraFormPersona && (
            <Card className="mb-6">
              <h3 className="text-lg font-medium mb-4">Nuova persona</h3>
              <form onSubmit={handleAggiungiPersona} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome *</label>
                    <Input
                      value={nuovaPersona.nome}
                      onChange={(e) => setNuovaPersona({...nuovaPersona, nome: e.target.value})}
                      className={erroriPersona.nome ? 'border-red-500' : ''}
                    />
                    {erroriPersona.nome && <p className="text-red-500 text-sm mt-1">{erroriPersona.nome}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Cognome *</label>
                    <Input
                      value={nuovaPersona.cognome}
                      onChange={(e) => setNuovaPersona({...nuovaPersona, cognome: e.target.value})}
                      className={erroriPersona.cognome ? 'border-red-500' : ''}
                    />
                    {erroriPersona.cognome && <p className="text-red-500 text-sm mt-1">{erroriPersona.cognome}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <Input
                      type="email"
                      value={nuovaPersona.email}
                      onChange={(e) => setNuovaPersona({...nuovaPersona, email: e.target.value})}
                      className={erroriPersona.email ? 'border-red-500' : ''}
                    />
                    {erroriPersona.email && <p className="text-red-500 text-sm mt-1">{erroriPersona.email}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Telefono *</label>
                    <Input
                      value={nuovaPersona.telefono}
                      onChange={(e) => setNuovaPersona({...nuovaPersona, telefono: e.target.value})}
                      className={erroriPersona.telefono ? 'border-red-500' : ''}
                    />
                    {erroriPersona.telefono && <p className="text-red-500 text-sm mt-1">{erroriPersona.telefono}</p>}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="consensoICF"
                    checked={nuovaPersona.consensoICF}
                    onChange={(e) => setNuovaPersona({...nuovaPersona, consensoICF: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="consensoICF" className="text-sm">Consenso all'utilizzo dei dati personali per la certificazione ICF</label>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMostraFormPersona(false)}
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
          )}

          {personeDelContratto.length === 0 ? (
            <div className="bg-muted p-6 rounded-lg text-center">
              <p className="text-muted-foreground">Nessuna persona aggiunta a questo contratto</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setMostraFormPersona(true)}
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Aggiungi la prima persona
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {personeDelContratto.map(persona => (
                <div 
                  key={persona.id} 
                  className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                      <FiUser className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{persona.nome} {persona.cognome}</h4>
                      <p className="text-sm text-muted-foreground">{cliente.nome}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="w-20 text-muted-foreground">Email:</span>
                      <span>{persona.email}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-20 text-muted-foreground">Telefono:</span>
                      <span>{persona.telefono}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-20 text-muted-foreground">Consenso ICF:</span>
                      <span>{persona.consensoICF ? 'Sì' : 'No'}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="ghost" size="sm">
                      <FiEdit className="mr-2 h-4 w-4" />
                      Modifica
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
}
