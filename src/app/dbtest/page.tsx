'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';

export default function DbTestPage() {
  const [results, setResults] = useState<{[key: string]: any}>({});
  const [error, setError] = useState<string | null>(null);

  const runTests = async () => {
    try {
      const response = await fetch('/api/dbtest');
      const data = await response.json();

      if (response.ok) {
        setResults(data);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Database</h1>
      <Button onClick={runTests}>Esegui Test</Button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {Object.entries(results).map(([category, categoryResults]) => (
        <div key={category} className="mt-8">
          <h2 className="text-xl font-semibold mb-2">{category}</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(categoryResults, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
}