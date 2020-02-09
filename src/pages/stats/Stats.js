import React, { Component, Fragment} from 'react'
import './Stats.css';
import './charts/StatsUserConnectionChart.css'
import Loader from '../../components/loader/Loader';
import WebsiteLoadings from './charts/UserConnection';
import ConnectedUsers from './charts/ConnectedUserCounter';
import FavoriteProducts from './FavoriteProducts/FavoriteProducts';
import * as actions from '../../store/actions'
import { connect} from 'react-redux';
import Product from '../../components/product/Product';
import Button from '../../components/button/Button';

class Stats extends Component {

    state = {
        productsStats: null,
        maxProductViews: 0,
        loading: true,
        showBrandsData: [],
        activeSection: 'products views',
        userConnectionStats: null,
        mostViewedProducts: null,
        mostFollowedProducts: null       
    }
    componentDidMount(){
        this.fetchProductsStats()
    }

    fetchProductsStats = () => {
        let url = "http://localhost:8000/stats/products-stats";
       fetch(url, {
           headers: {
               "Content-Type": "application/json"
           },
       })
       .then(res => {
            if (res.status !== 200) {
            throw new Error("Failed to fetch users");
            }
            return res.json();
        })
        .then(resData => {
            console.log('res', resData);

            let maxProductViews = 0;
            Object.keys(resData.stats).forEach(brand => {
                if(resData.stats[brand].views > maxProductViews){
                    maxProductViews = resData.stats[brand].views
                }
            })

            this.setState({
                productsStats: resData.stats,
                maxProductViews: maxProductViews,
                loading: false,
                mostViewedProducts: resData.mostViewedProducts,
                mostFollowedProducts: resData.mostFollowedProducts
            })
           
        })
        .catch(err => {
            console.log(err);
        });
    }

    showBrandsDataHandler = brand => {
        let showBrandsData = [];

        if(brand === 'show all'){
            showBrandsData = Object.keys(this.state.productsStats)
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


    

    fetchUserConnectionStats = () => {
        let url = "http://localhost:8000/stats/user-connection-stats";
        fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(res => {
             if (res.status !== 200) {
             throw new Error("Failed to fetch users connection stats");
             }
             return res.json();
         })
         .then(resData => {
            let stats = resData.stats;
            this.setState({  userConnectionStats: stats, loading: false})
         })
         .catch(err => {
            console.log(err);
        });
    }

    activSectionToggler = section => {
        const {userConnectionStats} = this.state
        if(section === 'website loadings' && !userConnectionStats || section === 'connected users' && !userConnectionStats){
            this.setState({ loading: true, activeSection: section}, () => this.fetchUserConnectionStats()); 
        } else {
            this.setState({ activeSection: section})
        }
        
    }

    render() {

        const {maxProductViews, productsStats, loading, showBrandsData, activeSection, userConnectionStats, mostViewedProducts, mostFollowedProducts} = this.state;
        let stats;

        if(loading){
            stats = <Loader />
        }

        if(!loading && activeSection === 'products views'){
            stats = (
                <Fragment>
                <section className="stats__section">

                    <div className="stats__section__title">
                        <h1 className="app__primary__title">
                            Products view
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
                            {Object.keys(productsStats).map(brand => (
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
                                                style={{ width: `${(productsStats[brand].views / maxProductViews) * 100}%`}}></div>
                                        </div>
                                        <div className="stats__productViews__list__item__viewCounter">
                                            {productsStats[brand].views}
                                        </div>
                                    </div>
                                   
                                    <ul className="stats__productViews__item__models__list">
                                        {Object.keys(productsStats[brand].models).map(model => (
                                            <li className="stats__productViews__item__models__list__item">
                                                <div className="stats__productViews__item__models__list__item__model">{model}</div> 
                                                <div className="stats__productViews__item__models__list__item__viewBar">
                                                    <div className="stats__productViews__item__models__list__item__viewBar__inner"
                                                        style={{ width: `${ productsStats[brand].models[model].viewCounter / maxProductViews * 100 }%`}}>
                                                    </div>
                                                </div>
                                                <div className="stats__productViews__item__models__list__item__viewCounter">
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
                  <h1 className="app__primary__title">Top views</h1>
                  <ul className="stats__topViews__list">
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
            
                          
        )} 

        if(!loading && activeSection === 'website loadings'){
            stats = <WebsiteLoadings stats={userConnectionStats}/>
        }

        if(!loading && activeSection === 'connected users'){
            stats = <ConnectedUsers stats={userConnectionStats}/>
        }

        if(!loading && activeSection === "favorite products"){
            stats = <FavoriteProducts stats={productsStats}
                                      mostFollowedProducts={mostFollowedProducts}
                                      setProductRequestedId={this.props.setProductRequestedId}/>
        }

        return (
            <div className="stats">

                <nav className="stats__nav">
                    <ul className="stats__nav__list">
                        <li className={`stats__nav__list__item ${activeSection === 'products views' ? 'active' : ''}`}
                            onClick={() => this.activSectionToggler('products views')}>
                            Products Views
                        </li>
                        <li className={`stats__nav__list__item ${activeSection === 'favorite products' ? 'active' : ''}`}
                            onClick={() => this.activSectionToggler('favorite products')}>
                            Favorite Products
                        </li>
                        
                        <li className={`stats__nav__list__item ${activeSection === 'website loadings' ? 'active' : ''}`}
                        onClick={() => this.activSectionToggler('website loadings')}>
                            Website loadings
                        </li>
                        <li className={`stats__nav__list__item  ${activeSection === 'connected users' ? 'active' : ''}`}
                        onClick={() => this.activSectionToggler('connected users')}>
                            Connected users
                        </li>
                    </ul>
                </nav>
               {stats}
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setProductRequestedId: (prodId) =>dispatch(actions.setRequestedProductId(prodId)),
    }
}

export default connect(null, mapDispatchToProps)(Stats);