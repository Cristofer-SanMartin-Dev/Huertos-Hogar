// src/components/Footer.jsx

/**
 * HuertoHogar es una empresa ficticia (proyecto educativo): no tiene perfiles
 * reales en redes sociales, así que en vez de simular enlaces a páginas que
 * no existen, estos botones comparten el sitio de verdad a través de
 * WhatsApp y Twitter/X (intents reales, funcionales).
 */
const Footer = () => {
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '');
    const texto = encodeURIComponent('Descubre HuertoHogar: productos frescos del campo a tu hogar.');

    return (
        <footer className="footer mt-auto py-3 bg-dark text-white">
            <div className="container text-center">
                <p>&copy; 2025 HuertoHogar. Todos los derechos reservados.</p>
                <div className="social-links">
                    <a
                        href={`https://wa.me/?text=${texto}%20${url}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-white mx-2"
                    >
                        Compartir por WhatsApp
                    </a>
                    |
                    <a
                        href={`https://twitter.com/intent/tweet?text=${texto}&url=${url}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-white mx-2"
                    >
                        Compartir en Twitter/X
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
