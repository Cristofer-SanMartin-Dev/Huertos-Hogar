// Ruta: src/components/RegionComunaSelect.jsx
import React from 'react';
import REGIONES_CHILE, { getComunas } from '../data/chileRegiones.js';

/**
 * Par de selects Región/Comuna: al cambiar la región, la comuna se resetea
 * y su lista de opciones se filtra según la región elegida.
 */
const RegionComunaSelect = ({ region, comuna, onRegionChange, onComunaChange, regionError, comunaError }) => {
    const comunas = getComunas(region);

    const handleRegionChange = (e) => {
        onRegionChange(e.target.value);
        onComunaChange(''); // la comuna anterior puede no existir en la región nueva
    };

    return (
        <>
            <div className="col-md-6 form-group">
                <label htmlFor="region">Región:</label>
                <select
                    id="region"
                    className={`form-select ${regionError ? 'is-invalid' : ''}`}
                    value={region}
                    onChange={handleRegionChange}
                    required
                >
                    <option value="">Seleccione...</option>
                    {REGIONES_CHILE.map(r => (
                        <option key={r.region} value={r.region}>{r.region}</option>
                    ))}
                </select>
                {regionError && <div className="invalid-feedback">{regionError}</div>}
            </div>

            <div className="col-md-6 form-group">
                <label htmlFor="comuna">Comuna:</label>
                <select
                    id="comuna"
                    className={`form-select ${comunaError ? 'is-invalid' : ''}`}
                    value={comuna}
                    onChange={(e) => onComunaChange(e.target.value)}
                    disabled={!region}
                    required
                >
                    <option value="">{region ? 'Seleccione...' : 'Elige una región primero'}</option>
                    {comunas.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
                {comunaError && <div className="invalid-feedback">{comunaError}</div>}
            </div>
        </>
    );
};

export default RegionComunaSelect;
