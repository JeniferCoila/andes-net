// mvc.js

export class Model {
    static async fetchData(route) {
        try {
            const response = await fetch(`./views/${route}.html`);
            if (!response.ok) {
                throw new Error(`No se pudo cargar ${route}`);
            }
            return await response.text();
        } catch (error) {
            console.error('Error al cargar el contenido:', error);
            return null;
        }
    }
}

export class View {
    static renderMainContent(content) {
        document.getElementById('andesnet-content').innerHTML = content;
    }
}

export class Controller {
    constructor() {
        this.routes = {
            '': 'home',
            'login': 'login',
            'dashboard': 'dashboard'
            // Puedes agregar más rutas según sea necesario
        };
    }

    getRouteFromPath(path) {
        return this.routes[path];
    }

    async loadContent(route) {
        try {
            const content = await Model.fetchData(route);
            if (content) {
                View.renderMainContent(content);
            } else {
                console.error(`No se encontró contenido para la ruta ${route}`);
            }
        } catch (error) {
            console.error('Error al cargar el contenido:', error);
        }
    }
}
