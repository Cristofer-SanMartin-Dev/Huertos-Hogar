import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="container mt-5">
      <div className="p-5 mb-4 bg-light rounded-3">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Bienvenido a HuertoHogar</h1>
          <p className="col-md-8 fs-4">Del campo a tu hogar. Descubre la frescura y calidad de nuestros productos seleccionados directamente de agricultores locales.</p>
          <Link className="btn btn-primary btn-lg" to="/products">Ver Productos</Link>
        </div>
      </div>
    </div>
  );
};