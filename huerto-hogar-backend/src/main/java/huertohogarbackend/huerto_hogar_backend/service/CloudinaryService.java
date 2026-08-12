// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/service/CloudinaryService.java
package huertohogarbackend.huerto_hogar_backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * Sube las imágenes de producto a Cloudinary en vez de guardarlas en disco.
 *
 * Render (y la mayoría de los hosts gratuitos) no tiene disco persistente:
 * un archivo escrito en el contenedor desaparece en cuanto se reinicia —
 * en cada deploy, y también cada vez que el servicio free se duerme por
 * inactividad y despierta con un contenedor nuevo. La base de datos sí es
 * persistente, así que quedaba apuntando a un archivo que ya no existía
 * ("la imagen se ve al editar y después desaparece"). Cloudinary sí persiste
 * de verdad, independiente de dónde corra el backend.
 */
@Service
public class CloudinaryService {

    private static final Logger logger = LoggerFactory.getLogger(CloudinaryService.class);

    private final Cloudinary cloudinary;

    public CloudinaryService(@Value("${app.cloudinary.url:}") String cloudinaryUrl) {
        this.cloudinary = (cloudinaryUrl != null && !cloudinaryUrl.isBlank())
                ? new Cloudinary(cloudinaryUrl)
                : null;
    }

    /**
     * @return la URL pública y persistente de la imagen ya subida, o null si
     * Cloudinary no está configurado (los tests no deben depender de la red
     * ni de credenciales reales).
     */
    public String upload(MultipartFile file) throws IOException {
        if (cloudinary == null) {
            logger.warn("CLOUDINARY_URL no configurada: se omite la subida de la imagen.");
            return null;
        }
        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap("folder", "huertohogar/productos"));
        return (String) result.get("secure_url");
    }
}
