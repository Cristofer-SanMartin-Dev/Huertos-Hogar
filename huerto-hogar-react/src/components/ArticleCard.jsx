// src/components/ArticleCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * TUTOR: Este componente es la "tarjeta de presentación" de un artículo
 * en la lista del blog. Muestra la información clave y un enlace para leer más.
 */
const ArticleCard = ({ post }) => {
  return (
    <div className="col">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h4 className="card-title" style={{fontFamily: 'var(--font-header)'}}>{post.title}</h4>
          <p className="card-text text-muted">Por {post.author} el {post.date}</p>
          <p className="card-text">{post.summary}</p>
          <Link to={`/blog/${post.id}`} className="btn btn-outline-success">
            Leer más
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;