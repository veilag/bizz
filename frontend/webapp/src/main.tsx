import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {WebAppProvider} from "@vkruglikov/react-telegram-web-app";

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <WebAppProvider>
    <App />
  </WebAppProvider>
)
