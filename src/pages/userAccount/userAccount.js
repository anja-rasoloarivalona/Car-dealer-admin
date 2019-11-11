import React, { Component, Fragment } from 'react';
import './userAccount.css';
import ProductCard from '../../components/product/Product';
import { connect } from 'react-redux';
import * as actions from '../../store/actions'

class userAccount extends Component {

    state = {
        user: null,
        userFavoriteProducts: null
    }

    componentDidMount(){
       // console.log('mu us', this.props.match.params.userId)
       this.fetchUserAccountDetails()
    }

    fetchUserAccountDetails = () => {
        let url = "http://localhost:8000/admin/user/" + this.props.match.params.userId;

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
                            userFavoriteProducts: resData.favorites}, () => console.log('user', resData))
         })
         .catch(err => {
             console.log(err);
         });
    }
    render() {
        const { user, userFavoriteProducts } = this.state;
        let userData;

        if(!user) {
            userData = <div>Loading...</div>
        } else {
            userData = (

                <Fragment>

                    <div className="user-account">

                        <div className="user-account__id">
                            <div className="user-account__id__avatar">
                                {user.firstName.slice(0, 1)}{user.lastName.slice(0, 1)}
                            </div>
                            <div className="user-account__id__infos">
                                <div className="user__account__id__infos__item user__account__id__infos__item--name">{user.firstName} {user.lastName}</div>
                                <div className="user__account__id__infos__item user__account__id__infos__item--email">{user.email}</div>
                            </div>

                            <div className="user-account__id__status">
                                <div className={`user-account__id__status__badge
                                                ${user.active ? 'active' : 'away'}`}>
                                    {user.active ? 'active' : 'away'}
                                </div>
                            </div>
                            
                        </div>

                        <section className="user-account__favorites">
                            <h3 className="user-account__section-title">Favorite Products</h3>
                            <ul className="user-account__favorites__list">
                                {
                                    userFavoriteProducts.map( product => (
                                        <ProductCard
                                            id={product._id}
                                            mainImg={product.general[0].mainImgUrl}
                                            made={product.general[0].made}
                                            model={product.general[0].model}
                                            year={product.general[0].year}
                                            price={product.general[0].price}
                                            nbKilometers={product.general[0].nbKilometers}
                                            gazol={product.general[0].gazol}
                                            transmissionType={product.general[0].transmissionType}
                                            goToProd={() => {
                                            this.props.setProductRequestedId(product._id);
                                            this.props.history.push(`/car/${product._id}`);
                                            }}
                                        />
                                    ))
                                }
                            </ul>
                        </section>

         
                    </div>
                    
                </Fragment>
                

            )
        }
        return (
            <section className="user-account">
                {userData}
            </section>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
      setProductRequestedId: (prodId) =>dispatch(actions.setRequestedProductId(prodId)),
      };
  
  };

export default connect(null, mapDispatchToProps)(userAccount)
