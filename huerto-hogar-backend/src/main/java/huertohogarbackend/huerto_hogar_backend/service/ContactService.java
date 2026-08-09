package huertohogarbackend.huerto_hogar_backend.service;

import huertohogarbackend.huerto_hogar_backend.dto.ContactMessageRequest;
import huertohogarbackend.huerto_hogar_backend.model.ContactMessage;
import huertohogarbackend.huerto_hogar_backend.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    public ContactMessage save(ContactMessageRequest dto) {
        ContactMessage message = new ContactMessage();
        message.setNombre(dto.getNombre());
        message.setEmail(dto.getEmail());
        message.setMensaje(dto.getMensaje());
        return contactMessageRepository.save(message);
    }

    public List<ContactMessage> listAll() {
        return contactMessageRepository.findAllByOrderByFechaDesc();
    }
}
