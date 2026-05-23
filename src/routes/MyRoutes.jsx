import { Routes, Route } from 'react-router-dom'

import Fila from '../pages/fila/Fila'
import Adicionar from '../pages/adicionar/Adicionar';

function MyRoutes({customers, setCustumers}) {
  return (
    <Routes>
      <Route path='/' element={<Fila customers={customers} setCustumers={setCustumers}/>} />
      <Route path='/adicionar' element={<Adicionar setCustumers={setCustumers} />} />
    </Routes>
  )
}

export default MyRoutes;