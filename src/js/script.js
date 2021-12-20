$(document).ready(function(){
    $(".js-mobile-menu").click(function () {
        $('.mobile__menu').toggleClass('active');
        $('.header-nav').toggleClass('active');
        $('body').toggleClass('menu-open');
        $('.mobile-trigger').toggleClass('is-active');
        return false;
    });
    $(document).bind("click touchstart", function (event){
        if ($(event.target).closest(".mobile-trigger, .header-nav").length) return;
        $('.header-nav').removeClass('active');
        $('body').removeClass('menu-open');
        $('.mobile-trigger').removeClass('is-active');
        event.stopPropagation();
    });
   
    $(".slider__items").slick({
        dots: false,
        prevArrow: '<button class="arrow__header prev__arrow-header"></button> ',
        nextArrow: '<button class="arrow__header    next__arrow-header "></button>',
        infinite: true,
        arrows: true,
        slidesToShow: 1,
        slidesToScroll: 1,
    })

})