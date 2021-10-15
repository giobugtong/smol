import React, { useState, useEffect, useContext } from "react";
import { Container, Image, Spinner } from "react-bootstrap";
import { useParams, useHistory, Link } from "react-router-dom";
import Swal from "sweetalert2";
import UserContext from "../UserContext";


export default function SmolRedirect () {
    const { smolParam } = useParams();
    const history = useHistory();
    const { changeDocTitle } = useContext(UserContext);
    const [showSpinner, setShowSpinner] = useState("d-block");
    const [randomDog, setRandomDog] = useState("");
    const [dogMessage, setDogMessage] = useState("");

    const fetchLink = () => {
        fetch(`${process.env.REACT_APP_API_URL}/links/retrieve-link`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                shortUrl: smolParam
            })
        })
        .then(response => response.json())
        .then(async data => {
            if (data.error) {
                Swal.fire({
                    title: "Error!",
                    text: data.error,
                    icon: "error"
                })
            } else if (data.isActive) {
                setDogMessage("Here's a photo of a dog while you wait:");
                setShowSpinner("d-none");
                
                let response = await fetch(`${process.env.REACT_APP_API_URL}/links/add-to-hits`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        shortUrl: smolParam
                    })
                })
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                } else {
                    window.location.replace(data.longUrl);
                }
                
                // await addToHits()
                // window.location.replace(data.longUrl);
            } else if (data.linkNotFound || !data.isActive) {
                setShowSpinner("d-none");
                setDogMessage("Link unavailable. Sorry about that. Here's a cute dog photo to look at instead:");
                Swal.fire({
                    text: `Sorry, sm-ol.vercel.app/${smolParam} does not exist or was deactivated by the owner.`,
                    icon: "info",
                    showConfirmButton: true,
                    confirmButtonText: "Home",
                    showCancelButton: true,
                    cancelButtonText: "Doggy!"
                })
                .then(result => {
                    if (result.isConfirmed) {
                        history.push("/smol/home");
                    }
                });
            }
        })
        .catch(err => {
            Swal.fire({
                title: "Catch Error!",
                text: err,
                icon: "error"
            })
        })
    }

    const addToHits = () => {
        fetch(`${process.env.REACT_APP_API_URL}/links/add-to-hits`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                shortUrl: smolParam
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.error) {
                Swal.fire({
                    title: "Error!",
                    text: data.error.name,
                    icon: "error"
                });
                console.log(data.error)
            }
        })
        .catch(err => {
            Swal.fire({
                title: "Catch Error!",
                text: err,
                icon: "error"
            });
        });
    }

    const fetchDogPhoto = () => {
        fetch(`https://dog.ceo/api/breeds/image/random`)
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                setRandomDog(data.message);
            }
        })
    }


    
    useEffect(() => {
        fetchDogPhoto();
        fetchLink();
        changeDocTitle("Smol: Redirect");
    }, [])

    return(
        <Container className="pt-3 pt-sm-5 mb-5 mt-3 mt-sm-5 text-center">
            <h1>Thank you for using smol!</h1>
            <p className={`my-4 ${showSpinner}`}>Redirecting you to the corresponding URL...</p>
            <Spinner className={`mx-auto my-4 ${showSpinner}`} animation="border" role="status" aria-hidden="true" size="lg" />
                <p className="my-4">{dogMessage}</p>
            <a target="_blank" href="https://dog.ceo/dog-api/">
                <Image alt="Random photo of a dog from dog API" src={randomDog} width="300px" fluid className="mt-4 d-block mx-auto"/>
            </a>
            <p className="my-4">Fetched from <a target="_blank" href="https://dog.ceo/dog-api/">Dog API</a></p>
            <p className="mt-5"><Link to="/smol/home">Smol home</Link></p>
        </Container>
    )
}