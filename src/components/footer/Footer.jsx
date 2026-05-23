import { FaUserFriends } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { Link } from 'react-router-dom';

import './footer.css'

function Footer() {
  return(
    <footer className='main-footer'>
      <nav className='main-footer-nav'>
        <Link to='/' className='footer-icons-container'>
          <span className='footer-icons'><FaUserFriends /></span>
          <p>Fila</p>
        </Link>
        <Link className='footer-icons-container'>
          <span className='footer-icons'><FaHistory /></span>
          <p>Historico</p>
        </Link>
        <Link to='/adicionar' className='footer-icons-container'>
          <span className='footer-icons'><TiUserAdd /></span>
          <p>Adicionar</p>
        </Link>
      </nav>
    </footer>
  )
}

export default Footer;