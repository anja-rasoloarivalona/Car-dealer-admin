import React, { Component, Fragment } from 'react'
import './Stats.css';
import Loader from '../../components/loader/Loader';
import StatsUserConnectionChart from './statsUserConnectionChart/StatsUserConnectionChart'

class Stats extends Component {

    state = {
        productsStats: null,
        maxProductViews: 0,
        selectedBrandInProductViews: null,
        maxModelViewsForSelectedBrand: 0,
        loading: true
    }
    componentDidMount(){
        this.fetchUsersHandler()
    }

    fetchUsersHandler = () => {
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
            let selectedBrandInProductViews = Object.keys(resData.stats)[0];
            let maxModelViewsForSelectedBrand = 0;

          Object.keys(resData.stats[selectedBrandInProductViews].models).forEach(model => {
              if(resData.stats[selectedBrandInProductViews].models[model] > maxModelViewsForSelectedBrand){
                  maxModelViewsForSelectedBrand = resData.stats[selectedBrandInProductViews].models[model]
              }
          })  

            Object.keys(resData.stats).forEach(brand => {
                if(resData.stats[brand].views > maxProductViews){
                    maxProductViews = resData.stats[brand].views
                }
            })

            this.setState({
                productsStats: resData.stats,
                maxProductViews: maxProductViews,
                loading: false,
                selectedBrandInProductViews: selectedBrandInProductViews,
                maxModelViewsForSelectedBrand: maxModelViewsForSelectedBrand

            })
           
        })
        .catch(err => {
            console.log(err);
        });
    }

    selectBrandInProductViewsHandler = brand => {
        let stats = this.state.productsStats; 
        let maxModelViewsForSelectedBrand = 0;
        Object.keys(stats[brand].models).forEach(model => {
            if(stats[brand].models[model] > maxModelViewsForSelectedBrand){
                maxModelViewsForSelectedBrand = stats[brand].models[model]
            }
        }) 
        this.setState({ selectedBrandInProductViews: brand,
                        maxModelViewsForSelectedBrand: maxModelViewsForSelectedBrand})
    }


    render() {

        const {maxProductViews, productsStats, loading, selectedBrandInProductViews, maxModelViewsForSelectedBrand} = this.state;

        let stats = <Loader />
        if(!loading){
            stats = (
            <Fragment>
                <section className="stats__productViews">
                    <h1 className="app__primary__title">Product Views</h1>
                    <div className="stats__productViews__Container">              
                        <ul className="stats__productViews__list">
                            <h2 className="stats__productViews__title">Par marque</h2>  
                            {Object.keys(productsStats).map(brand => (
                                <li className={`stats__productViews__list__item
                                                ${selectedBrandInProductViews === brand ? 'active' : ''}`}
                                    onClick={() => this.selectBrandInProductViewsHandler(brand)}>
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
                                </li>
                            ))}
                        </ul>
                        <div className="stats__productViews__byBrand">
                            <h2 className="stats__productViews__title">Par modèle</h2>  
                            <h3 className="stats__productViews__byBrand__title">
                                <span>
                                    {selectedBrandInProductViews} 
                                </span>
                                <span>
                                    {productsStats[selectedBrandInProductViews].views}
                                </span>
                            </h3>
                            <ul className="stats__productViews__byBrand__list">
                                {Object.keys(productsStats[selectedBrandInProductViews].models).map(model => (
                                    <li className="stats__productViews__byBrand__list__item">
                                        <div className="stats__productViews__byBrand__list__item__model">{model}</div> 
                                        <div className="stats__productViews__byBrand__list__item__viewBar">
                                            <div className="stats__productViews__byBrand__list__item__viewBar__inner"
                                                style={{ width: `${ productsStats[selectedBrandInProductViews].models[model] / maxModelViewsForSelectedBrand * 100 }%`}}>
                                            </div>
                                        </div>
                                        <div className="stats__productViews__byBrand__list__item__viewCounter">
                                            {productsStats[selectedBrandInProductViews].models[model]}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>             
                </section>

                <StatsUserConnectionChart />
              
            </Fragment>
            
        )} 

        return (
            <div className="stats">
               {stats}
            </div>
        )
    }
}



export default Stats;