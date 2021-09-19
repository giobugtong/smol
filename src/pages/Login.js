import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Row, Col, Spinner } from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";
import Swal from "sweetalert2"
import UserContext from "../UserContext";

export default function Login () {
    const { setUser, changeDocTitle } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loginButton, setLoginButton] = useState(false);
    const [errorStyle, setErrorStyle] = useState("");
    const [showSpinner, setShowSpinner] = useState("d-none");
    const history = useHistory();

    
    const loginUser = e => {
        e.preventDefault();
        setShowSpinner("");
        fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            setShowSpinner("d-none");
            if(data.accessToken) {
                localStorage.setItem("id", data.foundUser._id);
                localStorage.setItem("firstName", data.foundUser.firstName);
                localStorage.setItem("email", email);
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("isAdmin", data.foundUser.isAdmin);
                localStorage.setItem("links", JSON.stringify(data.foundUser.links));
                setUser({
                    email: email,
                    id: data.foundUser._id,
                    firstName: data.foundUser.firstName,
                    accessToken: data.accessToken,
                    isAdmin: data.foundUser.isAdmin,
                    links: data.foundUser.links
                });
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top',
                    showConfirmButton: false,
                    showCloseButton: true,
                    timer: 2600,
                    timerProgressBar: true,
                    showCloseButton: true
                })
                
                Toast.fire({
                    icon: 'success',
                    title: 'You are now logged in'
                })
                saveStoredLinks(data.foundUser._id);
                localStorage.removeItem("arrayOfLinks");
                setErrorStyle("");
                history.push("/smol/home");
            } else if (data.incorrectPassword) {
                if (errorMsg === `Incorrect password. Please try again.`) {
                    setErrorMsg(`Incorrect password. Please check your spelling.`);
                    setErrorStyle("border-danger");
                } else {
                    setErrorMsg("Incorrect password. Please try again.");
                    setErrorStyle("border-danger");
                }
            } else if (data.unregisteredUser) {
                setErrorMsg("Unregistered user or incorrect email. Please try again.");
            }
        })
        .catch(err => {
            Swal.fire({
                title: "Error!",
                icon: "error",
                text: err
            })
        })
    }
        
    const saveStoredLinks = userId => {
        let arrayOfLinks = JSON.parse(localStorage.getItem("arrayOfLinks")) || [];

        if (arrayOfLinks.length > 0) {
            fetch(`${process.env.REACT_APP_API_URL}/users/save-stored-links`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: userId,
                    arrayOfLinks: arrayOfLinks
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    Swal.fire({
                        title: "Error!",
                        icon: "error",
                        text: data.error
                    })
                } else {
                    
                }
            })
            .catch(err => {
                Swal.fire({
                    title: "Error!",
                    icon: "error",
                    text: err
                })
            })
        }
    }
        
    useEffect(() => {
        if(email && password) {
            setLoginButton(true);
        } else {
            setLoginButton(false);
        }
    }, [email, password]);

    useEffect(() => {
        changeDocTitle("Smol: Login")
    }, [])

    return(
        <Row className="mt-sm-4 mb-4">
            <Col style={{maxWidth: "400px"}} className="mx-auto">
                <h1 className="mb-3 mb-sm-5">Login</h1>
                <Form onSubmit={e => loginUser(e)}>
                        <div className="text-danger">{errorMsg}</div>
                        
                    <Form.Group className="mt-4 mb-4">
                        <Form.Control type="email" placeholder="Email address" required value={email} onChange={e => setEmail(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="my-4">

                        <Form.Control variant="danger" type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className={errorStyle}/>
                    </Form.Group>
                    {loginButton ? 
                        <Button variant="light" type="submit" className="mt-5 btn-block themeColor" disabled={!showSpinner}>
                        Login
                        <Spinner className={`mb-1 ml-2 ${showSpinner}`} as="span" animation="border" role="status" aria-hidden="true" size="sm" />
                        </Button> :
                        <Button variant="secondary" type="submit" className="mt-5 btn-block" disabled>Login</Button>
                    }
                </Form>
                <p className="text-center mt-5">Not a member yet? <Link to="/smol/register">Register now, it's free!</Link></p>
            </Col>
        </Row>
    )
}