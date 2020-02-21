import React from 'react'
import './Paginator.css';
import IconSvg from '../../utilities/svg/svg'

const Paginator = props => {
    const pageNumbers = [];
    for(let i = 1; i <= props.lastPage; i++){
        pageNumbers.push(i)
    }
    const pageNumbersButton = pageNumbers.map( i => (
            <div 
                onClick={props.onRequestPageNumber.bind(this, i)}
                key={i}
                id={i}
                className={`paginator__control ${props.currentPage === i ? 'active' : ' '}`}>
                {i}
            </div>
    ))

    return (
        <div className="paginator">
            {props.children}
            {props.products && props.products.length > 0 && (
            <div className={`paginator__controls ${props.currentPage === 1 && props.products.length < props.itemsPerPage ? 'hide':' '}`}>
                    <div className={`paginator__control
                                ${props.currentPage === 1 ? 'disabled': ''}`}
                            onClick={props.onRequestPreviousPage}>
                            <IconSvg icon="arrow-left"/>
                    </div>
                    {pageNumbersButton}
                    <div className={`paginator__control
                                ${props.currentPage === props.lastPage ? 'disabled': ''}`}
                            onClick={props.onRequestNextPage}>
                            <IconSvg icon="arrow-right"/>
                    </div>
                </div>
            )}
    </div>
    )
}





export default Paginator;