import React, { Component, Fragment } from 'react'
import './PublicitySelector.css';
import Loader from '../../../components/loader/Loader';
import Product from '../../../components/product/Product';
import Button from '../../../components/button/Button';
import IconSvg from '../../../utilities/svg/svg';

class PublicitySelector extends Component {

    state = {
        products: null,
        loading: true,
        selectedProductsIds: [],
        selectedProductsDetails: []
    }

    componentDidMount(){
        this.fetchProductsHandler()
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
            }, () => console.log('yewgw', this.state))
        })
        .catch( err => {
            console.log(err)
            this.setState({ loading: false})
        })
    }

    selectHandler = product => {
        const { selectedProductsIds } = this.state;
        let id = product._id

        if(!selectedProductsIds.includes(id)){

            this.setState(prevState => ({
                selectedProductsIds: [...prevState.selectedProductsIds, id],
                selectedProductsDetails: [...prevState.selectedProductsDetails, product]
            }));


        } else {
            this.setState(prevState => ({
                selectedProductsIds: prevState.selectedProductsIds.filter( prodId => prodId !== id),
                selectedProductsDetails: prevState.selectedProductsDetails.filter( prod => prod._id !== id),
              }));
        }   
    }


    render() {

        const {products, loading, selectedProductsIds, selectedProductsDetails} = this.state;
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
                                                    >
                                                    <div className={`publicitySelector__checkbox 
                                                                    ${selectedProductsIds.includes(product._id) ? 'checked': ''}`}
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
                                    onClick={() => this.props.addNewProducts(selectedProductsDetails)}>
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

export default PublicitySelector
