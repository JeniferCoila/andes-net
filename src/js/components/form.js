export default (form) => {
    class Form {
      constructor() {
        this.formCtn = document.getElementById(form);

        this.formBanner = this.formCtn.querySelector(".form");
        this.formLoading = this.formCtn.querySelector(".form-loading");
        this.formSuccess = this.formCtn.querySelector(".form-success");
        this.formError= this.formCtn.querySelector(".form-error");

        this.btnSendForm = this.formCtn.querySelector(".andesnet-banner-form__btn")
        this.fields = [".form-phone", ".form-id"];
        this.validateForm = true;

        this.registerData = {
            phone: 0,
            client_id: 0,
            dateRegister: '',
            id_register: '',
            plan_price: '',
            plan_prom_price: '',
            plan_name: '',
            velocity: '',
            prom_velocity: ''
        }

      }

      async loadCardData() {
        try {
            const response = await fetch('./js/data/cards-content.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo JSON.');
            }
            return await response.json();
        } catch (error) {
            console.error('Error al cargar el archivo JSON:', error);
            return []; // Retornar un arreglo vacío o manejar el error según sea necesario
        }
    }


      validateOnSubmit() {
        let $this = this;

        $this.formBanner.addEventListener("submit", (e) => {
            this.validateForm = true;
          e.preventDefault();
          $this.fields.forEach((field) => {
            let input = $this.formBanner.querySelector(`${field}`);
            $this.validateFields(input);
          });
          if (this.validateForm) {
            this.sendForm();
          }
        });
      }

      validateFields(field) {
        let pattern = '';
        let errorMsg = '';
        // Validación de datos ingresados
        switch (field.name) {
            case "phone":
                pattern = /^-?\d+$/;
                errorMsg = "Por favor ingrese un número válido";
                break;
            case "client_id":
                pattern = /^-?\d+$/;
                errorMsg = "Por favor ingrese un DNI válido";
                break;
            default:
                break;
        }


        switch (pattern.test(field.value)) {
            case true:
                this.setStatus(field, null, "success");
                this.registerData[field.name] = field.value;
                break;
        
            default:
                this.setStatus(field, errorMsg, "error");
                this.validateForm = false;
                break;
        }

      }

      setStatus(field, message, status) {

        const errorMessage = field.parentElement.querySelector('.error-message');
        if (status === "success") {
          if (errorMessage) { errorMessage.innerText = "" }
        }
    
        if (status === "error") {
            if (errorMessage) { errorMessage.innerText = "" }
            field.parentElement.querySelector('.error-message').innerText = message
        }
      }

      emptyValues(input) {
        input.value = '';
      }

      createRegister() {
        const localData = this.getObjectFromLocalStorage("register");
        localData.push(this.registerData);
        localStorage.setItem("register", JSON.stringify(localData));
      }

      getObjectFromLocalStorage(key) {
        const jsonString = localStorage.getItem(key);
        if (jsonString) {
            return JSON.parse(jsonString);
        }
        return [];
    }

      setRegister() {
        const date = new Date()/1000;
        this.registerData.dateRegister = date;
        this.registerData.id_register = "id" + Math.random().toString(16).slice(2);
        this.registerData.velocity = this.formBanner.querySelector('input[name="plan"]').dataset.plan;
        this.setAditionalData(this.registerData.velocity);
      }

      async setAditionalData(velocity) {
        const cardSliderData = await this.loadCardData();
        cardSliderData.forEach( data => {
          if(data.vel === velocity) {
            this.registerData.plan_price = data.price;
            this.registerData.plan_prom_price = data.prom_enabled ? data.prom_price : data.price;
            this.registerData.prom_velocity = data.prom_enabled ? data.promocional_vel : data.vel;
            this.registerData.plan_name = "Internet 100% Fibra " + (data.prom_enabled ? "Promocional " : "") + data.vel + " Mbps";
          }
        });
      }

      sendForm() {
        this.setRegister();
        this.formBanner.classList.add("andesnet-modal--hide");
        this.formLoading.classList.remove("andesnet-modal--hide");
        this.formLoading.classList.add("andesnet-modal--show");

          setTimeout(() => {
              this.formSuccess.classList.remove("andesnet-modal--hide");
              this.formSuccess.classList.add("andesnet-modal--show");

              this.formLoading.classList.add("andesnet-modal--hide");
              this.formLoading.classList.remove("andesnet-modal--show");

              setTimeout(() => {
                this.formBanner.classList.remove("andesnet-modal--hide");
                this.formBanner.classList.add("andesnet-modal--show");

                this.formSuccess.classList.add("andesnet-modal--hide");
                this.formSuccess.classList.remove("andesnet-modal--show");
                this.createRegister();

                const $this = this;
                $this.fields.forEach((field) => {
                    let input = $this.formBanner.querySelector(`${field}`);
                    $this.emptyValues(input);
                });

            }, 3000);

          }, 2000);
      }

      load() {
        this.validateOnSubmit();
      }
    }
  
    new Form().load();
  };
  