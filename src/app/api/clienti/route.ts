
import { NextResponse } from 'next/server';

// Per ora utilizziamo i dati dal context invece di SQLite
const clientiIniziali = [
  { id: 1, nome: 'Azienda ABC', email: 'info@aziendaabc.com', telefono: '+39 123 456 7890', tipo: 'azienda', attivo: true },
  { id: 2, nome: 'Azienda XYZ', email: 'contatti@xyz.it', telefono: '+39 234 567 8901', tipo: 'azienda', attivo: true },
  { id: 3, nome: 'Azienda DEF', email: 'info@def.com', telefono: '+39 345 678 9012', tipo: 'azienda', attivo: true },
  { id: 4, nome: 'Marco Rossi', email: 'marco.rossi@email.com', telefono: '+39 123 456 7890', tipo: 'individuale', attivo: true },
  { id: 5, nome: 'Laura Bianchi', email: 'laura.b@email.com', telefono: '+39 234 567 8901', tipo: 'individuale', attivo: true }
];

export async function GET() {
  try {
    return NextResponse.json(clientiIniziali);
  } catch (error) {
    console.error('Errore nel recupero dei clienti:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero dei clienti' },
      { status: 500 }
    );
  }
}
