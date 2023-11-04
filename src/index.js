import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import App from './App';
import { AuthContextProvider } from './Context/AuthContext';
import { ChatContextProvider } from './Context/ChatContext';
import { ChatProvider } from './Context/SharedContext';
// import { AuthContext } from './Context/AuthContext';
// import reportWebVitals from './reportWebVitals';
// imp[ort ChatContextProvider]
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <React.StrictMode>
    <AuthContextProvider>
    <ChatContextProvider>
    <ChatProvider>

    <App />
    </ChatProvider>
    </ChatContextProvider>
  </AuthContextProvider>
  </React.StrictMode>
);

