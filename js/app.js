
var app = angular.module("myApp", [
    "ngRoute",
    "ngSanitize",
    "ngAnimate",
    'pascalprecht.translate'
]);

// load configuration from files
app.constant('config', window.config);




// TRANSLATIONS ===============================================

app.config(['$translateProvider', function ($translateProvider) {

    // try to find out preferred language by yourself
    // $translateProvider.determinePreferredLanguage();

    // choose language form local storage or default

    if (!window.localStorage.locale) {
        window.localStorage.locale = config.defaultLanguage;
    }
    $translateProvider.preferredLanguage(window.localStorage.locale);

    // load default language Synchronously
    $.get({
        url: config.api.getTranslations,
        data: ['lang', window.localStorage.locale],
        async: false,
        contentType: "application/json",
        dataType: 'json',
        success: function (json) {
            $translateProvider.translations(window.localStorage.locale, json);
        }
    });
    
    $translateProvider.useUrlLoader(config.api.urls.getTranslations);
    $translateProvider.useSanitizeValueStrategy(null);
    // tell angular-translate to use your custom handler
    $translateProvider.useMissingTranslationHandler('missingTranslationHandlerFactory');
}]);

// define missing Translation Handler
app.factory('missingTranslationHandlerFactory', function () {
    var called = [];
    return function (translationID) {
        // use last element from code as default translation
        var translation = translationID.substr(translationID.lastIndexOf(".") + 1);

        var element = $("[translate='" + translationID + "']");
        if (element && element.html()) {
            translation = element.html();
        }
        
        if (!called[translationID]) {
            // call API
            $.post({
                url     : config.api.urls.missingTranslation,
                data    : {
                    code : translationID,
                    type : element.attr('translate-type'),
                    translation : translation
                }
            });
        }
        
        called[translationID] = true;

        return translation;
    };
});



// ROUTING ===============================================
app.config(function ($routeProvider, $locationProvider) { 
    
    $routeProvider 

        .when('/espacios', { 
            controller: 'EspaciosController', 
            templateUrl: 'js/pages/espacios/index.html' 
        })     
        .when('/participa', { 
            controller: 'ParticpaController', 
            templateUrl: 'js/pages/participa/index.html' 
        })     
        .when('/ciudad', { 
            controller: 'CiudadController', 
            templateUrl: 'js/pages/ciudad/index.html' 
        })      
        .when('/relatos/:id', { 
            controller: 'RelatosController', 
            templateUrl: 'js/pages/relatos/index.html' 
        })       
        .when('/espacio/:id', { 
            controller: 'EspacioController', 
            templateUrl: 'js/pages/espacio/index.html' 
        })     
        .otherwise({ 
            redirectTo: '/espacios' 
        }); 

    // remove hashbang
    $locationProvider.html5Mode(true);
});

// CORS fix
app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

app.run(function($rootScope, $sce, $http, $location, $timeout, $window, $translate, $route) {

    $('body').removeClass('loading');

    $rootScope.homeSlug = 'espacios';
    $rootScope.urlChangeCount = 0;

    $rootScope.$on('$routeChangeStart', function (event, next, prev) 
    {
        // find page slug
        var prevSlug = $rootScope.pageSlug = config.homepageSlug;
        if (next.originalPath && next.originalPath.substring(1)) {
            $rootScope.pageSlug = next.originalPath.substring(1);
            // substring until first slash
            if ($rootScope.pageSlug.indexOf('/') != -1) {
                $rootScope.pageSlug = $rootScope.pageSlug.substr(0, $rootScope.pageSlug.indexOf('/'));
            }
        }

        // set body class as "page-slug"
        $("body")
        .removeClass(function (index, className) {
            return (className.match (/(^|\s)page-\S+/g) || []).join(' ');
        })
        .addClass("page-"+$rootScope.pageSlug);

        $rootScope.setMetadata();
    });

    $rootScope.$on('$routeChangeSuccess', function() {
        $rootScope.urlChangeCount++;
        // console.log($rootScope.urlChangeCount);
    });

    // fix for displaying html from model field
    $rootScope.trustAsHtml = function(string) {
        return $sce.trustAsHtml(string);
    };


    // choose language
    $rootScope.setLanguage = function(language)
    {
        // save laguange chioce in local storage
        $rootScope.language = $window.localStorage.language = language;
        $translate.use(language);
        $('html').attr('lang', language);
        $('.languages a').removeClass('selected');
        $('.languages a[data-language=' + language + ']').addClass('selected');
    }
    $rootScope.setLanguage($window.localStorage.language);



    // language menu
    $('.languages a').click(function(){
        $rootScope.setLanguage($(this).data('language'));
        // $route.reload();
        $rootScope.loadRelatosData();
        $rootScope.loadEspaciosData();
        $rootScope.setMetadata();
        console.log('lang');
    });


    // relatos
    $("#menu-relatos .toggle").click(function(){
        $(this).parent().toggleClass("expanded");
        $(this).parent().find('.faces a').removeClass('selected');
    });


    $rootScope.relatosData = null;
    
    $rootScope.loadRelatosData = function()
    {
        $http({
            method  : 'GET',
            url     : config.api.urls.get_relatos,
            params  : {
                // 'lang': $rootScope.language
            }
        })
        .then(function(response) {
            $rootScope.relatosData = response.data;
            $timeout(function () {
                $('#menu-relatos .faces a').click(function(){
                    $('#menu-relatos .faces a').removeClass('selected');
                    $(this).addClass("selected");
                });
            });
        });
    }
    $rootScope.loadRelatosData();



    $rootScope.goBack = function() 
    {
        if ($rootScope.urlChangeCount > 1) {
            window.history.back();
        }
        else {
            window.location.href = config.homepageSlug; 
        }
    }



    // espacios data

    $rootScope.espaciosData = null;
    
    $rootScope.loadEspaciosData = function()
    {
        $http({
            method  : 'GET',
            url     : config.api.urls.get_espacios,
            params  : {
                // 'lang': $rootScope.language
            }
        })
        .then(function(response) {
            $rootScope.espaciosData = response.data;
        });
    };
    $rootScope.loadEspaciosData();





    // set meta data
    $rootScope.setMetadata = function()
    {
/*        var pageSlug = $rootScope.pageSlug;
        if (pageSlug == 'home') {
            pageSlug = '';
        }
        var page = $rootScope.pagesData[pageSlug];

        if (page) {
            document.title = page.meta_title;
            document.querySelector('meta[name=description]').setAttribute('content', page.meta_description);
        }*/
    }



    // intro

    $rootScope.closeIntro = function() 
    {
        $('#intro').addClass('closed');
        $timeout(function(){
            $('#intro').remove();
        }, 1000);
    }
    if ($window.sessionStorage.intro !== 'hide') { // show intro
        $('#intro').addClass('show');
        // create youtube player
        if (!YT) {
            $window.onYouTubePlayerAPIReady = onYoutubeReady;
        } else if (YT.loaded) {
            onYoutubeReady();
        } else {
            YT.ready(onYoutubeReady);
        }

        function onYoutubeReady() {

            $translate('intro.URL de video en YouTube').then(function (videoURL) {
                console.log(videoURL);
                var player = new YT.Player('intro-player', {
                    videoId: youtube_parser(videoURL),
                    height: '600',
                    width: '800',
                    playerVars: { 
                        'autoplay': 1,
                        'controls': 0, 
                        'rel' : 0,
                        'showinfo' : 0,
                        'cc_load_policy': 0,
                        'color': 'white',
                        // 'modestbranding': 1,
                        'fs': 0
                    },
                    events: {
                        'onStateChange': onStateChange
                    }
                });
            });
            
        }

        function onStateChange(state) {
            if (state.data === YT.PlayerState.ENDED) {
                $rootScope.closeIntro(); 
            }
        }
    }
    $window.sessionStorage.intro = 'hide';

});



    


$.extend($.easing,
{
    easeOutQuart: function (x, t, b, c, d) {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    }
});


function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

