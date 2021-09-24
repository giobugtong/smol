import React, { useState, useEffect, useContext } from "react";
import { Button, Col, Form, FormControl, FormGroup, FormLabel, InputGroup, Modal, Row, Spinner} from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function SmolLink (props) {
    const { prop } = props;
    const [linkId, setLinkId] = useState("");
    const [longUrl, setLongUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [numberOfHits, setNumberOfHits] = useState("");
    const [isActive, setIsActive] = useState(null);
    const [dateCreated, setDateCreated] = useState("");
    const [urlNickname, setUrlNickName] = useState("");

    const [qrCode, setQrCode] = useState("");
    const [showQrCode, setShowQrCode] = useState(false);
    const [qrCodeSize, setQrCodeSize] = useState("");

    const [initUrlNickname, setInitUrlNickname] = useState("");
    const [showInput, setShowInput] = useState("d-none");
    const [showSpinner, setShowSpinner] = useState("d-none");
    const [showGenerateSpinner, setShowGenerateSpinner] = useState("d-none");
    const [showBigSpinner, setShowBigSpinner] = useState("d-none");
    const [showQrSpinner, setShowQrSpinner] = useState("d-none");

    const fetchUserLinks = () => {
        setShowSpinner("");
        setShowBigSpinner("");
            fetch(`${process.env.REACT_APP_API_URL}/links/retrieve-link`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    shortUrl: prop.shortUrl
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    Swal.fire({
                        title: "Error!",
                        text: data.error.name,
                        icon: "error"
                    })
                } else if (data.linkNotFound) {
                    Swal.fire({
                        title: "Error!",
                        text: "Link not found!",
                        icon: "error"
                    })
                } else {
                    setLinkId(data._id);
                    setLongUrl(data.longUrl);
                    setShortUrl(data.shortUrl);
                    setNumberOfHits(data.numberOfHits.length);
                    setIsActive(data.isActive);
                    setDateCreated(data.dateCreated.slice(0, 10));
                    setUrlNickName(data.urlNickname);
                    setInitUrlNickname(data.urlNickname);
                    setQrCode(data.qrCode);
                    setShowSpinner("d-none");
                    setShowBigSpinner("d-none");
                    setShowInput("d-none");
                }
            })
            .catch(err => {
                Swal.fire({
                    title: "Error!",
                    text: err,
                    icon: "error"
                })
            })
    }

    const copyLink = () => {
        navigator.clipboard.writeText(`sm-ol.vercel.app/${shortUrl}`);
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

    const toggleStatus = () => {
        if (isActive) {
            Swal.fire({
                title: "Confirm deactivation",
                text: "Deactivating this link will prevent all access to associated URL.",
                icon: "warning",
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: "Deactivate",
                cancelButtonText: "Cancel"
            })
            .then(result => {
                if (result.isConfirmed) {
                    setShowSpinner("");
                    fetch(`${process.env.REACT_APP_API_URL}/links/toggle-status`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                        },
                        body: JSON.stringify({
                            linkId: linkId
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            Swal.fire({
                                title: "Error!",
                                text: data.error.name,
                                icon: "error"
                            })
                        } else {
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
                                text: `Smol link successfully ${isActive ? "deactivated" : "activated"}!`
                            })
                            fetchUserLinks();
                        }
                    })
                    .catch(err => {
                        Swal.fire({
                            title: "Error!",
                            text: err,
                            icon: "error"
                        })
                    })
                }
            })
            
        } else {
            setShowSpinner("");
                    fetch(`${process.env.REACT_APP_API_URL}/links/toggle-status`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                        },
                        body: JSON.stringify({
                            linkId: linkId
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            Swal.fire({
                                title: "Error!",
                                text: data.error.name,
                                icon: "error"
                            })
                        } else {
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
                                text: `Smol link successfully ${isActive ? "deactivated" : "activated"}!`
                            })
                            fetchUserLinks();
                        }
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

    const changeUrlNickname = e => {
        e.preventDefault();
        if (initUrlNickname === urlNickname) {
            setShowInput("d-none");
        } else {
            setShowSpinner("");
            fetch(`${process.env.REACT_APP_API_URL}/links/set-url-nickname`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({
                    linkId: linkId,
                    newNickname: urlNickname
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    Swal.fire({
                        title: "Error!",
                        text: data.error.name,
                        icon: "error"
                    })
                } else {
                    setInitUrlNickname(urlNickname);
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
                        text: `Nickname set!`
                    })
                    fetchUserLinks();
                }
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
        
    const toggleQrCode = () => {
        showQrCode ? setShowQrCode(false) : setShowQrCode(true);
    }

    const generateQrCode = e => {
        e.preventDefault();
        setShowGenerateSpinner("");
        if (qrCode) {
            return
        } else {
            fetch(`https://api.qrserver.com/v1/create-qr-code/?size=${qrCodeSize}x${qrCodeSize}&data=https://sm-ol.vercel.app/${shortUrl}`)
            .then(result => {
                setQrCode(result.url);
                fetch(`${process.env.REACT_APP_API_URL}/links/set-qr-code`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                    },
                    body: JSON.stringify({
                        linkId: linkId,
                        qrCode: result.url
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        Swal.fire({
                            title: "Error!",
                            text: data.error.name,
                            icon: "error"
                        })
                        setShowGenerateSpinner("d-none");
                    } else if (data.qrCodeSaved) {
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
                            text: `QR Code generated!`
                        })
                        setShowGenerateSpinner("d-none");
                    }
                })
                .catch(err => {
                    Swal.fire({
                        title: "Error!",
                        text: err,
                        icon: "error"
                    })
                    setShowGenerateSpinner("d-none");
                })
            })

            

        }
    }

    const toggleNicknameInput = () => {
        !showInput ? setShowInput("d-none") :
        setShowInput("");
        setUrlNickName(initUrlNickname);
    }

    useEffect(() => {
        if (prop) {
            fetchUserLinks();
        }
    }, [])

    useEffect(() => {
        if (urlNickname.length >= 25) {
            setUrlNickName(urlNickname.slice(0, 25));
        }
    }, [urlNickname])

    return(
        <>
        
            <Row className="bg-light justify-content-center align-items-center py-3 mx-sm-0 border border-dark smol-container mx-2 mx-md-0">
                <div style={{minHeight: "100%"}} className={`${showBigSpinner}`}>
                    <Spinner className="d-block mx-auto" animation="border" />
                </div>
                { showBigSpinner ? 
                    <>
                    <Col xs={12} className={!showInput && "d-none"}>{urlNickname ? <h5 className="overflow-auto pt-2 pb-1 font-weight-bold">{urlNickname}</h5> : <Link className="text-dark" target="_blank" to={`/${shortUrl}`}><h5>sm-ol.vercel.app/{shortUrl}</h5></Link>}</Col>
                    <Col xs={12} className={`${showInput} mb-1`}>
                    <Form onSubmit={e => changeUrlNickname(e)}>
                        <InputGroup>
                            <FormControl placeholder="Enter nickname" type="text" value={urlNickname} onChange={e => setUrlNickName(e.target.value)} className="text-dark font-weight-bold" style={{fontSize: "20px"}}/>
                            <InputGroup.Append>
                                <Button className="px-3 border-dark border" id="" variant="light" disabled={!showSpinner} onClick={e => changeUrlNickname(e)} size="sm">{!showSpinner ? <Spinner className={`mb-1 ml-2 ${showSpinner}`} as="span" animation="border" role="status" aria-hidden="true" size="sm" /> : <span>&#10003;</span>}</Button>
                                <Button className="px-3 border-dark border" id="" variant="light" onClick={() => toggleNicknameInput()} size="sm">&#x2715;</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                    </Col>
                    <Col xs={12}><span>{urlNickname ? <Link target="_blank" to={`/${shortUrl}`}>sm-ol.vercel.app/{shortUrl}</Link>  : null}</span></Col>
                    <Col xs={12} >Created: {dateCreated}</Col>
                    <Col xs={12} >Redirects to: </Col>
                    <Col xs={12}><div className="my-2 mb-md-3 border py-1 px-2 longUrl-text"><a className="text-primary" href={longUrl} target="_blank">{longUrl}</a></div></Col>
                    <Col sm={8} >Status: <span className={`font-weight-bold ${isActive ? "text-success" : "text-danger"}`}>{isActive ? "Active" : "Deactivated"}</span></Col>
                    <Col sm={4} >Hits: {numberOfHits}</Col>
                    <Col xs={12} className="mt-3 d-block" >
                        <Button className="themeColor my-1 link-btn" size="sm" disabled={!showSpinner} onClick={() => toggleNicknameInput()}>{urlNickname ? "Edit nickname" : "Set nickname"}<Spinner className={`mb-1 ml-2 ${showSpinner}`} as="span" animation="border" role="status" aria-hidden="true" size="sm" /></Button>
                        <Button className="themeColor my-1 link-btn" size="sm" disabled={!showSpinner} onClick={() => toggleStatus()}>{isActive ? "Deactivate" : "Activate"}<Spinner className={`mb-1 ml-2 ${showSpinner}`} as="span" animation="border" role="status" aria-hidden="true" size="sm" /></Button>
                        <Button className="themeColor my-1 link-btn" size="sm" onClick={() => copyLink()}>Copy link</Button>
                        <Button className="themeColor my-1 link-btn" size="sm" onClick={() => toggleQrCode()}>{qrCode ? "View" : "Generate"} QR Code</Button>
                    </Col>
                    </>
                :
                null
                }
            </Row>

        <Modal show={showQrCode} onHide={() => setShowQrCode(false)} className="p-0 d-flex justify-content-center align-items-center">
            
            <Modal.Header closeButton>
                <Modal.Title>{qrCode ? urlNickname ? urlNickname : `https://sm-ol.vercel.app/${shortUrl}` : "New QR Code"}</Modal.Title>
            </Modal.Header>
            {
                !qrCode &&
                <Modal.Body>
                <p>Content: <a target="_blank" href={`https://sm-ol.vercel.app/${shortUrl}`}>sm-ol.vercel.app/{shortUrl}</a></p>
                        <Form onSubmit={e => generateQrCode(e)}>
                            <Form.Group>
                                <Form.Label>Size in pixels:</Form.Label>
                                <Form.Control as="select" custom onChange={e => setQrCodeSize(e.target.value)}>
                                    <option value="150" selected>150 x 150</option>
                                    <option value="250">250 x 250</option>
                                    <option value="400">400 x 400</option>
                                    <option value="700">700 x 700</option>
                                    <option value="1000">1000 x 1000</option>
                                </Form.Control>
                            </Form.Group>
                            <Button type="submit" className="btn-block mt-3 themeColor">Generate<Spinner className={`mb-1 ml-2 ${showGenerateSpinner}`} as="span" animation="border" role="status" aria-hidden="true" size="sm" /></Button>
                            <Button onClick={() => setShowQrCode(false)} variant="secondary" className="btn-block mb-2">Cancel</Button>
                        </Form>
                </Modal.Body>
            }

            {
                qrCode &&
                <Modal.Body>
                    <div className={`py-5 ${showQrSpinner}`}>
                        <Spinner className="d-block mx-auto" animation="border" />
                    </div>
                    <a className={`my-2 d-block ${!showQrSpinner}`} href={qrCode} download={urlNickname ? `smol-qr-${urlNickname}.png` : `smol-qr-${shortUrl}.png`}>
                        <img alt={urlNickname ? `QR Code for ${urlNickname}` : `QR Code for sm-ol.vercel.app/${shortUrl}`} fluid="true" width="200px" src={qrCode} className="d-block mx-auto"/>
                    </a>
                    <p className="mt-4 mb-0">Content: <a target="_blank" href={`https://sm-ol.vercel.app/${shortUrl}`}>sm-ol.vercel.app/{shortUrl}</a></p>
                </Modal.Body>
            }
        </Modal>
        </>
    )
}
