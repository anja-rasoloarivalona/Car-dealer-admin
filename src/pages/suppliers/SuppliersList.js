import React from 'react';

const SuppliersList = props => {

    let suppliers = props.suppliers;


    return (
        <ul className="suppliers__list">
                    <h1 className="app__primary__title suppliers__title">
                    Suppliers
                        <div className="suppliers__addButton"
                              onClick={() => props.supplierCurrentViewHandler('suppliersForm')}>
                            ajouter
                        </div>
                    </h1>
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
                                    <div className="suppliers__list__item__header__cta__btn suppliers__list__item__header__cta__btn--delete">
                                        Delete
                                    </div>
                                </div>
                            </div>


                            <div className="suppliers__list__item__info">{supplier.email}</div>
                            <div className="suppliers__list__item__info">{supplier.phoneNumber}</div>
                            <div className="suppliers__list__item__info">{supplier.address}</div>

                            <div className="suppliers__list__item__nav">
                                <div className={`suppliers__list__item__nav__item
                                                ${supplier.currentView === 'contacts' ? 'active': ''}`}
                                     onClick={() => props.supplierNavigationHandler(supplier._id, 'contacts')}>Contacts</div>
                                <div className={`suppliers__list__item__nav__item
                                                ${supplier.currentView === 'products' ? 'active': ''}`}
                                    onClick={() => props.supplierNavigationHandler(supplier._id, 'products')}>Products</div>
                            </div>

                            <table className="suppliers__list__item__responsiblesTable">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>phoneNumber</th>
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
