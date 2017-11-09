app.controller('RelatosController', function($scope, $rootScope, $http, config) {  

    // create youtube player
    if (!YT) {
        $window.onYouTubePlayerAPIReady = onYoutubeReady;
    } else if (YT.loaded) {
        onYoutubeReady();
    } else {
        YT.ready(onYoutubeReady);
    }

    function onYoutubeReady() {
        var player = new YT.Player('my-player', {
            videoId: 'eVDDmhuSncc',
            height: '600',
            width: '800',
            playerVars: { 
                'autoplay': 1,
                'controls': 0, 
                'rel' : 0,
                'showinfo' : 0
            }
        });
    }

});