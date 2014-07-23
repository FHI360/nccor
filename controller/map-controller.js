'use strict';

//NCCOR Map Controller
angular.module('nccor', ['angularjs-dropdown-multiselect'])
    .controller('NccorCtrl', ['$scope', '$http', function($scope, $http){
        
        $scope.center = {
                lat: 24.0391667,
                lng: 121.525,
                zoom: 6,
            };

        $scope.data = {};
        $scope.filteredData = {};
        $scope.years = [];
        // $scope.agency = '';
        // $scope.agencies = [];
        $scope.topics = [];
        $scope.funder = '';
        $scope.funders = [];
        $scope.states = [];
        $scope.searchString = '';
        $scope.message = '';
        $scope.loaded = false;

        var projectsGroup = new L.MarkerClusterGroup({
            showCoverageOnHover: false, 
            maxClusterRadius: 20, 
            singleMarkerMode: true,
            zoomToBoundsOnClick: false
            // iconCreateFunction: function (cluster) {
            //     var markers = cluster.getAllChildMarkers();
            //     var n = 0;
            //     n = markers.length++;
            //     return L.divIcon({ html: '<div class="cluster">' + n + '</div>', className: 'mycluster', iconSize: L.point(40, 40) });
            // },
        });

        $scope.uncheckAllTopics = function() {
            $scope.topic = [];
            $scope.processData();
        }

        $scope.uncheckAllYears = function() {
            $scope.year = [];
            $scope.processData();
        }

        $scope.init = function() {
            $scope.message='Loading data...';
            console.log('Requesting remote server...');

            var projects = $scope.getProjects();
        };

        $scope.resetFilters = function() {
            $scope.searchString = '';
            $scope.getProjects();
        }

        $scope.processSearch = function(search) {
            $scope.message='Searching...';
            $scope.getProjects(search);
        }

        function initMap() {
            if($scope.map === undefined) {
                $scope.map = L.map('map', {minZoom: 4}).setView([39.186, -96.583], 4);
                var googleLayer = new L.Google('ROADMAP');
                $scope.map.addLayer(googleLayer);
            }
        }

        function processCluster(cluster) {
            var amount = _.reduce(cluster, function(memo, num) {  
                return parseInt(memo) + parseInt(num.budget); 
            }, 0);
            var popupMsg = '<h5>' + cluster.length + ' projects</h5>' + '<div>Budget amount: <strong>' + accounting.formatMoney(amount, '$', 0) + '</strong></div>';
            return popupMsg;
        }

        function placeMarkers() {
            projectsGroup.clearLayers();
            var popup = L.popup({offset: new L.Point(0,-10)});
            projectsGroup.addTo($scope.map);
            projectsGroup
                .on('clusterclick', function (a) {
                    var children = a.layer.getAllChildMarkers();
                    console.log(children);
                    popup.setLatLng(a.latlng)
                        .setContent(processCluster(children));
                    $scope.map.openPopup(popup);
                })
                .on('clusterblur', function(a) {
                    console.log(a);
                    $scope.map.closePopup(popup);
                })
                .on('clusterdblclick', function(a){
                    $scope.map.closePopup(popup);
                    //Disabling this to fit all markers in the cluster on the map.
                    //a.layer.zoomToBounds(); 
                    var bounds = a.layer.getBounds().pad(0.1);
                    $scope.map.fitBounds(bounds);
                });

            var projects = $scope.filteredData;
            var i=0;
            for (var key in $scope.filteredData) {
                if((projects[key].latitude !== undefined) && (projects[key].longitude !== undefined)) {
                    
                    var popupMsg = '<h5>' + projects[key].title + '</h5>'
                    + '<div>Budget amount: <strong>' + accounting.formatMoney(projects[key].amount, '$', 0) + '</strong></div>';
                    var marker = L.marker([projects[key].latitude, projects[key].longitude]).bindPopup(popupMsg, {offset: new L.Point(0,-10)}).on('click', function(evt) {evt.target.openPopup(); }).on('blur', function(evt) {evt.target.closePopup(); });
                    marker.budget = projects[key].amount;
                    marker.addTo(projectsGroup);
                }
            }
        }

        $scope.processData = function() {
            $scope.filteredData = _.chain($scope.data)
                .filter(function(el) {
                    if($scope.funder=='') return true;
                    var funders=Array($scope.funder);
                    return _.intersection(funders, Array(el.funder)).length > 0;
                })
                // .filter(function(el) {
                //     if($scope.agency=='') return true;
                //     var agencies = [];
                //     agencies=Array($scope.agency);
                //     return _.intersection(agencies, Array(el.agency)).length > 0;
                // })
                .filter(function(el) {
                    if($scope.topic=='') return true;
                    var topics = _.map($scope.topic, function(el) {return el.id;});

                    return _.intersection(topics, el.topics).length > 0;
                })
                .filter(function(el) {
                    if($scope.year=='') return true;
                    var years = _.map($scope.year, function(el) {return el.id;});
                    return _.intersection(years, Array(el.year)).length > 0;
                })
                .filter(function(el) {
                    if($scope.state=='') return true;
                    var states=Array($scope.state);
                    return _.intersection(states, Array(el.state)).length > 0;
                })
                .value();
                   
                placeMarkers();
                //console.log($scope.filteredData);
        };

        $scope.getProjects = function(search) {

            if(_.isEmpty($scope.cachedData) || search !== undefined) {

                var url = 'http://map.nccor.org/projects/all?callback=JSON_CALLBACK';

                if(search !== undefined) {
                    url = 'http://map.nccor.org/projects/search-results/?search_api_views_fulltext='+ search +'&callback=JSON_CALLBACK';
                }
            
                var responsePromise = $http.jsonp(url);

                responsePromise.success(function(data, status, headers, config) {
                    console.log( 'Got data from remote server' );
                    if(search === undefined) {
                        $scope.cachedData = data;
                    }
                    initData(data);
                    $scope.message='';
                    $scope.loaded = true;
                    $('#map-container').css("visibility", "visible");
                    $('#map-container').css("height", "auto");
                    //$('.multiselect').multiselect();
                });
                responsePromise.error(function(data, status, headers, config) {
                    console.log('JSONP failed!');
                    $scope.message='ERROR: Could not get data.';
                    initData([]);
                });
            }
            else {
                initData($scope.cachedData);
            }
        }

        function initData(data) {

            for (var key in data) {
                if(typeof data[key].topics === 'string') {
                    data[key].topics = data[key].topics.split(",");
                }
            }

            console.log(data);
            $scope.filteredData = $scope.data = data;
            renderFilters($scope.filteredData);

            $scope.state = "";
            $scope.year = [];
            $scope.funder = "";
            // $scope.agency = "";
            $scope.topic = [];

            initMap();
            placeMarkers();
        }

        function renderFilters(data) {
            $scope.funders = _.chain(data).uniq(function(obj) {return obj.funder}).map(function(el) { return el.funder }).sortBy(function(el) { return el; }).value();
            $scope.years = _.chain(data).uniq(function(obj) {return obj.year}).map(function(el) { return el.year }).sortBy(function(el) { return el; }).map(function(el){return {id:el, label:el}}).value();
            // $scope.agencies = _.chain(data).uniq(function(obj) {return obj.agency}).map(function(el) { return el.agency }).sortBy(function(el) { return el; }).value();
            
            $scope.topics = _.chain(data).map(function(obj){return obj.topics}).flatten().uniq().map(function(el){return {id:el, label:el}}).value();
            
            $scope.states= _.chain(data).uniq(function(obj) {return obj.state}).map(function(el) { return el.state }).filter(function(el) {return el!=undefined}).sortBy(function(el) { return el; }).value();
        }

        // $scope.$watchCollection('topic', function(newVal, oldVal) {
        //     console.log($scope.topic);
        //     $scope.processData();
        // });

    }]);