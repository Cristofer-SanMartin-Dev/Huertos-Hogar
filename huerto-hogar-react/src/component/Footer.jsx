// src/components/Footer.jsx

/**
 * TUTOR: Componente simple y reutilizable para el pie de página.
 * No tiene lógica, solo presenta información estática.
 */
const Footer = () => {
    return (
        <footer className="footer mt-auto py-3 bg-dark text-white">
            <div className="container text-center">
                <p>&copy; 2025 HuertoHogar. Todos los derechos reservados.</p>
                <div className="social-links">
                    <a href="#" className="text-white mx-2">Facebook</a> |
                    <a href="#" className="text-white mx-2">Instagram</a> |
                    <a href="#" className="text-white mx-2">Twitter</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;