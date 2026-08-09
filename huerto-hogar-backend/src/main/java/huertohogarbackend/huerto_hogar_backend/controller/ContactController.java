package huertohogarbackend.huerto_hogar_backend.controller;

import huertohogarbackend.huerto_hogar_backend.dto.ContactMessageRequest;
import huertohogarbackend.huerto_hogar_backend.model.ContactMessage;
import huertohogarbackend.huerto_hogar_backend.service.ContactService;
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
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping
    public ContactMessage submit(@RequestBody ContactMessageRequest request) {
        return contactService.save(request);
    }

    @GetMapping
    public List<ContactMessage> listAll() {
        return contactService.listAll();
    }
}
