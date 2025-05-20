import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const testResults: { [key: string]: any } = {};

    // Test Info
    testResults.info = {
      getInfo: await db.main.getInfo(),
    };

    // Test professionisti
    const professionista = {
      nome: "Test",
      cognome: "User",
      email: `test${Date.now()}@test.com`,
      password_hash: "hash123",
      telefono: "1234567890",
    };

    testResults.professionisti = {
      create: await db.professionisti.create(professionista),
      getAll: await db.professionisti.getAll(),
      getById: await db.professionisti.getById(1),
      update: await db.professionisti.update(1, {
        ...professionista,
        email: `upd_test${Date.now()}@test.com`,
        nome: "Updated",
        max_giornaliero: 8,
        max_settimanale: 40,
        max_mensile: 160,
      }),
    };

    // Test clienti
    const cliente = {
      nome: `Cliente Test ${Date.now()}`,
      email: "cliente@test.com",
      telefono: "0987654321",
      tipo: "individuale",
      professionista_id: 1,
    };

    testResults.clienti = {
      create: await db.clienti.create(cliente),
      getAll: await db.clienti.getAll(),
      getById: await db.clienti.getById(1),
      update: await db.clienti.update(1, {
        ...cliente,
        nome: "Cliente Aggiornato",
      }),
    };

    // Test contratti
    const contratto = {
      nome: "Contratto Test",
      tipo: "coaching",
      cliente_id: 1,
      incontri_totali: 10,
      giorno_minimo: 1,
      durata_minuti: 60,
    };

    testResults.contratti = {
      create: await db.contratti.create(contratto),
      getAll: await db.contratti.getAll(),
      getByClienteId: await db.contratti.getByClienteId(1),
      update: await db.contratti.update(1, {
        ...contratto,
        stato: "attivo",
        importo: 1000,
        report_finale: 1,
        quadripartito_iniziale: 0,
        quadripartito_intermedio: 0,
        quadripartito_finale: 0,
        dati_fatturazione: 0,
        attivo: 1,
      }),
    };

    // Test incontri
    const incontro = {
      contratto_id: 1,
      cliente_id: 1,
      persona_id: null,
      data: "2024-03-20",
      ora_inizio: "10:00",
      ora_fine: "11:00",
    };

    testResults.incontri = {
      create: await db.incontri.create(incontro),
      getAll: await db.incontri.getAll(),
      getByContrattoId: await db.incontri.getByContrattoId(1),
      update: await db.incontri.update(1, {
        ...incontro,
        stato: "completato",
        note: "Test completato",
      }),
    };

    // Test persone azienda
    const persona = {
      contratto_id: 1,
      nome: "Persona",
      cognome: "Test",
      email: "persona@test.com",
      telefono: "1230987654",
    };

    testResults.personeAzienda = {
      create: await db.personeAzienda.create(persona),
      getByContrattoId: await db.personeAzienda.getByContrattoId(1),
      update: await db.personeAzienda.update(1, {
        ...persona,
        consenso_icf: 1,
        attivo: 1,
      }),
    };

    // Test notifiche
    const notifica = {
      professionista_id: 1,
      tipo: "info",
      titolo: "Test Notifica",
      messaggio: "Messaggio di test",
    };

    testResults.notifiche = {
      create: await db.notifiche.create(notifica),
      getByProfessionista: await db.notifiche.getByProfessionista(1),
    };

    return NextResponse.json(testResults);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
