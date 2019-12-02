import React, { Component } from "react";
import "./Inventory.css";
import Product from "../../components/product/Product";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import Loader from "../../components/loader/Loader";
import queryString from 'querystring';



class Inventory extends Component {

  state = {
    sortBy: 'prix_croissant',
    products: null,
    loading: true,
    displayMode: 'grid',
    suppliers: null,

    requestedSupplier: 'all',
    requestedSupplierId: null,

    parsedQuery : null
  }

  componentDidMount(){
    let suppliers = this.props.suppliers;

    let parsedQuery = queryString.parse(this.props.location.search);

    let supplierId = parsedQuery.supplier;

    if(suppliers){
      if(supplierId !== undefined){
        let supplierName = suppliers.find(supplier => supplier._id === supplierId).name
        this.setState({ suppliers: suppliers, requestedSupplierId: supplierId, requestedSupplier: supplierName})
      } else {
        this.setState({ suppliers })
      }  
      this.fetchProductsHandler(suppliers, this.state.sortBy, parsedQuery)

    } else {
      this.fetchSuppliers(parsedQuery)
    }
  }

  fetchSuppliers = (query) => {
    let url = 'http://localhost:8000/suppliers';  
    fetch(url, {
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(res => {
        if(res.status !== 200 && res.status !== 201){
            throw new Error('Could not fetch suppliers')
        }
        return res.json()
    })
    .then(resData => {
        let suppliers = resData.suppliers;
        //We need to set the current view for the suppliers list page
        suppliers.forEach(supplier => {
            supplier.currentView = 'contacts'
        })
      this.props.setSuppliers(suppliers)
      this.setState({ suppliers})
      this.fetchProductsHandler( suppliers, this.state.sortBy, query)
  
    })
    .catch( err => {
        console.log(err)
    })
  }

  sortByHandler = sortBy => {

    let parsedQuery = queryString.parse(this.props.location.search);


    this.fetchProductsHandler(this.props.suppliers, sortBy, parsedQuery)
    this.setState({ sortBy })
  }

  selectSupplierHandler = supplierName => {

    let suppliers = this.props.suppliers;
    let supplierId;

    let query = {}

    if(supplierName !== 'all'){
      supplierId = suppliers.find(supplier => supplier.name === supplierName)._id
      query = {
        ...query,
        supplier: supplierId
      }
      this.fetchProductsHandler(suppliers, this.state.sortBy, query)
      this.setState({ requestedSupplier: supplierName, requestedSupplierId: supplierId})

    } else {
      this.fetchProductsHandler(suppliers, this.state.sortBy, query)
      this.setState({ requestedSupplier: supplierName, requestedSupplierId: null})
    }
    
  }

  toggleDisplayMode = () => {
    let displayMode;

    if(this.state.displayMode === 'list'){
      displayMode = 'grid'
    } else {
      displayMode = 'list'
    }

    this.setState({ displayMode})
  }

  fetchProductsHandler = (suppliers, sortBy, query) => {

    let url =  new URL('http://localhost:8000/product');

    let params = {
        sortBy: sortBy
    }

    if(query){
      params = {
        ...params,
        supplier: query.supplier
      }
    }

    url.search = new URLSearchParams(params).toString()

    fetch(url, {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch products");
        }
        return res.json(); 
      })
      .then(resData => {
        let products = resData.products;
        this.props.setProducts(products);
        this.setState({ products: products, loading: false})
        

        let supplierId = null;

        if(query){
            supplierId = query.supplier;
        }
      
          if(supplierId !== undefined && supplierId !== 'all' && supplierId !== null){

            let supplierName = suppliers.find(supplier => supplier._id === supplierId).name
            this.setState({ requestedSupplierId: supplierId, requestedSupplier: supplierName})
            this.props.history.push({
              search: `?sortBy=${this.state.sortBy}&supplier=${supplierId}`
            })
          } else {
            this.props.history.push({
              search: `?sortBy=${this.state.sortBy}&supplier=all`
            })
          }
            
      })
      .catch(err => {
        console.log(err);
      });
  }


  render() {

    const { products, loading, displayMode, sortBy, requestedSupplier, suppliers } = this.state;

    let productsList = <Loader />

  
    if(!loading){
      productsList = (
            <ul className={`inventory__list 
                ${displayMode === 'grid' ? '': 'list'}`}>
                {products.map(product => {

                  let date = new Date(product.createdAt).toLocaleString('fr-FR');
                  let view = product.general.viewCounter;
                  if(view === undefined){
                      view = 0
                  }

                  return (
                  
                    <li className="inventory__list__item"
                        key={product._id}>
  
                      <Product
                        id={product._id}
                        mainImg={product.general.mainImgUrl}
                        made={product.general.made}
                        model={product.general.model}
                        year={product.general.year}
                        price={product.general.price}
                        nbKilometers={product.general.nbKilometers}
                        gazol={product.general.gazol}
                        transmissionType={product.general.transmissionType}
                        goToProd={() => {
                          this.props.setProductRequestedId(product._id);
                          this.props.history.push(`/car/${product._id}`);
                        }}
                      />
  
                        {
                          displayMode === 'list' && (
                            <div className="inventory__list__item__info">
                              
                              <ul className="inventory__list__item__info__list">
                                  <li className="inventory__list__item__info__list__item">
                                      <div>Date de publication</div>
                                      <div>{date}</div>
                                  </li>
                                  <li className="inventory__list__item__info__list__item">
                                      <div>Fournisseur</div>
                                      <div>{product.supplier ? product.supplier.info.name : ''}</div>
                                  </li>
                                  <li className="inventory__list__item__info__list__item">
                                      <div>Prix concessionnaire</div>
                                      <div>{product.supplier ? product.supplier.price : ''}</div>
                                  </li>
                                  <li className="inventory__list__item__info__list__item">
                                      <div>Nombre de vues</div>
                                      <div>{view}</div>
                                  </li>
                                  <li className="inventory__list__item__info__list__item">
                                      <div>Suivis par</div>
                                      <div>{product.followers.length}</div>
                                  </li>
                                  <li className="inventory__list__item__info__list__item">
                                      <div>Numéro de référence</div>
                                      <div>{product.supplier.reference}</div>
                                  </li>
                              </ul>
                            </div>
                          ) 
                        }
  
  
                    </li>
                  
                  )
                }
                )}
              </ul>
      )
    }

    return (
      <div className="inventory">

              <div className="inventory__controller">

                  <div className="inventory__controller__section">
                      <div className="inventory__controller__section__key">Trier par</div>
                      <select value={sortBy}
                              onChange={e => this.sortByHandler(e.target.value)}>
                        <option value="prix_croissant">Prix croissant</option>
                        <option value="prix_décroissant">Prix décroissant</option>
                        <option value="popularité">Popularité</option>
                        <option value="date">Date</option>
                      </select>
                  </div>

                  <div className="inventory__controller__section">
                      <div className="inventory__controller__section__key">Fournisseur</div>
                      <select value={requestedSupplier}
                          onChange={e => this.selectSupplierHandler(e.target.value)}>
                            <option value='all'>Tous</option>
                          {suppliers && suppliers.map(supplier => (
                            <option key={supplier._id} value={supplier.name}>{supplier.name}</option>
                          ))}
                      </select>
                  </div>

                  <div className={`inventory__controller__displayMode 
                                  ${displayMode === 'list' ? 'active': ''}`}
                      onClick={this.toggleDisplayMode}>
                        Afficher données
                  </div>
              </div>

               {productsList}


            </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    products: state.products.products,
    suppliers: state.suppliers.suppliers
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setProductRequestedId: (prodId) =>dispatch(actions.setRequestedProductId(prodId)),
    setProducts: (products) => dispatch(actions.setProducts(products)),
    setSuppliers: suppliers => dispatch(actions.setSuppliers(suppliers))

    };

};



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Inventory);
