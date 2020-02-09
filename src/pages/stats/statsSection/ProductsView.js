import React, { Component , Fragment } from 'react';
import Title from '../../../components/title/Title';
import Button from '../../../components/button/Button';
import Product from '../../../components/product/Product';
import {withRouter} from 'react-router-dom'

class ProductsView extends Component {
    state = {
        showBrandsData: [],   
    }

    showBrandsDataHandler = brand => {
        let showBrandsData = [];
        if(brand === 'show all'){
            showBrandsData = Object.keys(this.props.productsStats)
        } else {
            if(brand === 'hide all'){
                showBrandsData = [];
            } else {
                if(!this.state.showBrandsData.includes(brand)){
                    showBrandsData = [...this.state.showBrandsData, brand]
                } else {
                    showBrandsData = this.state.showBrandsData.filter( i => i !== brand)
                }
            }
        }     
         this.setState({ showBrandsData })
    }

    render() {
        const { showBrandsData } = this.state
        let productsStats = this.props.productsStats;
        let maxProductViews = this.props.maxProductViews;
        let mostViewedProducts = this.props.mostViewedProducts

        return (
            <Fragment>
                <section className="stats__section">
                    <Title title=" Products views">
                        <div className="stats__section__title__cta">
                                <Button color="primary"
                                        onClick={() => this.showBrandsDataHandler('show all')}>
                                    Show
                                </Button>
                                <Button  color="primary"
                                    onClick={() => this.showBrandsDataHandler('hide all')}>
                                    Hide
                                </Button>
                            </div>
                    </Title>             
                    <ul className="stats__section__list">
                        {Object.keys(productsStats).map(brand => (
                            <li className={`stats__section__list__item
                                        ${showBrandsData.includes(brand) ? 'showList': ''}`}
                                key={brand}>                       
                                <div className="stats__section__list__item__brandContainer"
                                    onClick={() => this.showBrandsDataHandler(brand)}>
                                    <div className="stats__section__list__item__brand">
                                        {brand}
                                    </div>

                                    <div className="stats__section__list__item__viewBar">
                                        <div className="stats__section__list__item__viewBar__inner"
                                            style={{ width: `${(productsStats[brand].views / maxProductViews) * 100}%`}}></div>
                                    </div>
                                    <div className="stats__productViews__list__item__viewCounter">
                                        {productsStats[brand].views}
                                    </div>
                                </div>                           
                                <ul className="stats__section__list__item__modelsList">
                                    {Object.keys(productsStats[brand].models).map(model => (
                                        <li key={model} className="stats__section__list__item__modelsList__item">
                                            <div className="stats__section__list__item__modelsList__item__model">{model}</div> 
                                            <div className="stats__section__list__item__modelsList__item__viewBar">
                                                <div className="stats__section__list__item__modelsList__item__viewBar__inner"
                                                    style={{ width: `${ productsStats[brand].models[model].viewCounter / maxProductViews * 100 }%`}}>
                                                </div>
                                            </div>
                                            <div className="stats__section__list__item__modelsList__item__viewCounter">
                                                {productsStats[brand].models[model].viewCounter}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                
                            </li>
                        ))}
                    </ul>                   
                </section>
                <section className="stats__section">
                    <Title title="Top views"/>
                    <ul className="stats__products__list">
                            {mostViewedProducts.map(product => (
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
                                    goToProd={() => {
                                    this.props.setProductRequestedId(product._id);
                                    this.props.history.push(`/inventory/${product._id}`);
                                    }}
                            />
                            ))}                    
                    </ul>                          
                </section>
            </Fragment>
        )
    }
}

export default withRouter(ProductsView)
