import React from 'react';

// Recibimos 'props' como un objeto: { image, name, price, description }
export const ProductCard = ({ image, name, price, description }) => {
  return (
    <div className="card" style={{ width: '18rem' }}>
      <img src={image} className="card-img-top" alt={name} />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">{description}</p>
        <p className="card-text"><strong>Precio: ${price} CLP por kilo</strong></p>
        <a href="#" className="btn btn-primary">Agregar al carrito</a>
      </div>
    </div>
  );
};