import { Suspense } from 'react';
import Calculator from '../components/Calculator';
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  return (
    <Suspense>
      <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-4 md:p-8 font-mono">
        {/* Header with centered title and theme toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-4 justify-center">
            <img
              src="/img/btc.png"
              alt="Bitcoin logo"
              className="w-12 h-12 md:w-16 md:h-16"
            />
            <h1 className="text-2xl md:text-3xl font-bold">
              Bitcoin & ETF Retirement Plan
            </h1>
          </div>
          <ThemeToggle />
        </div>

        {/* Main content area */}
        <div className="max-w-[1400px] mx-auto">
          <Calculator />
        </div>
      </main>
    </Suspense>
  );
}
