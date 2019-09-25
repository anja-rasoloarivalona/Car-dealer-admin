import React, { Component } from 'react'
import './Car.css';
import { Gallery, GalleryImage } from "react-gesture-gallery";



import Overview from './overview/Overview';
import Technical from './technical/Technical';
import Features from './features/Features';


class Car extends Component {

    state = {
        index: 0,
        initiatlIndex: 0,

        carDetail: 'overview',

        product: {},
        loading: false
    }

    componentWillReceiveProps() {

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

    componentWillMount(){
        let id = this.props.history.location.pathname.slice(5);

        let url = "http://localhost:8000/admin/" + id;
        let method = 'GET';

        this.setState({loading: true})
        
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
            }, () => console.log(this.state.product))
        })
        .catch( err => {
            console.log(err)
        })

    }

    componentWillUnmount(){
        clearInterval(this.inter)
    }
    

    changeGalleryImgIndex = url => {
        const { product } = this.state;
        let index = product.imageUrls.indexOf(`${url}`);
        this.setState({ index: index})
    }

    detailRequestHandler = detail => {
        this.setState({ carDetail: detail})
    }

    render() {

        let {carDetail, product, loading } = this.state;

        let productRequested; 

        let detail;

        if(carDetail === 'overview'){
            detail = <Overview />
        }

        if(carDetail === 'technical'){
            detail = <Technical 
                        motorSize={product.tech[0].motorSize}
                        gazol={product.general[0].gazol}
                        maxSpeed={product.tech[0].maxSpeed}
                        transmissionType={product.general[0].transmissionType}
                        nbGearRatios={product.tech[0].nbGearRatios}/>
        }

        if(carDetail === 'features'){
            detail = <Features />
        }


        if(loading ===  true){
            productRequested = 'loading'
        } else {
            productRequested = (
                <div className="car">
                    <section className="car__presentation">
                        <h1 className="car__presentation__title">{product.general[0].title}</h1>
                        <div className="car__presentation__gallery">
                            <Gallery
                                index={this.state.index}
                                onRequestChange={i => this.setState({index: i})}>

                                {product.imageUrls.map(img => (
                                <GalleryImage objectFit="cover" key={img} src={img} />
                                ))}

                            </Gallery>
                        </div>
                        <div className="car__presentation__gallery__controller">
                            {
                                product.imageUrls.map(i => (
                                    <img src={i} alt="car" className="car__presentation__gallery__controller__img" key={Math.random().toString()}
                                        onClick={ () => this.changeGalleryImgIndex(i)}/>
                                ))
                            }

                        </div>
                        
                        <ul className="car__presentation__nav">
                            <li className="car__presentation__nav__item"
                                onClick={() => this.detailRequestHandler('overview')}>
                                Overview
                            </li>
                            <li  className="car__presentation__nav__item"
                                onClick={() => this.detailRequestHandler('technical')}>
                                Technical
                            </li>
                            <li  className="car__presentation__nav__item"
                                onClick={() => this.detailRequestHandler('features')}>
                                Features
                            </li>
                        </ul>

                        {detail}

                        <div className="space">

                        </div>
                        
                    </section>
                    <section className="car__presentation--right">

                    </section>
            </div>
            )
        }

        
        
        return productRequested
    }
}


export default Car;
