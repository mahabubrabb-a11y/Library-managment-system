
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './Shared/AuthContext.jsx'
import {LibraryProvider} from '../src/Shared/LibraryContext.jsx'
 
createRoot(document.getElementById('root')).render(
<BrowserRouter>
<AuthProvider>
    <LibraryProvider>
        <App />
    </LibraryProvider>
</AuthProvider>
</BrowserRouter>
)
