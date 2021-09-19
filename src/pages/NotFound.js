import React, {Fragment} from "react";
import { Container, Jumbotron } from "react-bootstrap";
import { Link } from 'react-router-dom';

export default function NotFound () {
    return(
        <Fragment>
            <Container>
                <Jumbotron className="text-center mt-5 bg-white">
                    <h1 className="text-danger" id="four-zero-four">404</h1>
                    <p className="mb-4">Page not found!</p>
                    <Link to="/smol/home" className="mx-auto px-4" >Back to Homepage</Link>
                </Jumbotron>
            </Container>
        </Fragment>
    );
}