import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HeliaProvider } from './provider/HeliaProvider'
import { ChakraProvider } from '@chakra-ui/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <ChakraProvider>
    <HeliaProvider>
      <App />
    </HeliaProvider>
  </ChakraProvider>
  // </React.StrictMode>
);
