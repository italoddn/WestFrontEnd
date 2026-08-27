import { useEffect, useState } from 'react';

import { FaUserFriends } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaRegClock } from "react-icons/fa";
import { MdChair } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { toast } from 'react-toastify';


import api from '../../services/api/api.js';

import './historico.css'

function Historico() {

  const [customers, setCustumers] = useState([]);
  const [activeSeat, setActiveSeat] = useState(null);
  const [selectedCustumer, setSelectedCustumer] = useState(null);
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

  async function clearHistory() {
    const confirmation = confirm("Deseja realmente limpar o historico!");

    if(!confirmation) return

    try {
      await api.delete('/history', {
          headers: {
            Authorization: `Bearer ${tooken}`
          }
        })

      window.location.reload();
    } catch (e) {
      console.log(e)
    }
  }

  function openSeatModal(custumer) {
    setSelectedCustumer(custumer);
    setActiveSeat(true);
  }

  function closeSeatModal() {
    setActiveSeat(false);
    setSelectedCustumer(null);
  }

  async function seatCustumer(table) {
    if (!selectedCustumer) return;

    try {
      const response = await api.put(`/history/${selectedCustumer._id}`, {
        seated: true,
        table: table || null
      }, {
        headers: {
          Authorization: `Bearer ${tooken}`
        }
      });

      if (response) {
        setCustumers(prev => prev.map(c => c._id === selectedCustumer._id ? response.data : c));
        toast.success(table ? `Cliente sentado na mesa ${table}` : 'Cliente marcado como sentado');
        closeSeatModal();
      }
    } catch (err) {
      console.log(err);
      toast.error('Erro ao atualizar');
    }
  }

  function handleConfirmSeated(e) {
    e.preventDefault();
    const table = e.target[0].value.trim();
    seatCustumer(table);
  }

  function handleSeatedWithoutTable() {
    seatCustumer(null);
  }


  return (
    <section className='historico-container'>
      <div className='historico-container-button-container'>
        <button className='historico-container-button-container-btn' onClick={clearHistory}>Limpar historico</button>
      </div>
      {customers.map((customer, index) => (
        <article
          className={`historico-card ${!customer.seated ? 'clickable' : ''}`}
          key={customer._id}
          onClick={() => !customer.seated && openSeatModal(customer)}
        >
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
                <p className='historico-date'>T de espera <span><FaRegClock /></span>{customer.timeInLine}</p>
                <p className='historico-date'>Chamado ás <span><FaRegClock /></span>{formatedDate(customer.createdAt)}</p>
              </div>
            </div>

            {customer.seated && (
              <div className='historico-seated-badge'>
                <span className='historico-seated-icon'>
                  <MdChair />
                </span>
                {customer.table ? (
                  <p className='historico-seated-text'>
                    Sentado na <strong>Mesa {customer.table}</strong>
                  </p>
                ) : (
                  <p className='historico-seated-text'>
                    <strong>Cliente sentado</strong>
                  </p>
                )}
              </div>
            )}
          </div>
        </article>
      ))}

      <div className={`historico-seat-container ${activeSeat ? 'active' : ''}`}>
        <div className='historico-seat-modal' onClick={(e) => e.stopPropagation()}>
          <button className='historico-seat-close' onClick={closeSeatModal}>
            <IoClose />
          </button>

          <div className='historico-seat-header'>
            <span className='historico-seat-icon'>
              <MdChair />
            </span>
            <h2>Informar mesa</h2>
          </div>

          {selectedCustumer && (
            <p className='historico-seat-custumer'>
              Marcando <strong>{selectedCustumer.name}</strong> como sentado
            </p>
          )}

          <form onSubmit={handleConfirmSeated} className='historico-seat-form'>
            <div className='historico-seat-input-container'>
              <label htmlFor='table-number'>Número da mesa (opcional)</label>
              <input
                id='table-number'
                type='text'
                placeholder='Ex: 20'
                maxLength='10'
              />
            </div>

            <div className='historico-seat-buttons'>
              <button type='submit' className='historico-seat-btn primary'>
                Confirmar
              </button>
              <button
                type='button'
                onClick={handleSeatedWithoutTable}
                className='historico-seat-btn secondary'
              >
                Apenas sentado
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Historico;
