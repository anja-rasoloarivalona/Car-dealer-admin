import React, { Component, Fragment } from 'react'
import './PublicitySelector.css';
import Loader from '../../../components/loader/Loader';
import Product from '../../../components/product/Product';
import Button from '../../../components/button/Button';
import IconSvg from '../../../utilities/svg/svg';
import * as actions from '../../../store/actions';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'

class PublicitySelector extends Component {

    state = {
        products: null,
        loading: true,
    }

    componentDidMount(){
        this.fetchProductsHandler();

        let productsIds = [];
        let productsDetails = [];
        let products = [];

        let publicitySelectorType = this.props.selectorTitle;

        if(publicitySelectorType === 'publicity'){
            products = this.props.newPubProducts
        }

        if(publicitySelectorType === 'home page'){
            products = this.props.newHomePageProducts
        }

        if(products.length > 0){
            products.forEach(product => {
                productsIds = [...productsIds, product._id];
                productsDetails = [...productsDetails, product]
            })
            let data = {
                productsIds, 
                productsDetails
            }
            this.props.setPublicitySelectorSelectedProducts(data)
        }  

    }

    fetchProductsHandler = () => {
        this.setState({ loading: true});
        let url = "http://localhost:8000/admin/publicity/add-new";
        let method = 'POST';

        let body = {section: this.props.selectorTitle};

        fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: method,
            body: JSON.stringify(body)
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Could not fetch suppliers')
            }
            return res.json()
        })
        .then(resData => {
            this.setState({
                products: resData.products,
                loading: false
            })
        })
        .catch( err => {
            console.log(err)
            this.setState({ loading: false})
        })
    }

    selectHandler = product => {
        const { selectorSelectedProductsIds, selectorSelectedProductsDetails } = this.props;
        let id = product._id;
        let data = {};
        if(!selectorSelectedProductsIds.includes(id)){
            data.productsIds = [...selectorSelectedProductsIds, id];
            data.productsDetails = [...selectorSelectedProductsDetails, product]
        } else {
            data.productsIds = selectorSelectedProductsIds.filter(prodId => prodId !== id);
            data.productsDetails = selectorSelectedProductsDetails.filter(product => product._id !== id);
        }  
        
        this.props.setPublicitySelectorSelectedProducts(data)
    }

    requestProductDetails = id => {
        this.props.setProductRequestedId(id);
        this.props.history.push(`/inventory/${id}`);
    }


    render() {

        const {products, loading} = this.state;

        const {selectorSelectedProductsIds,  selectorSelectedProductsDetails} = this.props;

        let productsList = <Loader />
        if(!loading){
            productsList = (
                <Fragment>
                    <ul className="publicity__main__list">
                                {
                                    products && products.map( product => (
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
                                                    >
                                                    <div className={`publicitySelector__checkbox 
                                                                    ${selectorSelectedProductsIds.includes(product._id) ? 'checked': ''}`}
                                                        onClick={() => this.selectHandler(product)}>
                                                        <IconSvg icon="checked"/>
                                                    </div>
                                                    </Product>
                                                </li>
                                            ))
                                    }  
                        </ul>
                        <div className="publicitySelector__cta">
                            <Button color="primary"
                                    onClick={() => this.props.addNewProducts(selectorSelectedProductsDetails)}>
                                Add
                            </Button>
                            <Button color="primary"
                                    onClick={this.props.toggleSelector}>
                                Cancel
                            </Button>

                        </div>
                </Fragment>
                
            )
        }

        return (
            <div className="publicitySelector">
                <h1 className="publicitySelector__title">Select {this.props.selectorTitle} products</h1>
                {productsList}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        selectorSelectedProductsIds: state.publicity.selectorSelectedProductsIds,
        selectorSelectedProductsDetails: state.publicity.selectorSelectedProductsDetails,
        newPubProducts: state.publicity.newPubProducts,
        newHomePageProducts: state.publicity.newHomePageProducts
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setProductRequestedId: (prodId) => dispatch(actions.setRequestedProductId(prodId)),
        setPublicitySelectorSelectedProducts: data => dispatch(actions.setPublicitySelectorSelectedProducts(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PublicitySelector))
