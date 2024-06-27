
import { Controller } from './controller/index.js';
import cards from "./components/cards.js";
import form from "./components/form.js";
import modal from "./components/modal.js";
import slider from "./components/slider.js";
import login from "./components/login.js";

const controller = new Controller();

// Función para manejar cambios de ubicación (URL)
const handleLocationChange = async () => {
    const hash = window.location.hash.slice(1);
    const route = controller.getRouteFromPath(hash) || ''; // Ruta por defecto es ''

    // Cargar contenido principal
    await controller.loadContent(route);

    // Cargar componentes según la ruta
    await loadComponents(route);
    
};

// Función para cargar componentes según la ruta
const loadComponents = (route) => {
    switch (route) {
        case 'home':
            cards();
            form('form-banner');
            form('form-modal');
            modal();
            slider();
            break;
        case 'login':
            login();
            break;
        case '/contact':
            break;
        default:
            break;
    }
};

// Manejar cambios en la URL sin recargar la página
window.addEventListener('popstate', handleLocationChange);

// Manejar carga inicial de la página
document.addEventListener('DOMContentLoaded', handleLocationChange);

// Cargar vista inicial cuando se ingresa una URL directamente
handleLocationChange();
