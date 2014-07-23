'use strict';

//NCCOR Map Controller
angular.module('nccor', [])
    .controller('NccorCtrl', ['$scope', '$http', function($scope, $http){
        
        $scope.center = {
                lat: 24.0391667,
                lng: 121.525,
                zoom: 6,
            };

        $scope.data = {};
        $scope.filteredData = {};
        $scope.year = '';
        $scope.years = [];
        $scope.agency = '';
        $scope.agencies = [];
        $scope.funder = '';
        $scope.funders = [];
        $scope.state = '';
        $scope.states = [];
        $scope.searchString = '';

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

        $scope.init = function() {
            console.log('Requesting remote server...');
            getAllProjects();
        };

        $scope.processSearch = function(search) {
            getAllProjects(search);
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
            var popupMsg = '<h3>' + cluster.length + ' projects</h3>' + '<div>Budget amount: <strong>' + accounting.formatMoney(amount, '$', 0) + '</strong></div>';
            return popupMsg;
        }

        function placeMarkers() {
            projectsGroup.clearLayers();
            var popup = L.popup({offset: new L.Point(0,-10)});
            projectsGroup.addTo($scope.map);
            projectsGroup
                .on('clusterclick', function (a) {
                    children = a.layer.getAllChildMarkers();
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
                    
                    var popupMsg = '<h3>' + projects[key].title + '</h3>'
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
                .filter(function(el) {
                    if($scope.agency=='') return true;
                    var agencies=Array($scope.agency);
                    return _.intersection(agencies, Array(el.agency)).length > 0;
                })
                .filter(function(el) {
                    if($scope.year=='') return true;
                    var years=Array($scope.year);
                    return _.intersection(years, Array(el.year)).length > 0;
	    })
                .filter(function(el) {
                    if($scope.state=='') return true;
                    var states=Array($scope.state);
                    return _.intersection(states, Array(el.state)).length > 0;
	    })
                .value();
            placeMarkers();
            console.log($scope.filteredData);
        };

        function getAllProjects(search) {
            if(search === undefined)
                var responsePromise = $http.jsonp('http://map.nccor.org/projects/all?callback=JSON_CALLBACK');
            else
                var responsePromise = $http.jsonp('http://map.nccor.org/projects/search-results/?search_api_views_fulltext='+ search +'&callback=JSON_CALLBACK');

            responsePromise.success(function(data, status, headers, config) {
                console.log( "Got data from remote server" );
                initData(data);
                //console.table(data);
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log("JSONP failed!"); 
                return [];
            });
        }

        function initData(data) {
            $scope.filteredData = $scope.data = data;
            renderFilters($scope.filteredData);
            initMap();
            placeMarkers();
        }

        function renderFilters(data) {
            $scope.funders = _.chain(data).uniq(function(obj) {return obj.funder}).map(function(el) { return el.funder }).sortBy(function(el) { return el; }).value();
            $scope.years = _.chain(data).uniq(function(obj) {return obj.year}).map(function(el) { return el.year }).sortBy(function(el) { return el; }).value();
            $scope.agencies= _.chain(data).uniq(function(obj) {return obj.agency}).map(function(el) { return el.agency }).sortBy(function(el) { return el; }).value();
            $scope.states= _.chain(data).uniq(function(obj) {return obj.state}).map(function(el) { return el.state }).filter(function(el) {return el!=undefined}).sortBy(function(el) { return el; }).value();
        }

    }]);