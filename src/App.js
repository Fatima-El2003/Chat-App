import './App.css';
import './style.scss';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Home from './Pages/Home';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './Context/AuthContext';
function App() {
  const {currentUser} = useContext(AuthContext)
  const ProtectedRouter = ({children}) =>{
    if(!currentUser){
      return <Navigate to="/Login" />
    }
    return children //children here means all components we apply this protectedRouter to.
  }
  return (
    <Router>
      <Routes>
        <Route path='/Register' element={<Register />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/' element={<ProtectedRouter><Home /></ProtectedRouter>} />
      </Routes>
    </Router>
  );
}

export default App;
