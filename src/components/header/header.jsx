import { FaRegUserCircle } from "react-icons/fa";
import { useState } from 'react'

import "./header.css";
import { Link } from 'react-router-dom';

function Header() {

  const [active, setActive] = useState(false);

  function handleClik() {
    setActive(prev => !prev);
  }

  return (
    <header className="main-header">
      <nav className="main-header-nav">
        <h1 className="main-header-title">West Burger</h1>
        <a href="#" className="main-header-userIcon"><FaRegUserCircle /></a>
      </nav>

      <div className="main-header-sliderContainer">
        <Link onClick={handleClik} to='/' className={`main-header-sliderFila ${active ? '' : 'active'}`}>Fila</Link>
        <Link onClick={handleClik} to='/historico' className={`main-header-sliderHistorico ${active ? 'active' : ''}`}>Histórico</Link>
        <div className={`main-header-slider ${active ? 'active' : ''}`}></div>
      </div>
    </header>
  );
}

export default Header;
