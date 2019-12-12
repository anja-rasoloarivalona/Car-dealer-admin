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
import Messages from './pages/messages/Messages';
import UserAccount from './pages/userAccount/userAccount';
import Suppliers from './pages/suppliers/Suppliers';

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

      this.initializeDatasHandler()

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

  initializeDatasHandler = () => {
    let url = 'http://localhost:8000/init';  
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
      this.props.setBrandsAndModels(resData.brandsAndModels);
      this.props.setTotalProducts(resData.totalProducts)
      this.setState({ loading: false})
    })
    .catch( err => {
        console.log(err)
    })
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
                            <Route exact path='/' component={Inventory}/>
                            <Route path='/ajouter' component={Add}/>
                            <Route path='/car/:prodId' component={Car}/>
                            <Route path='/publicity' component={Publicity}/>
                            <Route path='/users' component={Users}/>
                            <Route path='/stats' component={Stats}/>
                            <Route path='/user/:userId' component={UserAccount}/>
                            <Route path='/fournisseurs' component={Suppliers}/>
                            <Route path='/messages' render={(props) => <Messages {...props} playNotificationSound={this.playNotificationSound}/>}
                            />
                            {
                              /*                     
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
    setLoginStateToFalse: () => dispatch(actions.setLoginStateToFalse()),


    setBrandsAndModels: data => dispatch(actions.setBrandsAndModels(data)),
    setSuppliers: data => dispatch(actions.setSuppliers(data)),

    setTotalProducts : data => dispatch(actions.setTotalProducts(data))
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(App);
