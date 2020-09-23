
!(function ($)
{
  "use strict";

  // Hero typed
  if ($('.typed').length)
  {
    var typed_strings = $(".typed").data('typed-items');
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  // Smooth scroll for the navigation menu and links with .scrollto classes
  $(document).on('click', '.nav-menu a, .scrollto', function (e)
  {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname)
    {
      e.preventDefault();
      var target = $(this.hash);
      if (target.length)
      {

        var scrollto = target.offset().top;

        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu, .mobile-nav').length)
        {
          $('.nav-menu .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active'))
        {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
        }
        return false;
      }
    }
  });

  // Activate smooth scroll on page load with hash links in the url
  $(document).ready(function ()
  {
    if (window.location.hash)
    {
      var initial_nav = window.location.hash;
      if ($(initial_nav).length)
      {
        var scrollto = $(initial_nav).offset().top;
        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');
      }
    }
  });

  $(document).on('click', '.mobile-nav-toggle', function (e)
  {
    $('body').toggleClass('mobile-nav-active');
    $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
  });

  $(document).click(function (e)
  {
    var container = $(".mobile-nav-toggle");
    if (!container.is(e.target) && container.has(e.target).length === 0)
    {
      if ($('body').hasClass('mobile-nav-active'))
      {
        $('body').removeClass('mobile-nav-active');
        $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      }
    }
  });

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.nav-menu, .mobile-nav');

  $(window).on('scroll', function ()
  {
    var cur_pos = $(this).scrollTop() + 200;

    nav_sections.each(function ()
    {
      var top = $(this).offset().top,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom)
      {
        if (cur_pos <= bottom)
        {
          main_nav.find('li').removeClass('active');
        }
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
      }
      if (cur_pos < 300)
      {
        $(".nav-menu ul:first li:first").addClass('active');
      }
    });
  });

  // Back to top button
  $(window).scroll(function ()
  {
    if ($(this).scrollTop() > 100)
    {
      $('.back-to-top').fadeIn('slow');
    } else
    {
      $('.back-to-top').fadeOut('slow');
    }
  });

  $('.back-to-top').click(function ()
  {
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'easeInOutExpo');
    return false;
  });

  // Init AOS
  function aos_init()
  {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out-back",
      once: true
    });
  }
  $(window).on('load', function ()
  {
    aos_init();
  });

})(jQuery);


//SOCIAL FEED PLUGIN

$('.social-feed-container').socialfeed({
  // FACEBOOK
  facebook: {
    accounts: ['@teslamotors', '!teslamotors'],  //Array: Specify a list of accounts from which to pull wall posts
    limit: 2,                                   //Integer: max number of posts to load
    access_token: 'daa4e8d10d81b531efe049fce21b3ddf'  //String: "APP_ID|APP_SECRET"
  },

  // TWITTER
  twitter: {
    accounts: ['@spacex'],                       //Array: Specify a list of accounts from which to pull tweets
    limit: 2,                                    //Integer: max number of tweets to load
    consumer_key: 'YOUR_CONSUMER_KEY',           //String: consumer key. make sure to have your app read-only
    consumer_secret: 'YOUR_CONSUMER_SECRET_KEY', //String: consumer secret key. make sure to have your app read-only
    tweet_mode: 'compatibility'                  //String: change to "extended" to show the whole tweet
  },

  // INSTAGRAM
  instagram: {
    accounts: ['@teslamotors', '#teslamotors'],  //Array: Specify a list of accounts from which to pull posts
    limit: 2,                                   //Integer: max number of posts to load
    client_id: 'YOUR_INSTAGRAM_CLIENT_ID',       //String: Instagram client id (option if using access token)
    access_token: 'YOUR_INSTAGRAM_ACCESS_TOKEN' //String: Instagram access token
  },


  // GENERAL SETTINGS
  length: 400,                                     //Integer: For posts with text longer than this length, show an ellipsis.
  show_media: true,                                //Boolean: if false, doesn't display any post images
  media_min_width: 300,                           //Integer: Only get posts with images larger than this value
  update_period: 5000,                            //Integer: Number of seconds before social-feed will attempt to load new posts.
  template: "bower_components/social-feed/template.html",                         //String: Filename used to get the post template.
  template_html:                                  //String: HTML used for each post. This overrides the 'template' filename option
    '<article class="twitter-post"> \
    <h4>{{=it.author_name}}</h4><p>{{=it.text}}  \
    <a href="{{=it.link}}" target="_blank">read more</a> \
    </p> \
    </article>',
  date_format: "ll",                              //String: Display format of the date attribute (see http://momentjs.com/docs/#/displaying/format/)
  date_locale: "en",                              //String: The locale of the date (see: http://momentjs.com/docs/#/i18n/changing-locale/)
  moderation: function (content)
  {                 //Function: if returns false, template will have class hidden
    return (content.text) ? content.text.indexOf('fuck') == -1 : true;
  },
  callback: function ()
  {                          //Function: This is a callback function which is evoked when all the posts are collected and displayed
    console.log("All posts collected!");
  }
});