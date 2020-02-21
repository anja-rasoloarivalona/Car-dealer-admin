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
        loading: true,
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
            let data = {
                pubProducts: resData.publicity,
                homePageProducts: resData.home,
            }
            this.props.setPublicityData(data);
            this.setState({loading: false})
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
        let newEditingMode;
        let currentEditingMode = this.props.editingMode;



        if(!currentEditingMode){
            newEditingMode = [mode];
            this.props.setPublicityEditingMode(newEditingMode);
        } else {
            if(!currentEditingMode.includes(mode)){
                newEditingMode = [...currentEditingMode, mode]
                this.props.setPublicityEditingMode(newEditingMode);
            } else {
                this.cancelHandler(mode)
            }
        }
        



        
    }

    selectHandler = (section, id) => {
        const {selectedPubProducts, selectedHomePageProducts} = this.props;
        let data = [];
        if(section === 'publicity'){
            if(!selectedPubProducts.includes(id)){
                data = [...selectedPubProducts, id]
            } else {
                data = selectedPubProducts.filter(prodId => prodId !== id)
            }  
            this.props.setPublicitySelectedPubProducts(data)
        }
        if(section === 'home page'){
            if(!selectedHomePageProducts.includes(id)){
                data = [...selectedHomePageProducts, id]
            } else {
                data = selectedHomePageProducts.filter(prodId => prodId !== id)
            }  
            this.props.setPublicitySelectedHomePageProducts(data)
        }
    }

    deleteHandler = section => {
        if(section === 'publicity'){
           let newPublicityProducts =  this.props.currentPubProducts.filter(product => !this.props.selectedPubProducts.includes(product._id));
           this.props.deletePublicitySelectedPubProducts(newPublicityProducts)
        }

        if(section === 'home page'){
            let newHomePageProducts =  this.props.currentHomePageProducts.filter(product => !this.props.selectedHomePageProducts.includes(product._id));
            this.props.deletePublicitySelectedHomePageProducts(newHomePageProducts)
         }
    }

    cancelHandler = section => {
        this.props.cancelPublicityEditingMode(section)
    }

    saveHandler = () => {
        const {publicitySelectedProducts, newPubProducts, homePageSelectedProducts, newHomePageProducts } = this.props;

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
        this.props.togglePublicitySelector(section)
    }

    addNewPubProducts = products => {
        let currentEditingMode = this.props.editingMode;
        let selectorTitle = this.props.selectorTitle

        if(selectorTitle === 'publicity'){


            this.props.addPublicityPubProducts(products);  

            if(!currentEditingMode.includes('publicity')){
                this.editingModeHandler('publicity')
            }          
        }

        if(selectorTitle === 'home page'){
            this.props.addPublicityHomePageProducts(products);         
            if(!currentEditingMode.includes('home page')){
                this.editingModeHandler('home page')
            } 
        }

        this.props.togglePublicitySelector()
        
    }

    render() {
        const { loading} = this.state;

        const {
                currentPubProducts, 
                currentHomePageProducts, 
                editingMode,
                selectedPubProducts,
                selectedHomePageProducts,
                showSelector,
                selectorTitle,
                newPubProducts,
                newHomePageProducts
              } = this.props;

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
                                   currentPubProducts && currentPubProducts.map( product => (
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
                                                                ${ selectedPubProducts.includes(product._id) ? 'checked': ''}
                                                                ${editingMode && editingMode.includes("publicity") ? 'show': ''}`
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

                    
                                
                    <div className={`publicity__section__cta ${editingMode && editingMode.includes("publicity") ? 'show': ''}`}>
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
                                   currentHomePageProducts && currentHomePageProducts.map( product => (
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
                                                        ${selectedHomePageProducts.includes(product._id) ? 'checked': ''}
                                                        ${editingMode && editingMode.includes("home page") ? 'show': ''}`
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

                    <div className={`publicity__section__cta ${editingMode && editingMode.includes("home page") ? 'show': ''}`}>
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
        INIT_pubProducts: state.publicity.INIT_pubProducts,
        INIT_homePageProducts: state.publicity.INIT_homePageProducts,
        currentPubProducts: state.publicity.currentPubProducts,
        currentHomePageProducts: state.publicity.currentHomePageProducts,
        selectedPubProducts: state.publicity.selectedPubProducts,
        selectedHomePageProducts: state.publicity.selectedHomePageProducts,

        newPubProducts: state.publicity.newPubProducts,
        newHomePageProducts: state.publicity.newHomePageProducts,

        showSelector: state.publicity.showSelector,
        selectorTitle: state.publicity.selectorTitle,
        editingMode: state.publicity.editingMode



    }
}

const mapDispatchToProps = dispatch => {
    return {
        setProductRequestedId: (prodId) => dispatch(actions.setRequestedProductId(prodId)),
        setPublicityData: data => dispatch(actions.setPublicityData(data)),
        setPublicityEditingMode: data => dispatch(actions.setPublicityEditingMode(data)),
        setPublicitySelectedPubProducts: data => dispatch(actions.setPublicitySelectedPubProducts(data)),
        setPublicitySelectedHomePageProducts: data => dispatch(actions.setPublicitySelectedHomePageProducts(data)),
        cancelPublicityEditingMode: section => dispatch(actions.cancelPublicityEditingMode(section)),
        deletePublicitySelectedHomePageProducts: data => dispatch(actions.deletePublicitySelectedHomePageProducts(data)),
        deletePublicitySelectedPubProducts: data => dispatch(actions.deletePublicitySelectedPubProducts(data)),
        togglePublicitySelector: section => dispatch(actions.togglePublicitySelector(section)),
        addPublicityPubProducts: data => dispatch(actions.addPublicityPubProducts(data)),
        addPublicityHomePageProducts: data => dispatch(actions.addPublicityHomePageProducts(data))
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Publicity);