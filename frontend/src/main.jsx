import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"

import App from './App.jsx'
import './index.css'
{/*for using useMutation and useQuery function*/}
const queryClient = new QueryClient() 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>  {/* for defining the routes that are in the app.jsx file */}
      <QueryClientProvider client={queryClient}>  {/*for using useMutation and useQuery function*/}
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
