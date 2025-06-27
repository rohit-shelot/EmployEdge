import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const RefreshHandler = ({ setIsAuthenticated }) => {
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
    if(token){
      if(location.pathname ==='/' || location.pathname ==='/login' || location.pathname ==='/signup'){
        navigate('/employees',{replace:false})
      }
    }
  }, [location, navigate, setIsAuthenticated])

  return (
    <div>
      
    </div>
  )
}

export default RefreshHandler
