'use strict';

//NCCOR Map Controller
angular.module('nccor', ['angularjs-dropdown-multiselect', 'ui.slider', 'ngTable'])
    .controller('NccorCtrl', ['$scope', '$rootScope', '$http', '$filter', 'ngTableParams', function($scope, $rootScope, $http, $filter, ngTableParams){
        
        $scope.center = {
                lat: 24.0391667,
                lng: 121.525,
                zoom: 6
            };

        $scope.data = [];
        $scope.filteredData = [];
        $scope.years = [];
        // $scope.agency = '';
        // $scope.agencies = [];
        $scope.topics = [];
        $scope.funders = [];
        $scope.states = [];
        $scope.amountRange = $scope.dataAmountRange = [100000, 1000000];
        $scope.searchString = '';
        $scope.message = '';
        $scope.loaded = false;

        $scope.slider = {
            'options': {
                range: true,
                //start: function (event, ui) { console.log('Slider start'); },
                slide: function (event, ui) { $scope.processData(); $scope.$apply(); }
            }
        }

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

        $scope.uncheckAllFunders = function() {
            $scope.funder = [];
            $scope.processData();
        }

        $scope.uncheckAllStates = function() {
            $scope.state = [];
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
            var popupMsg = '<h5>' + cluster.length + ' projects</h5>' + '<div>Budget amount: <strong>$' + $filter('number')(amount, 0) + '</strong></div>';
            return popupMsg;
        }

        function placeMarkers() {
            projectsGroup.clearLayers();
            var popup = L.popup({offset: new L.Point(0,-10)});
            projectsGroup.addTo($scope.map);
            projectsGroup
                .on('clusterclick', function (a) {
                    var children = a.layer.getAllChildMarkers();
                    //console.log(children);
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
                    + '<div>Budget amount: <strong>$' + $filter('number')(projects[key].amount, 0) + '</strong></div>';
                    var marker = L.marker([projects[key].latitude, projects[key].longitude]).bindPopup(popupMsg, {offset: new L.Point(0,-10)}).on('click', function(evt) {evt.target.openPopup(); }).on('blur', function(evt) {evt.target.closePopup(); });
                    marker.budget = projects[key].amount;
                    marker.addTo(projectsGroup);
                }
            }
        }

        $scope.processData = function() {
            $scope.filteredData = _.chain($scope.data)
                
                // .filter(function(el) {
                //     if($scope.agency=='') return true;
                //     var agencies = [];
                //     agencies=Array($scope.agency);
                //     return _.intersection(agencies, Array(el.agency)).length > 0;
                // })
                .filter(function(el) {
                    if($scope.funder.length === 0) return true;
                    var funders = _.map($scope.funder, function(el) {return el.id;});
                    return _.intersection(funders, Array(el.funder)).length > 0;
                })
                .filter(function(el) {
                    if($scope.topic.length === 0) return true;
                    var topics = _.map($scope.topic, function(el) {return el.id;});

                    return _.intersection(topics, el.topics).length > 0;
                })
                .filter(function(el) {
                    if($scope.year.length === 0) return true;
                    var years = _.map($scope.year, function(el) {return el.id;});
                    return _.intersection(years, Array(el.year)).length > 0;
                })
                .filter(function(el) {
                    if($scope.state.length === 0) return true;
                    var states = _.map($scope.state, function(el) {return el.id;});
                    return _.intersection(states, Array(el.state)).length > 0;
                })
                .filter(function(el) {
                    if($scope.amountRange === $scope.dataAmountRange) return true;
                    //var states = _.map($scope.state, function(el) {return el.id;});
                    return el.amount >= $scope.amountRange[0] && el.amount <= $scope.amountRange[1];
                })
                .value();

                //$scope.$watch('filteredData', function () {
                    $scope.tableParams.reload();
                    $scope.tableParams.$params.page = 1;
                //});

                placeMarkers();
                //console.log($scope.filteredData);
        };

        function renderFilters(data) {
            $scope.funders = _.chain(data).uniq(function(obj) {return obj.funder}).filter(function(el) {return el.funder!=undefined}).map(function(el) { return {id:el.funder, label:el.funder} }).value();
            $scope.states  = _.chain(data).uniq(function(obj) {return obj.state}).filter(function(el) {return el.state!=undefined}).map(function(el) { return {id:el.state, label:el.state} }).sortBy(function(el) { return el.id; }).value();
            $scope.years   = _.chain(data).uniq(function(obj) {return obj.year}).filter(function(el) {return el.year!=undefined}).sortBy(function(el) { return el.year; }).map(function(el) { return {id:el.year, label:el.year} }).value();
            $scope.topics  = _.chain(data).map(function(obj){return obj.topics}).flatten().uniq().filter(function(el) {return el!=undefined}).map(function(el){return {id:el, label:el}}).value();
            var amounts = _.chain(data).uniq(function(obj) {return obj.amount}).filter(function(el) {return el.amount!=undefined}).map(function(el) { return el.amount }).value();
            $scope.amountRange = $scope.dataAmountRange = [parseInt(_.min(amounts)), parseInt(_.max(amounts))];

            // $scope.agencies = _.chain(data).uniq(function(obj) {return obj.agency}).map(function(el) { return el.agency }).sortBy(function(el) { return el; }).value();
        }

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

            $scope.funder = [];
            $scope.state = [];
            $scope.year = [];
            $scope.topic = [];
            $scope.minRange = 100000;
            $scope.maxRange = 10000000;
            // $scope.agency = "";
            
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 25           // count per page
            }, {
                $scope: $rootScope.$new(),
                total: $scope.filteredData.length, // length of data
                getData: function($defer, params) {
                    params.total($scope.filteredData.length);
                    $defer.resolve($scope.filteredData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

            $scope.tableParams.reload();
            $scope.tableParams.$params.page = 1;

            initMap();
            placeMarkers();
        }

        // $scope.$watchCollection('topic', function(newVal, oldVal) {
        //     console.log($scope.topic);
        //     $scope.processData();
        // });

    }]);