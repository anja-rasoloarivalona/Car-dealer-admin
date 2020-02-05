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
                <div 
                        onClick={this.props.onRequestPageNumber.bind(this, i)}
                        key={i}
                        id={i}
                        className={["paginator__control", 
                                this.props.currentPage === i ? 'active' : ' '].join(' ')}>
                    {i}
                </div>
            )
        })

        return (
            <div className="paginator">
                {this.props.children}
                {this.props.products && this.props.products.length > 0 && (
                   <div className="paginator__controls">
                        <div className={`paginator__control
                                    ${this.props.currentPage === 1 ? 'disabled': ''}`}
                                onClick={this.props.onRequestPreviousPage}>
                                <IconSvg icon="arrow-left"/>
                        </div>
                        {pageNumbersButton}
                        <div className={`paginator__control
                                    ${this.props.currentPage === this.props.lastPage ? 'disabled': ''}`}
                                onClick={this.props.onRequestNextPage}>
                                <IconSvg icon="arrow-right"/>
                        </div>
                    </div>
                )}
                
            
        </div>
        )
    }
}



export default Paginator;