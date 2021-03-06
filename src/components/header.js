import React from "react";
import {
     BrowserRouter as Router, 
     Link
} from 'react-router-dom'

// reactstrap components
import {
    UncontrolledCollapse,
    NavbarBrand,
    Navbar,
    NavItem,
    Nav,
    Row,
    Col
  } from "reactstrap";

class Header extends React.Component{
    componentDidMount(){

    }
    render(){
        return (
            <> 
            <header className="header-global">
                <Navbar className="navbar-main navbar-light" expand="lg" id="navbar-main">
        
                        <NavbarBrand>
                            <img alt="..." src={require("../assets/img/brand/logo_white.png")}></img>
                        </NavbarBrand>
                        <button className="navbar-toggler" id="navbar_global">
                            <span className="navbar-toggler-icon" />
                        </button>

                        <UncontrolledCollapse navbar toggler="#navbar_global">
                            <div className="navbar-collapse-header">
                                <Row>
                                    <Col className="collapse-brand" xs="6">
                                    <Router>
                                    <Link to="/">
                                        <img
                                        alt="..."
                                        src={require("../assets/img/brand/logo.png")}
                                        />
                                    </Link>
                                    </Router>
                                    </Col>
                                    <Col className="collapse-close" xs="6">
                                    <button className="navbar-toggler" id="navbar_global">
                                        <span />
                                        <span />
                                    </button>
                                    </Col>
                                </Row>
                            </div>
                          
                            <Nav className="ml-lg-auto" navbar>
                                <NavItem>
                                    <Link to="/" className="btn btn-header btn-icon text-white">Home</Link>    
                                </NavItem>
                                <NavItem>
                                    <Link to="/Sdgs" className="btn btn-header text-white">SDGs</Link>
                                </NavItem>
                                <NavItem>
                                    <Link to="/Dashboard" className="btn btn-header text-white">DASHBOARD</Link>
                                </NavItem>
                                <NavItem>
                                    <Link to="/CountryProfile" className="btn btn-header text-white">COUNTRY PROFILE</Link>
                                </NavItem>
                                <NavItem>
                                    <Link to="/Agenda2063" className="btn btn-header text-white">AGENDA 2063</Link>
                                </NavItem>
                                <NavItem>
                                    <Link to="/About" className="btn btn-header text-white">ABOUT US</Link>
                                </NavItem>
                                <NavItem>
                                    <Link to="/Faqs" className="btn btn-header text-white">FAQs</Link>
                                </NavItem>
                            </Nav>
                          
                        </UncontrolledCollapse>
                  
                </Navbar>
            </header> 
            </>
        );
    }
}

export default Header;