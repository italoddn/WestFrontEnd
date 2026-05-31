import { toast } from "react-toastify";
import { useEffect, useState } from "react";

import { FaUserFriends, FaRegClock } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaBars } from "react-icons/fa6";

import api from "../../services/api/api.js";

import "./fila.css";

function Fila({ customers, setCustumers }) {
  const tooken = localStorage.getItem("tooken");
  const [, setNow] = useState(new Date());

  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function handleClick(e, custumer) {
    const awaitingTime = e.target.parentElement.parentElement.childNodes[0].firstChild.innerText;
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

  async function deleteCustomer(e, custumer) {
    const awatingTime = e.target.parentElement.parentElement.parentElement.children[0].innerText
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
                  onClick={(e) => {
                    deleteCustomer(e, custumer);
                  }}
                >
                  Excluir
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
                <h3>{custumer.name}</h3>
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
              onClick={(e) => {
                handleClick(e, custumer);
              }}
              className="default-button"
            >
              Chamar
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}

export default Fila;
