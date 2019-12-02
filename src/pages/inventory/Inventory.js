import React, { Component } from "react";
import "./Inventory.css";
import Product from "../../components/product/Product";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import Input from "../../components/formInput/FormInput";
import IconSvg from "../../utilities/svg/svg";
import Loader from "../../components/loader/Loader";

class Inventory extends Component {

  state = {
    sortBy: 'prix croissant',
    products: null,
    loading: true,
    displayMode: 'list'
  }

  componentDidMount(){
    this.fetchProductsHandler()
  }

  sortByHandler = sortBy => {
    this.fetchProductsHandler(sortBy)
    this.setState({ sortBy })
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

  fetchProductsHandler = (sortBy) => {
    let url = `http://localhost:8000/product?sortBy=${sortBy}`;

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
      })
      .catch(err => {
        console.log(err);
      });
  }


  render() {

    const { products, loading, displayMode } = this.state;

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

              <div className="inventory__filter">
                <div className="inventory__filter__searchBar">
                  <Input
                    control="input"
                    value=""
                    type="text"
                    placeholder="search..."
                  />
                  <IconSvg icon="search" />
                </div>
              </div>

              <div className="inventory__controller">
                  <div className="inventory__controller__sort">
                      <div className="inventory__controller__sort__key">Trier par</div>
                      <select value={this.state.sortBy}
                              onChange={e => this.sortByHandler(e.target.value)}>
                        <option value="prix croissant">Prix croissant</option>
                        <option value="prix décroissant">Prix décroissant</option>
                        <option value="popularité">Popularité</option>
                        <option value="date">Date</option>
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
    products: state.products.products
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setProductRequestedId: (prodId) =>dispatch(actions.setRequestedProductId(prodId)),
    setProducts: (products) => dispatch(actions.setProducts(products))

    };

};



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Inventory);
