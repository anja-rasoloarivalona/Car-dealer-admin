import React, { Component } from 'react';
import './App.css';



/*----COMPONENTS---------*/
import Navtop from './components/navigation/navtop/Navtop';
import Navbar from './components/navigation/navbar/Navbar';

class App extends Component {
  render() {
    return (
      <div className="app">
            <Navtop />
            <Navbar />
      </div>
    );
  }
}

export default App;
