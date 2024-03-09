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
        // check for a valid email address
        switch (field.name) {
            case "phone":
                pattern = /^-?\d+$/;
                errorMsg = "Por favor ingrese un número válido";
                break;
            case "id":
                pattern = /^-?\d+$/;
                errorMsg = "Por favor ingrese un DNI válido";
                break;
            default:
                break;
        }

        console.log(field.value)

        switch (pattern.test(field.value)) {
            case true:
                this.setStatus(field, null, "success");
                break;
        
            default:
                this.setStatus(field, errorMsg, "error");
                this.validateForm = false;
                break;
        }

      }

      setStatus(field, message, status) {
        // const successIcon = field.parentElement.querySelector('.icon-success')
        console.log(status)
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

      sendForm() {
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
  