import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="flex items-center justify-center gap-8 mb-8">
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img
            src={viteLogo}
            className="w-24 h-24 transition-transform hover:scale-110"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img
            src={reactLogo}
            className="w-24 h-24 transition-transform hover:scale-110"
            alt="React logo"
          />
        </a>
      </div>

      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Vite + React + Tailwind CSS
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md text-center mb-6 w-full max-w-md">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Count is {count}
        </button>
        <p className="mt-4 text-gray-600">
          Edit{' '}
          <code className="bg-gray-100 px-2 py-1 rounded">src/App.tsx</code> and
          save to test HMR
        </p>
      </div>

      <p className="text-sm text-gray-500">
        Click on the Vite and React logos to learn more!!!
      </p>
    </div>
  );
}

export default App;
