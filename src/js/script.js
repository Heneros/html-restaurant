$(document).ready(function(){
    $(".js-mobile-menu").click(function () {
        $('.header-nav').toggleClass('active');
        $('body').toggleClass('menu-open');
        return false;
    });
})