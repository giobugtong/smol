import React, { useContext, useState } from "react";
import { Link, NavLink, useHistory} from 'react-router-dom';
import { Navbar, Nav, Image } from "react-bootstrap";
import UserContext from "../UserContext";

import navbarLogo from "../images/navbar-logo.png"

export default function AppNavbar () {
    const { user, unsetUser } = useContext(UserContext);
    const history = useHistory();
    const [expanded, setExpanded] = useState(false);
    const logout = () => {
        setExpanded(false);
        unsetUser();
        // history.push("/smol/login");
        window.location.replace("/smol/login");
    }

    let rightNav = (user.email) ?
    (
        user.isAdmin ?
        (
            <>
                <Nav.Link onClick={() => setExpanded(false)} as={ NavLink } to="/smol/profile">{user.email ? `${user.firstName}'s Profile` : "Profile"}</Nav.Link>
                <Nav.Link onClick={() => logout()} to="/smol/logout">Logout</Nav.Link>
            </>
        ) :
        (  
            <>              
                <Nav.Link onClick={() => setExpanded(false)} as={ NavLink } to="/smol/profile">{`${user.firstName}'s Profile`}</Nav.Link>
                <Nav.Link onClick={() => setExpanded(false)} onClick={() => logout()} to="/smol/logout">Logout</Nav.Link>
            </>
        )    
    ) :
    (
         <>
            <Nav.Link onClick={() => setExpanded(false)} as={ NavLink } to="/smol/register">Register</Nav.Link>
            <Nav.Link onClick={() => setExpanded(false)} as={ NavLink } to="/smol/login">Login</Nav.Link>
        </>
    )

    return(
        <Navbar id="navbar" variant="dark" expand="md" expanded={expanded}>
            <Navbar.Brand as={ Link } to="/smol/home" className="ml-md-5">
                <Image fluid src={navbarLogo} alt="smol logo" width="125px"/>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => expanded ? setExpanded(false) : setExpanded(true)} style={{border: "none"}}/>
            <Navbar.Collapse id="basic-navbar-nav" className="ml-3 ml-md-0">
                <Nav className="mr-auto">
                    <Nav.Link onClick={() => setExpanded(false)} as={ NavLink } to={"/smol/home"}>Home</Nav.Link>
                    <Nav.Link onClick={() => setExpanded(false)} as={ NavLink } to={"/smol/about"}>About</Nav.Link>
                </Nav>
                <Nav className="mr-md-5">
                    {rightNav}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}