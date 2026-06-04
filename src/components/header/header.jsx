import { useLocation } from 'react-router-dom';

import { FaRegUserCircle } from "react-icons/fa";

import "./header.css";
import { useState } from 'react';

function Header() {

  const url = useLocation().pathname
  const [active, setActive] = useState(false);

  function handleActive() {
    setActive(prev => !prev);
  }

  function logout() {
    const confirmation = confirm('Deseja realmente sair ?');
    if (!confirmation) return
    if (localStorage.getItem('tooken')) {
      localStorage.removeItem('tooken');
      window.location.href = '/login';
    }
    window.location.href = '/login';
  }

  return (
    <header className="main-header">
      <nav className="main-header-nav">
        <h1 className="main-header-title">West Burger</h1>
        <div className='main-header-login-container'>
          <span onClick={handleActive} className="main-header-userIcon"><FaRegUserCircle /></span>
          <ul className={`main-header-loginMenu ${active ? 'active' : ''}`}>
            <li><a href="/login">Entrar</a></li>
            <li onClick={logout}>Sair</li>
          </ul>
        </div>
      </nav>

      <div className="main-header-sliderContainer">
        <a href='/' className={`main-header-sliderFila ${url === '/' ? 'active' : ''}`}>Fila</a>
        <a href='/historico' className={`main-header-sliderHistorico ${url === '/historico' ? 'active' : ''}`}>Histórico</a>
        <div className={`main-header-slider ${url === '/historico' ? 'active' : ''}`}></div>
      </div>
    </header>
  );
}

export default Header;
