import React, { Component } from 'react';
import './App.css';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';



/*-----------PAGES---------*/
import Inventory from './pages/inventory/Inventory';
import Publicity from './pages/publicity/Publicity';
import Stats from './pages/stats/Stats';
import Order from './pages/order/Order';
import Add from './pages/addProduct/AddProduct';
import Car from './pages/car/Car';

/*----COMPONENTS---------*/
import Navtop from './components/navigation/navtop/Navtop';
import Navbar from './components/navigation/navbar/Navbar';

class App extends Component {
  render() {
    return (
      <div className="app">
            <Navtop />
            <Navbar />

            <Switch>
                


                <Route path='/' exact component={Inventory}/>

                <Route exact path='/car/:prodId' component={Car}/>

                <Route path='/publicity' component={Publicity}/>
                <Route path='/ajouter' component={Add}/>
                <Route path='/stats' component={Stats}/>
                <Route path='/commandes' component={Order}/>

                
                
            </Switch>
      </div>
    );
  }
}

export default App;
