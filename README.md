
# 🛍️ ECommerceEtp - Frontend

> 🌐 Plataforma de comercio electrónico desarrollada con **Angular**, pensada para compradores y vendedores. Forma parte del proyecto completo presentado para la **Olimpíada Nacional INET 2025** en el área de Programación.

---

## 📚 Tabla de Contenidos

- [📦 Descripción del Proyecto](#-descripción-del-proyecto)
- [🚀 Características Principales](#-características-principales)
- [🔧 Requisitos Técnicos](#-requisitos-técnicos)
- [🛠️ Instalación y Uso](#️-instalación-y-uso)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🧭 Navegación de Páginas](#-navegación-de-páginas)
- [👤 Usuarios y Roles](#-usuarios-y-roles)
- [🧰 Comandos Útiles](#-comandos-útiles)
- [📚 Recursos Adicionales](#-recursos-adicionales)
- [📌 Estado del Proyecto](#-estado-del-proyecto)
- [🙌 Créditos](#-créditos)
- [📝 Licencia](#-licencia)

---

## 📦 Descripción del Proyecto

**ECommerceEtp** es una tienda online con interfaz moderna y responsiva. Los usuarios pueden explorar productos, gestionar su carrito, registrarse, iniciar sesión y concretar compras. Los vendedores pueden administrar su catálogo de productos y visualizar sus ventas.

El sistema se comunica con la [API Backend](https://e-comerce-backend-kudw.onrender.com) desarrollada con FastAPI y documentada con Swagger.

---

## 🚀 Características Principales

- 🎨 Interfaz intuitiva desarrollada en Angular
- 🔐 Autenticación con tokens JWT
- 🛍️ Navegación de productos y búsquedas
- 🛒 Carrito persistente y actualizado en tiempo real
- 💼 Paneles diferenciados para compradores y vendedores
- 💬 Manejo de errores y notificaciones amigables
- 🌐 Adaptado para pantallas móviles

---

## 🔧 Requisitos Técnicos

- Node.js 18+
- Angular CLI (`@angular/cli`)
- Navegador moderno (Chrome, Firefox, Edge)

---

## 🛠️ Instalación y Uso

### 1. Clonar el repositorio

```bash
git clone https://github.com/Starkware-713/e-commerce-front
cd e-commerce-front
````

### 2. Instalar dependencias

```bash
npm install
```

### 3. Iniciar servidor de desarrollo

```bash
ng serve
```

### 4. Ver la aplicación

Abre [http://localhost:4200](http://localhost:4200) en tu navegador.

---

## 📁 Estructura del Proyecto

```bash
e-commerce-front/
├── public/                # Archivos públicos
├── src/
│   ├── index.html         # HTML principal
│   ├── main.ts            # Entrada de la app
│   ├── styles.css         # Estilos globales
│   └── app/
│       ├── app.module.ts      # Módulo raíz
│       ├── app.routes.ts      # Rutas principales
│       ├── pages/             # Vistas principales
│       │   ├── auth/          # Login, registro
│       │   ├── cart/          # Carrito de compras
│       │   ├── contact/       # Formulario de contacto
│       │   ├── dashboard/     # Panel de usuario
│       │   ├── errors/        # Páginas de error
│       │   ├── home/          # Página principal
│       │   ├── privacy/       # Política de privacidad
│       │   ├── products/      # Catálogo de productos
│       │   ├── terms/         # Términos y condiciones
│       ├── services/          # Servicios para API y lógica de negocio
│       └── shared/            # Componentes reutilizables (navbar, footer, etc.)
```

---

## 🧭 Navegación de Páginas

* **🏠 Inicio:** Productos destacados y navegación principal
* **🛍️ Productos:** Catálogo con filtros y búsqueda
* **🛒 Carrito:** Vista y modificación de productos seleccionados
* **🔐 Login/Registro:** Acceso y creación de cuentas
* **📊 Dashboard:**

  * Compradores: historial de compras
  * Vendedores: gestión de productos y ventas
* **❌ Errores:** Páginas de error 403/404
* **📜 Privacidad y Términos:** Información legal

---

## 👤 Usuarios y Roles

* **Compradores:** Pueden registrarse, buscar productos, comprar y gestionar su carrito.
* **Vendedores:** Tienen acceso a un panel personalizado para publicar productos y revisar ventas.

---

## 🧰 Comandos Útiles

| Comando                        | Descripción                           |
| ------------------------------ | ------------------------------------- |
| `npm install`                  | Instala dependencias                  |
| `ng serve`                     | Inicia el servidor de desarrollo      |
| `ng build`                     | Compila la aplicación para producción |
| `ng generate component nombre` | Crea un nuevo componente              |
| `ng test`                      | Ejecuta tests unitarios               |

---

## 📚 Recursos Adicionales

* [📘 Angular CLI Documentation](https://angular.dev/tools/cli)
* [🧪 Karma Test Runner](https://karma-runner.github.io)

---

## 📌 Estado del Proyecto

🟢 Proyecto funcional en constante mejora. Versión actual: `1.0.0`

---

## 🙌 Créditos

Desarrollado por **Walter Carrasco**, **Bruno Almonacid** y **Joaquin Narvay**  y  estudiantes del 7mo año de ETP en la **Escuela N.º 713 'Juan Abdala Chayep'**, Esquel, Chubut.
Complementa el backend en FastAPI para la **Olimpíada Nacional INET 2025** – Área Programación()

---

## 📝 Licencia

Este proyecto tiene fines educativos y se entrega como parte de una evaluación académica. Puede ser reutilizado con fines pedagógicos citando su autoría original.

