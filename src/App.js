import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "./screeens/Home/Home";
import DetailItem from "./screeens/Product/DetailProduct";
import Login from "./screeens/Auth/Login";
import Signup from "./screeens/Auth/Signup";
import ForgotPass from "./screeens/Auth/ForgotPass";
import Admin from "./screeens/Admin/Home";
import AdminPelapak from "./screeens/Admin/Pelapak";
import AdminCategory from "./screeens/Admin/Category";
import AdminCustomers from "./screeens/Admin/Customers";
import AdminRole from "./screeens/Admin/Role";
import User from "./screeens/User/User";
import Review from "./screeens/User/Review";
import Sell from "./screeens/User/Sell";
import Profil from "./screeens/User/Profil";
import AccessWarn from "./screeens/Auth/AccessWarn";
import Carts from "./screeens/Carts/Carts";
import Transaction from "./screeens/User/Transaction";
import Error from "./component/Error";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/item/:id" component={DetailItem} />
          <Route exact path="/signin" component={Login} />
          <Route exact path="/sell/:id" component={Sell} />
          <Route exact path="/admin" component={Admin} />
          <Route exact path="/admin/pelapak" component={AdminPelapak} />
          <Route exact path="/admin/category" component={AdminCategory} />
          <Route exact path="/admin/customers" component={AdminCustomers} />
          <Route exact path="/admin/role" component={AdminRole} />
          <Route exact path="/user" component={User} />
          <Route exact path="/review" component={Review} />
          <Route exact path="/profil/:id" component={Profil} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/forgotPass" component={ForgotPass} />
          <Route exact path="/restricted" component={AccessWarn} />
          <Route exact path="/carts" component={Carts} />
          <Route exact path="/transaction" component={Transaction} />
          <Route exact path="/404" component={Error} />
          <Redirect to="/404" />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
