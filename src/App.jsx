import { BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {ToastContainer} from 'react-toastify'

import api from './services/api/api.js'

import MyRoutes from './routes/MyRoutes';

import Header from "./components/header/header";
import Footer from './components/footer/Footer';

import './app.css'

function App() {

  const [custumers, setCustumers] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const response = await api.get('/');
        setCustumers(response.data)
      } catch (e) {
        console.log(e)
      }
    }

    getData();
  }, []);

  return (
    <BrowserRouter>
      <div className="container">
        <Header />
        <MyRoutes customers= {custumers} setCustumers={setCustumers}/>
      </div>
      
      <Footer />
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
