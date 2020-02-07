import React, { Component, Fragment } from 'react';
import './StatsUserConnectionChart.css';
import UserConnection from './charts/UserConnection';
import ConnectedUserCounter from './charts/ConnectedUserCounter'

import Loader from '../../../components/loader/Loader';

class StatsUserConnectionChart extends Component {

    state = {
        resData: null,
        loading: true
    }

    componentDidMount(){
        this.fetchUserConnectionHandler()
    }

    fetchUserConnectionHandler = () => {
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
            this.setState({ resData: stats, loading: false})
         })
         .catch(err => {
            console.log(err);
        });
    }

    render() {

        const {resData, loading} = this.state;

        let charts = <Loader />
        if(!loading){
            charts = (
                <Fragment>
                    <UserConnection stats={resData}/>
                    <ConnectedUserCounter stats={resData}/> 
                </Fragment>
            )
        }

        return charts
    }
}


export default StatsUserConnectionChart
