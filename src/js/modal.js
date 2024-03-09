export default () => {
    class Modal {
      constructor() {
        
        this.modalOpener = document.querySelectorAll(".modal-opener");
        this.modalCtn = document.querySelector(".a-modal-container")
        this.closeModalItem = this.modalCtn.querySelector(".close");
      }

      openModal() {

        const $this = this;
        console.log(this.modalCtn)

        for (let i = 0; i <  this.modalOpener.length; i++) {
            const modal = this.modalOpener[i];
            modal.addEventListener('click', function() {
                $this.modalCtn.style.display = "block";
            })
        }
      }
      
      closeModal() {
        const $this = this;

        $this.closeModalItem.addEventListener('click', function() {
            $this.modalCtn.style.display = "none";
        })
      }

      clickAny() {
        const $this = this;

        window.onclick = function(event) {
            console.log(event.target, $this.modalCtn)
            if (event.target == $this.modalCtn) {
                $this.modalCtn.style.display = "none";
            }
          }
      }

      load() {
        this.openModal();
        this.closeModal();
        this.clickAny();
      }
    }
  
    new Modal().load();
  };
  