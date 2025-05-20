import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data.db");
const schemaPath = path.join(process.cwd(), "src", "lib", "schema.sql");

// Inizializza il database
export function initializeDatabase() {
    const db = new Database(dbPath);

    // Leggi e esegui lo schema SQL se il database è nuovo
    if (!fs.existsSync(dbPath) || fs.statSync(dbPath).size == 0) {        
        const schema = fs.readFileSync(schemaPath, "utf8");
        db.exec(schema);
    }

    return db;
}

// Singleton per la connessione al database
let dbInstance: Database.Database | null = null;

export function getDb() {
    if (!dbInstance) {
        dbInstance = initializeDatabase();
    }
    return dbInstance;
}

// Funzioni helper per le operazioni comuni
export const db = {
    main: {
        getInfo: () => schemaPath,
    },
    professionisti: {
        getAll: () => getDb().prepare("SELECT * FROM professionisti").all(),
        getById: (id: number) =>
            getDb()
                .prepare("SELECT * FROM professionisti WHERE id = ?")
                .get(id),
        create: (data: any) =>
            getDb()
                .prepare(
                    `
            INSERT INTO professionisti (nome, cognome, email, password_hash, telefono)
            VALUES (@nome, @cognome, @email, @password_hash, @telefono)
        `,
                )
                .run(data),
        update: (id: number, data: any) =>
            getDb()
                .prepare(
                    `
            UPDATE professionisti SET 
            nome = @nome, cognome = @cognome, email = @email, 
            telefono = @telefono, max_giornaliero = @max_giornaliero,
            max_settimanale = @max_settimanale, max_mensile = @max_mensile
            WHERE id = @id
        `,
                )
                .run({ ...data, id }),
    },
    clienti: {
        getAll: () => getDb().prepare("SELECT * FROM clienti").all(),
        getById: (id: number) =>
            getDb().prepare("SELECT * FROM clienti WHERE id = ?").get(id),
        create: (data: any) =>
            getDb()
                .prepare(
                    `
            INSERT INTO clienti (nome, email, telefono, tipo, professionista_id)
            VALUES (@nome, @email, @telefono, @tipo, @professionista_id)
        `,
                )
                .run(data),
        update: (id: number, data: any) =>
            getDb()
                .prepare(
                    `
            UPDATE clienti SET 
            nome = @nome, email = @email, telefono = @telefono,
            tipo = @tipo
            WHERE id = @id
        `,
                )
                .run({ ...data, id }),
    },
    contratti: {
        getAll: () => getDb().prepare("SELECT * FROM contratti").all(),
        getByClienteId: (clienteId: number) =>
            getDb()
                .prepare("SELECT * FROM contratti WHERE cliente_id = ?")
                .all(clienteId),
        create: (data: any) =>
            getDb()
                .prepare(
                    `
            INSERT INTO contratti (nome, tipo, cliente_id, incontri_totali, giorno_minimo, durata_minuti)
            VALUES (@nome, @tipo, @cliente_id, @incontri_totali, @giorno_minimo, @durata_minuti)
        `,
                )
                .run(data),
        update: (id: number, data: any) =>
            getDb()
                .prepare(
                    `
            UPDATE contratti SET 
            nome = @nome, tipo = @tipo, incontri_totali = @incontri_totali,
            giorno_minimo = @giorno_minimo, durata_minuti = @durata_minuti,
            stato = @stato, importo = @importo, report_finale = @report_finale,
            quadripartito_iniziale = @quadripartito_iniziale,
            quadripartito_intermedio = @quadripartito_intermedio,
            quadripartito_finale = @quadripartito_finale,
            dati_fatturazione = @dati_fatturazione, attivo = @attivo
            WHERE id = @id
        `,
                )
                .run({ ...data, id }),
    },
    incontri: {
        getAll: () => getDb().prepare("SELECT * FROM incontri").all(),
        getByContrattoId: (contrattoId: number) =>
            getDb()
                .prepare("SELECT * FROM incontri WHERE contratto_id = ?")
                .all(contrattoId),
        create: (data: any) =>
            getDb()
                .prepare(
                    `
            INSERT INTO incontri (contratto_id, cliente_id, persona_id, data, ora_inizio, ora_fine)
            VALUES (@contratto_id, @cliente_id, @persona_id, @data, @ora_inizio, @ora_fine)
        `,
                )
                .run(data),
        update: (id: number, data: any) =>
            getDb()
                .prepare(
                    `
            UPDATE incontri SET 
            data = @data, ora_inizio = @ora_inizio, ora_fine = @ora_fine,
            stato = @stato, note = @note
            WHERE id = @id
        `,
                )
                .run({ ...data, id }),
    },
    personeAzienda: {
        getByContrattoId: (contrattoId: number) =>
            getDb()
                .prepare("SELECT * FROM persone_azienda WHERE contratto_id = ?")
                .all(contrattoId),
        create: (data: any) =>
            getDb()
                .prepare(
                    `
            INSERT INTO persone_azienda (contratto_id, nome, cognome, email, telefono)
            VALUES (@contratto_id, @nome, @cognome, @email, @telefono)
        `,
                )
                .run(data),
        update: (id: number, data: any) =>
            getDb()
                .prepare(
                    `
            UPDATE persone_azienda SET 
            nome = @nome, cognome = @cognome, email = @email,
            telefono = @telefono, consenso_icf = @consenso_icf, attivo = @attivo
            WHERE id = @id
        `,
                )
                .run({ ...data, id }),
    },
    notifiche: {
        getByProfessionista: (professionistaId: number) =>
            getDb()
                .prepare(
                    "SELECT * FROM notifiche WHERE professionista_id = ? ORDER BY created_at DESC",
                )
                .all(professionistaId),
        create: (data: any) =>
            getDb()
                .prepare(
                    `
            INSERT INTO notifiche (professionista_id, tipo, titolo, messaggio)
            VALUES (@professionista_id, @tipo, @titolo, @messaggio)
        `,
                )
                .run(data),
    },
};
