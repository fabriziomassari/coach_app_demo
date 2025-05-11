'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/lib/context';
import MainLayout from '@/components/ui/main-layout';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiClock, FiUser, FiCheck } from 'react-icons/fi';

export default function AgendaPage() {
  const { isAuthenticated, incontri, contratti, registraIncontroCompletato } = useAppContext();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'giorno' | 'settimana' | 'mese'>('settimana');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('it-IT', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('it-IT', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const prevPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'giorno') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewMode === 'settimana') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const nextPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'giorno') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewMode === 'settimana') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    const day = currentDate.getDay();
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      days.push(date);
    }

    return days;
  };

  // Filtra gli incontri per la data corrente
  const getIncontriByDate = (date: Date) => {
    return incontri.filter(incontro => 
      incontro.data.getDate() === date.getDate() &&
      incontro.data.getMonth() === date.getMonth() &&
      incontro.data.getFullYear() === date.getFullYear() &&
      incontro.stato === 'pianificato'
    );
  };

  const incontriGiorno = getIncontriByDate(currentDate);

  // Funzione per gestire il completamento di un incontro
  const handleCompletaIncontro = (incontroId: number) => {
    registraIncontroCompletato(incontroId);
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 - 19:00
    
    return (
      <div className="mt-4">
        <h3 className="font-medium mb-4">{formatDate(currentDate)}</h3>
        <div className="space-y-2">
          {hours.map(hour => {
            const incontriOra = incontriGiorno.filter(incontro => 
              parseInt(incontro.oraInizio.split(':')[0]) === hour
            );
            
            return (
              <div key={hour} className="flex border-b pb-2">
                <div className="w-16 text-muted-foreground text-sm">
                  {hour}:00
                </div>
                <div className="flex-1">
                  {incontriOra.map(incontro => (
                    <div key={incontro.id} className="bg-primary/10 p-2 rounded-md border-l-4 border-primary">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Sessione di coaching</h4>
                          <p className="text-sm text-muted-foreground">{incontro.nomeCliente}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge text={`${incontro.oraInizio} - ${incontro.oraFine}`} variant="primary" />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCompletaIncontro(incontro.id)}
                          >
                            <FiCheck className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    
    return (
      <div className="mt-4">
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day, index) => {
            const incontriGiorno = getIncontriByDate(day);
            
            return (
              <div key={index} className="text-center">
                <div className={`mb-2 p-2 rounded-md ${day.toDateString() === new Date().toDateString() ? 'bg-primary text-primary-foreground' : ''}`}>
                  <div className="text-xs">{day.toLocaleDateString('it-IT', { weekday: 'short' })}</div>
                  <div className="font-bold">{day.getDate()}</div>
                </div>
                <div className="space-y-2">
                  {incontriGiorno.map(incontro => (
                    <div key={incontro.id} className="bg-primary/10 p-2 rounded-md text-xs">
                      <div className="font-medium">{incontro.oraInizio} - {incontro.oraFine}</div>
                      <div>{incontro.nomeCliente.split(' - ')[0]}</div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mt-1 w-full"
                        onClick={() => handleCompletaIncontro(incontro.id)}
                      >
                        <FiCheck className="h-3 w-3 mr-1" />
                        Completa
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    // Ottieni i prossimi incontri
    const oggi = new Date();
    const prossimiIncontri = incontri
      .filter(incontro => incontro.data >= oggi && incontro.stato === 'pianificato')
      .sort((a, b) => a.data.getTime() - b.data.getTime())
      .slice(0, 3);
    
    return (
      <div className="mt-4">
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
          <div>Lun</div>
          <div>Mar</div>
          <div>Mer</div>
          <div>Gio</div>
          <div>Ven</div>
          <div>Sab</div>
          <div>Dom</div>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {/* Qui andrebbe il calendario completo, ma per semplicità mostriamo solo i prossimi appuntamenti */}
        </div>
        
        <div className="mt-6 space-y-4">
          <h3 className="font-medium">Prossimi appuntamenti</h3>
          <div className="space-y-3">
            {prossimiIncontri.map(incontro => {
              const giorni = Math.floor((incontro.data.getTime() - oggi.getTime()) / (1000 * 60 * 60 * 24));
              let dataText = 'Oggi';
              if (giorni === 1) dataText = 'Domani';
              else if (giorni === 2) dataText = 'Dopodomani';
              else if (giorni > 2) dataText = `Tra ${giorni} giorni`;
              
              return (
                <div key={incontro.id} className="flex items-start gap-3 p-3 border rounded-md hover:bg-muted/50">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <FiCalendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Sessione di coaching</h4>
                      <Badge text={dataText} variant="primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">{incontro.nomeCliente}</p>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <FiClock className="mr-1 h-3 w-3" />
                      <span>{incontro.oraInizio} - {incontro.oraFine}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCompletaIncontro(incontro.id)}
                  >
                    <FiCheck className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Agenda</h1>
        <p className="text-muted-foreground">Gestisci i tuoi impegni e visualizza la tua disponibilità</p>
      </div>

      <Card title="Calendario" className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button 
              variant={viewMode === 'giorno' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('giorno')}
            >
              Giorno
            </Button>
            <Button 
              variant={viewMode === 'settimana' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('settimana')}
            >
              Settimana
            </Button>
            <Button 
              variant={viewMode === 'mese' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('mese')}
            >
              Mese
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={prevPeriod}>
              <FiChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">
              {viewMode === 'mese' 
                ? formatMonthYear(currentDate) 
                : viewMode === 'settimana' 
                  ? `Settimana del ${getWeekDays()[0].getDate()} ${getWeekDays()[0].toLocaleDateString('it-IT', { month: 'long' })}`
                  : formatDate(currentDate)
              }
            </span>
            <Button variant="outline" size="sm" onClick={nextPeriod}>
              <FiChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {viewMode === 'giorno' && renderDayView()}
        {viewMode === 'settimana' && renderWeekView()}
        {viewMode === 'mese' && renderMonthView()}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Statistiche impegni">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Impegno giornaliero</span>
                <span className="text-sm text-muted-foreground">3/5</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Impegno settimanale</span>
                <span className="text-sm text-muted-foreground">15/20</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Impegno mensile</span>
                <span className="text-sm text-muted-foreground">45/60</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card title="Contratti attivi" className="col-span-2">
          <div className="space-y-3">
            {contratti
              .filter(contratto => contratto.stato === 'attivo')
              .map(contratto => (
                <div key={contratto.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <FiUser className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">{contratto.nome}</h4>
                      <p className="text-xs text-muted-foreground">{contratto.persone} persone, {contratto.incontriCompletati}/{contratto.incontriTotali} sessioni</p>
                    </div>
                  </div>
                  <Badge text="In corso" variant="success" />
                </div>
              ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
