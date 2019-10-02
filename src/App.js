import React, { Component } from 'react';
import './App.css';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import Loader from './components/loader/Loader';


/*-----------PAGES---------*/
import Inventory from './pages/inventory/Inventory';
import Publicity from './pages/publicity/Publicity';
import Stats from './pages/stats/Stats';
import Order from './pages/order/Order';
import Add from './pages/addProduct/AddProduct';
import Car from './pages/car/Car';
import Auth from './pages/auth/Auth';

/*----COMPONENTS---------*/
import Navtop from './components/navigation/navtop/Navtop';
import Navbar from './components/navigation/navbar/Navbar';
import Chat from './components/chat/Chat';



import * as actions from './store/actions'
import {connect} from 'react-redux';



class App extends Component {

  state = {
    loading: false
  }





  componentDidMount() {


  }

  fetchProductsHandler = () => {
    let url = "http://localhost:8000/admin/products";
    let method = "GET";

    fetch(url, {
      headers: {
        "Content-Type": "application/json"
      },
      method: method
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch products");
        }
        return res.json(); //extract the body
      })
      .then(resData => {
        this.props.setProducts(resData.products);
        this.setState({ loading: false})
      })
      .catch(err => {
        console.log(err);
      });
  }


  render() {

    let app;

    if(this.state.loading === true) {
      app = <Loader />
    } else {
      app = (
        <div className={`app  ${this.props.showFullNavbar === true ? '' : 'full-app'}`}>
                  <Navtop />
                  <Navbar />  
                 {
                   /*
                      <Chat /> 
                   */
                 }                
                  <Switch>
                      <Route path='/' exact component={Inventory}/>
                      <Route path='/ajouter' component={Add}/>
                      <Route exact path='/car/:prodId' component={Car}/>
                      <Route path='/publicity' component={Publicity}/>
                      {
                        /*                     
                        
                        <Route path='/stats' component={Stats}/>
                        <Route path='/commandes' component={Order}/> 
                        */
                      }
                                                       
                  </Switch>
                  
            </div>
      )
    }

    
    return app;
  }
}

const mapStateToProps = state => {
  return {
    showFullNavbar: state.nav.showFullNavbar,
    loading: state.nav.loading,

    auth: state.auth.auth,
    token: state.auth.auth,
    adminId: state.auth.adminId,
    adminName: state.auth.adminName

  }
}

const mapDispatchToProps = dispatch => {
  return {
    setProducts: products => dispatch(actions.setProducts(products))
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(App);
