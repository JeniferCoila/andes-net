# Documentación del Proyecto Andes Net

## Integrantes
- Rafael Anderson Ponte Gaitán (COORDINADOR)
- Jenifer Coila Farfan
- Victor Diego Torres Corrales
- Jholby Samamé Segura

## Descripción General

ANDESNET es un nuevo operador nacional que brinda servicios de internet hogar, la cual inicia su gestión en la ciudad de Ayacucho - Perú.
Teniendo como objetivo inicial abastecer a más de 5 mil familias en el presente año contratando planes de internet con la mayor velocidad en el mercado (800/mbps).
Para tal motivo se ha decidido optar por la creación de una Landing Page la cual le permite almacenar solicitudes directas de clientes potenciales e interesados que desean contratar dicho servicio y disfrutar del mejor nivel y velocidad de navegación.
De esta manera se establece como meta principal la conversión de 50% de clientes que se registren a través de la Landing Page - ANDESNET, creando los filtros necesarios que permitan realizar una adecuada y eficaz evaluación, tanto al nivel crediticio como al nivel de cobertura, de todos los usuarios que se registren a través de la nuestra página web.

## Vistas principales

### Home : https://andesnet-4973d.web.app/
### Login: https://andesnet-4973d.web.app/#login
### Dashboard https://andesnet-4973d.web.app/#dashboard

## Estructura del Código

## Clase `Form`

Define y exporta una clase `Form` que maneja la validación y el envío de un formulario en la página web. La clase `Form` incluye métodos para validar los campos del formulario, manejar el envío, mostrar mensajes de éxito/error y limpiar los campos del formulario después del envío.

### Constructor
Inicializa las referencias a los elementos del formulario y configura algunas variables necesarias para la validación y el envío.

### Métodos

- **`validateOnSubmit`**: Agrega un evento de submit al formulario para validar y enviar los datos.
- **`validateFields`**: Valida los campos del formulario según un patrón específico.
- **`setStatus`**: Muestra mensajes de error o éxito junto a los campos del formulario.
- **`emptyValues`**: Limpia los valores de los campos del formulario.
- **`sendForm`**: Maneja el proceso de envío del formulario, incluyendo la simulación de una solicitud de red y la gestión de la interfaz de usuario.
- **`load`**: Método que se llama al crear una instancia de la clase para iniciar el proceso de validación.

## Clase `Cards`
La clase `Cards` maneja la generación y visualización de cards de planes de internet de la página. Utiliza datos de un archivo JSON para crear el contenido de las cards y mostrarlas en el contenedor correspondiente del DOM.

### Constructor
Inicializa las referencias al contenedor de cards y almacena los datos importados del archivo JSON.

### Métodos

- **`setCards`**: Genera el contenido de las cards y lo inserta en el contenedor del DOM.
- **`getContent`**: Recorre los datos del JSON y construye el HTML para cada tarjeta, incluyendo título, velocidad, precio, promociones y beneficios.
- **`load`**: Llama al método `setCards` para cargar el contenido de las cards.

## Inicialización
```javascript
new Cards().load();
```

## Clase `Slider`
Define y exporta una clase `Form` que maneja la implementación del slider haciendo uso de la librería Swiper JS
usando su CDN.

### Métodos
- **`Swiper`**: Implementa el componente slider en los carruseles de beneficios y planes


## Clase `Modal`

Define y exporta una función que crea y gestiona un modal (ventana emergente) en la página web. La clase `Modal` maneja la apertura, cierre y eventos relacionados con el modal.

### Constructor
Inicializa las referencias a los elementos del DOM relacionados con el modal:
- **`modalOpener`**: Botones que abren el modal.
- **`modalCtn`**: Contenedor del modal.
- **`closeModalItem`**: Elemento dentro del modal que cierra el modal.

### Métodos

- **`openModal`**: Añade eventos a los botones de apertura del modal. Al hacer clic, se muestra el modal y se asigna el plan seleccionado a un campo dentro del modal.
- **`closeModal`**: Añade un evento al elemento de cierre para ocultar el modal cuando se hace clic en él.
- **`clickAny`**: Añade un evento para cerrar el modal si se hace clic fuera de él (en cualquier parte de la ventana).
- **`load`**: Inicializa los eventos de apertura, cierre y clic fuera del modal llamando a los métodos correspondientes.

## Inicialización
```javascript
new Modal().load();
```

### Inicio de sesión

Se ha incorporado una funcionalidad de inicio de sesión accesible desde la vista principal, con el propósito de incrementar la seguridad.

## Funcionalidades
- **Campos de Entrada:**
  - **Usuario:** Campo de texto donde el usuario ingresa su nombre de usuario o correo electrónico.
  - **Contraseña:** Campo de texto donde el usuario ingresa su contraseña.
- **Botón de Inicio de Sesión:** Al hacer clic en este botón, se verifica la información ingresada y, si es correcta, se permite el acceso al dashboard (panel de registros).

### Dashboard

Se ha implementado un CRUD (Create, Read, Update, Delete) para la gestión de registros de clientes.

## Funcionalidades
- **Visualización de Datos:**
  - Los datos se obtienen de la memoria del navegador y se muestran en una tabla.
  - La tabla incluye las siguientes columnas:
    - **Número de Celular del Cliente:** Muestra el número de celular asociado al cliente.
    - **DNI:** Muestra el Documento Nacional de Identidad del cliente.
    - **Plan Elegido:** Indica el plan seleccionado por el cliente.
    - **Precio:** Muestra el precio del plan.
    - **Precio Promocional (si existe):** Indica el precio promocional del plan, si está disponible.
- **Creación de Nuevos Registros:**
  - Se ha añadido un módulo que permite la creación de nuevos registros.
  - Este módulo solicita la entrada del DNI y el número de celular del cliente.
- **Edición y Eliminación de Registros:**
  - Cada registro en la tabla cuenta con botones específicos:
    - **Botón de Editar:** Permite modificar la información del registro.
    - **Botón de Eliminar:** Permite eliminar el registro de la tabla.


