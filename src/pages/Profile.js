import React, { useState, useEffect, useContext } from "react";
import { Col, Row, Card, Button, Modal, Form, InputGroup, FormControl, Spinner } from "react-bootstrap";
import UserContext from "../UserContext";
import SmolLink from "../components/SmolLink";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function Profile () {
    const { user, changeDocTitle } = useContext(UserContext);

    const [userLinks, setUserLinks] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [joinDate, setJoinDate] = useState("");
    const [totalLinks, setTotalLinks] = useState(0);

    const [showAdd, setShowAdd] = useState(false);

    const [createLinkButton, setCreateLinkButton] = useState(false);
    const [longUrl, setLongUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [errorMsg, setErrorMsg] = useState(``);
    const [errorStyleMd, setErrorStyleMd] = useState("");
    const [errorStyleSm, setErrorStyleSm] = useState("");

    const [showSpinner, setShowSpinner] = useState("d-none");
    const [showBigSpinner, setShowBigSpinner] = useState("d-none");



    const fetchUserData = () => {
        setShowBigSpinner("");
        fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                Swal.fire({
                    title: "Error!",
                    icon: "error",
                    text: data.error
                })
            } else if (data.invalidAccessToken || data.noAccessToken) {
                Swal.fire({
                    title: "Error!",
                    icon: "error",
                    text: "Access Token error!"
                })
            } else {
                if (data.links.length > 0) {
                    const mappedLinks = data.links.map(link => {
                        return(
                            <Col className="mb-3 mb-sm-4" sm={9} md={8} lg={6} xl={4}>
                                <SmolLink key={link.linkId} prop={link}/>
                                {/* <hr></hr> */}
                            </Col>
                        )
                    })
                    setTotalLinks(data.links.length);
                    setUserLinks(mappedLinks);
                } else {
                    setTotalLinks("none");
                }
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setJoinDate(data.joinDate.slice(0, 10));
                setShowBigSpinner("d-none");
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

    const createLink = e => {
        e.preventDefault();
        let format = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]+/;
        if (format.test(shortUrl) || shortUrl[0] === "-" ||shortUrl[shortUrl.length-1] === "-" || shortUrl.includes("--")) {
            setErrorMsg(`Invalid link format`);
            setErrorStyleMd("border border-danger");
            setErrorStyleSm("border border-danger");
        } else if (shortUrl && shortUrl.length < 4) {
            setErrorMsg("Please enter at least 4 characters");
            setErrorStyleMd("border border-danger");
            setErrorStyleSm("border border-danger");
        } else if (shortUrl === "smol" ) {
            setErrorMsg(`Sorry, "smol" is a reserved smol link`)
        } else if (longUrl === "https://www.youtube.com/watch?v=dQw4w9WgXcQ" || longUrl === "https://www.youtube.com/watch?v=DLzxrzFCyOs") {
            Swal.fire({
                title: "Error!",
                text: "Sorry, Rickrolling is illegal!",
                icon: "error",
                showConfirmButton: true
            })
            setShowSpinner("d-none");
        } else {
            setShowSpinner("");
            setErrorMsg("");
            setErrorStyleMd("");
            setErrorStyleSm("");
            fetch(`${process.env.REACT_APP_API_URL}/links/create-link`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({
                    longUrl: longUrl,
                    shortUrl: shortUrl
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    Swal.fire({
                        title: "Error!",
                        text: data.error,
                        icon: "error"
                    })
                } else if (data.shortUrlExists) {
                    setErrorMsg(`Oops, "${shortUrl}" is taken. Try a something else.`);
                    setErrorStyleMd("border border-danger");
                    setErrorStyleSm("border border-danger");
                } else if (data.shortUrl) {
                    closeAdd();
                    const Toast = Swal.mixin({
                        toast: true,
                        icon: "success",
                        position: "top",
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        showCloseButton: true
                      })
                    Toast.fire({
                        text: `Smol link successfully created!`
                    })
                }
                setShowSpinner("d-none");
                setLongUrl("");
                fetchUserData();
            })
            .catch(err => {
                Swal.fire({
                    title: "Error!",
                    text: err.name,
                    icon: "error"
                })
            })
            
        }
    }

    const openAdd = e => {
        e.preventDefault();
        setShowAdd(true);

    }

    const closeAdd = () => {
        setShowAdd(false);
        setLongUrl("");
        setShortUrl("");
    }

    useEffect(() => {
        changeDocTitle(`Smol: ${user.firstName}'s Profile`);
    }, [])

    useEffect(() => {
        fetchUserData();
    }, [])

    useEffect(() => {
        if (longUrl) {
            setCreateLinkButton(true);
        } else {
            setCreateLinkButton(false);
        }
    }, [longUrl])

    return(
        <div className="mx-auto" style={{maxWidth: "1100px"}}>
            <Row className="mt-3 mt-md-4 mb-5">
                <Col xs={12}>
                    <h1>Profile</h1>
                </Col>

                <Col sm={11} md={9} lg={7}  className="">
                    <Card className="mt-3 mt-md-4 rounded-0">
                        <Card.Header className={user.isAdmin ? "pb-0" : null}>
                            <h3 className="d-inline-block m-0">{firstName} {lastName}</h3>
                        </Card.Header>
                        <Card.Body>
                            <Row>

                                <Col sm={8}>
                                    <p>Email address: {user.email}</p>
                                    <p>Join date: {joinDate}</p>
                                </Col>
                                <Col sm={4}>
                                    <p>Smol Links: {totalLinks}</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <div className={showBigSpinner}>
                <Spinner size="lg" className="d-block mx-auto" animation="border" />
            </div>
            {
            showBigSpinner ? 
            <>
                <Row className="mb-3 mt-3 mt-md-4 ml-sm-4">
                    <Col xs={12}>
                        <h4>{`${user.firstName}'s Smol Links`}</h4>
                    </Col>
                    {userLinks.length > 0 ?
                    <Col className="" sm={6} md={4} lg={3}>
                        <p className="mt-3"><Button className="btn-block themeColor" onClick={e => openAdd(e)} >Create Smol link</Button></p>
                    </Col> : null
                    }
                </Row>
                <Row className="mb-3 mb-sm-5 pb-sm-5 ml-sm-4">
                    {userLinks.length ? userLinks : <p className="ml-3">No links yet. <a href="" onClick={e => openAdd(e)} >Create one now!</a></p>}
                </Row>

            </>
            : null
            }

            <Modal show={showAdd} onHide={closeAdd} className="mt-5">
                <Form onSubmit={e => createLink(e)}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Smol link</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-danger mb-2 mb-md-3">{errorMsg}</div>
                        <Form.Group className="mt-4 mb-4">
                            <Form.Control type="url" placeholder="Paste long URL here" required value={longUrl} onChange={e => setLongUrl(e.target.value)} style={{border: "2px solid black"}} className="" id="long-url-input"/>
                        </Form.Group>

                        <InputGroup className="mb-3" style={{border: "1px solid black"}}>
                            <InputGroup.Prepend>
                            <InputGroup.Text className="url-prefix">
                                sm-ol.vercel.app/
                            </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl aria-describedby="basic-addon3" type="text" placeholder="Custom smol link (optional)"
                                value={shortUrl} onChange={e => setShortUrl(e.target.value)} className={`d-none d-sm-inline ${errorStyleMd}`}/>
                            <FormControl aria-describedby="basic-addon3" type="text" placeholder="cool-link"
                                value={shortUrl} onChange={e => setShortUrl(e.target.value)} className={`d-inline d-sm-none ${errorStyleSm}`}/>
                        </InputGroup>

                        <Modal.Footer>
                        {createLinkButton ? 
                            <Button variant="light" type="submit" className="mt-4 btn-block themeColor" disabled={!showSpinner}>Create Smol link<Spinner className={`mb-1 ml-2 ${showSpinner}`} as="span" animation="border" role="status" aria-hidden="true" size="sm" /></Button> :
                            <Button variant="secondary" type="submit" className="mt-4 btn-block" disabled >Create Smol link</Button>
                        }
                            <Button variant="secondary" className="btn-block" onClick={closeAdd}>Close</Button>
                        </Modal.Footer>
                    </Modal.Body>
                </Form>
            </Modal>
        </div>
    )
}