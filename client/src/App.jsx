import './App.css'
import { Routes, Route } from 'react-router-dom'
import Auth from "./pages/Auth"
import { Toaster } from 'react-hot-toast'
import Chat from './pages/Chat'
import ProtectedRoute from './components/ProtectedRoute'
import AuthSync from './components/AuthSync'

function App() {

  return (
    <>
      <Toaster position='top-right' reverseOrder={false} />
      <AuthSync />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
      </Routes>

    </>
  )
}

export default App
