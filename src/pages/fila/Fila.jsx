import { toast } from "react-toastify";
import { useRef ,useEffect, useState } from "react";

import { FaUserFriends, FaRegClock } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaBars } from "react-icons/fa6";

import api from "../../services/api/api.js";

import "./fila.css";

function Fila({ customers, setCustumers }) {
  const tooken = localStorage.getItem("tooken");
  const [, setNow] = useState(new Date());

  const [activeMenu, setActiveMenu] = useState(null);
  const [activeEdit, setActiveEdit] = useState(null);
  const [idCustumer, setIdCustumer] = useState(null)

  const inputNameRef = useRef();
  const inputAcenntsRef = useRef();
  const inputNumberRef = useRef();


  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function handleClick(custumer, awaitingTime) {
    const confirmation = confirm("Deseja chamar o cliente? ");
    if (!confirmation) return;

    const id = custumer._id;
    const { name, accents, phoneNumber } = custumer;

    try {
      if (!id) toast.error("cliente não existe");
      const response = await api.post(
        `/send-mensage/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tooken}`,
          },
        },
      );
      if (!response) {
        toast.error("mensagem não enviada");
        return;
      }
      toast.success("Mensagem enviada");

      await api.post(
        "/history",
        {
          name,
          accents,
          phoneNumber,
          stats: "Chamado!",
          timeInLine: awaitingTime
        },
        {
          headers: {
            Authorization: `Bearer ${tooken}`,
          },
        },
      );

      const deleted = await api.delete(`/${id}`, {
        headers: {
          Authorization: `Bearer ${tooken}`,
        },
      });

      if (!deleted) {
        toast.error("internal server error");
      }

      const list = await api.get("/", {
        headers: {
          Authorization: `Bearer ${tooken}`,
        },
      });
      setCustumers(list.data);
    } catch (e) {
      console.log(e);
    }
  }

  function getWaitingTime(time) {
    const dateNow = new Date().getTime();
    const dbTime = new Date(time).getTime();

    const diff = Math.max(0, dateNow - dbTime);

    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor(diff / 1000 / 60) % 60;
    const seconds = Math.floor(diff / 1000) % 60;

    return `${formatedTime(hours)}:${formatedTime(minutes)}:${formatedTime(seconds)}`;
  }

  function formatedTime(time) {
    if (time < 10) return `0${time}`;
    return `${time}`;
  }

  function handleMenu(id) {
    setActiveMenu((prev) => (prev === id ? null : id));
  }

  async function deleteCustomer(awatingTime, custumer) {
    const { _id, name, accents, phoneNumber } = custumer;
    const confirmation = confirm(`Deseja excluir ${name} ?`);
    if (!confirmation) return;

    try {
      await api.post(
        "/history",
        {
          name,
          accents,
          phoneNumber,
          stats: "Cancelado!",
          timeInLine: awatingTime
        },
        {
          headers: {
            Authorization: `Bearer ${tooken}`,
          },
        },
      );

      await api.delete(`/${_id}`, {
        headers: {
          Authorization: `Bearer ${tooken}`,
        },
      });

      const newCustomers = await api.get("/", {
        headers: {
          Authorization: `Bearer ${tooken}`,
        },
      });
      setCustumers(newCustomers.data);

      toast.success("Cliente removido da fila!");
    } catch (e) {
      console.log(e);
    }
  }

  function activateEditMenu() {
  setActiveEdit(prev => !prev);

  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    inputNameRef.current?.focus();
  }, 0);
}

  function editCustomer(custumer) {
    activateEditMenu()
    inputNameRef.current.value = custumer.name
    inputAcenntsRef.current.value = custumer.accents
    inputNumberRef.current.value = custumer.phoneNumber
    setIdCustumer(custumer._id)
  }

  async function updateCustumer(e) {
    e.preventDefault()

    const updateCliente = {
      name: e.target[0].value,
      accents: e.target[1].value,
      phoneNumber: e.target[2].value,
    }


    try {
      const response = await api.put(`/${idCustumer}`, updateCliente, {
        headers: {
          Authorization: `Bearer ${tooken}`,
        },
      })

      console.log('oi')
      console.log(response);

      if(!response) {
        toast.error('Error ao editar cliente')
        return
      }


      window.location.reload();
      
    } catch (e) {
      console.log(e)
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

  return (
    <section className="fila-container-cards">
      {customers.map((custumer, index) => (
        <article className="fila-cards-container" key={custumer._id}>
          <div className="fila-header">
            <p><span><FaRegClock /></span>{getWaitingTime(custumer.createdAt)}</p>
            <button onClick={() => handleMenu(custumer._id)}>
              <FaBars />
            </button>

            <ul
              className={`fila-header-menu ${activeMenu === custumer._id ? "active" : ""
                }`}
            >
              <li>
                <button
                  onClick={() => {
                    deleteCustomer(getWaitingTime(custumer.createdAt), custumer);
                  }}
                >
                  Excluir
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    editCustomer(custumer)
                  }}
                >
                  Editar
                </button>
              </li>
            </ul>
          </div>

          <div className="fila-cards">
            <div className="fila-container-informations">
              <div className="fila-position">
                <h2>{`#${index + 1}`}</h2>
              </div>

              <div className="fila-informations">
                <h3>
                  {custumer.name}
                  {custumer.confirmed && (
                    <span className="confirmation-icon" title="Confirmado">✓</span>
                  )}
                </h3>
                <p>
                  <span>
                    <FaUserFriends />
                  </span>
                  {`${custumer.accents} pessoas`}
                </p>
                <p>
                  <span>
                    <BsFillTelephoneFill />
                  </span>
                  {custumer.phoneNumber}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                handleClick(custumer, getWaitingTime(custumer.createdAt));
              }}
              className="default-button"
            >
              Chamar
            </button>
          </div>
        </article>
      ))}

      <div className={`fila-edit-container ${activeEdit ? 'active' : ''}`}>
        <div className='fila-edit'>

          <form onSubmit={updateCustumer} className='fila-edit-inputs-container'>
            <div className='fila-edit-input-container'>
              <label htmlFor="custumer-name">Nome</label>
              <input type="text"  ref={inputNameRef}/>
            </div>

            <div className='fila-edit-input-container'>
                <label htmlFor="custumer-name">Quantidade de pessoas</label>
                <input ref={inputAcenntsRef} type="number" min='1' defaultValue='1' className='edit-input-accents'/>
            </div>

            <div className='fila-edit-input-container'>
              <label htmlFor="custumer-name">N° de telefone</label>
              <input ref={inputNumberRef} onChange={handlePhone} type="text" placeholder='(00) 0000-0000'/>
            </div>

            <div className='edit-buttons-container'>
              <button type='submit' className='fila-edit-saveBtn save'>salvar</button>
              <button type='button' onClick={()=> {setActiveEdit(prev => !prev)}} className='fila-edit-saveBtn cancel'>Cancelar</button>
            </div>
            
          </form>
        </div>
      </div>
    </section>
  );
}

export default Fila;
