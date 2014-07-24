$(document).ready(function(){
  if($("#owl-demo1").length != 0){
    $("#owl-demo1").owlCarousel({
      items: 1,
      loop: true,
      margin: 10,
      smartSpeed: 450,
      autoplay: true,
      autoplayTimeout: 4000,
    });
  }
})