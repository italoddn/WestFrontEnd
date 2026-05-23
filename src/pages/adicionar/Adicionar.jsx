import { FaRegUser, FaPhone } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useRef } from 'react';

import api from '../../services/api/api.js'

import './adicionar.css'

function Adicionar({setCustumers}) {

  const inputNumberRef = useRef();

  function handleAccents(e) {
    if (e.target.innerText === '-') {
      if (inputNumberRef.current.value <= '1') return
      inputNumberRef.current.value--;
    }
    if (e.target.innerText === '+') {
      inputNumberRef.current.value++;
    }
  }

  function handlePhone(e) {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    value = value.slice(0, 11);
    value = value.replace(/^(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");

    e.target.value = value;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (e.target[0].value < 3) {
      toast.error('Nome deve ter pelo menos 3 Caracteres')
      return
    }

    if (e.target[1].value < 1) {
      toast.error('Quantidade de pessoas invalida')
      return
    }

    if (e.target[2].value.length < 11) {
      toast.error('Numero de telefone invalido')
      return
    }

    try {
      const response = await api.post('/', {
        name: e.target[0].value,
        accents: e.target[1].value,
        phoneNumber: e.target[2].value,
      })

      if(response) toast.success('Cliente cadastrado');

      e.target[0].value = '';
      e.target[1].value = '1';
      e.target[2].value = '';

      const list = await api.get('/');
      setCustumers(list.data);

      
    } catch (e) {
      console.log(e);
      toast.error('internal error')
    }
    
  }



  return (
    <form onSubmit={handleSubmit} className='adicionar-container'>
      <div className='adicionar-inputs-container'>

        <div className='adicionar-inputsLabel-container'>
          <label htmlFor="name">Nome</label>
          <div className='adicionar-inputContainer'>
            <input type="text" id='name' placeholder='Digite o nome do cliente' />
            <span><FaRegUser /></span>
          </div>
        </div>

        <div className='adicionar-inputsLabel-container'>
          <label htmlFor="accents">Quantidade de pessoas</label>
          <div className='adicionar-inputContainer'>
            <span onClick={handleAccents} id='adicionar-plusLess'>-</span>
            <input ref={inputNumberRef} type="number" id='accents' min='1' defaultValue='1' />
            <span onClick={handleAccents} id='adicionar-plusLess'>+</span>
          </div>
        </div>

        <div className='adicionar-inputsLabel-container'>
          <label htmlFor="phoneNumber">N° Telefone</label>
          <div className='adicionar-inputContainer'>
            <input onChange={handlePhone} id='phoneNumber' type="tel" placeholder='(00) 00000-0000' />
            <span><FaPhone /></span>
          </div>
        </div>

        <button type='submit' className='default-button'>Adicionar</button>
      </div>
    </form>
  )
}

export default Adicionar;