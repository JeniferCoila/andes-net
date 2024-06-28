import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";

export default () => {
  class Slider {
    constructor() {
      this.plansContainer = document.querySelector(".andesnet-plans__cards");
      this.benefitsContainer = document.querySelector(
        ".andesnet-benefits__cards"
      );
    }
    load() {
      new Swiper(this.plansContainer, {
        slidesPerView: 1,
        spaceBetween: 20,
        autoHeight: true,
        pagination: {
          el: ".swiper-pagination",
          bulletClass: "swiper-pagination-bullet andesnet-bullet",
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 4,
          },
        },
      });

      new Swiper(this.benefitsContainer, {
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
          el: ".swiper-pagination",
          bulletClass: "swiper-pagination-bullet andesnet-bullet",
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        },
      });
    }
  }
  new Slider().load();
};
