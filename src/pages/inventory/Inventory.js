import React, { Component } from 'react'
import './Inventory.css';

import Product from '../../components/product/Product';


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

                <ul className="inventory__list">
                  
                    {
                        products.map( product => (
                            <li className="inventory__list__item">
                                <Product 
                                    key={product.general[0].mainImgUrl}
                                    mainImg={product.general[0].mainImgUrl}
                                    made={product.general[0].made}
                                    model={product.general[0].model}
                                    year={product.general[0].year}
                                    price={product.general[0].price}
                                    nbKilometers={product.general[0].nbKilometers}
                                    gazol={product.general[0].gazol}
                                    transmissionType={product.general[0].transmissionType}/>
                            </li>
                        ))
                    }
                </ul>

            </div>
        )
    }
}



export default Inventory;
