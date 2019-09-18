import React, { Component } from 'react';
import './App.css';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';



/*-----------PAGES---------*/
import Inventory from './pages/inventory/Inventory';
import Publicity from './pages/publicity/Publicity';
import Stats from './pages/stats/Stats';
import Order from './pages/order/Order';


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
                <Route path='/publicity' component={Publicity}/>
                <Route path='/stats' component={Stats}/>
                <Route path='/commandes' component={Order}/>
                
            </Switch>
      </div>
    );
  }
}

export default App;
