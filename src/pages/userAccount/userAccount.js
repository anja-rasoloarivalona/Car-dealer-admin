import React, { Component, Fragment } from 'react';
import './userAccount.css';
import ProductCard from '../../components/product/Product';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import IconSvg from '../../utilities/svg/svg';
import ConnectionCounter from './userAccountCharts/ConnectionCounter';

class userAccount extends Component {

    state = {
        user: null,
        userFavoriteProducts: null,
        userViewedProducts: null
    }

    componentDidMount(){
       this.fetchUserAccountDetails()
    }

    fetchUserAccountDetails = () => {
        let url = "https://africauto.herokuapp.com/admin/user/" + this.props.match.params.userId;

        fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(res => {
             if (res.status !== 200) {
             throw new Error("Failed to fetch users");
             }
             return res.json();
         })
         .then(resData => {
             this.setState({ user: resData.user,
                            userFavoriteProducts: resData.favorites,
                            userViewedProducts: resData.viewedProducts})
         })
         .catch(err => {
             console.log(err);
         });
    }

    elapsedTimeCalculator = data => {
        let hourDisplayedElapsedTime;
        let minuteDisplayedElapsedTime;
        let secondsDisplayedElapsedTime

        let connectionEnd = data.end.substr(3, 2) + '-' + data.end.substr(0, 2) + '-' + data.end.substr(6, 4) + ' ' + data.end.split(' ')[1]
        let connectionStart = data.start.substr(3, 2) + '-' + data.start.substr(0, 2) + '-' + data.start.substr(6, 4) + ' ' + data.start.split(' ')[1]
        let elapsedTime = new Date(connectionEnd) - new Date(connectionStart)
    
        if( (elapsedTime / 1000 / 60) > 60){
            //elapsed time is bigger than one hour
            hourDisplayedElapsedTime = Math.floor(elapsedTime / 1000 / 60 / 60) + 'h'
            minuteDisplayedElapsedTime = Math.floor((elapsedTime / 1000 / 60) % 60)  + 'min'
            secondsDisplayedElapsedTime = Math.floor((elapsedTime / 1000 / 60) % 60) % 60 + 'sec'
            return `${hourDisplayedElapsedTime} ${minuteDisplayedElapsedTime} ${secondsDisplayedElapsedTime}`
        } else {
                if( (elapsedTime / 1000) > 60){
                    //elapsed time is bigger than one minute
                    minuteDisplayedElapsedTime = (Math.floor(elapsedTime / 1000 / 60)) + 'min';
                    secondsDisplayedElapsedTime = (elapsedTime / 1000) % 60 + 'sec'
                    return `${minuteDisplayedElapsedTime} ${secondsDisplayedElapsedTime}`
                    } 
                    else return ((elapsedTime / 1000) + 'sec') 
                            
                }
    }

    render() {
        const { user, userFavoriteProducts, userViewedProducts } = this.state;
        let userData;

        let userFavoriteProductsList = (
            <div className="user-account__products-list--noProduct">
                This user doesn't have favorite products yet
            </div>
        ) 

        if(userFavoriteProducts && userFavoriteProducts.length > 0){
            userFavoriteProductsList = (
                        <ul className="user-account__products-list">
                                {userFavoriteProducts.map( product => (
                                        <ProductCard
                                            key={product._id}
                                            id={product._id}
                                            mainImg={product.general.mainImgUrl}
                                            made={product.general.made}
                                            model={product.general.model}
                                            year={product.general.year}
                                            price={product.general.price}
                                            nbKilometers={product.general.nbKilometers}
                                            gazol={product.general.gazol}
                                            transmissionType={product.general.transmissionType}
                                            goToProd={() => {
                                            this.props.setProductRequestedId(product._id);
                                            this.props.history.push(`/car/${product._id}`);
                                            }}
                                        />
                                    ))}
                            </ul>
            )
        }

        if(!user) {
            userData = <div>Loading...</div>
        } else {
            userData = (
                    <div className="user-account">

                        <header className="user-account__header">

                            <div className="user-account__header__id">          
                                <div className="user-account__header__id__avatar">
                                    {user.firstName.slice(0, 1)}{user.lastName.slice(0, 1)}
                                </div>
                                <div className="user__account__header__id__name">{user.firstName} {user.lastName}</div>
                            </div>
                        
                            <div className="user-account__header__infos">
                                <div className="user-account__header__infos__group">
                                    <IconSvg icon="email"/>
                                   <div>{user.email}</div>
                                </div>
                                <div className="user-account__header__infos__group">
                                    <IconSvg icon="phone"/>
                                   <div>{user.phoneNumber && user.phoneNumber !== ''? user.phoneNumber : 'N.D.' }</div>
                                </div>
                                
                            </div>

                      
                                <div className={`user-account__header__status
                                                ${user.active ? 'active' : 'away'}`}>
                                    {user.active ? 'active' : 'away'}
                                </div>

                            
                        </header>

                        <section className="user-account__section user-account__favorites">
                            <h3 className="user-account__section-title">Favorite Products</h3>
                            {userFavoriteProductsList}
                        </section>

                        <section className="user-account__section user-account__viewed">
                            <h3 className="user-account__section-title">Viewed Products</h3>
                            <ul className="user-account__products-list">
                                {
                                    userViewedProducts.map( product => (
                                        <ProductCard
                                            key={product._id}
                                            id={product._id}
                                            mainImg={product.general.mainImgUrl}
                                            made={product.general.made}
                                            model={product.general.model}
                                            year={product.general.year}
                                            price={product.general.price}
                                            nbKilometers={product.general.nbKilometers}
                                            gazol={product.general.gazol}
                                            transmissionType={product.general.transmissionType}
                                            goToProd={() => {
                                            this.props.setProductRequestedId(product._id);
                                            this.props.history.push(`/car/${product._id}`);
                                            }}
                                        />
                                    ))
                                }
                            </ul>
                        </section>

                        <section className="user-account__section">
                                <h3 className="user-account__section-title">Connection History</h3>
                                
                                <ConnectionCounter data={user.connection } />

                                {/* <table className="user-account__connection__table">
                                    <thead>
                                        <tr>
                                            <th>Start</th>
                                            <th>End</th>
                                            <th>Durée</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            user.connection.map(connection => {
                                                let data = {
                                                            end: connection.end, 
                                                            start: connection.start
                                                        }
                                               let displayedElapsedTime = this.elapsedTimeCalculator(data)

                                                return (
                                                    <tr className="user-account__connection__table__data"
                                                        key={connection._id}>
                                                        <td>{connection.start}</td>
                                                        <td>{connection.end !== 'none' ? connection.end : 'active'}</td>
                                                        <td>{displayedElapsedTime.includes(NaN) ? 'to be determined' : displayedElapsedTime }</td>
                                                    </tr>
                                                )
                                                
                                            })
                                        }
                                    </tbody>
                                </table> */}
                        </section>

         
                    </div>              

            )
        }
        return userData

        
    }
}

const mapDispatchToProps = dispatch => {
    return {
      setProductRequestedId: (prodId) =>dispatch(actions.setRequestedProductId(prodId)),
      };
  
  };

export default connect(null, mapDispatchToProps)(userAccount)
