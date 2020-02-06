import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';


class ConnectionCounter extends Component {

    state = {
        data: null,
        globalDataSet: null,

    }

    componentDidMount(){
        console.log('nofew', this.props.data);
        let data = this.props.data;
        let tempData = {};
        let finalData = {}

        data.forEach(i => {
            let a = i.start.split(' ')[0];
            let month = a.split('-')[0];
            let day = a.split('-')[1];
            let year = a.split('-')[2];

            let date = `${day}-${month}-${year}`;
            let shortDate = `${day}-${month}`;

            if(!Object.keys(tempData ).includes(shortDate)){
                tempData  = {
                    ...tempData ,
                    [shortDate] : 1
                }
            } else {
                tempData  = {
                    ...tempData ,
                    [shortDate] : tempData [shortDate] + 1
                }
            }
            let datasets = [];
            Object.keys(tempData).forEach(i => {
                datasets = [...datasets, tempData[i]]
            })

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
        })

        this.setState({ data: finalData, globalDataSet: data})

    }
    render() {
        const {data} = this.state;

        let chart = <div>loading</div>

        if(data){
            chart = <Line 
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
                        data = {data}
                  />
        }

        return (

            <div className="user-account__chart">
                <div className="user-account__chart__container">
                   {chart}
                </div>
                
            </div>
        )
    }
}

export default ConnectionCounter;

