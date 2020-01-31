import React, { Component } from 'react'
import './Publicity.css';
import { connect } from 'react-redux';
import Product from '../../components/product/Product';
import Loader from '../../components/loader/Loader';
import * as actions from '../../store/actions';
import IconSvg from '../../utilities/svg/svg';
import Button from '../../components/button/Button';

class Publicity extends Component {

    state = {
        pubProducts: null,
        homePageProducts: null,
        init_pubProducts: null,
        init_homePageProducts: null,

        loading: true,
        editingMode: false,
        publicitySelectedProducts: []
    }

    componentDidMount(){
        this.fetchProductsHandler()
    }

    fetchProductsHandler = () => {
        this.setState({ loading: true});

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
                init_pubProducts: resData.publicity,
                homePageProducts: resData.home,
                init_homePageProducts: resData.home,
                loading: false
            })
        })
        .catch( err => {
            console.log(err)
            this.setState({ loading: false})
        })
    }

    requestProductDetails = id => {
        this.props.setProductRequestedId(id);
        this.props.history.push(`/inventory/${id}`);
    }

    editingModeHandler = mode => {
        this.setState({ editingMode: mode})
    }

    selectHandler = id => {
        const {publicitySelectedProducts} = this.state;
        if(!publicitySelectedProducts.includes(id)){
            this.setState(prevState => ({
                publicitySelectedProducts: [...prevState.publicitySelectedProducts, id]
              }));
        } else {
            this.setState(prevState => ({
                publicitySelectedProducts: prevState.publicitySelectedProducts.filter( id => id !== id)
              }));
        }   
    }

    deleteHandler = section => {
        if(section === 'publicity'){
           let newPublicityProducts =  this.state.pubProducts.filter(product => !this.state.publicitySelectedProducts.includes(product._id));
           this.setState({
               pubProducts: newPublicityProducts
           })
        }
    }

    cancelHandler = section => {
        if(section === 'publicity'){
            this.setState({
                pubProducts: this.state.init_pubProducts,
                editingMode: false,
                publicitySelectedProducts: []
            })
        }
    }

    saveHandler = () => {
        const {publicitySelectedProducts} = this.state;

        const formData = new FormData();
        formData.append("removeFromPub", publicitySelectedProducts);

        let method = 'PUT';
        let url = "http://localhost:8000/admin/update-product-visibility";

        fetch(url, {
            headers: {
              "Content-Type": "application/json"
            },
            method: method,
            body: JSON.stringify(Object.fromEntries(formData))
          })
          .then(res => {
            if (res.status !== 200 && res.status !== 201) {
              throw new Error("Creating a product failed");
            }
            return res.json()
          })
          .then(resData => {
            console.log(resData);
            this.fetchProductsHandler();
            this.setState({ editingMode: false})
          })
          .catch(err => {
            console.log(err);
          });
    }

    render() {
        const {pubProducts, homePageProducts, loading, editingMode, publicitySelectedProducts} = this.state;
        let publicity = <Loader />
        if(!loading){
            publicity = (
            <div className="publicity">
                <section className="publicity__section--main publicity__section">
                    <h1 className="publicity__title">Publicity</h1>
                    <div className="publicity__section__controller">
                        <IconSvg icon="bin" customClass="publicity__section__controller__delete"
                                 onClick={() => this.deleteHandler('publicity')}/>
                        <IconSvg icon="pencil" 
                                 customClass="publicity__section__controller__edit"
                                 onClick={ () => this.editingModeHandler('publicity')}
                        />
                    </div>
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
                                            >
                                                <div className={`publicity__main__list__item__checkbox
                                                                ${publicitySelectedProducts.includes(product._id) ? 'checked': ''}
                                                                ${editingMode === "publicity" ? 'show': ''}`
                                                                }
                                                    onClick={() => this.selectHandler(product._id)}>
                                                    <IconSvg icon="checked"/>
                                                </div>
                                            </Product>
                                        </li>
                                    ))
                                }                 
                    </ul>
                                
                    <div className={`publicity__section__cta ${editingMode === "publicity" ? 'show': ''}`}>
                                <Button color="primary"
                                        onClick={this.saveHandler}>
                                    Save
                                </Button>
                                <Button color="primary"
                                        onClick={() => this.cancelHandler('publicity')}>
                                    Cancel
                                </Button>
                    </div>
                
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
                                            goToProd={() => this.requestProductDetails(product._id)}
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