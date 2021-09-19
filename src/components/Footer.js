import React, { useContext } from "react";
import { Image, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import footerLogo from "../images/footer-logo.png";
import phFlag from "../images/ph-flag.png"
import UserContext from "../UserContext";

export default function Footer () {
    const { user } = useContext(UserContext);


    return(
        <>
            <footer className="text-center pt-2 pb-3 text-muted" style={{minWidth: "267px"}}>
            <Row className="justify-content-center align-items-center mx-auto" style={{maxWidth: "800px"}}>
                <Col sm={2}>
                    <Image src={footerLogo} width="40px" fluid alt="Smol logo" className="my-2"/>
                </Col>
                <Col xs={6} sm={2}>
                        <Link className="text-muted" to="/smol/home">Home</Link>
                </Col>
                <Col xs={6} sm={2} className="mb-2 mb-sm-0">
                        <Link className="text-muted" to="/smol/about">About</Link>
                </Col>
                <Col xs={6} sm={2} className="mb-2 mb-sm-0">
                        {
                        user.email ? 
                        <Link className="text-muted" to="/smol/profile">Profile</Link> :
                        <Link className="text-muted" to="/smol/register">Register</Link>
                        }
                </Col>
                <Col xs={6} sm={2} className="mb-2 mb-sm-0">
                        <a className="text-muted" href="https://github.com/giobugtong" target="_blank">GitHub</a>
                </Col>
            </Row>
                    <hr className="mt-2"></hr>
            <Row className="justify-content-center align-items-center mx-auto" style={{maxWidth: "800px"}}>
                <Col sm={6} className="mt-2 mt-sm-0 mb-1 mb-sm-0">
                    Made in
                    <a href="https://www.gov.ph/es/the-philippines.html" target="_blank">
                        <Image src={phFlag} width="25px" fluid alt="Philippine flag" className="mx-2 pb-1"/>
                    </a>
                </Col>
                <Col sm={6}>
                <p className="mx-3 mb-1">&#169; 2021 Smol<span className="mx-2">|</span>All rights reserved</p>
                </Col>
            </Row>
            </footer>
        </>
    )
}