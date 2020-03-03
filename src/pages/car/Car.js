import React, { Component } from 'react'
import './Car.css';
import { Gallery, GalleryImage } from "react-gesture-gallery";
import IconSvg from '../../utilities/svg/svg';
import Button from '../../components/button/Button';

import Overview from './overview/Overview';
import Technical from './technical/Technical';
import Features from './features/Features';

import { connect } from 'react-redux';
import * as actions from '../../store/actions';


class Car extends Component {

    constructor(props){
        super(props);
        this.state = {
            index: 0,     
            initiatlIndex: 0,  
            product: null,
            loading: true,
            partRequested: 'overview',
        }
        this.escFunction = this.escFunction.bind(this)
    }


    imageSlideHandler = () => {
    let {index, images, initiatlIndex} =  this.state;
    this.inter = setInterval(() => {
                if(index === images.length){
                    this.setState({index: initiatlIndex}, () => {
                        clearInterval(this.inter);
                        this.imageSlideHandler();
                    })
                } else {
                    this.setState({index: index++ })
                }
            }, 2500)
    }

    componentDidMount(){
        let prodId;
        if(this.props.prodId === ''){
            prodId = this.props.match.params.prodId
        } else {
            prodId = this.props.prodId
        }    

        let url = "https://africauto.herokuapp.com/admin/" + prodId;
        let method = 'GET';
        
        fetch(url, {
            headers: {
                "Content-type": "application/json"
            },
            method: method
        })
        .then( res => {
            if(res.status !== 200){
                throw new Error('Failed to fetch that product')
            }
            return res.json();
        })
        .then( resData => {
            this.setState({
                product: resData.product,
                loading: false
            }, () => this.props.setProductRequested(resData.product))
        })
        .catch( err => {
            console.log(err)
        })

        document.addEventListener("keydown", this.escFunction, false);
        
    }

    componentWillUnmount(){
        clearInterval(this.inter)
        document.removeEventListener("keydown", this.escFunction, false);
    }
    

    changeGalleryImgIndex = url => {
        const { product } = this.state;
        let index = product.imageUrls.indexOf(`${url}`);
        this.setState({ index: index})
    }

    detailRequestHandler = detail => {
        this.setState({ requestedSection: detail})
    }

    escFunction(event){
        if(event.keyCode === 27 && this.props.hideScrollBar) {
          this.props.showScrollBarHandler()
        }
      }


    render() {

        let {partRequested, product, loading } = this.state;
        let productRequested; 
        let detail;

        if(partRequested === 'overview'){
            detail = <Overview product={product}/>
        }

        if(partRequested === 'technical'){
            detail = <Technical product={product}/>
        }

        if(partRequested === 'features'){
            detail = <Features product={product}/>
        }


        if(loading ===  true){
            productRequested = <div>loading</div>
        } else {
            productRequested = (
                <div className="single-car">
                    <div className="single-car__backBtn"
                          onClick={() => this.props.history.goBack()}>
                        Back
                    </div>
                    <div className="single-car__header">

                        <div className="single-car__header__main">

                            <div className="single-car__header__main__titleContainer">
                                <h1 className="single-car__header__main__title">{product.general.title} {product.general.year}</h1>
                                <div className="single-car__header__main__controller">
                                    <Button link= {{pathname: '/ajouter'}} color="primary"
                                            onClick={this.props.toggleEditingMode}>
                                        Edit
                                    </Button>
                                    <Button link='/' color="primary">
                                        Delete
                                    </Button>
                                </div>
                            </div>
                            
                            <div className={`single-car__header__main__gallery`}>                          
                                <Gallery
                                    index={this.state.index}
                                    onRequestChange={i => this.setState({index: i})}>

                                    {product.imageUrls.map(img => (
                                    <GalleryImage objectFit="cover" key={img} src={img} 
                                                onClick={this.props.hideScrollBarHandler}
                                    />
                                    ))}
                                </Gallery>                                 
                            </div> 
                            {this.props.hideScrollBar && (
                                <div className="single-car__header__main__gallery--fullContainer">

                                    <div className="single-car__header__main__gallery--fullContainer__closeBtn"
                                        onClick={this.props.showScrollBarHandler}>
                                        <IconSvg icon="close"/>
                                    </div>


                                    <div className="single-car__header__main__gallery--full">
                                        <Gallery
                                            index={this.state.index}
                                            onRequestChange={i => this.setState({index: i})}>
                                            {product.imageUrls.map(img => (
                                            <GalleryImage objectFit="contain" key={img} src={img} 
                                            />
                                            ))}
                                        </Gallery>
                                    </div>
                                </div>                   
                            )}  
                            <div className="single-car__header__main__gallery__controller">
                                {product.imageUrls.map(i => (
                                    <img src={i} alt="car" className="single-car__header__main__gallery__controller__img" key={i}
                                        onClick={ () => this.changeGalleryImgIndex(i)}/>
                                ))}
                            </div>


                            </div>
                            <div className="single-car__header__info">
                            <div className="single-car__header__info__priceContainer">
                                <div className="single-car__header__info__price">{product.general.price.toLocaleString()} CAD</div>
                            </div>
                            <ul className="single-car__header__info__list">
                                    <li className="single-car__header__info__list__item">
                                        <div className="single-car__header__info__list__item__key">reference</div>
                                        <div className="single-car__header__info__list__item__value">{product.supplier.reference}</div>
                                    </li>
                                    <li className="single-car__header__info__list__item">
                                        <div className="single-car__header__info__list__item__key">brand</div>
                                        <div className="single-car__header__info__list__item__value">{product.general.brand}</div>
                                    </li>
                                    <li className="single-car__header__info__list__item">
                                        <div className="single-car__header__info__list__item__key">body type</div>
                                        <div className="single-car__header__info__list__item__value">{product.general.bodyType}</div>
                                    </li>
                                    <li className="single-car__header__info__list__item">
                                        <div className="single-car__header__info__list__item__key">model</div>
                                        <div className="single-car__header__info__list__item__value">{product.general.model}</div>
                                    </li>
                                    <li className="single-car__header__info__list__item">
                                        <div className="single-car__header__info__list__item__key">year</div>
                                        <div className="single-car__header__info__list__item__value">{product.general.year}</div>
                                    </li>
                                    <li className="single-car__header__info__list__item">
                                        <div className="single-car__header__info__list__item__key">kilometer</div>
                                        <div className="single-car__header__info__list__item__value">{product.general.nbKilometers} km</div>
                                    </li>
                                    <li className="single-car__header__info__list__item">
                                        <div className="single-car__header__info__list__item__key">YOR</div>
                                        <div className="single-car__header__info__list__item__value">{product.general.yearOfRelease}</div>
                                    </li>
                                    <li className="single-car__header__info__list__item">
                                        <div className="single-car__header__info__list__item__key">fuel</div>
                                        <div className="single-car__header__info__list__item__value">{product.general.gazol}</div>
                                    </li>
                                    <li className="single-car__header__info__list__item">
                                        <div className="single-car__header__info__list__item__key">gear box</div>
                                        <div className="single-car__header__info__list__item__value">{product.general.transmissionType}</div>
                                    </li>
                                    <li className="single-car__header__info__list__item">
                                        <div className="single-car__header__info__list__item__key">serial number</div>
                                        <div className="single-car__header__info__list__item__value">{product.general.serialNumber}</div>
                                    </li>
                                    <li className="single-car__header__info__list__item">
                                        <div className="single-car__header__info__list__item__key">views</div>
                                        <div className="single-car__header__info__list__item__value">{product.general.viewCounter ? product.general.viewCounter : '-' }</div>
                                    </li>
                                    <li className="single-car__header__info__list__item">
                                        <div className="single-car__header__info__list__item__key">followers</div>
                                        <div className="single-car__header__info__list__item__value">{product.followersCounter ? product.followersCounter : '-'}</div>
                                    </li>
                            </ul>
                        </div>  
                    </div>
                                          
                    <section className="single-car__details">                 
                        <ul className="single-car__details__nav">
                            <li className={`single-car__details__nav__item
                                        ${this.state.partRequested === 'overview' ? 'active': ''}`}
                                onClick={() => this.setState({ partRequested: 'overview'})}>
                                Overview
                            </li>
                            <li className={`single-car__details__nav__item
                                        ${this.state.partRequested === 'technical' ? 'active': ''}`}
                                onClick={() => this.setState({ partRequested: 'technical'})}>
                                Technical
                            </li>
                            <li className={`single-car__details__nav__item
                                        ${this.state.partRequested === 'features' ? 'active': ''}`}
                                onClick={() => this.setState({ partRequested: 'features'})}>
                                Features
                            </li>
                        </ul>
                        {detail}
                    </section>
                      
            </div>
            )
        }

        
        
        return productRequested
    }
}


const mapStateToProps = state => {
    return {
        prodId: state.products.productRequestedId,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setProductRequested: (prod) => dispatch(actions.setRequestedProduct(prod)),
        toggleEditingMode: () => dispatch(actions.toggleEditingMode())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Car);
