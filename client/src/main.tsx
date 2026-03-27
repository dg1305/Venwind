import { StrictMode } from 'react'
import './i18n'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Initialize AOS once globally with optimized settings
// Delay initialization slightly to avoid blocking initial render
if (typeof window !== 'undefined') {
  // Use requestIdleCallback for better performance, fallback to setTimeout
  const initAOS = () => {
AOS.init({
  duration: 800,
  once: true,
  offset: 100,
      debounceDelay: 50,
      throttleDelay: 99,
    });
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(initAOS, { timeout: 2000 });
  } else {
    setTimeout(initAOS, 100);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
