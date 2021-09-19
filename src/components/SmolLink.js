import React, { useState, useEffect, useContext } from "react";
import { Button, Col, Form, FormControl, FormGroup, InputGroup, Row, Spinner} from "react-bootstrap";
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
    const [showInput, setShowInput] = useState("d-none");
    const [showSpinner, setShowSpinner] = useState("d-none");
    const [showBigSpinner, setShowBigSpinner] = useState("d-none");

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

    const changeUrlNickname = e => {
        e.preventDefault();
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

    useEffect(() => {
        if (prop) {
            fetchUserLinks();
        }
    console.log(props);
    }, [])

    return(
        <>
        <div className={showBigSpinner}>
            <Spinner size="sm" className="d-block mx-auto" animation="border" />
        </div>
        { showBigSpinner ? 
            <Row key={prop.key} className="bg-light py-3 mx-sm-0 border smol-container" style={{minWidth: "267px"}}>
                <Col xs={12} className={!showInput && "d-none"}>{urlNickname ? <h5>{urlNickname}</h5> : <Link className="text-dark" target="_blank" to={`/${shortUrl}`}><h5>sm-ol.vercel.app/{shortUrl}</h5></Link>}</Col>
                <Col xs={12} className={showInput}>
                <Form onSubmit={e => changeUrlNickname(e)}>
                    <InputGroup>
                        <FormControl placeholder="Enter nickname" type="text" value={urlNickname} onChange={e => setUrlNickName(e.target.value)} className="text-dark" />
                        <InputGroup.Append>
                            <Button className="px-2 border-dark border" id="" variant="light" disabled={!showSpinner} onClick={e => changeUrlNickname(e)} size="sm">{!showSpinner ? <Spinner className={`mb-1 ml-2 ${showSpinner}`} as="span" animation="border" role="status" aria-hidden="true" size="sm" /> : <span>&#10003;</span>}</Button>
                            <Button className="px-2 border-dark border" id="" variant="light" onClick={() => setShowInput("d-none")} size="sm">&#x2715;</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form>
                </Col>
                <Col xs={12}><span >{urlNickname ? <Link target="_blank" to={`/${shortUrl}`}>sm-ol.vercel.app/{shortUrl}</Link>  : null}</span></Col>
                <Col xs={12} >Created: {dateCreated}</Col>
                <Col xs={12} >Destination: </Col>
                <Col xs={12}><div className="my-2 border py-1 px-2 longUrl-text">{longUrl}</div></Col>
                <Col sm={8} >Status: <span className={`font-weight-bold ${isActive ? "text-success" : "text-danger"}`}>{isActive ? "Active" : "Deactivated"}</span></Col>
                <Col sm={4} >Hits: {numberOfHits}</Col>
                <Col xs={12} className="mt-3 d-block" >
                    <Button className="themeColor my-1 link-btn" size="sm" disabled={!showSpinner} onClick={() => showInput ? setShowInput("") : setShowInput("d-none")}>{urlNickname ? "Edit nickname" : "Set nickname"}<Spinner className={`mb-1 ml-2 ${showSpinner}`} as="span" animation="border" role="status" aria-hidden="true" size="sm" /></Button>
                    <Button className="themeColor my-1 link-btn" size="sm" disabled={!showSpinner} onClick={() => toggleStatus()}>{isActive ? "Deactivate" : "Activate"}<Spinner className={`mb-1 ml-2 ${showSpinner}`} as="span" animation="border" role="status" aria-hidden="true" size="sm" /></Button>
                    <Button className="themeColor my-1 link-btn" size="sm" onClick={() => copyLink()}>Copy link</Button>
                </Col>
            </Row>
         :
        null
        }
        </>
    )
}
