
import Swiper, { Navigation, Pagination } from "swiper";
import 'swiper/swiper-bundle.css';


Swiper.use([Navigation, Pagination]);

/* eslint-disable no-unused-vars */
var mySwiper = new Swiper('.swiper-container', {
  loop: true,

  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },

})
/* eslint-disable no-unused-vars */