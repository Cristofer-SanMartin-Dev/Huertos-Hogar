// src/pages/BlogPage.jsx
import React, { useState, useEffect } from 'react';
import { getPosts } from '../services/blogService.js';
import ArticleCard from '../components/ArticleCard.jsx';

/**
 * TUTOR: Esta es la página principal del blog.
 * Su única responsabilidad es obtener todos los posts y mostrarlos
 * usando el componente ArticleCard.
 */
const BlogPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4" style={{ fontFamily: 'var(--font-header)', color: 'var(--accent-brown)' }}>
        Nuestro Blog
      </h2>
      <p className="text-center text-muted mb-5">
        Consejos, recetas e historias sobre alimentación saludable y sostenibilidad.
      </p>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {posts.map(post => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default BlogPage;