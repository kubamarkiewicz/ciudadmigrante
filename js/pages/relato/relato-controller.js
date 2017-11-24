app.controller('RelatoController', function($scope, $rootScope, $http, $routeParams, config) {  




    $("section#relato-video aside .handle").click(function(){
        $(this).parent().toggleClass('expanded');
    });


    $rootScope.$watch('relatosData', function() {
        if ($rootScope.relatosData) {
            $scope.relatoData = $rootScope.relatosData[$routeParams.id];

            if ($scope.relatoData.youtube_id) {

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
                        videoId: $scope.relatoData.youtube_id,
                        height: '600',
                        width: '800',
                        playerVars: { 
                            'autoplay': 1,
                            'controls': 1, 
                            'rel' : 0,
                            'showinfo' : 0,
                            'cc_load_policy': 1,
                            'color': 'white',
                            // 'modestbranding': 1,
                            'fs': 0
                        }
                    });
                }
                
            }


        }
    });
    

});