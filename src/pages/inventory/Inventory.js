import React, { Component } from 'react'
import './Inventory.css';

import Product from '../../components/product/Product';

import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import Input from '../../components/formInput/FormInput';
import IconSvg from '../../utilities/svg/svg';


class Inventory extends Component {

    state = {
        products: []
    }

    componentDidMount(){
        let url = "http://localhost:8000/admin/products";
        let method = 'GET';

        fetch( url, {
            headers: {
                "Content-Type": "application/json"
            },
            method: method
        })
        .then(res => {
            if(res.status !== 200){
                throw new Error('Failed to fectch products')
            }
            return res.json(); //extract the body
        })
        .then(resData => {
            this.setState({ 
                products: resData.products
            }, () => console.log(this.state.products))
        })
        .catch( err => {
            console.log(err)
        })
    }


    render() {

        const { products } = this.state
        return (
            <div className="inventory">

                <div className="inventory__filter">
                    <div className="inventory__filter__searchBar">
                        <Input control='input'
                               value=''
                               type='text'
                               placeholder='search...'/>
                        <IconSvg icon="search"/>
                    </div>
                </div>


                <ul className="inventory__list">
                  
                    {
                        products.map( product => (
                            <li className="inventory__list__item">
                                <Product
                                    id={product._id} 
                                    key={product.general[0].mainImgUrl}
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
                                                this.props.history.push(`/car/${product._id}`)
                                    }}/>
                            </li>
                        ))
                    }
                </ul>

            </div>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        setProductRequestedId: (prodId) => dispatch(actions.setRequestedProductId(prodId))
    }
}


export default connect(null, mapDispatchToProps)(Inventory);
