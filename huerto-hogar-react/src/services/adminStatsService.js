// Ruta: src/services/adminStatsService.js
import http from './http.js';

class AdminStatsService {
    getStats() {
        return http.get('/api/admin/stats');
    }

    getUsers() {
        return http.get('/api/admin/users');
    }

    getReports() {
        return http.get('/api/admin/reports');
    }
}

export default new AdminStatsService();
