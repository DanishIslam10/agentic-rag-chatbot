import { useState, useEffect } from 'react'
import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import { Toaster } from 'react-hot-toast'
import Chat from './pages/Chat'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, setisLoggedIn } from './slices/authSlice'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { user, isLoggedIn } = useSelector((state) => state.auth);

  const getAuthState = async () => {

    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/auth/restore-auth-state`, {
        withCredentials: true,
      });

      console.log("Restore Auth State Response:", response.data);

      if (response.data.success) {
        // Update auth state in Redux store
        dispatch(setUser(response.data.user));
        dispatch(setisLoggedIn(true));
        navigate('/chat');

      } else {
        console.warn("Failed to restore auth state:", response.data.message);
      }

    } catch (error) {
      console.error("Error fetching auth state:", error);
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      // console.log("User is already logged in:", user);
      navigate('/chat');
    } else {
      // console.log("User is not logged in. Attempting to restore auth state...");
      getAuthState();
    }
  }, [])

  return (
    <>
      <Toaster position='top-right' reverseOrder={false} />
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
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
