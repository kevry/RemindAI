import React, { Component } from 'react';
import { MenuItems } from "./MenuItems"
import './HomeNavbar.css'
import {Button} from './Button.js'
import {app} from "../../base";
import { AuthContext } from "../../Auth.js";

class HomeNavbar extends Component {
    state = { clicked: false }

    handleClick = () => {
        this.setState({ clicked: !this.state.clicked })
    }

    logOut = async ()=> {
        try {
            await app
              .auth().signOut()
          } catch (error) {
            alert(error);
          }
    }

    render() {
        return(
            <nav className="NavbarItems">
                <h1 className="navbar-logo">Remind A.I.<i className="fab fa-react"></i></h1>
                <div className="menu-icon" onClick={this.handleClick}>
                    <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>
                <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
                    {MenuItems.map((item, index) => {
                        if (item.cName === 'nav-links-mobile') {
                            return (
                                <li key={index}>
                                    <a className={item.cName} onClick={this.logOut} href={item.url}>
                                    {item.title}
                                    </a>
                                </li>
                            )

                        } else {
                            return (
                                <li key={index}>
                                    <a className={item.cName} href={item.url}>
                                    {item.title}
                                    </a>
                                </li>
                            )

                        }

                    })}
                </ul>
                <Button onClick={this.logOut}>Log Out</Button>
            </nav>
        )
    }
}

export default HomeNavbar