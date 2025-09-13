# CNT Agendamiento

Aplicación web desarrollada en **Angular** para la **gestión y agendamiento de citas** de atención al cliente para CNT.  
El proyecto está basado en una arquitectura en tres capas:

- **Components**: Contiene la interfaz de usuario y la lógica de presentación.
- **Models**: Define las interfaces y estructuras de datos utilizadas en toda la aplicación.
- **Services**: Maneja la comunicación con el backend y la lógica de negocio.

---

## 🚀 Tecnologías

- **Angular CLI**: 18.2.20  
- **Angular**: 18.2.13  
- **Node.js**: 20.19.1  
- **npm**: 10.8.2  
- **RxJS**: 7.8.2  
- **TypeScript**: 5.4.5  
- **Zone.js**: 0.14.10  

---

## 📂 Estructura del proyecto

```
cnt-agendamiento/
├── src/
│   ├── app/
│   │   ├── components/   # Componentes de la UI
│   │   ├── models/       # Interfaces y modelos de datos
│   │   ├── services/     # Lógica de negocio y peticiones HTTP
│   │   └── app.module.ts
│   └── assets/           # Recursos estáticos (imágenes, etc.)
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠️ Instalación y ejecución en desarrollo

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/usuario/cnt-agendamiento.git
   cd cnt-agendamiento
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Levantar el servidor en modo desarrollo**:
   ```bash
   ng serve
   ```
   La aplicación estará disponible en:  
   **http://localhost:4200**

---

## 🏗️ Generar build para producción

1. Ejecutar:
   ```bash
   ng build --configuration production
   ```

2. Los archivos generados estarán en la carpeta `dist/cnt-agendamiento/`.  
   Estos archivos son los que debes desplegar en tu servidor o servicio de hosting.

---
---

## 📦 Comandos útiles

- **Verificar versión de Angular**  
  ```bash
  ng version
  ```
- **Crear un nuevo componente**  
  ```bash
  ng generate component components/nombre-componente
  ```
- **Crear un nuevo servicio**  
  ```bash
  ng generate service services/nombre-servicio
  ```

---

## 📜 Licencia
Este proyecto es de uso interno para CNT y no está destinado para distribución pública.
