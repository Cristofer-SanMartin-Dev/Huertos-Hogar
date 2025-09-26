import React from 'react';
import { ProductCard } from '../components/ProductCard';

// Datos de ejemplo basados en tu PDF
const products = [
  {
    id: 'FR001',
    name: 'Manzanas Fuji',
    price: 1200,
    description: 'Crujientes y dulces, cultivadas en el Valle del Maule.',
    image: 'https://i.imgur.com/2v5s1bs.jpeg' // URL de imagen de ejemplo
  },
  {
    id: 'FR002',
    name: 'Naranjas Valencia',
    price: 1000,
    description: 'Jugosas y ricas en vitamina C, ideales para zumos.',
    image: 'https://i.imgur.com/s6n5m7L.jpeg' // URL de imagen de ejemplo
  },
  {
    id: 'FR003',
    name: 'Plátanos Cavendish',
    price: 800,
    description: 'Maduros y dulces, perfectos como snack energético.',
    image: 'https://i.imgur.com/oKudl0a.jpeg' // URL de imagen de ejemplo
  }
];

export const HomePage = () => {
  return (
    <div className="container mt-4">
      <div className="row">
        {/* Usamos .map() para "mapear" cada producto a un componente ProductCard */}
        {products.map(product => (
          <div className="col-md-4 mb-4" key={product.id}>
            <ProductCard
              name={product.name}
              price={product.price}
              description={product.description}
              image={product.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
};