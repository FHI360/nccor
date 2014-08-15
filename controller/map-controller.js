'use strict';

//NCCOR Map Controller
angular.module('nccor', ['angularjs-dropdown-multiselect', 'ui.slider', 'trNgGrid'])
    .filter('nfcurrency', [ '$filter', '$locale', function ($filter, $locale) {
        var currency = $filter('currency'), formats = $locale.NUMBER_FORMATS;
        return function (amount, symbol) {
            var value = currency(amount, symbol);
            return value.replace(new RegExp('\\' + formats.DECIMAL_SEP + '\\d{2}'), '')
        }       
    }])
    .controller('NccorCtrl', ['$scope', '$rootScope', '$http', '$filter', function($scope, $rootScope, $http, $filter){
        
        // $scope.agency = '';
        // $scope.agencies = [];
        $scope.data = [];
        $scope.filteredData = [];
        $scope.years = [];
        $scope.topics = [];
        $scope.funders = [];
        $scope.states = [];
        $scope.visibleNids = [];
        //$scope.amountRange = $scope.dataAmountRange = [1000000, 1000000];
        $scope.searchString = '';
        $scope.message = '';
        $scope.loaded = false;
        $scope.reset = false;
        $scope.tableFilter = "";
        $scope.zoomedin = false;

        TrNgGrid.defaultPagerMinifiedPageCountThreshold = 5;

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
            zoomToBoundsOnClick: false,
            spiderfyOnMaxZoom: false
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
            $scope.visibleNids = [];
            $scope.reset = true;
            $scope.map.setView([38, -98], 4, {reset:true});
            $scope.reset = false;
            $scope.zoomedin = false;

            $scope.searchString = '';
            $scope.getProjects();
        }

        $scope.processSearch = function(search) {
            $scope.message='Searching...';
            $scope.getProjects(search);
        }

        function initMap() {
            if($scope.map === undefined) {
                $scope.map = L.map('map', {minZoom: 4, maxZoom: 16, scrollWheelZoom: false}).setView([38, -98], 4);
                var googleLayer = new L.Google('ROADMAP');
                $scope.map.addLayer(googleLayer);
            }

            $scope.map
                .on('moveend', function() {
                    if($scope.reset) {
                        return 0;
                    }

                    $scope.visibleNids = [];
                    $scope.processData();
                    // Construct an empty list to fill with onscreen markers.
                    var inBounds = [],
                    // Get the map bounds - the top-left and bottom-right locations.
                        bounds = $scope.map.getBounds();

                    // For each marker, consider whether it is currently visible by comparing
                    // with the current map bounds.
                    projectsGroup.eachLayer(function(marker) {
                        if (bounds.contains(marker.getLatLng())) {
                            inBounds.push(marker.nid);
                        }
                    });

                    if($scope.map.getZoom() > $scope.map.getMinZoom()) {
                        $scope.zoomedin = true;
                    }
                    else {
                        $scope.zoomedin = false;
                    }

                    // Display a list of markers.
                    $scope.visibleNids = inBounds;
                    $scope.processData();
                    $scope.$apply();
                });
                // .on('zoomend', function() {
                //     if($scope.map.getZoom() != $scope.map.getMinZoom()) {
                //         $scope.zoomedin = true;
                //     }
                // });
        }

        function processCluster(a) {
            var cluster = a.layer.getAllChildMarkers();
            var bounds = a.layer.getBounds().pad(0.1);
            var amount = _.reduce(cluster, function(memo, num) {  
                return parseInt(memo) + parseInt(num.budget); 
            }, 0);
            var nids = _.map(cluster, function(el) { return el.nid; } );
            var popupMsg = '<h5>' + cluster.length + ' projects</h5>' + '<div>Combined budget amount: <strong>$' + $filter('number')(amount, 0) + '</strong></div>';
            if($scope.map.getZoom() == $scope.map.getMaxZoom()) {
                popupMsg += '<div class="scroll-link-container"><a class="scroll-link" onclick="animateScroll(\'#table\');">View details below</a></div>';
            }
            else {
                popupMsg += '<div class="scroll-link-container">Click on marker to zoom closer</div>';   
            }
            return popupMsg;
        }

        function placeMarkers() {
            projectsGroup.clearLayers();
            var popup = L.popup({offset: new L.Point(0,-10)});
            projectsGroup.addTo($scope.map);
            projectsGroup
                .on('clustermouseover', function (a) {
                    //console.log(children);
                    popup.setLatLng(a.latlng).setContent(processCluster(a));
                    $scope.map.openPopup(popup);
                })
                .on('clustermouseout', function (a) {
                    if($scope.map.getZoom() != $scope.map.getMaxZoom()) {
                        $scope.map.closePopup(popup);
                    }
                })
                .on('clusterblur', function(a) {
                    $scope.map.closePopup(popup);
                })
                .on('clusterclick', function(a){
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
                    if($scope.map.getZoom() == $scope.map.getMaxZoom()) {
                        popupMsg += '<div class="scroll-link-container"><a class="scroll-link" onclick="animateScroll(\'#table\');">View details below</a></div>';
                    }
                    else {
                        popupMsg += '<div class="scroll-link-container">Click on marker to zoom closer</div>';
                    }

                    var marker = L.marker([projects[key].latitude, projects[key].longitude])
                        .bindPopup(popupMsg, {offset: new L.Point(0,-10)})
                        .on('click', function(evt) {
                            if($scope.map.getZoom() != $scope.map.getMaxZoom()) {
                                $scope.map.setView(evt.latlng, $scope.map.getMaxZoom(), {reset:false});
                            }                          
                        })
                        .on('mouseover', function(evt) {
                            evt.target.openPopup();                            
                        })
                        .on('mouseout', function(evt) {
                            if($scope.map.getZoom() != $scope.map.getMaxZoom()) {
                                evt.target.closePopup();
                            }
                        })
                        //.on('click', function(evt) {evt.target.openPopup(); })
                        .on('blur', function(evt) {evt.target.closePopup(); });
                    marker.budget = projects[key].amount;
                    marker.nid = projects[key].nid;
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
                .filter(function(el) {
                    if($scope.visibleNids.length === 0) return true;
                    return _.intersection($scope.visibleNids, Array(el.nid)).length > 0;
                })
                .value();

                placeMarkers();
                //console.log($scope.filteredData);
                //tableDirective.navigateToPage(1);
        };

        $scope.filterVisible = function(markers) {
            return _.filter($scope.filteredData, function(el) {
                    if(markers.length === 0) return false;
                    return _.intersection(markers, Array(el.nid)).length > 0;
                });
        };

        function renderFilters(data) {
            $scope.funders = _.chain(data).uniq(function(obj) {return obj.funder}).filter(function(el) {return el.funder!=undefined}).map(function(el) { return {id:el.funder, label:el.funder} }).value();
            $scope.states  = _.chain(data).uniq(function(obj) {return obj.state}).filter(function(el) {return el.state!=undefined}).map(function(el) { return {id:el.state, label:el.state} }).sortBy(function(el) { return el.id; }).value();
            $scope.years   = _.chain(data).uniq(function(obj) {return obj.year}).filter(function(el) {return el.year!=undefined}).sortBy(function(el) { return el.year; }).map(function(el) { return {id:el.year, label:el.year} }).value();
            $scope.topics  = _.chain(data).map(function(obj){return obj.topics}).flatten().uniq().filter(function(el) {return el!=undefined}).map(function(el){return {id:el, label:el}}).value();
            var amounts = _.chain(data).uniq(function(obj) {return obj.amount}).filter(function(el) {return el.amount!=undefined}).map(function(el) { return el.amount }).value();
            $scope.amountRange = $scope.dataAmountRange = minMaxRange(amounts);
        }

        function minMaxRange(arr) {
            return [parseInt(_.min(arr, function(el) {return parseInt(el)})), parseInt(_.max(arr, function(el) {return parseInt(el)}))]
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
                if(typeof data[key].investigator === 'object') {
                    data[key].investigator = htmlDecode(data[key].investigator.join(","));
                }

                data[key].title = htmlDecode(data[key].title);
                data[key].institution = htmlDecode(data[key].institution);
            }

            //console.log(data);
            $scope.filteredData = $scope.data = data;
            _.forEach($scope.filteredData, function(el) {el.amount = parseInt(el.amount)});
            renderFilters($scope.filteredData);

            $scope.funder = [];
            $scope.state = [];
            $scope.year = [];
            $scope.topic = [];
            $scope.minRange = $scope.amountRange[0];
            $scope.maxRange = $scope.amountRange[1];

            // $scope.agency = "";
            
            initMap();
            placeMarkers();
        }

        function htmlDecode(html) {
            var div = document.createElement("div");
            div.innerHTML = html;
            return div.childNodes[0].nodeValue;
        }

    }]);