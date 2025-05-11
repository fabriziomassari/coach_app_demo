'use client';

import { useState } from 'react';
import Input from '../ui/input';
import Button from '../ui/button';
import Alert from '../ui/alert';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { useAppContext } from '@/lib/context';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAppContext();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        // Demo: accetta qualsiasi credenziale
        const result = await login(email, password);
        if (result) {
          setSuccess('Accesso effettuato con successo!');
          router.push('/dashboard');
        }
      } else {
        // Demo: registrazione sempre riuscita
        setSuccess('Registrazione completata con successo! Ora puoi accedere.');
        setIsLogin(true);
      }
    } catch (err) {
      setError('Si è verificato un errore. Riprova più tardi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Coach Time</h1>
        <p className="text-muted-foreground mt-2">
          {isLogin ? 'Accedi al tuo account' : 'Crea un nuovo account'}
        </p>
      </div>

      {error && (
        <Alert type="error" title="Errore">
          {error}
        </Alert>
      )}

      {success && (
        <Alert type="success" title="Successo">
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {!isLogin && (
          <div className="space-y-2">
            <Input
              label="Nome e Cognome"
              id="name"
              type="text"
              placeholder="Inserisci il tuo nome e cognome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="Inserisci la tua email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Input
            label="Password"
            id="password"
            type="password"
            placeholder="Inserisci la tua password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {isLogin && (
          <div className="text-sm text-right">
            <a href="#" className="text-primary hover:underline">
              Password dimenticata?
            </a>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
        >
          {isLogin ? 'Accedi' : 'Registrati'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p>
          {isLogin ? "Non hai un account? " : "Hai già un account? "}
          <button
            type="button"
            className="text-primary hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Registrati" : "Accedi"}
          </button>
        </p>
      </div>
    </div>
  );
}
