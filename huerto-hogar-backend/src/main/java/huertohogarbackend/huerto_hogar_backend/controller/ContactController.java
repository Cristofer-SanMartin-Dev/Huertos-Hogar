package huertohogarbackend.huerto_hogar_backend.controller;

import huertohogarbackend.huerto_hogar_backend.config.OpenApiConfig;
import huertohogarbackend.huerto_hogar_backend.dto.ContactMessageRequest;
import huertohogarbackend.huerto_hogar_backend.model.ContactMessage;
import huertohogarbackend.huerto_hogar_backend.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Mensajes de contacto. Al ser una empresa ficticia sin buzón real, el
 * mensaje se persiste de verdad en la base de datos (no se "envía por
 * correo") y un administrador puede leerlo desde el panel.
 */
@RestController
@RequestMapping("/api/contact")
@Tag(name = "Contacto", description = "Formulario de contacto público. Los mensajes se guardan en la base de datos (no se envían por correo); solo un ADMIN puede leerlos.")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping
    @Operation(summary = "Enviar un mensaje de contacto", description = "Público, no requiere sesión. El mensaje queda guardado para que lo revise un ADMIN desde el panel.")
    public ContactMessage submit(@RequestBody ContactMessageRequest request) {
        return contactService.save(request);
    }

    @GetMapping
    @Operation(summary = "Listar todos los mensajes de contacto recibidos (solo ADMIN)")
    @SecurityRequirement(name = OpenApiConfig.SECURITY_SCHEME)
    @ApiResponse(responseCode = "403", description = "El usuario no tiene rol ADMIN")
    public List<ContactMessage> listAll() {
        return contactService.listAll();
    }
}
