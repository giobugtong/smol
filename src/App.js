import React, { Fragment, useState } from 'react';
import './App.css';
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";

import AppNavbar from './components/AppNavbar.js';
import UserContext from './UserContext';

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SmolRedirect from './components/SmolRedirect';
import Profile from './pages/Profile';
import About from './pages/About';
import NotFound from "./pages/NotFound";
import Footer from './components/Footer';


export default function App() {

  const [user, setUser] = useState({
    id: localStorage.getItem("id"),
    firstName: localStorage.getItem("firstName"),
    email: localStorage.getItem("email"),
    accessToken: localStorage.getItem("accessToken"),
    isAdmin: localStorage.getItem("isAdmin") === "true",
    links: localStorage.getItem("links")
  });

  const unsetUser = () => {
    localStorage.clear();
    setUser({
      id: null,
      firstName: null,
      email: null,
      accessToken: null,
      isAdmin: null,
      links: null
    });
  }

  const changeDocTitle = (title) => {
    document.title = title
  }
  
  return(
    <Fragment>
      <UserContext.Provider value={{ user, setUser, unsetUser, changeDocTitle }}>
        <Router>
            <AppNavbar />
          <Container fluid id="main-container">
              <Switch>

                <Route exact path="/" component={ Home } />
                <Route exact path="/smol/home" component={ Home } />

                <Route exact path="/smol/profile">
                  {!user.email ? <Redirect to="/smol/login" /> : <Profile />}
                </Route>

                <Route exact path="/smol/about" component={ About } />

                <Route exact path="/smol/login">
                  {user.email ? <Redirect to="/smol/home" /> : <Login/>}
                </Route>

                <Route exact path="/smol/register">
                {user.email ? <Redirect to="/smol/home" /> : <Register/>}
                </Route>
                <Route exact path={`/:smolParam`} component={ SmolRedirect }/>
                
                <Route component={NotFound}/>
              </Switch>
          </Container>
          <Footer />
        </Router>
      </UserContext.Provider>
    </Fragment>
  )
}


