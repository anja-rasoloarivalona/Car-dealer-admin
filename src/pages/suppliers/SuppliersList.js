import React from 'react';
import Title from '../../components/title/Title';
import Button from '../../components/button/Button'

const SuppliersList = props => {
    let suppliers = props.suppliers;
    return (
        <ul className="suppliers__list">
                    <Title title = "Suppliers">
                        <div className="suppliers__addButton"
                              onClick={() => props.supplierCurrentViewHandler('suppliersForm')}>
                            Add
                        </div>
                    </Title>
                    {suppliers.map(supplier => (
                        <li className="suppliers__list__item"
                            key={supplier._id}>
                            <div className="suppliers__list__item__header">
                                <h3 className="suppliers__list__item__header__name">{supplier.name}</h3> 
                                <div className="suppliers__list__item__header__cta">                     
                                    <div className="suppliers__list__item__header__cta__btn suppliers__list__item__header__cta__btn--edit"
                                         onClick={() => props.editSupplierHandler(supplier)}>
                                        Edit
                                    </div>
                                    <div className="suppliers__list__item__header__cta__btn suppliers__list__item__header__cta__btn--delete"
                                        onClick={() => props.deleteSupplierHandler(supplier._id)}>
                                        Delete
                                    </div>
                                </div>
                            </div>

                            <div className="suppliers__list__item__infoGroup">
                                <div className="suppliers__list__item__info">{supplier.email}</div>
                                <div className="suppliers__list__item__info">{supplier.phoneNumber}</div>
                                <div className="suppliers__list__item__info">{supplier.address}</div>
                            </div>

                            

                            <div className="suppliers__list__item__nav">
                                <div className={`suppliers__list__item__nav__item
                                                ${supplier.currentView === 'contacts' ? 'active': ''}`}
                                     onClick={() => props.supplierNavigationHandler(supplier._id, 'contacts')}>Contacts</div>
                                {/* <div className={`suppliers__list__item__nav__item
                                                ${supplier.currentView === 'products' ? 'active': ''}`}
                                    onClick={() => props.supplierNavigationHandler(supplier._id, 'products')}>Products</div> */}
                            </div>

                            <table className="suppliers__list__item__responsiblesTable">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone Number</th>
                                        <th>Poste</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {supplier.responsibles.map(responsible => (
                                        <tr className="suppliers__list__item__responsiblesTable__row"
                                            key={responsible}>
                                            <td className="suppliers__list__item__responsiblesTable__row__data">{responsible.name}</td>
                                            <td className="suppliers__list__item__responsiblesTable__row__data">{responsible.email}</td>
                                            <td className="suppliers__list__item__responsiblesTable__row__data">{responsible.phoneNumber}</td>
                                            <td className="suppliers__list__item__responsiblesTable__row__data">{responsible.title}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                
                            </table>
                        </li>
                    )
                    )}
                </ul>
    )
}

export default SuppliersList
