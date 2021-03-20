import React, { Component } from 'react';
import "./Footer.css"


class Footer extends Component {


    render() {
        return(
            <div className="footer">

                <div className="footer-social-media">
                    <form action="https://facebook.com/">
                        <button>
                            <div className="social-icon">
                                <i className="fab fa-facebook-f"></i>    
                            </div>
                        </button>
                    </form>

                    <form action="https://instagram.com/">
                        <button>
                            <div className="social-icon">
                                <i className="fab fa-instagram"></i>
                            </div>
                        </button>
                    </form>

                    <form action="https://twitter.com/">
                        <button>
                            <div className="social-icon">
                                <i className="fab fa-twitter"></i>
                            </div>
                        </button>
                    </form>
                </div>

                <div className="footer-info">
                    <a > Info </a>
                    <h4>&middot;</h4>
                    <a > Support </a>
                </div>



                <h1 className="project-title">Remind A.I.<i className="fab fa-react"></i></h1>
                <p className="project-reserved">Kevry &#169; 2021 All Rights Reserved</p>
            </div>
        )
    }


}

export default Footer
