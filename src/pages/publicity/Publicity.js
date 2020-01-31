import React, { Component } from 'react'
import './Publicity.css';
import { connect } from 'react-redux';
import Product from '../../components/product/Product';
import Loader from '../../components/loader/Loader';
import * as actions from '../../store/actions';
import IconSvg from '../../utilities/svg/svg';
import Button from '../../components/button/Button';
import PublicitySelector from './PublicitySelector/PublicitySelector';

class Publicity extends Component {

    state = {
        pubProducts: null,
        homePageProducts: null,


        init_pubProducts: null,
        init_homePageProducts: null,

        loading: true,
        editingMode: false,

        publicitySelectedProducts: [],
        homePageSelectedProducts: [],

        showSelector: false,
        selectorTitle: null,

        newPubProducts: [],
        newHomePageProducts: []

    }

    componentDidMount(){
        this.fetchProductsHandler()
    }

    fetchProductsHandler = () => {
        this.setState({ loading: true});

        let url = 'http://localhost:8000/admin/publicity'; 
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

    selectHandler = (section, id) => {
        const {publicitySelectedProducts, homePageSelectedProducts} = this.state;

        if(section === 'publicity'){
            if(!publicitySelectedProducts.includes(id)){
                this.setState(prevState => ({
                    publicitySelectedProducts: [...prevState.publicitySelectedProducts, id]
                  }));
            } else {
                this.setState(prevState => ({
                    publicitySelectedProducts: prevState.publicitySelectedProducts.filter( prodId => prodId !== id)
                  }));
            }  
        }

        if(section === 'home page'){
            if(!homePageSelectedProducts.includes(id)){
                this.setState(prevState => ({
                    homePageSelectedProducts: [...prevState.homePageSelectedProducts, id]
                  }));
            } else {
                this.setState(prevState => ({
                    homePageSelectedProducts: prevState.homePageSelectedProducts.filter( prodId => prodId !== id)
                  }));
            }  
        }
         
    }

    deleteHandler = section => {
        if(section === 'publicity'){
           let newPublicityProducts =  this.state.pubProducts.filter(product => !this.state.publicitySelectedProducts.includes(product._id));
           this.setState({
               pubProducts: newPublicityProducts
           })
        }

        if(section === 'home page'){
            let newHomePageProducts =  this.state.homePageProducts.filter(product => !this.state.homePageSelectedProducts.includes(product._id));
            this.setState({
                homePageProducts: newHomePageProducts
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

        if(section === 'home page'){
            this.setState({
                homePageProducts: this.state.init_homePageProducts,
                editingMode: false,
                homePageSelectedProducts: []
            })
        }
    }

    saveHandler = () => {
        const {publicitySelectedProducts, newPubProducts, homePageSelectedProducts, newHomePageProducts } = this.state;

        const formData = new FormData();

        formData.append("removeFromPub", publicitySelectedProducts);
        formData.append("removeFromHomePage", homePageSelectedProducts);

        if(newPubProducts){
            let newPublicityProductsIds = [];
            newPubProducts.forEach(product => {
                newPublicityProductsIds = [...newPublicityProductsIds, product._id]
            })
            formData.append("addToPub", newPublicityProductsIds);
        }

        if(newHomePageProducts){
            let newHomePageProductsIds = [];
            newHomePageProducts.forEach(product => {
                newHomePageProductsIds = [...newHomePageProductsIds, product._id]
            })
            formData.append("addToHomePage", newHomePageProductsIds);
        }

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
            this.fetchProductsHandler();
            this.setState({ editingMode: false, newPubProducts: [], newHomePageProducts: []})
          })
          .catch(err => {
            console.log(err);
          });
    }

    toggleSelector = section => {

        let newSection = null;

        if(!this.state.showSelector){
            newSection = section
        } 

        this.setState(prevState => ({
            showSelector: !prevState.showSelector,
            selectorTitle: newSection
        }));
    }

    addNewPubProducts = products => {
        if(this.state.selectorTitle === 'publicity'){
            this.setState({ newPubProducts: products, showSelector: false, editingMode: 'publicity'})
        }

        if(this.state.selectorTitle === 'home page'){
            this.setState({ newHomePageProducts: products, showSelector: false, editingMode: 'home page'})
        }
        
    }

    render() {
        const {pubProducts, homePageProducts, loading, editingMode, publicitySelectedProducts, homePageSelectedProducts, showSelector, newPubProducts,newHomePageProducts, selectorTitle} = this.state;
        let publicity = <Loader />
        if(!loading){
            publicity = (
            <div className="publicity">

                {showSelector && <PublicitySelector 
                                    toggleSelector={this.toggleSelector} 
                                    addNewProducts={this.addNewPubProducts}
                                    selectorTitle={selectorTitle}
                                 />}
                
                <section className="publicity__section--main publicity__section">
                    <h1 className="publicity__title">Publicity</h1>
                    <div className="publicity__section__controller">
                        <IconSvg icon="add"
                                  onClick={() => this.toggleSelector('publicity')}/>
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
                                                    onClick={() => this.selectHandler('publicity', product._id)}>
                                                    <IconSvg icon="checked"/>
                                                </div>
                                            </Product>
                                        </li>
                                    ))
                                }                 
                    </ul>

                    {
                        newPubProducts.length > 0 && (
                            <div className="publicity__newProducts">
                                <h2 className="publicity__newProducts__title">New products</h2>
                                <ul className="publicity__main__list">               
                                        {
                                        newPubProducts && newPubProducts.map( product => (
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
                                                        <div className={`publicity__main__list__item__checkbox`}>
                                                            <IconSvg icon="checked"/>
                                                        </div>
                                                    </Product>
                                                </li>
                                            ))
                                        }                 
                                </ul>
                            </div>
                        )
                    }

                    
                                
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
                    <div className="publicity__section__controller">
                        <IconSvg icon="add"
                                  onClick={() => this.toggleSelector('home page')}/>
                        <IconSvg icon="bin" customClass="publicity__section__controller__delete"
                                 onClick={() => this.deleteHandler('home page')}/>
                        <IconSvg icon="pencil" 
                                 customClass="publicity__section__controller__edit"
                                 onClick={ () => this.editingModeHandler('home page')}
                        />             
                    </div>
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
                                        >
                                        <div className={`publicity__main__list__item__checkbox
                                                        ${homePageSelectedProducts.includes(product._id) ? 'checked': ''}
                                                        ${editingMode === "home page" ? 'show': ''}`
                                                        }
                                                onClick={() => this.selectHandler("home page",product._id)}>
                                            <IconSvg icon="checked"/>
                                        </div>
                                        </Product>
                                        
                                    </li>
                                    ))
                                } 
                    </ul>

                    {
                        newHomePageProducts.length > 0 && (
                            <div className="publicity__newProducts">
                                <h2 className="publicity__newProducts__title">New products</h2>
                                <ul className="publicity__main__list">               
                                        {
                                        newHomePageProducts && newHomePageProducts.map( product => (
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
                                                        <div className={`publicity__main__list__item__checkbox`}>
                                                            <IconSvg icon="checked"/>
                                                        </div>
                                                    </Product>
                                                </li>
                                            ))
                                        }                 
                                </ul>
                            </div>
                        )
                    }

                    <div className={`publicity__section__cta ${editingMode === "home page" ? 'show': ''}`}>
                                <Button color="primary"
                                        onClick={this.saveHandler}>
                                    Save
                                </Button>
                                <Button color="primary"
                                        onClick={() => this.cancelHandler('home page')}>
                                    Cancel
                                </Button>
                    </div>

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