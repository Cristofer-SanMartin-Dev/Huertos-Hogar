# Build en dos etapas: la primera compila con Maven, la segunda solo
# empaqueta el .jar resultante en una imagen liviana (sin JDK, Maven ni
# código fuente) para que la imagen final sea chica y rápida de desplegar.

FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copiar primero el wrapper y el pom.xml (no el código) permite que Docker
# cachee la descarga de dependencias mientras no cambie pom.xml: si solo
# editás una clase Java, el siguiente build no vuelve a bajar todo Maven.
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

COPY src ./src
RUN ./mvnw clean package -DskipTests -B

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render (y la mayoría de los hosts gratuitos) inyectan la variable PORT y
# esperan que la app escuche justo ahí; application.properties ya lo lee
# como server.port=${PORT:8080}.
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
