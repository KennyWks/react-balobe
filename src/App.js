import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Header from "./screeens/Layout/Header";
import Footer from "./screeens/Layout/Footer";
import Home from "./screeens/Home/Home";
import DetailItem from "./screeens/Product/DetailProduct";
import Login from "./screeens/Auth/Login";
import Signup from "./screeens/Auth/Signup";
import ForgotPass from "./screeens/Auth/ForgotPass";
import Admin from "./screeens/Admin/Admin";
import User from "./screeens/User/User";
import Review from "./screeens/User/Review";
import Profil from "./screeens/User/Profil";
import LoginWarn from "./screeens/Auth/LoginWarn";
import Category from "./screeens/Category/Category";
import DetailCategory from "./screeens/Category/DetailCategory";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
    };
  }

  render() {
    return (
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/item/:id" component={DetailItem} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/admin" component={Admin} />
          <Route exact path="/user" component={User} />
          <Route exact path="/review" component={Review} />
          <Route exact path="/profil/:id" component={Profil} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/forgotPass" component={ForgotPass} />
          <Route exact path="/loginWarn" component={LoginWarn} />
          <Route exact path="/category" component={Category} />
          <Route exact path="/category/:id" component={DetailCategory} />
          <Redirect to="/404" />
        </Switch>
        <Footer />
      </BrowserRouter>
    );
  }
}

export default App;
