'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Definizione dei tipi
export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefono: string;
  tipo: 'individuale' | 'azienda';
  attivo: boolean;
}

export interface PersonaAzienda {
  id: number;
  contrattoId: number;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  consensoICF: boolean;
  attivo: boolean;
}

export interface Contratto {
  id: number;
  nome: string;
  tipo: string;
  clienteId: number;
  incontriTotali: number;
  incontriCompletati: number;
  stato: 'attivo' | 'completato' | 'archiviato';
  giornoMinimo: number; // Frequenza: giorni minimi tra incontri
  durataMinuti: number; // Durata singola intervista in minuti
  importo: number;
  reportFinale: boolean;
  quadripartitoIniziale: boolean;
  quadripartitoIntermedio: boolean;
  quadripartitoFinale: boolean;
  datiFatturazione: string;
  attivo: boolean;
}

export interface Incontro {
  id: number;
  contrattoId: number;
  clienteId: number;
  personaId?: number; // ID della persona dell'azienda, se applicabile
  nomeCliente: string;
  data: Date;
  oraInizio: string;
  oraFine: string;
  stato: 'pianificato' | 'completato' | 'annullato';
}

export interface Notifica {
  id: number;
  tipo: 'info' | 'success' | 'warning' | 'error';
  titolo: string;
  messaggio: string;
  data: string;
  letta: boolean;
}

export interface Profilo {
  nome: string;
  email: string;
  telefono: string;
  maxGiornaliero: number;
  maxSettimanale: number;
  maxMensile: number;
  notificheEmail: boolean;
  notificheApp: boolean;
}

interface AppState {
  clienti: Cliente[];
  contratti: Contratto[];
  personeAzienda: PersonaAzienda[];
  incontri: Incontro[];
  notifiche: Notifica[];
  profilo: Profilo;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registraIncontroCompletato: (incontroId: number) => void;
  aggiungiNotifica: (notifica: Omit<Notifica, 'id' | 'data' | 'letta'>) => void;
  segnaNotificaComeLetta: (notificaId: number) => void;
  eliminaNotifica: (notificaId: number) => void;
  segnaNotificheComeLette: () => void;
  aggiornaProfiloUtente: (profilo: Partial<Profilo>) => void;
  // Funzioni per la gestione dei clienti
  aggiungiCliente: (cliente: Omit<Cliente, 'id'>) => number;
  modificaCliente: (id: number, cliente: Partial<Cliente>) => void;
  eliminaCliente: (id: number) => void;
  getClienteById: (id: number) => Cliente | undefined;
  // Funzioni per la gestione dei contratti
  aggiungiContratto: (contratto: Omit<Contratto, 'id' | 'incontriCompletati' | 'attivo'>) => number;
  modificaContratto: (id: number, contratto: Partial<Contratto>) => void;
  eliminaContratto: (id: number) => void;
  getContrattoById: (id: number) => Contratto | undefined;
  // Funzioni per la gestione delle persone azienda
  aggiungiPersonaAzienda: (persona: Omit<PersonaAzienda, 'id' | 'attivo'>) => number;
  modificaPersonaAzienda: (id: number, persona: Partial<PersonaAzienda>) => void;
  eliminaPersonaAzienda: (id: number) => void;
  getPersoneByContrattoId: (contrattoId: number) => PersonaAzienda[];
  getPersonaById: (id: number) => PersonaAzienda | undefined;
}

// Dati iniziali
const clientiIniziali: Cliente[] = [
  { id: 1, nome: 'Azienda ABC', email: 'info@aziendaabc.com', telefono: '+39 123 456 7890', tipo: 'azienda', attivo: true },
  { id: 2, nome: 'Azienda XYZ', email: 'contatti@xyz.it', telefono: '+39 234 567 8901', tipo: 'azienda', attivo: true },
  { id: 3, nome: 'Azienda DEF', email: 'info@def.com', telefono: '+39 345 678 9012', tipo: 'azienda', attivo: true },
  { id: 4, nome: 'Marco Rossi', email: 'marco.rossi@email.com', telefono: '+39 123 456 7890', tipo: 'individuale', attivo: true },
  { id: 5, nome: 'Laura Bianchi', email: 'laura.b@email.com', telefono: '+39 234 567 8901', tipo: 'individuale', attivo: true },
  { id: 6, nome: 'Giovanni Verdi', email: 'g.verdi@email.com', telefono: '+39 345 678 9012', tipo: 'individuale', attivo: true },
  { id: 7, nome: 'Paolo Neri', email: 'paolo.neri@email.com', telefono: '+39 456 789 0123', tipo: 'individuale', attivo: true },
];

const personeAziendaIniziali: PersonaAzienda[] = [
  { id: 1, contrattoId: 1, nome: 'Marco', cognome: 'Rossi', email: 'marco.rossi@aziendaabc.com', telefono: '+39 123 456 7891', consensoICF: true, attivo: true },
  { id: 2, contrattoId: 1, nome: 'Anna', cognome: 'Bianchi', email: 'anna.bianchi@aziendaabc.com', telefono: '+39 123 456 7892', consensoICF: true, attivo: true },
  { id: 3, contrattoId: 1, nome: 'Luigi', cognome: 'Verdi', email: 'luigi.verdi@aziendaabc.com', telefono: '+39 123 456 7893', consensoICF: false, attivo: true },
  { id: 4, contrattoId: 1, nome: 'Giulia', cognome: 'Neri', email: 'giulia.neri@aziendaabc.com', telefono: '+39 123 456 7894', consensoICF: true, attivo: true },
  { id: 5, contrattoId: 1, nome: 'Roberto', cognome: 'Gialli', email: 'roberto.gialli@aziendaabc.com', telefono: '+39 123 456 7895', consensoICF: true, attivo: true },
  { id: 6, contrattoId: 2, nome: 'Laura', cognome: 'Bianchi', email: 'laura.bianchi@xyz.it', telefono: '+39 234 567 8902', consensoICF: true, attivo: true },
  { id: 7, contrattoId: 2, nome: 'Paolo', cognome: 'Rossi', email: 'paolo.rossi@xyz.it', telefono: '+39 234 567 8903', consensoICF: true, attivo: true },
  { id: 8, contrattoId: 2, nome: 'Chiara', cognome: 'Verdi', email: 'chiara.verdi@xyz.it', telefono: '+39 234 567 8904', consensoICF: false, attivo: true },
];

const contrattiIniziali: Contratto[] = [
  { 
    id: 1, 
    nome: 'Coaching Aziendale ABC', 
    tipo: 'Sessione di coaching', 
    clienteId: 1, 
    incontriTotali: 25, 
    incontriCompletati: 15, 
    stato: 'attivo', 
    giornoMinimo: 7, 
    durataMinuti: 60,
    importo: 5000,
    reportFinale: true,
    quadripartitoIniziale: true,
    quadripartitoIntermedio: false,
    quadripartitoFinale: true,
    datiFatturazione: 'Fattura mensile, pagamento a 30gg',
    attivo: true
  },
  { 
    id: 2, 
    nome: 'Coaching Aziendale XYZ', 
    tipo: 'Sessione di coaching', 
    clienteId: 2, 
    incontriTotali: 12, 
    incontriCompletati: 8, 
    stato: 'attivo', 
    giornoMinimo: 7, 
    durataMinuti: 45,
    importo: 3000,
    reportFinale: false,
    quadripartitoIniziale: true,
    quadripartitoIntermedio: false,
    quadripartitoFinale: false,
    datiFatturazione: 'Fattura unica, pagamento anticipato',
    attivo: true
  },
  { 
    id: 3, 
    nome: 'Coaching Individuale Marco', 
    tipo: 'Sessione di coaching', 
    clienteId: 4, 
    incontriTotali: 10, 
    incontriCompletati: 6, 
    stato: 'attivo', 
    giornoMinimo: 14, 
    durataMinuti: 60,
    importo: 1200,
    reportFinale: true,
    quadripartitoIniziale: false,
    quadripartitoIntermedio: false,
    quadripartitoFinale: true,
    datiFatturazione: 'Fattura per sessione',
    attivo: true
  },
  { 
    id: 4, 
    nome: 'Coaching Aziendale DEF', 
    tipo: 'Sessione di coaching', 
    clienteId: 3, 
    incontriTotali: 16, 
    incontriCompletati: 16, 
    stato: 'completato', 
    giornoMinimo: 7, 
    durataMinuti: 90,
    importo: 4000,
    reportFinale: true,
    quadripartitoIniziale: true,
    quadripartitoIntermedio: true,
    quadripartitoFinale: true,
    datiFatturazione: 'Fattura trimestrale',
    attivo: true
  },
  { 
    id: 5, 
    nome: 'Coaching Individuale Laura', 
    tipo: 'Sessione di coaching', 
    clienteId: 5, 
    incontriTotali: 5, 
    incontriCompletati: 5, 
    stato: 'completato', 
    giornoMinimo: 14, 
    durataMinuti: 45,
    importo: 600,
    reportFinale: false,
    quadripartitoIniziale: false,
    quadripartitoIntermedio: false,
    quadripartitoFinale: false,
    datiFatturazione: 'Pagamento anticipato',
    attivo: true
  },
];

// Funzione per generare date future
const generaDataFutura = (giorniAvanti: number) => {
  const data = new Date();
  data.setDate(data.getDate() + giorniAvanti);
  return data;
};

const incontriIniziali: Incontro[] = [
  { id: 1, contrattoId: 1, clienteId: 1, personaId: 1, nomeCliente: 'Marco Rossi - Azienda ABC', data: generaDataFutura(0), oraInizio: '10:00', oraFine: '11:00', stato: 'pianificato' },
  { id: 2, contrattoId: 2, clienteId: 2, personaId: 6, nomeCliente: 'Laura Bianchi - Azienda XYZ', data: generaDataFutura(0), oraInizio: '14:30', oraFine: '15:30', stato: 'pianificato' },
  { id: 3, contrattoId: 3, clienteId: 6, nomeCliente: 'Giovanni Verdi - Individuale', data: generaDataFutura(0), oraInizio: '17:00', oraFine: '18:00', stato: 'pianificato' },
  { id: 4, contrattoId: 1, clienteId: 1, personaId: 2, nomeCliente: 'Anna Bianchi - Azienda ABC', data: generaDataFutura(1), oraInizio: '11:00', oraFine: '12:00', stato: 'pianificato' },
  { id: 5, contrattoId: 2, clienteId: 2, personaId: 7, nomeCliente: 'Paolo Rossi - Azienda XYZ', data: generaDataFutura(2), oraInizio: '14:30', oraFine: '15:30', stato: 'pianificato' },
  { id: 6, contrattoId: 3, clienteId: 6, nomeCliente: 'Giovanni Verdi - Individuale', data: generaDataFutura(3), oraInizio: '17:00', oraFine: '18:00', stato: 'pianificato' },
];

const notificheIniziali: Notifica[] = [
  { id: 1, tipo: 'warning', titolo: 'Limite di capacità quasi raggiunto', messaggio: 'Hai raggiunto il 75% della tua capacità settimanale.', data: 'Oggi', letta: false },
  { id: 2, tipo: 'info', titolo: 'Nuovo incontro pianificato', messaggio: 'Sessione di coaching con Paolo Neri programmata per domani alle 11:00.', data: 'Ieri', letta: false },
  { id: 3, tipo: 'success', titolo: 'Incontro completato', messaggio: 'Hai completato con successo la sessione di coaching con Marco Rossi.', data: '2 giorni fa', letta: true },
  { id: 4, tipo: 'info', titolo: 'Promemoria incontro', messaggio: 'Hai un incontro con Laura Bianchi tra 2 ore.', data: '3 giorni fa', letta: true },
  { id: 5, tipo: 'warning', titolo: 'Ripianificazione necessaria', messaggio: 'È necessario ripianificare gli incontri con Giovanni Verdi a causa di un conflitto.', data: '1 settimana fa', letta: true },
];

const profiloIniziale: Profilo = {
  nome: 'Mario Bianchi',
  email: 'mario.bianchi@email.com',
  telefono: '+39 123 456 7890',
  maxGiornaliero: 5,
  maxSettimanale: 20,
  maxMensile: 60,
  notificheEmail: true,
  notificheApp: true,
};

// Creazione del contesto
const AppContext = createContext<AppState | undefined>(undefined);

// Provider del contesto
export function AppProvider({ children }: { children: ReactNode }) {
  const [clienti, setClienti] = useState<Cliente[]>(clientiIniziali);
  const [contratti, setContratti] = useState<Contratto[]>(contrattiIniziali);
  const [personeAzienda, setPersoneAzienda] = useState<PersonaAzienda[]>(personeAziendaIniziali);
  const [incontri, setIncontri] = useState<Incontro[]>(incontriIniziali);
  const [notifiche, setNotifiche] = useState<Notifica[]>(notificheIniziali);
  const [profilo, setProfilo] = useState<Profilo>(profiloIniziale);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Effetto per simulare l'autenticazione persistente
  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Funzione di login
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulazione di autenticazione
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsAuthenticated(true);
        localStorage.setItem('auth', 'true');
        resolve(true);
      }, 1000);
    });
  };

  // Funzione di logout
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('auth');
  };

  // Funzione per registrare un incontro completato
  const registraIncontroCompletato = (incontroId: number) => {
    setIncontri(incontri.map(incontro => 
      incontro.id === incontroId ? { ...incontro, stato: 'completato' } : incontro
    ));

    // Aggiorna il conteggio degli incontri completati nel contratto
    const incontroCompletato = incontri.find(i => i.id === incontroId);
    if (incontroCompletato) {
      setContratti(contratti.map(contratto => 
        contratto.id === incontroCompletato.contrattoId 
          ? { ...contratto, incontriCompletati: contratto.incontriCompletati + 1 } 
          : contratto
      ));

      // Aggiungi una notifica di successo
      aggiungiNotifica({
        tipo: 'success',
        titolo: 'Incontro completato',
        messaggio: `Hai completato con successo la sessione di coaching con ${incontroCompletato.nomeCliente}.`
      });
    }
  };

  // Funzione per aggiungere una notifica
  const aggiungiNotifica = (notifica: Omit<Notifica, 'id' | 'data' | 'letta'>) => {
    const nuovaNotifica: Notifica = {
      id: notifiche.length > 0 ? Math.max(...notifiche.map(n => n.id)) + 1 : 1,
      ...notifica,
      data: 'Adesso',
      letta: false
    };
    setNotifiche([nuovaNotifica, ...notifiche]);
  };

  // Funzione per segnare una notifica come letta
  const segnaNotificaComeLetta = (notificaId: number) => {
    setNotifiche(notifiche.map(notifica => 
      notifica.id === notificaId ? { ...notifica, letta: true } : notifica
    ));
  };

  // Funzione per eliminare una notifica
  const eliminaNotifica = (notificaId: number) => {
    setNotifiche(notifiche.filter(notifica => notifica.id !== notificaId));
  };

  // Funzione per segnare tutte le notifiche come lette
  const segnaNotificheComeLette = () => {
    setNotifiche(notifiche.map(notifica => ({ ...notifica, letta: true })));
  };

  // Funzione per aggiornare il profilo utente
  const aggiornaProfiloUtente = (nuovoProfilo: Partial<Profilo>) => {
    setProfilo({ ...profilo, ...nuovoProfilo });
  };

  // Funzione per aggiungere un nuovo cliente
  const aggiungiCliente = (cliente: Omit<Cliente, 'id'>) => {
    const nuovoId = clienti.length > 0 ? Math.max(...clienti.map(c => c.id)) + 1 : 1;
    const nuovoCliente: Cliente = {
      id: nuovoId,
      ...cliente
    };
    setClienti([...clienti, nuovoCliente]);
    
    // Aggiungi una notifica
    aggiungiNotifica({
      tipo: 'success',
      titolo: 'Nuovo cliente aggiunto',
      messaggio: `Il cliente ${cliente.nome} è stato aggiunto con successo.`
    });
    
    return nuovoId;
  };

  // Funzione per modificare un cliente esistente
  const modificaCliente = (id: number, cliente: Partial<Cliente>) => {
    setClienti(clienti.map(c => 
      c.id === id ? { ...c, ...cliente } : c
    ));
    
    // Aggiungi una notifica
    aggiungiNotifica({
      tipo: 'info',
      titolo: 'Cliente aggiornato',
      messaggio: `Le informazioni del cliente sono state aggiornate con successo.`
    });
  };

  // Funzione per eliminare logicamente un cliente
  const eliminaCliente = (id: number) => {
    // Cancellazione logica (imposta attivo a false)
    setClienti(clienti.map(c => 
      c.id === id ? { ...c, attivo: false } : c
    ));
    
    // Aggiungi una notifica
    const cliente = clienti.find(c => c.id === id);
    if (cliente) {
      aggiungiNotifica({
        tipo: 'warning',
        titolo: 'Cliente disattivato',
        messaggio: `Il cliente ${cliente.nome} è stato disattivato.`
      });
    }
  };

  // Funzione per ottenere un cliente tramite ID
  const getClienteById = (id: number) => {
    return clienti.find(c => c.id === id);
  };

  // Funzione per aggiungere un nuovo contratto
  const aggiungiContratto = (contratto: Omit<Contratto, 'id' | 'incontriCompletati' | 'attivo'>) => {
    const nuovoId = contratti.length > 0 ? Math.max(...contratti.map(c => c.id)) + 1 : 1;
    const nuovoContratto: Contratto = {
      id: nuovoId,
      incontriCompletati: 0,
      attivo: true,
      ...contratto
    };
    setContratti([...contratti, nuovoContratto]);
    
    // Aggiungi una notifica
    aggiungiNotifica({
      tipo: 'success',
      titolo: 'Nuovo contratto creato',
      messaggio: `Il contratto "${contratto.nome}" è stato creato con successo.`
    });
    
    return nuovoId;
  };

  // Funzione per modificare un contratto esistente
  const modificaContratto = (id: number, contratto: Partial<Contratto>) => {
    setContratti(contratti.map(c => 
      c.id === id ? { ...c, ...contratto } : c
    ));
    
    // Aggiungi una notifica
    aggiungiNotifica({
      tipo: 'info',
      titolo: 'Contratto aggiornato',
      messaggio: `Le informazioni del contratto sono state aggiornate con successo.`
    });
  };

  // Funzione per eliminare logicamente un contratto
  const eliminaContratto = (id: number) => {
    // Cancellazione logica (imposta attivo a false)
    setContratti(contratti.map(c => 
      c.id === id ? { ...c, attivo: false } : c
    ));
    
    // Aggiungi una notifica
    const contratto = contratti.find(c => c.id === id);
    if (contratto) {
      aggiungiNotifica({
        tipo: 'warning',
        titolo: 'Contratto disattivato',
        messaggio: `Il contratto "${contratto.nome}" è stato disattivato.`
      });
    }
  };

  // Funzione per ottenere un contratto tramite ID
  const getContrattoById = (id: number) => {
    return contratti.find(c => c.id === id);
  };

  // Funzione per aggiungere una nuova persona azienda
  const aggiungiPersonaAzienda = (persona: Omit<PersonaAzienda, 'id' | 'attivo'>) => {
    const nuovoId = personeAzienda.length > 0 ? Math.max(...personeAzienda.map(p => p.id)) + 1 : 1;
    const nuovaPersona: PersonaAzienda = {
      id: nuovoId,
      attivo: true,
      ...persona
    };
    setPersoneAzienda([...personeAzienda, nuovaPersona]);
    
    // Aggiungi una notifica
    aggiungiNotifica({
      tipo: 'success',
      titolo: 'Nuova persona aggiunta',
      messaggio: `${persona.nome} ${persona.cognome} è stato aggiunto al contratto.`
    });
    
    return nuovoId;
  };

  // Funzione per modificare una persona azienda esistente
  const modificaPersonaAzienda = (id: number, persona: Partial<PersonaAzienda>) => {
    setPersoneAzienda(personeAzienda.map(p => 
      p.id === id ? { ...p, ...persona } : p
    ));
    
    // Aggiungi una notifica
    const personaModificata = personeAzienda.find(p => p.id === id);
    if (personaModificata) {
      aggiungiNotifica({
        tipo: 'info',
        titolo: 'Persona aggiornata',
        messaggio: `Le informazioni di ${personaModificata.nome} ${personaModificata.cognome} sono state aggiornate.`
      });
    }
  };

  // Funzione per eliminare logicamente una persona azienda
  const eliminaPersonaAzienda = (id: number) => {
    // Cancellazione logica (imposta attivo a false)
    setPersoneAzienda(personeAzienda.map(p => 
      p.id === id ? { ...p, attivo: false } : p
    ));
    
    // Aggiungi una notifica
    const persona = personeAzienda.find(p => p.id === id);
    if (persona) {
      aggiungiNotifica({
        tipo: 'warning',
        titolo: 'Persona rimossa',
        messaggio: `${persona.nome} ${persona.cognome} è stato rimosso dal contratto.`
      });
    }
  };

  // Funzione per ottenere le persone di un contratto
  const getPersoneByContrattoId = (contrattoId: number) => {
    return personeAzienda.filter(p => p.contrattoId === contrattoId && p.attivo);
  };

  // Funzione per ottenere una persona tramite ID
  const getPersonaById = (id: number) => {
    return personeAzienda.find(p => p.id === id);
  };

  return (
    <AppContext.Provider value={{
      clienti,
      contratti,
      personeAzienda,
      incontri,
      notifiche,
      profilo,
      isAuthenticated,
      login,
      logout,
      registraIncontroCompletato,
      aggiungiNotifica,
      segnaNotificaComeLetta,
      eliminaNotifica,
      segnaNotificheComeLette,
      aggiornaProfiloUtente,
      aggiungiCliente,
      modificaCliente,
      eliminaCliente,
      getClienteById,
      aggiungiContratto,
      modificaContratto,
      eliminaContratto,
      getContrattoById,
      aggiungiPersonaAzienda,
      modificaPersonaAzienda,
      eliminaPersonaAzienda,
      getPersoneByContrattoId,
      getPersonaById
    }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook per utilizzare il contesto
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext deve essere utilizzato all\'interno di un AppProvider');
  }
  return context;
}
