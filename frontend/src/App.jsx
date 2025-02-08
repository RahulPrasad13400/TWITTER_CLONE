import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import LoginPage from './pages/auth/login/LoginPage'
import SignUpPage from './pages/auth/signup/SignUpPage'
import HomePage from './pages/home/HomePage'
import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from './components/common/LoadingSpinner'


export default function App() {     
  
  const {data : authUser, isLoading} = useQuery({  // to fetch data (get) 
    queryKey : ['authUser'],  // by using queykey we can get this data on other files without writing the whole function and it gives a unique name to the query 
    queryFn : async () =>{
      try{
        const res = await fetch('/api/auth/me')
        console.log(res)
        const data = await res.json()
        if(data.error) return null 
        if(!res.ok) throw new Error(data.error || "Something went wrong")
        return data 
      }catch(error){
        throw new Error(error)
      }
    },
    retry : false 
  }) 

  if(isLoading){
    return <div className='h-screen flex justify-center items-center '>
      <LoadingSpinner size='lg' />
    </div>
  }
  
  console.log("ashwin : ", authUser)

  return (
    <div className='flex max-w-6xl mx-auto'>
      {authUser && <Sidebar />}
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to="/login" /> } />
        <Route path='/profile/:username' element={ authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster />  {/* notification polathe top ile success error sambavam varan */}
    </div>
  )
}
