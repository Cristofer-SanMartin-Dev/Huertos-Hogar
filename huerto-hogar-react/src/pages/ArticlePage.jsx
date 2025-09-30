// src/pages/ArticlePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostById } from '../services/blogService.js';

const ArticlePage = () => {
  const { articleId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const foundPost = getPostById(articleId);
    setPost(foundPost);
  }, [articleId]);

  if (!post) {
    return <div className="container py-5 text-center">Artículo no encontrado.</div>;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Título y metadatos del post */}
          <h1 style={{ fontFamily: 'var(--font-header)' }}>{post.title}</h1>
          <p className="text-muted">Publicado por {post.author} el {post.date}</p>
          
          {/* TUTOR: Aquí añadimos la imagen.
            - Usamos la propiedad `post.imageUrl` que acabamos de agregar.
            - `img-fluid` y `rounded` son clases de Bootstrap que hacen la imagen
              responsiva y con bordes redondeados.
            - `my-4` añade un margen vertical para darle espacio.
          */}
          <img src={post.imageUrl} alt={post.title} className="img-fluid rounded my-4 shadow-sm" />
          
          {/* Contenido del post */}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          
          <hr />
          <Link to="/blog" className="btn btn-primary mt-3">
            &larr; Volver al Blog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;