import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import axios from 'axios';
import Container from 'react-bootstrap/Container';
import AppNavbar from './components/AppNavbar';
import { UserProvider } from './context/UserContext';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Workouts from './pages/Workouts';
import Logout from './pages/Logout';
  
function App() {
  const [user, setUser] = useState({
    id: null
  });

  const unsetUser = () => {

      localStorage.clear();

    };
  useEffect(() => {
    const token = localStorage.getItem('token');
      if (!token) return; 

      fetch(`https://fitnessapp-api-ln8u.onrender.com/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        // console.log(data)

        if (typeof data.user !== "undefined") {
  
          setUser({
            id: data.user._id,
          });
  
        } else {
  
          setUser({
            id: null,
          });
  
        }
  
      })
  
      }, []);



  return (
    <>
    <UserProvider value={{ user, setUser, unsetUser }}>
      <BrowserRouter>
        <AppNavbar />
         <Container>
            <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/register" element={<Register />} />
             <Route path="/login" element={<Login />} />
             <Route path="/workouts" element={<Workouts />} />
             <Route path="/logout" element={<Logout />} />
            </Routes>  
          </Container>
      </BrowserRouter>
    </UserProvider>
    </>
  );
}


export default App;
