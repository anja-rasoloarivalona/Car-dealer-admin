import React from 'react';
import './ProductsList.css';
import ProductCard from '../product/Product';
// import * as actions from '../../store/actions';
// import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom'

const ProductsList = props => {
    const requestProductDetails = (data) => {
        props.history.push(`/inventory/${data._id}?brand=${data.general.brand}&model=${data.general.model}&price=${data.general.price}`); 
        if(props.fetchProductDetailsHandler){
                props.fetchProductDetailsHandler(data)
        }     
        
    }
  
    let productsList = props.productsList;
    return (
        <ul className="products-list">
            {productsList.map(product => (
                <li key={product._id} className="products-list__item">
                    <ProductCard 
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
                        goToProd={() => requestProductDetails(product)}
                    />
                </li>
            ))}
        </ul>
    )
}

export default withRouter(ProductsList)
