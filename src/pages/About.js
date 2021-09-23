import React, { useContext, useEffect } from "react";
import UserContext from "../UserContext";
import { Col, Row } from "react-bootstrap";

export default function About () {

    const { changeDocTitle } = useContext(UserContext);

    useEffect(() => {
        changeDocTitle("Smol: About");
    }, [])

    return(
        <Row className="mt-sm-4 mb-5 justify-content-center">
            <Col style={{maxWidth: "1100px"}} className="ml-1 ml-md-3 mr-2">
                <h1>About</h1>
                <div className="my-4 ml-2 ml-sm-4" id="about-content">
                    <h4>What</h4>
                        <p>Smol is a simple yet useful web app that takes in any long URL and turns it into a link that is shorter, looks better on publication materials, and, more importantly, easier to remember. Clicking or correctly typing the smol link redirects the user to the corresponding URL. If it does not exist or was deactivated by the owner of the link (the one who generated it), the user is alerted.</p>

                    <h4>How</h4>
                        <p className="text-muted">Tech stack used: MongoDB, Express.js, React.js, and Node.js (MERN)</p>
                        <p>Each link entered to the main input field, upon successful validation in the frontend, is stored in the database as a "long URL." Then, if the user does not enter a custom link, the server randomly generates a unique 8-character-long string and associates it with the long URL as its corresponding "short URL." These data are stored in the database ready for retrieval.</p>
                        <p>For custom links, the text entered to the secondary text input are checked for special characters - only dashes are allowed. The web app then follows the same process as described above, but with the custom link as the short URL.</p>
                        <p>Smol automatically saves a logged in user's generated links. They can also view, assign a nickname, deactivate/activate, and generate a QR code for their saved smol links through the user dashboard in <a href="/smol/profile">My Profile</a>. Every time a user clicks a link, web app adds one to the number of hits. You may also see this number in the dashboard.</p>
                        <p>For guest users, the last three (3) links generated are saved in the browser's local storage and then associated to their respective account upon logging in.</p>
                        <p className="font-italic">Smol source code: <a href="https://github.com/giobugtong/smol" target="_blank">React app</a> | <a href="https://github.com/giobugtong/smol-api" target="_blank">API</a></p>
                    <h4>Who</h4>
                    <p>Hi! My name is Gio and I developed this web app. I am a Full Stack Web Developer based in Cavite, PH. I attended a coding bootcamp in July 2021 and completed it in September of the same year.</p>
                    <p>You can view my other works, download my resume, and contact me by clicking <a href="https://giobugtong.github.io/portfolio/" target="_blank">here</a>.</p>
                    
                    <h4>Why</h4>
                        <p>As a former human resources professional, I used a lot of shortened links to communicate better with employees and officers. Most of them were links to Google Forms for gathering data, registration forms, information campaigns, and invitations to free webinars.</p>
                        <p>As the the COVID-19 pandemic ravaged the world and forced most of the workforce into a remote setup, communication and coordination spelled the difference between a good day at work and a disaster. Shorter URLs helped me in properly and more effectively disseminate potentially life-saving information to the employees.</p>
                </div>


            </Col>
        </Row>
    )
}