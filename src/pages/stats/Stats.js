import React, { Component } from 'react'
import './Stats.css';
import Loader from '../../components/loader/Loader';

class Stats extends Component {

    state = {
        productsStats: null,
        maxProductViews: 0,
        selectedMadeInProductViews: null,
        maxModelViewsForSelectedMade: 0,
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
            let selectedMadeInProductViews = Object.keys(resData.stats)[0];
            let maxModelViewsForSelectedMade = 0;

          Object.keys(resData.stats[selectedMadeInProductViews].models).forEach(model => {
              if(resData.stats[selectedMadeInProductViews].models[model] > maxModelViewsForSelectedMade){
                  maxModelViewsForSelectedMade = resData.stats[selectedMadeInProductViews].models[model]
              }
          })  

            Object.keys(resData.stats).forEach(made => {
                if(resData.stats[made].views > maxProductViews){
                    maxProductViews = resData.stats[made].views
                }
            })

            this.setState({
                productsStats: resData.stats,
                maxProductViews: maxProductViews,
                loading: false,
                selectedMadeInProductViews: selectedMadeInProductViews,
                maxModelViewsForSelectedMade: maxModelViewsForSelectedMade

            }, () => console.log(this.state))
           
        })
        .catch(err => {
            console.log(err);
        });
    }

    selectMadeInProductViewsHandler = made => {
        let stats = this.state.productsStats; 
        let maxModelViewsForSelectedMade = 0;
        Object.keys(stats[made].models).forEach(model => {
            if(stats[made].models[model] > maxModelViewsForSelectedMade){
                maxModelViewsForSelectedMade = stats[made].models[model]
            }
        }) 
        this.setState({ selectedMadeInProductViews: made,
                        maxModelViewsForSelectedMade: maxModelViewsForSelectedMade})
    }


    render() {

        const {maxProductViews, productsStats, loading, selectedMadeInProductViews, maxModelViewsForSelectedMade} = this.state;

        let stats = <Loader />
        if(!loading){
            stats = (

            <section className="stats__productViews">

                <h1 className="app__primary__title">Product Views</h1>

                <div className="stats__productViews__Container"> 

                                
                    <ul className="stats__productViews__list">
                        <h2 className="stats__productViews__title">Par marque</h2>  
                        {Object.keys(productsStats).map(made => (
                            <li className={`stats__productViews__list__item
                                            ${selectedMadeInProductViews === made ? 'active' : ''}`}
                                onClick={() => this.selectMadeInProductViewsHandler(made)}>
                                <div className="stats__productViews__list__item__made">
                                    {made}
                                </div>

                                <div className="stats__productViews__list__item__viewBar">
                                    <div className="stats__productViews__list__item__viewBar__inner"
                                        style={{ width: `${(productsStats[made].views / maxProductViews) * 100}%`}}></div>
                                </div>
                                <div className="stats__productViews__list__item__viewCounter">
                                    {productsStats[made].views}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="stats__productViews__byMades">
                        <h2 className="stats__productViews__title">Par modèle</h2>  
                        <h3 className="stats__productViews__byMades__title">
                            <span>
                                {selectedMadeInProductViews} 
                            </span>
                            <span>
                                {productsStats[selectedMadeInProductViews].views}
                            </span>
                        </h3>
                        <ul className="stats__productViews__byMades__list">
                            {Object.keys(productsStats[selectedMadeInProductViews].models).map(model => (
                                <li className="stats__productViews__byMades__list__item">
                                    <div className="stats__productViews__byMades__list__item__model">{model}</div> 
                                    <div className="stats__productViews__byMades__list__item__viewBar">
                                        <div className="stats__productViews__byMades__list__item__viewBar__inner"
                                             style={{ width: `${ productsStats[selectedMadeInProductViews].models[model] / maxModelViewsForSelectedMade * 100 }%`}}>
                                        </div>
                                    </div>
                                    <div className="stats__productViews__byMades__list__item__viewCounter">
                                        {productsStats[selectedMadeInProductViews].models[model]}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>             
           </section>
        )} 

        return (
            <div className="stats">
               {stats}
            </div>
        )
    }
}



export default Stats;