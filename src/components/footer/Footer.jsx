import { FaUserFriends } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";

import './footer.css'

function Footer() {

  return(
    <footer className='main-footer'>
      <nav className='main-footer-nav'>
        <a href='/' className='footer-icons-container'>
          <span className='footer-icons'><FaUserFriends /></span>
          <p>Fila</p>
        </a>
        <a href='/historico' className='footer-icons-container'>
          <span className='footer-icons'><FaHistory /></span>
          <p>Historico</p>
        </a>
        <a href='/adicionar' className='footer-icons-container'>
          <span className='footer-icons'><TiUserAdd /></span>
          <p>Adicionar</p>
        </a>
      </nav>
    </footer>
  )
}

export default Footer;