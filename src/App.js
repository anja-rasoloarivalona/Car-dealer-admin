import React, { Component, Fragment } from 'react';
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
import Users from './pages/users/Users'
import Messages from './pages/messages/Messages'

/*----COMPONENTS---------*/
import Navtop from './components/navigation/navtop/Navtop';
import Navbar from './components/navigation/navbar/Navbar';
import Chat from './components/chat/Chat';
import notification from './assets/notification.mp3'



import * as actions from './store/actions'
import {connect} from 'react-redux';



class App extends Component {

  state = {
    loading: true
  }





  componentDidMount() {
      const token = localStorage.getItem('woto-admin-token');
      const expiryDate = localStorage.getItem('woto-admin-expiryData');
      const connectedAdminId = localStorage.getItem('woto-admin-adminId');
      const connnectedAdminName = localStorage.getItem('woto-admin-adminName');

      this.setState({ loading: false})

      if(!token || !expiryDate){
        console.log('NO TOKEN');
        return
      }

      if(new Date(expiryDate) <= new Date()){
        console.log('Token not valid anymore')
        return
      }

      this.props.setLoginStateToTrue(true, token, connectedAdminId, connnectedAdminName)
  }

  playNotificationSound = () => {
    this.player.play();
  }


  render() {

    let app;

    if(this.state.loading === true) {
      app = <Loader fullView/>
    } else {
        
      if(!this.props.token || !this.props.adminId || !this.props.auth || !this.props.adminName) {
          app = <Auth />
        } else {
            app = (
      
              <Fragment>       
                        <Navbar />  
                        
                        <audio src={notification} ref={ref => this.player = ref}  />
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
                            <Route path='/users' component={Users}/>
                            <Route path='/messages' render={(props) => <Messages {...props} playNotificationSound={this.playNotificationSound}/>}
                            />
                            {
                              /*                     
                              
                              <Route path='/stats' component={Stats}/>
                              <Route path='/commandes' component={Order}/> 
                              */
                            }
                                                            
                        </Switch>
                        
                </Fragment>
          )
        }
    
    
      }
    
    
    
    

    
    return (
            <div className={`app  ${this.props.showFullNavbar === true ? '' : 'full-app'}`}>
                    <Navtop />
                    {app}
            </div>
      )
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
    setLoginStateToTrue: (isAuth, token, adminId, adminName) => dispatch(actions.setLoginStateToTrue(isAuth, token, adminId, adminName)),
    setLoginStateToFalse: () => dispatch(actions.setLoginStateToFalse())
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(App);
