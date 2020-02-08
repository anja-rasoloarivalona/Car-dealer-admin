import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { daysInMonth } from '../../../utilities/daysInMonth';
import {MONTH_TABLE } from '../../../utilities/monthTable';

class UserConnection extends Component {
    state = {

        data: {
            labels: [],
            datasets: []
        },
        tempData: null,
        mm_yyyy_labels: [],
        loading: true,
        filter: 'general',
        selectedMonth: null,
    }

    componentDidMount(){
        this.selectUsersConnectionFilterGeneral()
    }

    selectFilterHandler = filter => {
        if(filter === 'general'){
            this.setState({ filter}, () => this.selectUsersConnectionFilterGeneral())
            
        }

        if(filter === 'month'){
            this.setState({ filter}, () => this.selectUsersConnectionFilterByMonth())
        }
    }

    selectUsersConnectionFilterByMonth = monthAndYear => {
        //Check if we have an argument, if not use the state which has been initialized when componentDidMount
        if(!monthAndYear){
            monthAndYear = this.state.selectedMonth
        } 

        //Count the number of day in the month
        let month = monthAndYear.split('-')[0];
        let year = monthAndYear.split('-')[1];
        let daysInMonthCounter = daysInMonth( parseInt(month), parseInt(year));

        //Built the full date for each day of the month
        let fullDatelabels = [];
        let day;
        for(day = 1; day < daysInMonthCounter + 1; day++){
            if(day < 10){
                day=`0${day}`
            }
            fullDatelabels.push(`${day}-${month}-${year}`)
        }

        //store only the key value date-counter that corresponds to the month 
        let tempData = {};
        Object.keys(this.state.tempData).forEach(date => {
            if(`${date.split('-')[1]}-${date.split('-')[2]}` === monthAndYear){
                tempData[date] = this.state.tempData[date]
            }
        })

        let datasets = [];
        fullDatelabels.forEach(label => {
            if(Object.keys(tempData).includes(label)){
                datasets = [...datasets, tempData[label]]
            }else{
                datasets = [...datasets, 0]
            }
        })

        let labels = [];
        fullDatelabels.forEach(label => {
            labels.push(label.split('-')[0])
        })

        let finalData = {
                labels: labels,
                datasets: [
                    {
                        label: `Number of connections - ${MONTH_TABLE[month - 1]} ${year}`,
                        data: datasets,
                        backgroundColor: 'transparent'
                    }
                ]
        }          
        this.setState({ data: finalData, selectedMonth: monthAndYear})
 
    }


    selectUsersConnectionFilterGeneral = () => {   
        let tempData = {}; // to manipulate the data
        let finalData = {} //to send the final value to the chart
        //Storing all the connection dataset in the data array
        let data = [];
        this.props.stats.forEach(userStat => {
            userStat.connection.forEach(connection => {
                data.push(connection)
            })
        })
        //Creating the full date for each connection and storing it in the fullDate array
        let fullDateArray = [];
        data.forEach(i => {
            let day = i.start.split('-')[0];
            let month = i.start.split('-')[1];
            let year = i.start.split('-')[2];
            let x = new Date(`${month}-${day}-${year}`);
            fullDateArray.push(x)
        })
        //Sorting the date from oldest to newest
        fullDateArray = fullDateArray.sort( (a, b) => {
            return a > b ? 1 : a < b ? -1 : 0
        })
        //Format the sorted date in dd-mm-yyyy and store the result in the sortedShortDateArray
        let sortedShortDateArray = [];
        fullDateArray.forEach(i => {
            let day = i.getDate()
            let month = i.getMonth() + 1;
            let year = i.getFullYear();
            if(day < 10){
                day = `0${day}`;
            }
            sortedShortDateArray.push(`${day}-${month}-${year}`)
            
        })
        //For each date, check if it's already in the tempData object
        sortedShortDateArray.forEach(date => {
            if(!Object.keys(tempData).includes(date)){
                // Case 1 : the date is not in the tempData, we need to add it as property and init the counter
                tempData[date] = 1
            } else {
                //case 2 : the date is already in the tempData, we need to increment its value by 1
                tempData[date] = tempData[date] + 1
            }
        })
        //store each date the value in the datasets array
        let datasets = [];
        Object.keys(tempData).forEach(date => {
            datasets = [...datasets, tempData[date]]
        })
        //Build the finalData object
        finalData =  {
            labels : Object.keys(tempData),
            datasets: [
                    {
                    label: 'Number of connections',
                    data: datasets,
                    backgroundColor: 'transparent'
                    }
                ]
         }  

        //console.log('tempdata', tempData);
        // console.log('final', finalData);

        let mm_yyyy_labels = [];
        (Object.keys(tempData).forEach(i => {
            let mm_yyyy = `${i.split('-')[1]}-${i.split('-')[2]}`
            if(!mm_yyyy_labels.includes(mm_yyyy)){
                mm_yyyy_labels.push(mm_yyyy)
            }
        }))

        this.setState({ data: finalData,
                        tempData: tempData,
                        mm_yyyy_labels: mm_yyyy_labels,
                        selectedMonth: mm_yyyy_labels[0],
                        loading: false,                  
                         statsUserConnectionFilter: 'general',
                         showUserConnectionFilterByMonthList: false
                    })
    }



    render() {
        const {data, mm_yyyy_labels, loading, filter, selectedMonth} = this.state;

        let statsUserConnection = <div>loading</div>
        if(!loading){
            statsUserConnection = (
                <section className="stats__usersConnection">
                    <div className="stats__userConnection__container">  

                        <div className="stats__userConnection__filter">
                            <h2 className="stats__userConnection__filter__title">Filtre</h2>
                            <ul className="stats__userConnection__filter__list">

                                <li className={`stats__userConnection__filter__list__item
                                            ${filter === 'general' ? 'active': ''}`}
                                    onClick={() => this.selectFilterHandler('general')}>
                                        general
                                </li>

                                <li className={`stats__userConnection__filter__list__item
                                            ${filter === 'month' ? 'active': ''}`}
                                    onClick={() => this.selectFilterHandler('month')}>
                                    <div className="stats__userConnection__filter__list__item__key">Par mois</div>
                                    <div className="stats__userConnection__filter__list__item__value">{selectedMonth}</div>
                                    <ul className={`stats__userConnection__filter__byMonthList
                                                    ${filter === 'month'  ? 'shown' : ''}`}>
                                        {mm_yyyy_labels.map(label => (
                                            <li key={label}
                                                onClick={() => this.selectUsersConnectionFilterByMonth(label)} 
                                                className={`stats__userConnection__filter__byMonthList__item
                                                            ${selectedMonth === label ? 'active' : ''}`}>
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
                                    responsive: true,
                                    scales: {
                                        yAxes: [{
                                            ticks: {
                                                beginAtZero: true,
                                                stepSize: 1
                                            }
                                        }]
                                    }
                                }}
                                data={data}
                            />  
                        </div>   
                    </div>
                </section>
            )
        }

        return statsUserConnection
    }
}


export default UserConnection;
