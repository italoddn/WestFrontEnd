import { Routes, Route } from 'react-router-dom'

import Fila from '../pages/fila/Fila'
import Adicionar from '../pages/adicionar/Adicionar';
import Historico from '../pages/historico/Historico';
import Login from '../pages/login/Login';
import PrivateRoute from './privateRoute';

function MyRoutes({customers, setCustumers}) {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      
      <Route path='/' element={<PrivateRoute><Fila customers={customers} setCustumers={setCustumers}/> </PrivateRoute>} />
      
      <Route path='/adicionar' element={<PrivateRoute><Adicionar setCustumers={setCustumers} /> </PrivateRoute>} />
      
      <Route path='/historico' element={<PrivateRoute><Historico /></PrivateRoute>} />
    </Routes>
  )
}

export default MyRoutes;