FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline -B

COPY src ./src
RUN ./mvnw clean package -DskipTests -B

FROM eclipse-temurin:25-jre
WORKDIR /app

RUN groupadd -r colalimpa && useradd -r -g colalimpa colalimpa

COPY --from=build /app/target/*.jar app.jar
RUN chown -R colalimpa:colalimpa /app

USER colalimpa

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
