import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Kaydırma konumunu kendimiz yönetiyoruz (bkz. Home.jsx). Tarayıcının kendi
// geri yüklemesi açık kalırsa, veri gelmeden önceki kısa iskelet sayfada
// hedefi maksimuma kırpıp sayfayı en dibe atıyor.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
