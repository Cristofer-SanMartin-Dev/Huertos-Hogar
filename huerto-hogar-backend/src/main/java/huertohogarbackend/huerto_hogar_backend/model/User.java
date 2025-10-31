package huertohogarbackend.huerto_hogar_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table; // Usaremos @Table para evitar conflictos con la palabra "user"
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * TUTOR: Este es el Modelo para nuestros usuarios.
 * Sigue la misma lógica que la entidad 'Product' [cite: 765-787].
 */
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
// La palabra "User" suele ser una palabra reservada en SQL.
// @Table(name = "app_users") le dice a Spring que cree la tabla
// con el nombre "app_users" para evitar conflictos.
@Table(name = "app_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    // Guardaremos el nombre del usuario (ej: "Juan Pérez")
    private String name;

    // @Column(unique = true) asegura que no puedan existir dos usuarios
    // con el mismo correo electrónico en la base de datos.
    @Column(unique = true)
    private String email;

    // Esta columna guardará la contraseña YA ENCRIPTADA (hasheada).
    private String password;
    
    // Podríamos añadir más campos como 'address' (dirección) aquí.
}