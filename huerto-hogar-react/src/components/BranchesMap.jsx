// src/components/BranchesMap.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { sucursales } from '../data/sucursales.js';

// Los bundlers (Vite/webpack) rompen las rutas por defecto de los iconos de
// Leaflet porque no las resuelven automáticamente: hay que apuntarlas a mano
// a los archivos importados.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

/**
 * Mapa interactivo con las sucursales de HuertoHogar en Chile, usando
 * Leaflet + OpenStreetMap: gratuito y sin necesitar una API key de pago,
 * a diferencia de la API de JavaScript de Google Maps para varios marcadores.
 */
const BranchesMap = ({ height = '450px' }) => {
    // Centro aproximado de Chile continental, con zoom para ver desde
    // Puerto Montt hasta la Región Metropolitana.
    const centro = [-37.5, -72.0];

    return (
        <div className="rounded shadow overflow-hidden" style={{ height }}>
            <MapContainer center={centro} zoom={5} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {sucursales.map(sucursal => (
                    <Marker key={sucursal.ciudad} position={[sucursal.lat, sucursal.lng]}>
                        <Popup>
                            <strong>{sucursal.ciudad}</strong><br />
                            {sucursal.region}<br />
                            {sucursal.horario}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default BranchesMap;
