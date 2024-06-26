export default () => {
  class Login {
    constructor() {
      // Usuario administrador para pruebas
      this.adminUser = {
        username: "admin",
        password: "admin",
      };

      // Obtener referencias a elementos del DOM
      this.loginForm = document.getElementById("andesnet-login-form");
      this.usernameInput = document.getElementById("andesnet-login-username");
      this.passwordInput = document.getElementById("andesnet-login-password");

      // Asociar eventos
      this.loginForm.addEventListener("submit", this.handleLogin.bind(this));

    }

    handleLogin(event) {
      event.preventDefault(); // Evitar que el formulario se envíe automáticamente

      // Obtener valores de los campos
      const username = this.usernameInput.value.trim();
      const password = this.passwordInput.value.trim();

      // Validar usuario de prueba (admin admin)
      if (username !== this.adminUser.username || password !== this.adminUser.password) {
        alert(
          'Credenciales incorrectas. Prueba con "admin" como usuario y contraseña.'
        );
      } else {
        this.redirectTo('dashboard');
      }

    }

    redirectTo(hash) {
      const baseUrl = window.location.origin + window.location.pathname;
      window.location.href = baseUrl + "#" + hash;
    }
  }
  new Login();
};
