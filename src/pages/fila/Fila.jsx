import { FaUserFriends } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { toast } from 'react-toastify';

import api from '../../services/api/api.js'

import './fila.css'

function Fila({ customers, setCustumers}) {

  async function handleClick(id) {
    console.log(id);
    try {
      if(!id) toast.error('cliente não existe');
      const response = await api.post(`/send-mensage/${id}`);
      if(!response){
        toast.error('mensagem não enviada');
        return
      } 
      toast.success('Mensagem enviada');

      const deleted = await api.delete(`/${id}`);
      
      if(!deleted) {
        toast.error('internal server error')
      }

      const list = await api.get('/')
      setCustumers(list.data);

    } catch (e) {
      console.log(e)
    }
  }

  return (
    <section className='fila-container-cards'>
      {customers.map((custumer, index) => (
        <article className='fila-cards' key={custumer._id}>
          <div className='fila-container-informations'>
            <div className='fila-position'>
              <h2>{`#${index + 1 }`}</h2>
            </div>
            <div className='fila-informations'>
              <h3>{custumer.name}</h3>
              <p><span><FaUserFriends /></span>{`${custumer.accents} pessoas`}</p>
              <p><span><BsFillTelephoneFill /></span>{custumer.phoneNumber}</p>
            </div>
          </div>
          <button onClick={()=> {
            handleClick(custumer._id)
          }} className='default-button'>Chamar</button>
        </article>
      ))}


    </section>

  )
};

export default Fila;