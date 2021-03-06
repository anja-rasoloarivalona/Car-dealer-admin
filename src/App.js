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
import SingleCar from './pages/car/Car';
import Auth from './pages/auth/Auth';
import Users from './pages/users/Users'
import Messages from './pages/messages/Messages';
import UserAccount from './pages/userAccount/userAccount';
import Suppliers from './pages/suppliers/Suppliers';
import AdminManager from './pages/adminManager/AdminManager'

/*----COMPONENTS---------*/
import Navtop from './components/navigation/navtop/Navtop';
import Navbar from './components/navigation/navbar/Navbar';
import Chat from './components/chat/Chat';
import notification from './assets/eventually.mp3'
import ErrorHandler from './components/errorHandler/ErrorHandler';


import * as actions from './store/actions'
import {connect} from 'react-redux';



class App extends Component {

  state = {
    loading: true,
    hideScrollBar: false,
  }

  showScrollBarHandler = () => {
    this.setState({ hideScrollBar: false}, () => document.body.className = "")
  }
  hideScrollBarHandler = () => {
    this.setState({ hideScrollBar: true}, () => document.body.className="hideScrollBar")
  }


  componentDidMount() {
      const token = localStorage.getItem('woto-admin-token');
      const expiryDate = localStorage.getItem('woto-admin-expiryData');
      const connectedAdminId = localStorage.getItem('woto-admin-adminId');
      const connnectedAdminName = localStorage.getItem('woto-admin-adminName');

      this.initializeDatasHandler()

      if(!token || !expiryDate){
        console.log('NO TOKEN');
        return
      }

      if(new Date(expiryDate) <= new Date()){
        console.log('Token not valid anymore')
        return
      }

      this.props.setLoginStateToTrue(true, token, connectedAdminId, connnectedAdminName);

  }

  initializeDatasHandler = () => {
    let url = 'https://africauto.herokuapp.com/init';  
    fetch(url, {
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(res => {
        if(res.status !== 200 && res.status !== 201){
            throw new Error('Could not fetch suppliers')
        }
        return res.json()
    })
    .then(resData => {


        let suppliers = resData.suppliers;
        //We need to set the current view for the suppliers list page
        suppliers.forEach(supplier => {
            supplier.currentView = 'contacts'
        })

      this.props.setSuppliers(suppliers);
       this.props.initAppData(resData)
      this.setState({ loading: false})
    })
    .catch( err => {
        console.log(err)
    })
  }

  playNotificationSound = () => {
    this.player.play();
  }

  logoutHandler = () => {
    this.props.setLoginStateToFalse();
    localStorage.removeItem('woto-admin-token');
    localStorage.removeItem('woto-admin-expiryDate');
    localStorage.removeItem('woto-admin-adminId');
    localStorage.removeItem('woto-admin-adminName');
    this.props.history.push('/')
  }

  render() {

    const { hideScrollBar } = this.state
    let app;

    if(this.state.loading === true) {
      app = <Loader fullView/>
    } else {
        
      if(!this.props.token || !this.props.adminId || !this.props.auth || !this.props.adminName) {
          app = (
            <div className="fullScreen">
              <Auth />
            </div>
          )
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
                            <Route exact path='/' component={Inventory}/>  
                            <Route path='/inventory/:prodId'  render={(props) => <SingleCar {...props} hideScrollBar={hideScrollBar} showScrollBarHandler={this.showScrollBarHandler} hideScrollBarHandler={this.hideScrollBarHandler} /> }/>
                            <Route path='/inventory' component={Inventory}/>
                            <Route path='/ajouter' component={Add}/>
                            <Route path='/publicity' component={Publicity}/>
                            <Route path='/users/:userId' component={UserAccount}/>
                            <Route path='/users' component={Users}/>
                            <Route path='/stats' component={Stats}/>   
                            <Route path='/fournisseurs' component={Suppliers}/>
                            <Route path='/messages' render={(props) => <Messages {...props} playNotificationSound={this.playNotificationSound}/>}
                            />     

                            {this.props.adminId === '5d94e344b01eb1509cc2539c' && (
                              <Route path='/admin-manager' component={AdminManager}/> 
                            )}
                            



                            <Redirect to="/"/>                                                    
                        </Switch>
                        
                </Fragment>
          )
        }
    
    
      }
    
    return (
            <div className={`app  ${this.props.showFullNavbar === true ? '' : 'full-app'}`}>
                    <Navtop logoutHandler={this.logoutHandler} />
                    {this.props.errors !== null && <ErrorHandler />}
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
    adminName: state.auth.adminName,
    errors: state.error.errors

  }
}

const mapDispatchToProps = dispatch => {
  return {
    setLoginStateToTrue: (isAuth, token, adminId, adminName) => dispatch(actions.setLoginStateToTrue(isAuth, token, adminId, adminName)),
    setLoginStateToFalse: () => dispatch(actions.setLoginStateToFalse()),
    initAppData: data => dispatch(actions.initAppData(data)),
    setSuppliers: data => dispatch(actions.setSuppliers(data)),

  }
}



export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
