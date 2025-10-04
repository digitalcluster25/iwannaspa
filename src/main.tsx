import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Принудительная очистка кэша
console.log('🚀 App starting with cache-busting:', Date.now())

createRoot(document.getElementById('root')!).render(<App />)
