import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { daysInMonth } from '../../../../utilities/daysInMonth';
class UserConnection extends Component {
    state = {

        data: {
            labels: [],
            datasets: []
        },

        globalStatsDataSet: null,
        statsUserConnectionFilter: 'general', //general or by month
        statsUserConnectionFilterByMonth: null,

        statsUserConnectionFilterByMonthLabels: [],

        showUserConnectionFilterByMonthList: false,

        resData: null

    }

    componentDidMount(){
        this.selectUsersConnectionFilterGeneral(this.props.stats)
    }

    selectUsersConnectionFilterByMonth = monthAndYear => {   

            let dataset = this.state.globalStatsDataSet;
            let month = monthAndYear.split('-')[0];
            let year = monthAndYear.split('-')[1]
            let daysInMonthCounter = daysInMonth( parseInt(month), parseInt(year));

            let tempLabels = [];
            let day;
            for(day = 1 ; day < daysInMonthCounter + 1; day++ ){
                tempLabels.push( `${day}-${month}-${year}`)
            }

            let filterByMonthData = {};
            dataset.forEach(data => {
    
                let monthAndYearData = data.start.slice(3, 10);
                let fullDate = data.start.split(' ')[0];

                if(monthAndYearData === monthAndYear){
                    if(!Object.keys(filterByMonthData).includes(fullDate)){
                        filterByMonthData[fullDate] = 1
                    }else {
                        filterByMonthData[fullDate] = filterByMonthData[fullDate] + 1
                    }
                }
            })

            let finalData = {}

            tempLabels.forEach( dateLabels => {
                if(Object.keys(filterByMonthData).includes(dateLabels)){
                    finalData = {
                        ...finalData,
                        [dateLabels]: filterByMonthData[dateLabels]
                    } 
                } else {
                    finalData = {
                        ...finalData,
                        [dateLabels] : 0
                    }
                }
            })
      

            let numberOfConnectionsData = [];
            let labels = [];       
            Object.keys(finalData).forEach(data => {
                numberOfConnectionsData.push(finalData[data])
                labels.push(data.split('-')[0])
            })
            let data = {
                labels: labels,
                datasets: [
                    {
                        label: `Number of connections - ${month}/${year}`,
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
                        showUserConnectionFilterByMonthList: false})
    }



    render() {
        const {statsUserConnectionFilterByMonthLabels, statsUserConnectionFilter, showUserConnectionFilterByMonthList, statsUserConnectionFilterByMonth, resData} = this.state;

        return (
            <section className="stats__usersConnection">
                <h1 className="app__primary__title">Users Connection</h1>
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
            </section>
        )
    }
}


export default UserConnection;
