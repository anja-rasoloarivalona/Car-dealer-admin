import React, { Component } from 'react'
import './Paginator.css';
import IconSvg from '../../utilities/svg/svg'


class Paginator extends Component {
    render() {

        const pageNumbers = [];
        for(let i = 1; i <= this.props.lastPage; i++){
            pageNumbers.push(i)
        }

        const pageNumbersButton = pageNumbers.map( i => {
            return (
                <button 
                        onClick={this.props.onRequestPageNumber.bind(this, i)}
                        key={i}
                        id={i}
                        className={["paginator__control", 
                                this.props.currentPage === i ? 'active' : ' '].join(' ')}>
                    {i}
                </button>
            )
        })

        return (
            <div className="paginator">
                {this.props.children}
                <div className="paginator__controls">

                   

                    <button className="paginator__control"
                            disabled={ this.props.currentPage === 1 ? true : false}
                            onClick={this.props.onRequestPreviousPage}>
                               <IconSvg icon="arrow-left"/>
                    </button>

                    {pageNumbersButton}

                    <button className="paginator__control"
                            disabled={ this.props.currentPage === this.props.lastPage ? true : false}
                            onClick={this.props.onRequestNextPage}>
                              <IconSvg icon="arrow-right"/>
                    </button>
            </div>
            
        </div>
        )
    }
}



export default Paginator;