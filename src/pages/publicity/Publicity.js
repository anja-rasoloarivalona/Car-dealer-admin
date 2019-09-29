import React, { Component } from 'react'
import './Publicity.css';
import { connect } from 'react-redux';
import Product from '../../components/product/Product';

class Publicity extends Component {


    render() {

        const pubProducts = this.props.products.filter( i => i.general[0].publicity === 'oui');
        const homepageProducts = this.props.products.filter( i => i.general[0].homePage === 'oui');

        return (
            <div className="publicity">
                <section className="publicity__section--main publicity__section">
                    <h1 className="publicity__title">Publicity</h1>

                    <ul className="publicity__main__list">

                        
                                {
                                    pubProducts.map( product => (
                                        <li>
                                            <Product  id={product._id}
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
                    
                    


                </section>
                <section className="publicity__section--inventory publicity__section">
                    <h1 className="publicity__title">Home Page</h1>
                    <ul className="publicity__main__list">
                  
                                {
                                    homepageProducts.map( product => (
                                        <li>
                                            <Product  id={product._id}
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
                </section>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        products: state.products.products
    }
}



export default connect(mapStateToProps)(Publicity);