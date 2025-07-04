import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import ChatPage from './pages/ChatPage.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';

const App = () => {
  // const user = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <Routes>
      
          <Route path='/' element={ <HomePage />} />
        
        <Route path='/chat' element={<ChatPage />} />
           
        </Routes>
  )
}

export default App
