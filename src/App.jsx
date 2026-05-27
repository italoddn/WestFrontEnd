import { useEffect, useState } from 'react';
import {ToastContainer} from 'react-toastify'

import api from './services/api/api.js'

import MyRoutes from './routes/MyRoutes';

import Header from "./components/header/header";
import Footer from './components/footer/Footer';

import './app.css'

function App() {
  const [custumers, setCustumers] = useState([]);
  const tooken = localStorage.getItem("tooken");

  useEffect(() => {
    async function getData() {
      try {
        const response = await api.get('/', {
          headers:{
            Authorization: `Bearer ${tooken}`
          }
        });
        setCustumers(response.data)
      } catch (e) {
        console.log(e)
      }
    }

    getData();
  }, []);

  return (
    <>
      <div className="container">
        <Header />
        <MyRoutes customers= {custumers} setCustumers={setCustumers}/>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}

export default App;
