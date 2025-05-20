
-- Schema del database per l'applicazione di gestione tempo lavorativo

-- Tabella professionisti
CREATE TABLE IF NOT EXISTS professionisti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cognome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    telefono TEXT,
    max_giornaliero INTEGER DEFAULT 5,
    max_settimanale INTEGER DEFAULT 20,
    max_mensile INTEGER DEFAULT 60,
    notifiche_email BOOLEAN DEFAULT true,
    notifiche_app BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella clienti
CREATE TABLE IF NOT EXISTS clienti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT,
    tipo TEXT CHECK(tipo IN ('individuale', 'azienda')) NOT NULL,
    attivo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    professionista_id INTEGER,
    FOREIGN KEY (professionista_id) REFERENCES professionisti(id)
);

-- Tabella contratti
CREATE TABLE IF NOT EXISTS contratti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL,
    cliente_id INTEGER NOT NULL,
    incontri_totali INTEGER NOT NULL,
    incontri_completati INTEGER DEFAULT 0,
    stato TEXT CHECK(stato IN ('attivo', 'completato', 'archiviato')) DEFAULT 'attivo',
    giorno_minimo INTEGER NOT NULL,
    durata_minuti INTEGER NOT NULL,
    importo DECIMAL(10,2),
    report_finale BOOLEAN DEFAULT false,
    quadripartito_iniziale BOOLEAN DEFAULT false,
    quadripartito_intermedio BOOLEAN DEFAULT false,
    quadripartito_finale BOOLEAN DEFAULT false,
    dati_fatturazione TEXT,
    attivo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clienti(id)
);

-- Tabella persone azienda
CREATE TABLE IF NOT EXISTS persone_azienda (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contratto_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    cognome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT,
    consenso_icf BOOLEAN DEFAULT false,
    attivo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contratto_id) REFERENCES contratti(id)
);

-- Tabella incontri
CREATE TABLE IF NOT EXISTS incontri (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contratto_id INTEGER NOT NULL,
    cliente_id INTEGER NOT NULL,
    persona_id INTEGER,
    data DATE NOT NULL,
    ora_inizio TIME NOT NULL,
    ora_fine TIME NOT NULL,
    stato TEXT CHECK(stato IN ('pianificato', 'completato', 'annullato')) DEFAULT 'pianificato',
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contratto_id) REFERENCES contratti(id),
    FOREIGN KEY (cliente_id) REFERENCES clienti(id),
    FOREIGN KEY (persona_id) REFERENCES persone_azienda(id)
);

-- Tabella notifiche
CREATE TABLE IF NOT EXISTS notifiche (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    professionista_id INTEGER NOT NULL,
    tipo TEXT CHECK(tipo IN ('info', 'success', 'warning', 'error')) NOT NULL,
    titolo TEXT NOT NULL,
    messaggio TEXT NOT NULL,
    letta BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (professionista_id) REFERENCES professionisti(id)
);

-- Indici per migliorare le performance
CREATE INDEX idx_clienti_professionista ON clienti(professionista_id);
CREATE INDEX idx_contratti_cliente ON contratti(cliente_id);
CREATE INDEX idx_persone_contratto ON persone_azienda(contratto_id);
CREATE INDEX idx_incontri_contratto ON incontri(contratto_id);
CREATE INDEX idx_incontri_cliente ON incontri(cliente_id);
CREATE INDEX idx_notifiche_professionista ON notifiche(professionista_id);
