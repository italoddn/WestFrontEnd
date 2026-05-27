import { Link, useLocation} from 'react-router-dom';

import { FaRegUserCircle } from "react-icons/fa";

import "./header.css";

function Header() {

  const url = useLocation().pathname

  return (
    <header className="main-header">
      <nav className="main-header-nav">
        <h1 className="main-header-title">West Burger</h1>
        <a href="#" className="main-header-userIcon"><FaRegUserCircle /></a>
      </nav>

      <div className="main-header-sliderContainer">
        <Link to='/' className={`main-header-sliderFila ${url === '/' ? 'active' : ''}`}>Fila</Link>
        <Link to='/historico' className={`main-header-sliderHistorico ${url === '/historico' ? 'active': ''}`}>Histórico</Link>
        <div className={`main-header-slider ${url === '/historico' ? 'active': ''}`}></div>
      </div>
    </header>
  );
}

export default Header;
