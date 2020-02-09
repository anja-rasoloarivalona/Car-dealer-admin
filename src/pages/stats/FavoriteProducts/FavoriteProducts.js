import React, { Component , Fragment} from 'react';
import Loader from '../../../components/loader/Loader';
import Button from '../../../components/button/Button';
import Product from '../../../components/product/Product'

class FavoriteProducts extends Component {

    state = {
        data : null,
        loading: true,
        showBrandsData: [],
        maxFollowedProducts: 0
    }


    componentDidMount(){
        console.log('faaavorite',this.props.stats)
        let stats= this.props.stats;
        let sortedBrands = [];
        for(let brand in stats){
            sortedBrands.push([ brand, stats[brand].followers])
        }
        sortedBrands.sort((a, b) => {
            return b[1] - a[1];
        })

        let maxFollowedProducts = sortedBrands[0][1]

        let data = {}; 
        sortedBrands.forEach(brandData => {
            let brandName = brandData[0];
            data[brandName] = {
                followers: brandData[1],
                models: {...stats[brandName].models}
            }
            
        })



        this.setState({ data, maxFollowedProducts , loading: false})
    }

    showBrandsDataHandler = brand => {
        let showBrandsData = [];

        if(brand === 'show all'){
            showBrandsData = Object.keys(this.state.data)
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

        const {data, loading, maxFollowedProducts, showBrandsData} = this.state
        let mostFollowedProducts = this.props.mostFollowedProducts

        let stats = <Loader />;

        if(!loading){
            stats = 
            
            <Fragment>
                <section className="stats__section">

                    <div className="stats__section__title">
                        <h1 className="app__primary__title">
                            Favorite products
                        </h1>
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
                    </div>
                    <ul className="stats__productViews__list">
                            {Object.keys(data).map(brand => (
                                <li className={`stats__productViews__list__item
                                               ${showBrandsData.includes(brand) ? 'showList': ''}`}
                                    key={brand}>                       
                                    <div className="stats__productViews__list__item__brandContainer"
                                         onClick={() => this.showBrandsDataHandler(brand)}>
                                        <div className="stats__productViews__list__item__brand">
                                            {brand}
                                        </div>

                                        <div className="stats__productViews__list__item__viewBar">
                                            <div className="stats__productViews__list__item__viewBar__inner"
                                                 style={{ width: `${(data[brand].followers / maxFollowedProducts) * 100}%`}}
                                                >
                                                </div>
                                        </div>
                                        <div className="stats__productViews__list__item__viewCounter">
                                            {data[brand].followers}
                                        </div>
                                    </div>
                                   
                                    <ul className="stats__productViews__item__models__list">
                                        {Object.keys(data[brand].models).map(model => (
                                            <li className="stats__productViews__item__models__list__item">
                                                <div className="stats__productViews__item__models__list__item__model">{model}</div> 
                                                <div className="stats__productViews__item__models__list__item__viewBar">
                                                    <div className="stats__productViews__item__models__list__item__viewBar__inner"
                                                        style={{ width: `${ data[brand].models[model].favoritesCounter / maxFollowedProducts * 100 }%`}}>
                                                    </div>
                                                </div>
                                                <div className="stats__productViews__item__models__list__item__viewCounter">
                                                    {data[brand].models[model].favoritesCounter}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    
                                </li>
                            ))}
                        </ul>
                        </section>
                        <section className="stats__section">
                            <h1 className="app__primary__title">Top followed</h1>
                            <ul className="stats__topViews__list">
                                    {mostFollowedProducts.map(product => (
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
        }


        return (
            <div>
                {stats}
            </div>
        )
    }
}

export default FavoriteProducts
