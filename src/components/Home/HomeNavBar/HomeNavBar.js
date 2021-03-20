import React, {Component} from 'react'
import {MenuItems} from './MenuItems'
import './HomeNavBar.css'
import app from "../../../base";


class HomeNavbar extends Component {

    logout = () =>{
        app.auth().signOut()
    }


    render() {
        return(
            <nav className="NavbarItems">
                <h1 className="navbar-logo">Remind A.I. <i className="fas fa-laptop-code"></i> </h1>

                <ul>
                    {MenuItems.map((item, index) => {
                        return ( item.flag ? (
                            <li>
                                <a className={item.cName} onClick={this.logout} href={item.url}>
                                    {item.title}
                                </a>
                            </li>
                        ):(
                            <li>
                                <a className={item.cName}  href={item.url}>
                                    {item.title}
                                </a>
                            </li>
                        )

                        )
                    })}
                </ul>
            </nav>
        )
    }

}


export default HomeNavbar