import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Row, Col, Spinner } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2"
import UserContext from "../UserContext";

export default function Register () {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [warningMsg, setWarningMsg] = useState("");
    const [showLoginLink, setShowLoginLink] = useState("d-none");
    const [mismatchedPassword, setMismatchedPassword] = useState("");
    const [alreadyRegistered, setAlreadyRegistered] = useState("");
    const [registerButton, setRegisterButton] = useState(false);
    const { changeDocTitle } = useContext(UserContext);
    const [showSpinner, setShowSpinner] = useState("d-none");
    const history = useHistory();

    useEffect(()=>{
        if(firstName && lastName && email && password && confirmPassword && password === confirmPassword) {
            setRegisterButton(true);
            setMismatchedPassword("");
            setWarningMsg("");
        } else if (password && confirmPassword && password !== confirmPassword) {
            setWarningMsg("Passwords do not match!");
            setMismatchedPassword("border-danger");
            setRegisterButton(false);
        } else {
            setRegisterButton(false);
            setMismatchedPassword("");
            setWarningMsg("");
        }
    }, [firstName, lastName, email, password, confirmPassword, registerButton]);

    const registerUser = e => {
        e.preventDefault();
        setShowSpinner("");
        fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            setShowSpinner("d-none");
            if (data.emailExists) {
                setAlreadyRegistered("border-danger");
                setShowLoginLink("text-danger");
            } else if (data.incompleteFields) {
                setWarningMsg("Please enter all required fields");
            } else {
                console.log(data);
                Swal.fire({
                    title: "You are now registered!",
                    icon: "success",
                    text: `Thank you for registering, ${data.firstName} ${data.lastName}!`,
                    timer: 5000
                })
                resetForm();
                history.push("/smol/login");
            }
        })
    }

    const resetForm = () => {
        setEmail("");
        setFirstName("");
        setLastName("");
        setPassword("");
        setConfirmPassword("");
        setMismatchedPassword("");
        setShowLoginLink("d-none");
        setAlreadyRegistered("");
    }

    useEffect(() => {
        changeDocTitle("Smol: Register")
    }, [])
    
    return(
        <Row className="mt-sm-4 pb-5">
            <Col style={{maxWidth: "450px"}} className="mx-auto">
                <h1 className="mb-sm-4">Register</h1>
                <Form onSubmit={e => registerUser(e)}>
                    <p className="text-danger">{warningMsg}</p>
                    <p className={showLoginLink}>Email is already registered. Please <Link className="text-primary" to="/smol/login" >login</Link> or enter a different email.</p>
                    
                    <Form.Group className="my-2 my-sm-3">
                        <Form.Label>First name: </Form.Label>
                        <Form.Control type="text" placeholder="First name" required value={firstName} onChange={e => setFirstName(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="my-2 my-sm-3">
                        <Form.Label>Last name: </Form.Label>
                        <Form.Control type="text" placeholder="Last name" required value={lastName} onChange={e => setLastName(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="my-2 my-sm-3">
                        <Form.Label>Email address: </Form.Label>
                        <Form.Control className={alreadyRegistered} type="email" placeholder="Email address" required value={email} onChange={e => setEmail(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="my-2 my-sm-3">
                        <Form.Label>Password: </Form.Label>
                        <Form.Control className={mismatchedPassword} type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="my-2 my-sm-3">

                        <Form.Control className={mismatchedPassword} type="password" placeholder="Re-enter password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/>
                    </Form.Group>
                    <Row className="justify-content-between mx-0 mt-4">
                        <Col className="p-0 mb-3 mb-sm-0" sm={5}>
                            {registerButton ? 
                                <Button variant="info" type="submit" className="btn-block themeColor" disabled={!showSpinner} >Register<Spinner className={`mb-1 ml-2 ${showSpinner}`} as="span" animation="border" role="status" aria-hidden="true" size="sm" /></Button> :
                                <Button variant="secondary" type="submit" className="btn-block" disabled>Register</Button>
                            }
                        </Col>
                        <Col className="p-0" sm={5}>
                        <Button id="reset-btn" className="btn-block" onClick={resetForm}>Reset</Button>
                        </Col>
                    </Row>
                </Form>
            </Col>
           
        </Row>
    )
}