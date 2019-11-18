import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import './StatsUserConnectionChart.css';

class StatsUserConnectionChart extends Component {

    state = {

        data: {
            labels: ["1", "2", "3", "4"],
            datasets: [
                {
                    label: 'Video Mades',
                   // backgroundColor: 'rgba(255, 0, 255, 0.75)',
                    data: [4, 5, 7,1,6]
                }
            ]
        },

        globalStatsDataSet: null,
        statsUserConnectionFilter: 'general', //general or by month
        statsUserConnectionFilterByMonth: null,

        statsUserConnectionFilterByMonthLabels: [],

        showUserConnectionFilterByMonthList: false,

        resData: null

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
            this.selectUsersConnectionFilterGeneral(stats)
         })
         .catch(err => {
            console.log(err);
        });
    }



    selectUsersConnectionFilterByMonth = monthAndYear => {   
            let dataset = this.state.globalStatsDataSet;
            let filterByMonth = monthAndYear;
            let filterByMonthData = {};
    
            dataset.forEach(data => {
                let monthAndYear = data.start.slice(3, 10);
                let fullDate = data.start.split(' ')[0];
               
    
                if(monthAndYear === filterByMonth){
                    if(!Object.keys(filterByMonthData).includes(fullDate)){
                        filterByMonthData[fullDate] = 1
                    }else {
                        filterByMonthData[fullDate] = filterByMonthData[fullDate] + 1
                    }
                }
            })
            let numberOfConnectionsData = [];
            let labels = [];
            
            Object.keys(filterByMonthData).forEach(data => {
                numberOfConnectionsData.push(filterByMonthData[data])
                labels.push(data.slice(0, 5))
            })
    
            let data = {
                labels: labels,
                datasets: [
                    {
                        label: 'Number of connections',
                        data: numberOfConnectionsData,
                        backgroundColor: 'transparent'
                    }
                ]
            }   
            this.setState({ statsUserConnectionFilter: 'byMonth', showUserConnectionFilterByMonthList: true, data: data})    
    }

    selectUsersConnectionFilterByMonthHandler = monthAndYear => {
        this.setState({ statsUserConnectionFilterByMonth : monthAndYear} , () => this.selectUsersConnectionFilterByMonth(monthAndYear))
    }

    selectUsersConnectionFilterGeneral = stats => {

        console.log('stta', stats);

        //Storing all the connection dataset
        let globalStatsDataSet = []

        stats.forEach(userStat => {
            userStat.connection.forEach(connection => {
                globalStatsDataSet.push(connection)
            })
        })

        //Built labels
        let generalLabelsFullDate = [];
        let generalLabelsShortDate = {};

        let statsUserConnectionFilterByMonthLabels = [];


        globalStatsDataSet.forEach(data => {
            let fullDate = data.start.split(' ')[0];
            let shortDate = fullDate.slice(0, 5);
            let monthAndYear = fullDate.slice(3, 10)

            if(!generalLabelsFullDate.includes(fullDate)){
                generalLabelsFullDate = [...generalLabelsFullDate, fullDate]
                generalLabelsShortDate[shortDate] = 1;
            } else {
                generalLabelsShortDate[shortDate] = generalLabelsShortDate[shortDate] + 1
            }

            if(!statsUserConnectionFilterByMonthLabels.includes(monthAndYear)){
                statsUserConnectionFilterByMonthLabels.push(monthAndYear)
            }
        })


        let statsUserConnectionFilterByMonth = statsUserConnectionFilterByMonthLabels[0]


        let numberOfConnectionsData = [];
        Object.keys(generalLabelsShortDate).forEach(shortDate => {
            numberOfConnectionsData.push(generalLabelsShortDate[shortDate])
        })

        let data = {
            labels: Object.keys(generalLabelsShortDate),
            datasets: [
                {
                    label: 'Number of connections',
                    data: numberOfConnectionsData,
                    backgroundColor: 'transparent'
                }
            ]
        }
        this.setState({ 
                        data: data, 
                        resData: stats,
                        globalStatsDataSet: globalStatsDataSet,
                        statsUserConnectionFilterByMonthLabels: statsUserConnectionFilterByMonthLabels, 
                        statsUserConnectionFilterByMonth: statsUserConnectionFilterByMonth,
                        statsUserConnectionFilter: 'general',
                        showUserConnectionFilterByMonthList: false}, () => console.log(this.state))
    }


    render() {

        const {statsUserConnectionFilterByMonthLabels, statsUserConnectionFilter, showUserConnectionFilterByMonthList, statsUserConnectionFilterByMonth, resData} = this.state;

        return (
            <div className="stats__userConnection__container">        
                <div className="stats__userConnection__filter">
                    <h2 className="stats__userConnection__filter__title">Filtre</h2>
                    <ul className="stats__userConnection__filter__list">

                        <li className={`stats__userConnection__filter__list__item
                                      ${statsUserConnectionFilter === 'general' ? 'active': ''}`}
                            onClick={() => this.selectUsersConnectionFilterGeneral(resData)}>
                                general
                        </li>

                        <li className={`stats__userConnection__filter__list__item
                                       ${statsUserConnectionFilter === 'byMonth' ? 'active': ''}`}
                            onClick={() => this.selectUsersConnectionFilterByMonth(statsUserConnectionFilterByMonth)}>
                            <div className="stats__userConnection__filter__list__item__key">Par mois</div>
                            <div className="stats__userConnection__filter__list__item__value">{statsUserConnectionFilterByMonth}</div>
                            <ul className={`stats__userConnection__filter__byMonthList
                                            ${showUserConnectionFilterByMonthList === true ? 'shown' : ''}`}>
                                {statsUserConnectionFilterByMonthLabels.map(label => (
                                    <li key={label}
                                        onClick={() => this.selectUsersConnectionFilterByMonthHandler(label)} 
                                        className={`stats__userConnection__filter__byMonthList__item
                                                    ${statsUserConnectionFilterByMonth === label ? 'active' : ''}`}>
                                        {label}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ul>
                </div>     
                <div className="stats__userConnection__chartContainer">
                    <Line 
                        options={{
                            responsive: true
                        }}
                        data={this.state.data}
                    />  
                </div>   
            </div>
        )
    }
}


export default StatsUserConnectionChart
