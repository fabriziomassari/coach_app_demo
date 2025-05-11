# Struttura PWA - App Gestione Tempo per Coach

## Panoramica
Questa PWA è progettata per aiutare i coach a gestire il loro tempo lavorativo, i contratti con i clienti e la pianificazione degli incontri di coaching.

## Pagine Principali

### 1. Autenticazione
- Login
- Registrazione
- Recupero password

### 2. Dashboard
- Riepilogo impegni giornalieri/settimanali
- Notifiche
- Accesso rapido a contratti attivi
- Statistiche di utilizzo del tempo

### 3. Gestione Profilo
- Informazioni personali
- Impostazioni di capacità (limiti giornalieri/settimanali/mensili)
- Preferenze di notifica

### 4. Gestione Contratti
- Elenco contratti attivi/archiviati
- Creazione nuovo contratto
- Dettaglio contratto
  - Informazioni generali
  - Elenco persone associate
  - Stato avanzamento incontri

### 5. Gestione Clienti
- Elenco clienti (persone singole)
- Elenco aziende
- Dettaglio cliente/azienda
  - Informazioni di contatto
  - Contratti associati
  - Storico incontri

### 6. Agenda
- Vista mensile
- Vista settimanale
- Vista annuale
- Filtri per contratto/cliente
- Indicatori di impegno e tempo libero

### 7. Pianificazione Incontri
- Visualizzazione incontri pianificati
- Registrazione incontri completati
- Ripianificazione automatica

### 8. Notifiche
- Centro notifiche
- Avvisi di superamento limiti
- Promemoria incontri

## Componenti UI

### Componenti Comuni
- Barra di navigazione
- Menu laterale
- Footer
- Modali di conferma
- Toast per notifiche

### Componenti Specifici
- Card contratto
- Card cliente/azienda
- Calendario interattivo
- Indicatori di capacità
- Form di creazione/modifica contratto
- Form di registrazione incontro
- Grafici di utilizzo del tempo

## Flussi di Navigazione

### Flusso Principale
1. Login/Registrazione
2. Dashboard
3. Navigazione alle varie sezioni

### Flusso Creazione Contratto
1. Accesso alla sezione Contratti
2. Creazione nuovo contratto
3. Selezione cliente/azienda o creazione nuovo
4. Definizione parametri contratto
5. Conferma e visualizzazione pianificazione automatica

### Flusso Gestione Incontri
1. Accesso all'Agenda
2. Visualizzazione incontri pianificati
3. Registrazione incontro completato
4. Visualizzazione aggiornata della pianificazione

## Funzionalità PWA
- Installazione su dispositivi
- Funzionamento offline per visualizzazione dati
- Sincronizzazione quando online
- Notifiche push
