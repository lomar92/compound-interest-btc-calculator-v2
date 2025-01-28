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
          
          {/* Social links */}
          <div className="flex items-center justify-end gap-4 mt-8 pb-4">
            <a
              href="https://github.com/lomar92/compound-interest-btc-calculator-v2"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-90 transition-opacity flex items-center"
            >
              <img
                src="/img/github-logo.png"
                alt="GitHub Profile"
                className="h-[36px] w-auto"
              />
            </a>
            <a
              href="https://buymeacoffee.com/lomar92"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-90 transition-opacity flex items-center"
            >
              <img
                src="https://img.buymeacoffee.com/button-api/?text=Donate&emoji=🙏&slug=lomar92&button_colour=f7941a&font_colour=000000&font_family=Comic&outline_colour=000000&coffee_colour=FFDD00&counter=false"
                alt="Donate"
                className="h-[36px] w-auto"
              />
            </a>
          </div>
        </div>
      </main>
    </Suspense>
  );
}
