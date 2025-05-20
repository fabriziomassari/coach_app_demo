#   Documento di Specifiche Funzionali: App Gestione Tempo Lavorativo Professionisti

**1. Introduzione**

Il presente documento definisce le specifiche funzionali per una nuova applicazione dedicata alla gestione del tempo lavorativo di professionisti. L'obiettivo principale dell'app è consentire ai professionisti di organizzare efficacemente i propri impegni, evitando sovrapposizioni e garantendo una gestione ottimale dei contratti e degli incontri con i propri clienti. L'applicazione fornirà strumenti per la pianificazione, il monitoraggio e la verifica dell'impegno lavorativo nel tempo.

**2. Obiettivi**

* Fornire ai professionisti un ambiente di lavoro digitale personalizzato per la gestione del tempo.
* Permettere la gestione separata dei profili di ogni professionista registrato.
* Consentire la creazione e la gestione di contratti di lavoro con clienti esterni.
* Tracciare l'avanzamento degli incontri previsti all'interno di ciascun contratto.
* Fornire una visione chiara dell'impegno lavorativo attuale e futuro per ogni professionista.
* Notificare il superamento di limiti di capacità definiti dal professionista.

**3. Utenti Target**

* Professionisti che gestiscono autonomamente il proprio tempo e i propri impegni lavorativi con diversi clienti. Le categorie di professionisti target principali per questa applicazione sono i coach, ovvero coloro che svolgono attività di coaching.

**4. Funzionalità Principali**

**4.1. Gestione del Profilo Professionista**

* **Registrazione:** Nuovo utente professionista potrà registrarsi fornendo nome, cognome e email..
* **Login:** Utente registrato potrà accedere al proprio ambiente tramite email/password, Single Sign On (Google, Microsoft) e supporto per MFA e passkey.
* **Gestione Impostazioni:** Ogni professionista potrà gestire le proprie impostazioni, inclusa la definizione dei limiti di capacità (numero massimo di incontri al giorno, a settimana, al mese).
* **Ambiente di Lavoro Personalizzato:** Ogni professionista avrà un proprio ambiente isolato con la propria agenda e la lista dei propri clienti/persone.

**4.2. Gestione dei Contratti**

* **Creazione Nuovo Contratto:** Il professionista potrà creare un nuovo contratto associandolo a clienti. Le persone sono clienti singoli, ognuno associato a un proprio contratto individuale. Le aziende, invece, sono entità che possono raggruppare più persone sotto un unico contratto. Le informazioni da specificare includono:
    * Tipologia di contratto: è prevista una sola tipologia di contratto denominata "sessione di coaching". Questa tipologia prevede la definizione di un numero di interviste, una durata specifica e un periodo minimo di pausa obbligatorio tra un'intervista e la successiva effettuata con la stessa persona.
    * Ogni cliente singolo può avere più contratti con frequenza, numero di interviste e durata singola intervista.
    * Ogni cliente azienda può avere più contratti in ognuno dei quali viene riportato il numero di persone e le generalità (nome, cognome, email, telefono) delle singole persone dell'azienda per quel contratto, ed il contratto ha poi le stesse caratteristiche di quello del cliente singolo (numero di interviste e durata singola intervista) applicata a tutte le persone dell'azienda.
    * Il "numero di persone" dalle aziende non deve essere un attributo dell'azienda ma sarà gestito solo a livello di contratto.
    * Per la gestione dei contratti, questi devono avere anche l'importo e alcuni flag per indicare se occorre un report finale, se c'è un "quadripartito" iniziale, se c'è un "quadripartito" intermedio, se c'è un "quadripartito" finale.
    * Prevedi un campo per il costo del contratto e anche dati relativi alla fatturazione.
    * Per le persone dell'azienda nei contratti, oltre a nome, cognome, email e telefono prevedi anche un flag per il consenso all'utilizzo dei dati personali per la certificazione ICF.
    * È necessario poter filtrare/cercare le persone all'interno di un contratto.
    * Numero totale di persone da intervistare.
    * Durata stimata del contratto: la durata del contratto è espressa in numero di incontri per persona..
    * Numero di interviste previste per ogni persona.
    * Tempo minimo da intercorrere tra un'intervista e la successiva per la stessa persona: il tempo minimo è espresso in giorni.
    * In un contratto la frequenza è il numero di giorni minimi tra due incontri con la stessa persona.
    * La "durata singola intervista" è in minuti.
    * Numero massimo di persone che è possibile seguire in una giornata.
* **Visualizzazione Contratti:** Il professionista potrà visualizzare l'elenco dei propri contratti attivi e archiviati.
* **Dettagli Contratto:** Sarà possibile visualizzare i dettagli di un singolo contratto, inclusi tutti i parametri definiti in fase di creazione e lo stato di avanzamento degli incontri con ogni persona.

**4.3. Gestione degli Incontri**

* **Pianificazione Incontri:** Il sistema dovrà assistere nella pianificazione degli incontri, tenendo conto del tempo minimo tra un incontro e l'altro per la stessa persona e del numero massimo di persone seguibili in un giorno. La pianificazione è automatica ma è solo una proposta di impegno nel tempo; successivamente gli incontri verranno effettuati in base alle agende delle persone (che non devono essere gestite dall'app) e verranno registrati una volta avvenuti, con una ripianificazione del periodo successivo. In generale gli incontri con le persone, sia come clienti singoli che come dipendenti di aziende, sono l'oggetto principale del programma e dei contratti e quindi deve essere possibile visualizzare e gestire in dettaglio il percorso delle persone e tutti gli incontri già avvenuti e da fare in futuro.
* **Segnalazione Incontro Completato:** Il professionista potrà segnare un incontro come completato.
* **Ripianificazione Incontri:** Non è prevista una vera e propria riprogrammazione degli incontri all'interno dell'app. L'applicazione si concentra sull'indicare il numero di impegni che il professionista avrà in un determinato periodo (settimana/mese/anno). Questi impegni non dovranno superare dei limiti preimpostati dal professionista stesso. La gestione effettiva degli appuntamenti e delle eventuali riprogrammazioni avviene esternamente all'app, basandosi sulle agende delle persone coinvolte, che non sono gestite dal sistema.
* **Visualizzazione Incontri:** L'applicazione permetterà di visualizzare gli incontri pianificati e completati per contratto e per persona.

**4.4. Visualizzazione dell'Impegno Lavorativo (Agenda)**

* **Viste Temporali:** L'agenda potrà essere visualizzata per mese, settimana o anno.
* **Indicatori di Impegno:** All'interno di ogni periodo visualizzato, sarà indicato il numero di incontri previsti.
* **Filtri:** Sarà possibile filtrare gli impegni per uno o più contratti.
* **Visualizzazione Tempo Libero:** L'agenda dovrà indicare visivamente il tempo "libero" residuo nel periodo selezionato.
* **Distinzione Incontri Passati e Futuri:** Gli incontri già avvenuti saranno distinti da quelli ancora da effettuare.

**4.5. Notifiche e Avvisi**

* **Superamento Limiti di Capacità:** Il sistema notificherà il professionista nel caso in cui la pianificazione di un nuovo incontro superi i limiti di capacità definiti (giornalieri, settimanali, mensili). Le modalità di notifica previste sono in-app e tramite email.

**5. Regole di Business**

* Il tempo minimo tra due incontri con la stessa persona deve essere rispettato durante la pianificazione.
* Il numero massimo di persone seguibili in una giornata non deve essere superato.
* La pianificazione non deve superare i limiti di capacità definiti dal professionista per periodo.
* L'aggiornamento dello stato di un incontro (completato, riprogrammato) deve riflettersi immediatamente nella visualizzazione dell'agenda e nello stato di avanzamento del contratto.

**6. Requisiti Non Funzionali**

* **Scalabilità:** L'applicazione dovrà essere progettata per supportare un numero crescente di professionisti e di dati.
* **Sicurezza:** L'accesso ai dati dei professionisti dovrà essere protetto tramite autenticazione sicura (email/password, SSO, MFA, passkey) e autorizzazione appropriata.
* **Usabilità:** L'interfaccia utente dovrà essere intuitiva e facile da usare. Si procederà con un design moderno basato sulle funzionalità descritte.