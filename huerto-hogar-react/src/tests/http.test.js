// src/tests/http.test.js
import { describe, test, expect, beforeEach } from 'vitest';
import http, { setToken, getToken, clearSession } from '../services/http.js';

/**
 * Pruebas del manejo de sesión en el cliente.
 *
 * Verifican que el token JWT se adjunte automáticamente a las peticiones
 * protegidas y que al cerrar sesión no quede rastro en el navegador.
 */
describe('Servicio http (sesión y token)', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  // Ejecuta el interceptor de petición tal como lo haría axios.
  const aplicarInterceptor = (config = { headers: {} }) =>
    http.interceptors.request.handlers[0].fulfilled(config);

  test('debería adjuntar la cabecera Authorization cuando hay token guardado', () => {
    setToken('token-de-prueba');

    const config = aplicarInterceptor();

    expect(config.headers.Authorization).toBe('Bearer token-de-prueba');
  });

  test('no debería adjuntar Authorization si el usuario no ha iniciado sesión', () => {
    const config = aplicarInterceptor();

    expect(config.headers.Authorization).toBeUndefined();
  });

  test('clearSession debería borrar el token y el usuario del navegador', () => {
    setToken('token-de-prueba');
    localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test' }));

    clearSession();

    expect(getToken()).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
