import React, { Component} from 'react'
import './Stats.css';
import './charts/StatsUserConnectionChart.css'
import Loader from '../../components/loader/Loader';
import * as actions from '../../store/actions'
import { connect} from 'react-redux';


//STATS SECTIONS
import WebsiteLoadings from './charts/UserConnection';
import ConnectedUsers from './charts/ConnectedUserCounter';
import FavoriteProducts from './statsSection/FavoriteProducts';
import ProductsView from  './statsSection/ProductsView';




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
            let maxProductViews = 0;
            Object.keys(resData.stats).forEach(brand => {
                if(resData.stats[brand].views > maxProductViews){
                    maxProductViews = resData.stats[brand].views
                }
            })
            this.setState({
                productsStats: resData.stats,
                mostViewedProducts: resData.mostViewedProducts,
                mostFollowedProducts: resData.mostFollowedProducts,
                maxProductViews: maxProductViews,
                loading: false,
                
           })          
        })
        .catch(err => {
            console.log(err);
        });
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

        const {maxProductViews, productsStats, loading, activeSection, userConnectionStats, mostViewedProducts, mostFollowedProducts} = this.state;
        let stats;

        if(loading){
            stats = <Loader />
        }
        if(!loading && activeSection === 'products views'){
            stats = ( <ProductsView 
                        productsStats={productsStats} 
                        maxProductViews={maxProductViews}
                        setProductRequestedId={this.props.setProductRequestedId}
                        mostViewedProducts={mostViewedProducts}
                      />)
        } 
        if(!loading && activeSection === "favorite products"){
            stats = <FavoriteProducts stats={productsStats}
                                      mostFollowedProducts={mostFollowedProducts}
                                      setProductRequestedId={this.props.setProductRequestedId}/>
        }
        if(!loading && activeSection === 'website loadings'){
            stats = <WebsiteLoadings stats={userConnectionStats}/>
        }

        if(!loading && activeSection === 'connected users'){
            stats = <ConnectedUsers stats={userConnectionStats}/>
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