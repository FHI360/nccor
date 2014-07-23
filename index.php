<?php
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>NCCOR National Collaborative on Childhood Obesity Research</title>
<meta name="description" content="The National Collaborative on Childhood Obesity Research (NCCOR) brings together four of the nation's leading research funders – the Centers for Disease Control and Prevention (CDC), the National Institutes of Health (NIH), the Robert Wood Johnson Foundation (RWJF), and the U.S. Department of Agriculture (USDA) – to address the problem of childhood obesity in America." />
<script type="text/javascript" src="http://use.typekit.com/ofq3xyz.js"></script>
<script type="text/javascript">try{Typekit.load();}catch(e){}</script>

<link rel="shortcut icon" type="image/x-icon" href="http://nccor.org/images/favicon.ico" />

<meta property="og:title" content="NCCOR" />
<meta property="og:description" content="The National Collaborative on Childhood Obesity Research (NCCOR) brings together four of the nation's leading research funders – the Centers for Disease Control and Prevention (CDC), the National Institutes of Health (NIH), the Robert Wood Johnson Foundation (RWJF), and the U.S. Department of Agriculture (USDA) – to address the problem of childhood obesity in America." />

 
<link href="../../css/redesign-2014/header-redesign-style.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" href="http://www.google.com/cse/style/look/default.css" type="text/css" />
<link href="../../css/global.css" rel="stylesheet" type="text/css" />
<link href="../../css/dropdown.css" media="screen" rel="stylesheet" type="text/css" />
<link href="../../css/default.advanced.css" media="screen" rel="stylesheet" type="text/css" />
<link href="css/map.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" href="leaflet/leaflet.css" />
<link rel="stylesheet" href="leaflet/leaflet.markercluster/MarkerCluster.css" />
<link rel="stylesheet" href="leaflet/leaflet.markercluster/MarkerCluster.Default.css" />
<!--[if IE 6]><link href="../css/ie6-override.css" type="text/css" rel="stylesheet" media="screen" /><![endif]-->
</head>

<body>
<?php include("../../includes/2014-preheader.php") ?>
<div id="container">
<div id="banner">

<?php include("../../includes/2014-header.php") ?>
<?php include("../../includes/2014-header-buttons.php") ?>

  </div><!--end banner-->
    
    <div id="content" data-ng-app="nccor">
  
        <div class="content-full-width" data-ng-controller="NccorCtrl" data-ng-init="init()">
			
            <p class="breadcrumbs">
              <a href="../../index.php" alt="Home">Home</a> &nbsp;&gt;&nbsp; <a href="../index.php" alt="Home">Tools</a> &nbsp;&gt;&nbsp; Project Map
            </p>
            
            <h1>Project Map</h1>
            <h3 data-ng-show="!loaded">Loading map...</h3>
            <div id="map-container">
              <p>The Project Map is a searchable database of projects.</p>

              <h3>Showing {{filteredData.length}} projects.</h3>
              <h4 data-ng-if="message.length>0">{{message}} <img src="images/loading.gif"></h4>

              <form id="keyword-search" data-ng-submit="processSearch(searchString)">
                  <input type="text" placeholder="Search by keywords..." data-ng-model="searchString"></input>
                  <button type="submit" class="btn btn-success btn-lg btn-block">Search</button>
              </form>
              <br>

              <label for="year">Year:</label>
              <select name="year" data-ng-change="processData()" data-ng-model="year">
                  <option value="">- Show all -</option>
                  <option data-ng-repeat="y in years" value="{{y}}">{{y}}</option>
              </select>

              <label for="agency">Agency:</label>
              <select name="agency" data-ng-change="processData()" data-ng-model="agency">
                  <option value="">- Show all -</option>
                  <option data-ng-repeat="a in agencies" value="{{a}}">{{a}}</option>
              </select>

              <label for="funder">Funder:</label>
              <select name="funder" data-ng-change="processData()" data-ng-model="funder">
                  <option value="">- Show all -</option>
                  <option data-ng-repeat="f in funders" value="{{f}}">{{f}}</option>
              </select>

              <label for="state">State:</label>
              <select name="state" data-ng-change="processData()" data-ng-model="state">
                  <option value="">- Show all -</option>
                  <option data-ng-repeat="s in states" value="{{s}}">{{s}}</option>
              </select>

              <button data-ng-click="resetFilters()">Reset filters</button>
              <br><br>

              <!-- <leaflet center="center" markers="markers" layers="layers" width="640px" height="480px"></leaflet> -->

              <div id="map"></div>

              <ul ng-model="filteredData">
                  <li data-ng-repeat="datum in filteredData">{{datum.title}} : {{datum.funder}} : {{datum.agency}} : {{datum.state}} : {{datum.year}}</li>
              </ul>
            </div>
          	
          <!-- the map -->

          <!-- end the map -->

</div><!--end content-right-->
  </div><!--end content-->
    
<? include("../../includes/grand-footer.txt") ?>

<? include("../../includes/footer.txt") ?>

</div><!--end container-->


<!--[if lt IE 7]>
<script type="text/javascript" src="../../js/jquery/jquery.js"></script>
<script type="text/javascript" src="../../js/jquery/jquery.dropdown.js"></script>
<![endif]-->
<script type="text/javascript" src="../../js/rollover.js"></script>
<script type="text/javascript" src="../../js/search.js"></script>
<!--LOAD Google Analytics Tracking of Outbound Clicks / Downloads -->
<script src="../../js/ga-tracking-downloads-outbound.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.19/angular.min.js"></script>
<script src="http://cdn.leafletjs.com/leaflet-0.7.1/leaflet.js"></script>
<script src="http://maps.google.com/maps/api/js?v=3.2&sensor=false"></script>
<script src="leaflet/google/leaflet-google-plugin.js"></script>
<script src="http://leaflet.github.io/Leaflet.markercluster/dist/leaflet.markercluster-src.js"></script>
<script src="accounting/accounting.min.js"></script>
<script src="controller/map-controller.js"></script>

<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-21178805-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>

</body>
</html>