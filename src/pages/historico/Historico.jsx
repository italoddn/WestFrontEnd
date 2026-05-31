import { useEffect, useState } from 'react';

import { FaUserFriends } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaRegClock } from "react-icons/fa";


import api from '../../services/api/api.js';

import './historico.css'

function Historico() {

  const [customers, setCustumers] = useState([]);
  const tooken = localStorage.getItem('tooken');

  useEffect(() => {
    async function getData() {

      try {
        const response = await api.get('/history', {
          headers: {
            Authorization: `Bearer ${tooken}`
          }
        });
        setCustumers(response.data);
      } catch (e) {
        if(e.status === 401) {
          return
        }
      }
    }

    getData();
  }, [])

  function formatedDate(date) {
    const newDate = new Date(date).toLocaleTimeString();
    return newDate;
  }


  return (
    <section className='historico-container'>
      {customers.map((customer, index) => (
        <article className='historico-card' key={customer._id}>
          <div className='historico-cards'>
            <div className='historico-container-informations'>
              <div className='historico-position'>
                <h2>{`#${index + 1}`}</h2>
              </div>
              <div className='historico-informations'>
                <h3>{customer.name}</h3>
                <p><span><FaUserFriends /></span>{`${customer.accents} pessoas`}</p>
                <p><span><BsFillTelephoneFill /></span>{customer.phoneNumber}</p>
              </div>

              <div className='historico-stats'>
                <p className={`${customer.stats === 'Chamado!' ? 'finalizado' : 'cancelado'}`}>{customer.stats}</p>
                <p className='historico-date'>Tempo de espera <span><FaRegClock /></span>{customer.timeInLine}</p>
                <p className='historico-date'>Chamado ás <span><FaRegClock /></span>{formatedDate(customer.createdAt)}</p>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}

export default Historico;