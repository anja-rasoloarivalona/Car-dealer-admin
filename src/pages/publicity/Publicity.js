import React, { Component } from 'react'
import './Publicity.css';
import { connect } from 'react-redux';
import Product from '../../components/product/Product';
import Loader from '../../components/loader/Loader';
import * as actions from '../../store/actions';

class Publicity extends Component {

    state = {
        pubProducts: null,
        homePageProducts: null,
        loading: true
    }
    componentDidMount(){
        this.setState({ loading: true})
        let url = 'http://localhost:8000/product/publicity'; 
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
            this.setState({
                pubProducts: resData.publicity,
                homePageProducts: resData.home,
                loading: false
            })
        })
        .catch( err => {
            console.log(err)
            this.setState({ loading: false})
        })
    }

    requestProductDetails = id => {
        console.log('id', id);

        this.props.setProductRequestedId(id);
        this.props.history.push(`/inventory/${id}`);
    }
    render() {
        const {pubProducts, homePageProducts, loading} = this.state;
        let publicity = <Loader />
        if(!loading){
            publicity = (
            <div className="publicity">
                <section className="publicity__section--main publicity__section">
                    <h1 className="publicity__title">Publicity</h1>
                    <ul className="publicity__main__list">               
                                {
                                   pubProducts && pubProducts.map( product => (
                                        <li key={product._id}>
                                            <Product  
                                                id={product._id}
                                                mainImg={product.general.mainImgUrl}
                                                title={product.general.title}
                                                brand={product.general.brand}
                                                model={product.general.model}
                                                year={product.general.year}
                                                price={product.general.price}
                                                nbKilometers={product.general.nbKilometers}
                                                gazol={product.general.gazol}
                                                transmissionType={product.general.transmissionType}
                                                goToProd={() => this.requestProductDetails(product._id)}
                                            />
                                        </li>
                                    ))
                                }
                        

                        
                    </ul>
                </section>
                <section className="publicity__section--inventory publicity__section">
                    <h1 className="publicity__title">Home Page</h1>
                    <ul className="publicity__main__list">                
                                {
                                   homePageProducts && homePageProducts.map( product => (
                                    <li key={product._id}>
                                        <Product  
                                            id={product._id}
                                            mainImg={product.general.mainImgUrl}
                                            title={product.general.title}
                                            brand={product.general.brand}
                                            model={product.general.model}
                                            year={product.general.year}
                                            price={product.general.price}
                                            nbKilometers={product.general.nbKilometers}
                                            gazol={product.general.gazol}
                                            transmissionType={product.general.transmissionType}
                                            
                                        />
                                    </li>
                                    ))
                                } 
                    </ul>
                </section>
            </div>
            )
        }

        return publicity
    }
}

const mapStateToProps = state => {
    return {
        products: state.products.products
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setProductRequestedId: (prodId) => dispatch(actions.setRequestedProductId(prodId))
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Publicity);