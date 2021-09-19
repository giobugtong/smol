import React, { useContext, useEffect, useState }from "react";
import { Col, Row, Container, Form, Button, InputGroup, FormControl, Spinner, Image } from "react-bootstrap";
import UserContext from "../UserContext";
import Swal from "sweetalert2";
import clipboard from "../icons/clipboard.png";
import networkBg from "../images/network-bg.svg";
import smolSpan from "../images/smol-span.png";
import { Link } from "react-router-dom";

export default function Home () {
    const { user, changeDocTitle } = useContext(UserContext);
    const [longUrl, setLongUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [createLinkButton, setCreateLinkButton] = useState(false);
    const [errorStyleMd, setErrorStyleMd] = useState("");
    const [errorStyleSm, setErrorStyleSm] = useState("");
    const [errorMsg, setErrorMsg] = useState(``);
    const [newLink, setNewLink] = useState("");
    const [showNewLink, setShowNewLink] = useState("d-none");
    const [showSpinner, setShowSpinner] = useState("d-none");
    const [storedLinks, setStoredLinks] = useState([]);
    let arrayOfLinks = JSON.parse(localStorage.getItem("arrayOfLinks")) || [];
    
    const createLink = e => {
        e.preventDefault();
        let format = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]+/;
        setShowSpinner("");
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
            .then(result => {
                window.location.replace("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
            })
        } else {
            setErrorMsg("");
            setErrorStyleMd("");
            setErrorStyleSm("");
            if (user.email) {
                // setShowSpinner("");
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
                        setShowNewLink("mt-3 mt-md-4");
                        setNewLink(`https://sm-ol.vercel.app/${data.shortUrl}`);
                    }
                    setShowSpinner("d-none");
                    setLongUrl("");

                })
                .catch(err => {
                    Swal.fire({
                        title: "Error!",
                        text: err.name,
                        icon: "error"
                    })
                })
            } else {
                // setShowSpinner("");
                fetch(`${process.env.REACT_APP_API_URL}/links/create-link-as-guest`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
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
                        setShowNewLink("mt-3 mt-md-4");
                        setNewLink(`https://sm-ol.vercel.app/${data.shortUrl}`);
                        copyToLocalStorage({shortUrl: data.shortUrl});
                    }
                    setShowSpinner("d-none");
                    setLongUrl("");
                })
                .catch(err => {
                    Swal.fire({
                        title: "Error!",
                        text: err,
                        icon: "error"
                    })
                })
            } 
            
        }
    }

    const copyLink = () => {
        navigator.clipboard.writeText(newLink);
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
            text: `Link copied to clipboard. Paste away!`
        })
    }

    const copyToLocalStorage = link => {
        if (arrayOfLinks.length === 3) {
            arrayOfLinks = arrayOfLinks.slice(1,3);
            arrayOfLinks.push(link);
        } else {
            arrayOfLinks.push(link);
        }
        localStorage.setItem("arrayOfLinks", JSON.stringify(arrayOfLinks));
        setStoredLinks(arrayOfLinks);
    }

    useEffect(() => {
        if (longUrl) {
            setCreateLinkButton(true);
        } else {
            setCreateLinkButton(false);
        }
    }, [longUrl])
    
    useEffect(() => {
        changeDocTitle("Smol");
        setStoredLinks(arrayOfLinks);
    }, [])

    return(
        <>
        <Container className="mt-2 position-relative px-0">
            <Row className="align-items-start">
                <Col lg={6} xl={7} className="text-left text-lg-right mt-sm-3" >
                    <h1 id="banner">Make your URLs short, sweet and <Image id="smol" src={smolSpan} alt="smol logo" fluid /> </h1>
                </Col>

                <Col lg={6} xl={5} lg={{order: "first"}} className="py-2 mb-sm-3">
                    <h4 className="font-weight-bold mt-0 mt-md-3" style={{fontSize: "clamp(1.125rem, 5vw, 1.85rem)"}}>Create your very own smol link</h4>
                    <Form onSubmit={e => createLink(e)} className="mb-4">
                        <Form.Group className="my-4">
                            <Form.Control type="url" placeholder="Paste long URL here" required value={longUrl} onChange={e => setLongUrl(e.target.value)} style={{border: "2px solid black"}} className="" id="long-url-input"/>
                        </Form.Group>

                            <div className="text-danger mb-2 mb-md-3">{errorMsg}</div>
                            <div className="d-block d-sm-none mb-2">Custom smol link (optional):</div>
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

                        {createLinkButton ? 
                            <Button variant="light" type="submit" className="mt-4 btn-block themeColor" disabled={!showSpinner}>{arrayOfLinks.length > 0 ? "Create another smol link" : "Create smol link"}<Spinner className={`mb-1 ml-2 ${showSpinner}`} as="span" animation="border" role="status" aria-hidden="true" size="sm" /></Button> :
                            <Button variant="secondary" type="submit" className="mt-4 btn-block" disabled >{arrayOfLinks.length > 0 ? "Create another smol link" : "Create smol link"}</Button>
                        }
                    </Form>
                    <div className={showNewLink}>
                        <p>Here is your smol link:</p>
                        <InputGroup>
                        <FormControl type="text" id="copy-input" readOnly value={newLink} onClick={() => copyLink()} className="text-dark" />
                        <InputGroup.Append>
                            <Button className="px-0" id="copy-button" variant="light" onClick={() => copyLink()} size="sm"><Image src={clipboard} fluid width="26px" alt="clipboard icon"/></Button>
                        </InputGroup.Append>
                        </InputGroup>

                    </div>
                        
                        {storedLinks.length > 0 && 
                            <div className="mt-4 mb-2 mb-sm-0 bg-light px-3 py-2 border border-secondary" id="stored-links">
                                <p>Your 3 last created links:</p>
                                <hr></hr>
                                <ul className="pl-4 pl-sm-5" style={{listStyle: "none"}}>
                                    {storedLinks[0] && <li><Link target="_blank" to={`/${storedLinks[0].shortUrl}`}>{`sm-ol.vercel.app/${storedLinks[0].shortUrl}`}</Link></li>}
                                    {storedLinks[1] && <li><Link target="_blank" to={`/${storedLinks[1].shortUrl}`}>{`sm-ol.vercel.app/${storedLinks[1].shortUrl}`}</Link></li>}
                                    {storedLinks[2] && <li><Link target="_blank" to={`/${storedLinks[2].shortUrl}`}>{`sm-ol.vercel.app/${storedLinks[2].shortUrl}`}</Link></li>}

                                </ul>
                                    <p><Link to={"/smol/login"}>Login</Link> now to keep them in your account.</p>
                            </div>
                        }
                </Col>
            </Row>
                
            <Row className="mt-2 mt-lg-4">
            <Col lg={5} sm={{order: "last"}} className="mb-4 mb-sm-5">
                    <h2 className="font-weight-bold" style={{fontSize: "clamp(1rem, 8vw, 2rem)"}}>smol<span className="ml-2" style={{fontSize: "clamp(1rem, 6vw, 1.25rem)"}}> [ smawl ] </span></h2>
                    <hr className="d-block d-sm-none"></hr>
                    <div className="ml-3 mr-3" style={{fontSize: "clamp(.75rem, 6vw, 1rem)"}}>
                        <p>
                            adjective, slang
                            <br></br>
                        </p>
                        <p>
                            In the internet slang of <a href="https://outwardhound.com/furtropolis/awww/doggolingo-a-guide-to-the-internets-favorite-dog-language" target="_blank">DoggoLingo</a>, <em>smol</em> is an affectionate way of saying someone or something is small in size.
                        </p>
                        <p>
                            It most often describes animals like puppies, kittens, bunnies, and in this case, <em>"smol"</em> links.
                        </p>
                        <p>Source: <a href="https://www.dictionary.com/e/slang/smol/?itm_source=parsely-api" target="_blank">dictionary.com</a></p>
                    </div>
            </Col>
            </Row>
        <Image src={networkBg} id="networkBg" alt="connected people background" fluid/>

        </Container>
        </>
    );
}