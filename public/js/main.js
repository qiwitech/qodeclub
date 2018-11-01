jQuery(document).ready(function($) {


    $("#navToggle").click(function() {
        $(this).toggleClass("active");
        $(".overlay").toggleClass("open");
        // this line ▼ prevents content scroll-behind
        $("body").toggleClass("locked"); 
    });


    $("#request").submit(function(e) {
        e.preventDefault();
        var $form = $(this);

        grecaptcha.ready(function() {
            grecaptcha.execute('6LcJ_ncUAAAAAJs0TIkneGMbpgz43XH_Ij_sHM95', {action: 'request'})
            .then(function(token) {
                var data = $form.serializeArray();
                data.push({name: "gtoken", value: token});
                $.post('/request', $.param(data))
                .then(function() {
                  $("#request").hide();
                  $("#request").trigger('reset');
                }).catch(function(){
                  $("#request").hide();
                  $("#request").trigger('reset');
                });                
            });
        });
    }); 

    jQuery('.fancybox').fancybox({
        openEffect  : 'none',
        closeEffect : 'none'
    });
    jQuery('.fancybox-media').fancybox({
        openEffect  : 'none',
        closeEffect : 'none',
        helpers : {
            media : {}
        }
    });

    var menu_selector = ".navbar";

    function onScroll(){
        var scroll_top = $(document).scrollTop();
        $(menu_selector + " a").each(function(){
            var hash = $(this).attr("href");
            var target = $(hash);
            if (target.position().top <= scroll_top && target.position().top + target.outerHeight() > scroll_top) {
                $(menu_selector + " a.active").removeClass("active");
                $(this).addClass("active");
            } else {
                $(this).removeClass("active");
            }
        });
    }

    $(document).on("scroll", onScroll);

    $("a[href^=#]").click(function(e){
        e.preventDefault();
        $(document).off("scroll");
        $(menu_selector + " a.active").removeClass("active");
        $(this).addClass("active");
        var hash = $(this).attr("href");
        var target = $(hash);
        $("html, body").animate({
            scrollTop: target.offset().top
        }, 500, function(){
            window.location.hash = hash;
            $(document).on("scroll", onScroll);
        });

    });
    
    jQuery(window).scroll(function() {
        jQuery(this).scrollTop() > 50 ? jQuery(".fixed").addClass("fixx") : jQuery(".fixed").removeClass("fixx")
    }); 
});
