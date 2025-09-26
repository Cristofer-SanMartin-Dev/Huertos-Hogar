import React from 'react';
import { CartWidget } from './CartWidget'; // 1. Importamos el componente

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">HuertoHogar</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">Frutas Frescas</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Verduras Orgánicas</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Productos Orgánicos</a>
            </li>
             <li className="nav-item">
              <a className="nav-link" href="#">Productos Lácteos</a>
            </li>
          </ul>
        </div>
        <CartWidget /> {/* 2. Usamos el componente */}
      </div>
    </nav>
  );
};