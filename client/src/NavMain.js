import "./NavMain.css";
import React, {useState} from 'react';
import * as Bs from 'react-icons/bs';
import * as Cg from 'react-icons/cg';
import { Link } from 'react-router-dom';
import { NavData } from "./NavData";
import NotifDropdown from "./NotifDropdown";
import logo from './public/logo.png'
import logo1 from './public/logo1.png'


function NavMain() {

    const [sidebar, setSidebar] = useState(false)
    const showSideBar = () => setSidebar(!sidebar)
    return (
    <>
      <div className='navbar'>
          <img className="logo" src={logo}/>
          <div className='subnav'>
              <div className='notif-bell'><NotifDropdown /></div>
              <Link to='/account'><Cg.CgProfile/></Link>
          </div>
      </div>
      <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items'>
              <div className='top-bar'></div>
              <div className="icon-container">
                  {NavData.map((item, index) => {
                    return (
                        <li key = {index} className={item.cName}>
                            <Link to={item.path}>
                                {item.icon}
                                <div className={'title'}>
                                    {item.title}
                                </div>
                                {/* Add item.title here on hover*/}
                            </Link>
                        </li>
                    )
                  })}
              </div>
          </ul>
      </nav>
    </>
    );
}

export default NavMain

