
import { Controller } from './controller/index.js';
import cards from "./components/cards.js";
import form from "./components/form.js";
import slider from "./components/slider.js";
import login from "./components/login.js";
import dashboard from "./components/dashboard.js";
import download from './download.js';

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
            slider();
            break;
        case 'login':
            login();
            break;
        case 'dashboard':
            dashboard();
            download();
            break;
        default:
            break;
    }
};

const redirectLogin = () => {
    const userData = sessionStorage.getItem("user-andesnet");
    const route = window.location.hash;
    console.log(route)
    if (!userData && route !== "#login" && route !== "") {
      alert("No se ha iniciado sesión");
      window.location.href =
        window.location.origin +
        window.location.pathname +
        "#login";
    } else {
        handleLocationChange();
    }
  }


// Manejar cambios en la URL sin recargar la página
window.addEventListener('popstate', redirectLogin);

// Manejar carga inicial de la página
document.addEventListener('DOMContentLoaded', redirectLogin);
