import React, { Component } from 'react'
import './Inventory.css';
import {connect} from 'react-redux'
import Loader from '../../components/loader/Loader';
import Controller from './Controller/Controller';
import queryString from 'query-string';
import * as actions from '../../store/actions'
import ProductsList from '../../components/ProductsList/ProductsList';
import Paginator from '../../components/paginator/Paginator';
import { amountFormater } from '../../utilities/amountFormater'

class Inventory extends Component {

    state = {
        products: null,
        loading: true,
        query: {
            brand: 'all',
            model: 'all',
            bodyType: 'all',
            supplierName: 'all',
            supplierId: null,
            page: 1,
            year: {
                value: {
                    min: 2008,
                    max: 2020
                },
                scope: {
                    min: 2008,
                    max: 2020
                }
            },
            price: {
                value: {
                    min: null,
                    max: null
                },
                scope: {
                    min: null,
                    max: null
                },
                init:{
                    min: null,
                    max: null
                }
            },
            sort: 'increasing price'

        },
        lastPage: null
    }

    componentWillMount(){
        // console.log('fetching',this.props.history, this.props.location)
    }

    componentDidMount(){    
        /*** START INIT MIN AND MAX PRICE ***/
        let minPrice = this.props.price.min;
        let maxPrice = this.props.price.max;
        /*** END INIT MIN AND MAX PRICE ***/  
        let parsedQuery = queryString.parse(this.props.location.search);
        if(Object.keys(parsedQuery).length > 2){
          if(parsedQuery.page > 1){
            this.props.setInventoryCurrentPage(parseInt(parsedQuery.page)) 
          }
            this.setState(prevState => ({
            ...prevState,
            query: {
                ...prevState.query,
                price : {
                    init: {
                        min: minPrice,
                        max: maxPrice
                    },
                    scope: {
                        min:  minPrice,
                        max: maxPrice
                    },  
                    value: {
                        min: parseInt(parsedQuery.minPrice),
                        max: parseInt(parsedQuery.maxPrice)
                    },
                    fullValue: {
                        min: parseInt(parsedQuery.minPrice),
                        max: parseInt(parsedQuery.maxPrice)
                    }
                },
                year : {
                    ...prevState.query.year,
                    value: {
                        min: parseInt(parsedQuery.minYear),
                        max: parseInt(parsedQuery.maxYear)
                    }
                },
                supplierName: parsedQuery.supplier,
                supplierId: parsedQuery.supplier === 'all' ? null : this.props.suppliers.find( supplier => supplier.name === parsedQuery.supplier)._id,
                brand: parsedQuery.brand,
                model: parsedQuery.model,
                sort: parsedQuery.sort,
                bodyType: parsedQuery.bodyType,
                page: parsedQuery.page,                  
            },
            lastPage: Math.ceil(this.props.totalProductsCounter / this.props.itemsPerPage)
        }), () =>  this.fetchProductsHandler())
        } else {
            this.setState(prevState => ({
                ...prevState,
                query: {
                    ...prevState.query,
                    price: {
                        init: {
                            min: minPrice,
                            max: maxPrice
                        },
                        scope: {
                            min:  minPrice,
                            max: maxPrice 
                        },  
                        value: {
                            min: minPrice,
                            max: maxPrice 
                        },
                        fullValue: {
                            min: minPrice,
                            max: maxPrice 
                        },
                    }
                },
                lastPage: Math.ceil(this.props.totalProductsCounter / this.props.itemsPerPage)
            }), () =>  this.fetchProductsHandler())
           
        }  
    }


    fetchProductsHandler = () => {
        const {query} = this.state
        let url =  new URL('http://localhost:8000/product/admin');
        let params;

        //current value with the corresponding currency
        let minPrice = query.price.value.min;
        let maxPrice = query.price.value.max;
            //store the value in those variables, we'll use them as a search parameters for the url at the ending of fetching products
            let minPriceQuery = minPrice;
            let maxPriceQuery = maxPrice;
            //Convert the full value to CAD because or DB uses CAD as price currency
            minPrice = amountFormater(query.price.fullValue.min, this.props.currency, 'CAD', this.props.quotes);
            maxPrice = amountFormater(query.price.fullValue.max, this.props.currency, 'CAD', this.props.quotes);
        
            if(query){
            params = {
                ...params,
                page: query.page,
                brand: query.brand,
                bodyType: query.bodyType,
                model: query.model,
                supplierId: query.supplierId,
                minPrice: Math.floor(minPrice),
                maxPrice: Math.ceil(maxPrice),
                minYear: query.year.value.min,
                maxYear: query.year.value.max,
                sort: query.sort.split(' ').length > 0 ? `${query.sort.split(' ')[0]}_${query.sort.split(' ')[1]}` : query.sort
            }
            url.search = new URLSearchParams(params).toString()
        }

        console.log('fecthin', params.supplierId)


        fetch( url, {
          headers: {
            'Content-type': 'application/json'
          }
        })
        .then( res => {
          if(res.status !== 200 && res.status !== 201){
            throw new Error('Error fetching products')
          }
          return res.json()
        })
        .then(resData => {  
          this.setState({ products: resData.products, loading: false});
          this.props.history.push({
              pathname: `/inventory`,
              search: `supplier=${query.supplierName}&sort=${query.sort}&page=${query.page}&bodyType=${query.bodyType}&brand=${query.brand}&model=${query.model}&minPrice=${minPriceQuery}&maxPrice=${maxPriceQuery}&minYear=${query.year.value.min}&maxYear=${query.year.value.max}`
          })
        })
        .catch(err => {
          console.log(err)
        })
    }

    componentDidUpdate(prevProps){
        let prevCurrency = prevProps.currency;
        let nextCurrency = this.props.currency;
        let stateQuery = this.state.query;   
       if(prevCurrency !== nextCurrency){
            let quotes = this.props.quotes;
            this.setState(prevState => ({
                ...prevState,
                query: {
                    ...prevState.query,
                    price: {
                        ...prevState.query.price,
                        scope: {
                            min: Math.floor(amountFormater(stateQuery.price.init.min, 'CAD', nextCurrency, quotes) / 1000 ) * 1000,
                            max: Math.ceil(amountFormater(stateQuery.price.init.max, 'CAD', nextCurrency, quotes) / 1000 ) * 1000 ,
                        },
                        value: {
                            min: Math.floor(amountFormater(stateQuery.price.init.min, 'CAD', nextCurrency, quotes)/ 1000 ) * 1000,
                            max: Math.ceil(amountFormater(stateQuery.price.init.max, 'CAD', nextCurrency, quotes) / 1000 ) * 1000,
                        },
                        fullValue: {
                            min: amountFormater(stateQuery.price.init.min, 'CAD', nextCurrency, quotes),
                            max: amountFormater(stateQuery.price.init.max, 'CAD', nextCurrency, quotes)
                        }
                    }
                }
            }), () => this.fetchProductsHandler())

        }     
    }

    selectBodyTypeHandler = bodyType => {
        let data = this.props.brandAndModelsData;
        let stateQuery = this.state.query
        let query
        if(stateQuery.brand !== 'all'){   
            if(Object.keys(data[stateQuery.brand]).includes(bodyType)){
                query = {
                    ...this.state.query,
                    bodyType: bodyType
                } 
            } else {
                query = {
                    ...this.state.query,
                    bodyType: bodyType,
                    brand: 'all',
                    model: 'all',
                    page: 1
                } 
            }
        } else {
            query = {
                ...this.state.query,
                bodyType: bodyType
            } 
        }
        this.setState({ query}, () => this.fetchProductsHandler(query))
    }

    selectBrandHandler = brand => {   
        let query = {
            ...this.state.query,
                brand: brand
            }
        if(brand === 'all'){
            query = {
                ...query,
                model: 'all',
                page: 1
            }
        } 
        this.setState({ query }, () => this.fetchProductsHandler(query))
    }
    selectModelHandler = model => {
        this.setState( prevState => ({
            ...prevState,
            query: {
                ...prevState.query,
                model: model
            }
        }), () => this.fetchProductsHandler())
    }
    sortHandler = sort => {
        this.setState(prevState => ({
            ...prevState,
            query : {
                ...prevState.query,
                sort: sort,
                page: 1
            }         
        }), () => this.fetchProductsHandler())
    }
    selectSupplierHandler = supplierName => {
      if(supplierName === 'all'){
        this.setState(prevState => ({
          ...prevState,
          query: {
            ...prevState.query,
            supplierName: 'all',
            supplierId: null
          }
        }), () => this.fetchProductsHandler())

      } else {
        let supplierId = this.props.suppliers.find( supplier => supplier.name === supplierName)._id
        this.setState(prevState => ({
          ...prevState,
          query: {
            ...prevState.query,
            supplierName: supplierName,
            supplierId: supplierId,
          }
        }), () => this.fetchProductsHandler())
      }
    }
    changePriceHandler = value => {
        this.setState( prevState => ({
            ...prevState,
            query: {
                ...prevState.query,
                page: 1,
                price: {
                    ...prevState.query.price,
                    value: value,
                    fullValue: value
                }
            }
        }))
    }
    changeYearHandler = value => {
        this.setState(prevState => ({
            ...prevState,
            query: {
                ...prevState.query,
                page: 1,
                year: {
                    ...prevState.query.year,
                    value: value
                }
            }
        }))
    }
    changeComplete = () => {
        this.fetchProductsHandler()
    }

    paginationHandler = direction => {
        let query = this.state.query  
        if(direction === 'next' &&  this.props.currentInventoryPage < this.state.lastPage ){ 
                query = {
                    ...query,
                    page: this.props.currentInventoryPage + 1
                  }
            this.props.setInventoryCurrentPage(this.props.currentInventoryPage + 1)
            this.setState({ query }, () => this.fetchProductsHandler())
        }
        if(direction === 'previous' && this.props.currentInventoryPage > 1 ){
          query = {
            ...query,
            page: this.props.currentInventoryPage - 1
          }
          this.props.setInventoryCurrentPage(this.props.currentInventoryPage - 1)
          this.setState({ query }, () => this.fetchProductsHandler())
        }
        if(direction !== 'previous' && direction !== 'next'){
          query = {
            ...query,
            page: direction
          }
          this.props.setInventoryCurrentPage(direction)
          this.setState({ query }, () => this.fetchProductsHandler())
        }

        
      }

    render() {
        const {products, loading, query} = this.state;
        let inventory = <Loader />
        if(!loading){
            inventory = (
                <div className="inventory">
    
                        <Controller
                            currency={this.props.currency}
                            query={query}
                            selectBrandHandler={this.selectBrandHandler}
                            selectModelHandler={this.selectModelHandler}
                            selectBodyTypeHandler={this.selectBodyTypeHandler}
                            sortHandler={this.sortHandler}
                            changePriceHandler={this.changePriceHandler}
                            changeYearHandler={this.changeYearHandler}
                            changeComplete={this.changeComplete}
                            data={this.props.brandAndModelsData}
                            selectSupplierHandler={this.selectSupplierHandler}
                        />

                    
                    <section className="inventory__container">
                        {products && (
                            <Paginator
                            onRequestPreviousPage={this.paginationHandler.bind(this, 'previous')}
                            onRequestNextPage={this.paginationHandler.bind(this, 'next')}
                            lastPage={Math.ceil(this.props.totalProductsCounter / this.props.itemsPerPage)}
                            currentPage={this.props.currentInventoryPage}
                            onRequestPageNumber={this.paginationHandler}
                            products={products}
                            itemsPerPage={this.props.itemsPerPage}
                            >
                                <ProductsList productsList={products}/>
                            </Paginator>
                                          
                        )}
                    </section>
                    
                </div>
            )
        }

        return inventory
    }
}

const mapStateToProps = state => {
    return {
        brandAndModelsData: state.products.brandAndModelsData,
        price: state.products.price,
        totalProductsCounter: state.products.totalProducts,
        currentInventoryPage: state.products.currentInventoryPage,
        itemsPerPage: state.products.itemsPerPage,

        currency: state.parameters.currency,
        quotes: state.parameters.quotes,
        lang: state.parameters.lang,
        currency: state.parameters.currency,

        suppliers: state.suppliers.suppliers
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setInventoryCurrentPage: data => dispatch(actions.setInventoryCurrentPage(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inventory)