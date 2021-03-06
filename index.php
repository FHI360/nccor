<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:ng="http://angularjs.org">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>NCCOR National Collaborative on Childhood Obesity Research</title>
<meta name="description" content="The National Collaborative on Childhood Obesity Research (NCCOR) brings together four of the nation's leading research funders – the Centers for Disease Control and Prevention (CDC), the National Institutes of Health (NIH), the Robert Wood Johnson Foundation (RWJF), and the U.S. Department of Agriculture (USDA) – to address the problem of childhood obesity in America." />
<script type="text/javascript" src="http://use.typekit.com/ofq3xyz.js"></script>
<script type="text/javascript">try{Typekit.load();}catch(e){}</script>

<link rel="shortcut icon" type="image/x-icon" href="http://nccor.org/images/favicon.ico" />

<meta property="og:title" content="NCCOR Interactive Funding Map" />
<meta property="og:description" content="The National Collaborative on Childhood Obesity Research (NCCOR) brings together four of the nation's leading research funders – the Centers for Disease Control and Prevention (CDC), the National Institutes of Health (NIH), the Robert Wood Johnson Foundation (RWJF), and the U.S. Department of Agriculture (USDA) – to address the problem of childhood obesity in America." />

<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
<link href="../../css/redesign-2014/header-redesign-style.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" href="http://www.google.com/cse/style/look/default.css" type="text/css" />
<link href="../../css/global.css" rel="stylesheet" type="text/css" />
<link href="../../css/dropdown.css" media="screen" rel="stylesheet" type="text/css" />
<link href="../../css/default.advanced.css" media="screen" rel="stylesheet" type="text/css" />
<link rel="stylesheet" href="leaflet/leaflet.css" />
<link rel="stylesheet" href="leaflet/leaflet.markercluster/MarkerCluster.css" />
<link rel="stylesheet" href="leaflet/leaflet.markercluster/MarkerCluster.Default.css" />
<link href="bootstrap/multiselect.min.css" rel="stylesheet" type="text/css" />
<link href="slider/jquery-ui-trimmed.css" rel="stylesheet" type="text/css" />
<link href="table/trNgGrid.css" rel="stylesheet" type="text/css" />
<link href="css/map.css" rel="stylesheet" type="text/css" />

<!--[if IE 6]><link href="../css/ie6-override.css" type="text/css" rel="stylesheet" media="screen" /><![endif]-->
<!--[if lte IE 8]>
    <script>
      document.createElement('ng-include');
      document.createElement('ng-pluralize');
      document.createElement('ng-view');

      // Optionally these for CSS
      document.createElement('ng:include');
      document.createElement('ng:pluralize');
      document.createElement('ng:view');
    </script>
    <style>
      .col {
        display: inline-block;
      }
      #keyword-search {
        width: 275px;
      }
    </style>
<![endif]-->
</head>

<body>
<?php include("../../includes/2014-preheader.php") ?>
<div id="container">
<div id="banner">

<?php include("../../includes/2014-header.php") ?>
<?php include("../../includes/2014-header-buttons.php") ?>

  </div><!--end banner-->
  <div id="content">
      <div id="ng-app" ng-app="nccor">
  
        <div class="content-full-width bootstrap" data-ng-controller="NccorCtrl" data-ng-init="init()">
            
            <p class="breadcrumbs">
              <a href="../../index.php" alt="Home">Home</a> &nbsp;&gt;&nbsp; <a href="../index.php" alt="Home">Tools</a> &nbsp;&gt;&nbsp; NCCOR Interactive Funding Map
            </p>
            
            <h1>NCCOR Interactive Funding Map</h1>
            <div id="page-container">
              <p>The National Collaborative on Childhood Obesity Research (NCCOR) Interactive Funding Map is a resource for researchers designed to provide a snapshot of large, recent and current childhood obesity research projects within the United States. All projects featured in the map:</p>
              <ul class="text-ul">
                <li>Are funded by CDC, NIH, RWJF, or USDA</li>
                <li>Are funded or were funded at $1 million or more per year</li>
                <li>Received funding between 2008 and 2014</li>
              </ul>
              <br>
              <p>The NCCOR Interactive Funding Map includes a variety of features to learn about specific awards.</p>
              <ul class="text-ul">
                <li>To start, simply adjust the filters below (Year(s), Funder(s), State(s), Topic(s), Amount).</li>
                <li>You can also search by keyword.</li>
                <li>Additionally, you can navigate within the map (drag, zoom in/out) to focus on specific geographical areas.</li>
                <li>Project details can be viewed in the map by hovering your cursor over a green project marker. Clicking on a project marker will “zoom” the map to the location of the project(s).</li>
              </ul>
              <br>
              <p>Details for projects displayed in the map view are listed in the sortable table below the map. Additional information (e.g., project number, proposal ID, GIS coordinates) is available within the exportable file. To export information for all projects, click the link below the map.</p>
              <h3 data-ng-show="!loaded" class="loading-map"><img src="images/loading-map.gif"><br>LOADING MAP...</h3>
              <div id="map-container">
                <div class="row">
                  <div class="col col-md-6">
                    <div class="col col-sm-6 filter-container">
                      <label class="text-center col-xs-12">Year(s)</label>
                      <div data-ng-dropdown-multiselect="" options="years" selected-model="year" extra-settings="{displayProp: 'label', idProp: 'label', showCheckAll: false}" translation-texts="{buttonDefaultText: 'Show all', uncheckAll: 'Reset'}" events="{onItemSelect: processData, onItemDeselect: processData, onDeselectAll: uncheckAllYears}"></div>
                    </div>
                  
                    <div class="col col-sm-6 filter-container">
                      <label class="text-center col-xs-12">Funder(s)</label>
                      <div data-ng-dropdown-multiselect="" options="funders" selected-model="funder" extra-settings="{displayProp: 'label', idProp: 'label', showCheckAll: false}" translation-texts="{buttonDefaultText: 'Show all', uncheckAll: 'Reset'}" events="{onItemSelect: processData, onItemDeselect: processData, onDeselectAll: uncheckAllFunders}"></div>
                    </div>
                  </div>

                  <div class="col col-md-6">
                    <div class="col col-sm-6 filter-container">
                      <label class="text-center col-xs-12">State(s)</label>
                      <div data-ng-dropdown-multiselect="" options="states" selected-model="state" extra-settings="{displayProp: 'label', idProp: 'label', showCheckAll: false}" translation-texts="{buttonDefaultText: 'Show all', uncheckAll: 'Reset'}" events="{onItemSelect: changeStates, onItemDeselect: changeStates, onDeselectAll: uncheckAllStates}"></div>
                    </div>
                    
                    <div class="col col-sm-6 filter-container">
                      <label class="text-center col-xs-12">Topic(s)</label>
                      <div data-ng-dropdown-multiselect="" options="topics" selected-model="topic" extra-settings="{displayProp: 'label', idProp: 'label', showCheckAll: false}" translation-texts="{buttonDefaultText: 'Show all', uncheckAll: 'Reset'}" events="{onItemSelect: processData, onItemDeselect: processData, onDeselectAll: uncheckAllTopics}"></div>
                    </div>
                  </div>
                </div>

                <div class="row">&nbsp;</div>

                <div class="row">
                  <div class="col-sm-12">
                    <div class="col col-sm-3 search-container">
                      <form id="keyword-search" data-ng-submit="processSearch(searchString)" class="form-inline" role="form">
                        <div class="form-group">
                          <div class="input-group">
                            <input class="form-control"  type="search" placeholder="Search by keywords..." data-ng-model="searchString"></input>
                            <span class="input-group-btn"><button type="submit" class="btn btn-primary btn-md btn-block"><span class="glyphicon glyphicon-search"></span></button></span>

                          </div>
                        </div>
                      </form>
                    </div>

                    <div class="col-sm-6">
                      <label class="text-center col-xs-12">Amount</label>
                      <div class="row">
                        <div class="col-xs-12"><div ui-slider="slider.options" min="{{minRange}}" max="{{maxRange}}" step="50000" ng-model="amountRange"></div></div>
                      </div>
                      <div class="row">
                        <div class="col-xs-6">{{amountRange[0] | nfcurrency}}</div>
                        <div class="col-xs-6 text-right">{{amountRange[1] | nfcurrency}}</div>
                      </div>
                    </div>

                    <div class="col col-sm-3 reset-container">
                      <button data-ng-click="resetFilters()" class="btn btn-primary col-sm-12 reset">Reset all filters</button>
                    </div>
                  </div>
                </div>
                <div class="row"><h5 data-ng-if="message.length>0" class="col col-sm-12">{{message}} <img src="images/loading.gif"></h5></div>
                <div class="row">&nbsp;</div>

                <div class="row">
                  <label class="text-left col-xs-12" data-ng-if="((year.length>0)||(funder.length>0)||(state.length>0)||(topic.length>0))">Active Filters</label>
                  <div class="col-sm-12">
                    <ul class="active-filters active-filters-years"><li data-ng-repeat="y in year"><small>{{y.id}}</small></li></ul>                
                    <ul class="active-filters active-filters-funders"><li data-ng-repeat="f in funder"><small>{{f.id}}</small></li></ul>
                    <ul class="active-filters active-filters-states"><li data-ng-repeat="s in state"><small>{{s.id}}</small></li></ul>
                    <ul class="active-filters active-filters-topics"><li data-ng-repeat="t in topic"><small>{{t.id}}</small></li></ul>
                  </div>
                </div>
            
                <h4>Showing {{filteredData.length}} projects</h4>
                <br>

                <div id="map"></div>
                <br>

                <div class="row">
                  <a id="table"></a>
                </div>
                <div class="row">
                  <div class="col-md-6"><span data-ng-show="zoomedin">To zoom out, click the “Reset all filters” button above.</span></div>
                  <div class="col-md-6 text-right"><a href="http://map.nccor.org/export/projects/all/NCCOR_Projects.csv"><img src="images/spreadsheet.png" /> Export all projects to CSV</a></div>
                </div>
                <div class="row">
                  <div class="col-md-12 text-right"><p class="small">Data last updated May 2014</p></div>
                </div>

                <div class="row">
                  <div class="col-md-12 text-justify">
                    <p>To sort the projects listed in the table, click the column titles in the header row (Title, Year, Funder, Agency, Institution, Location, Investigator, Budget).</p>
                  </div>
                </div>

                <table data-tr-ng-grid="" items="filteredData" data-page-items="10" data-selection-mode="0" data-enable-filtering="false" class="table table-responsive">
                  <thead>
                    <tr>
                      <th field-name="title" display-name="Title" enable-filtering="false" cell-width="30em" display-align="left"></th>
                      <th field-name="year" display-name="Year" enable-filtering="false" cell-width="7em" display-align="left"></th>
                      <th field-name="funder" display-name="Funder" enable-filtering="false" cell-width="7em" display-align="left"></th>
                      <th field-name="agency" display-name="Agency" enable-filtering="false" cell-width="7em" display-align="left"></th>
                      <th field-name="institution" display-name="Institution" enable-filtering="false" cell-width="15em" display-align="left"></th>
                      <th field-name="location" display-name="Location" enable-filtering="false" cell-width="10em" display-align="left"></th>
                      <th field-name="investigator" display-name="Investigator" enable-filtering="false" cell-width="10em" display-align="left"></th>
                      <th field-name="amount" display-name="Budget" enable-filtering="false" cell-width="7em" display-align="right" display-format="nfcurrency"></th>
                    </tr>
                  </thead>
                </table>

                <div class="row">
                  <div class="col-md-12 text-justify">
                    <p>Public data sources:</p>
                    <ul class="text-ul">
                      <li><a href="http://projectreporter.nih.gov/reporter.cfm">NIH RePORTER (NIH and CDC funded research projects)</a></li>
                      <li><a href="http://www.rwjf.org/en/grants/search.html">RWJF Grant Archive</a></li>
                      <li><a href="http://cris.nifa.usda.gov/cgi-bin/starfinder/0?path=fastlink1.txt&id=anon&pass=&search=GC=A2101&format=WEBTITLESG">USDA NIFA Current Research Information System</a></li>
                    </ul>
                    <p class="disclaimer"><strong>Disclaimer:</strong> The research projects included in the map are not representative of all funded work by NCCOR partners. Only research projects that met specific selection criteria for the purpose of this map are included (e.g., large projects funded at $1 million or more per year). Inclusion of a research project does not indicate an endorsement of methodology or outcomes by NCCOR partners. Map data should be used for reference purposes only. Users of this interactive map should consult research project descriptions provided by the funding organization for more information or to learn about research projects not shown.</p>
                  </div>
                </div>

              </div><!-- end of the map-container -->
            </div><!-- end of the page-container -->
        </div><!--end content-full-width-->
    </div><!--end ng-app-->
  </div><!--end content-->
    
<? include("../../includes/grand-footer.txt") ?>

<? include("../../includes/footer.txt") ?>

</div><!--end container-->

<!--[if lt IE 9]>
<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
<!--[if lt IE 7]>
<script type="text/javascript" src="../../js/jquery/jquery.js"></script>
<script type="text/javascript" src="../../js/jquery/jquery.dropdown.js"></script>
<![endif]-->
<script type="text/javascript" src="../../js/rollover.js"></script>
<script type="text/javascript" src="../../js/search.js"></script>
<!--LOAD Google Analytics Tracking of Outbound Clicks / Downloads -->
<script src="../../js/ga-tracking-downloads-outbound.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.19/angular.min.js"></script>
<script src="leaflet/leaflet.js"></script>
<script src="http://maps.google.com/maps/api/js?v=3.2&sensor=false"></script>
<script src="leaflet/google/leaflet-google-plugin.min.js"></script>
<script src="http://leaflet.github.io/Leaflet.markercluster/dist/leaflet.markercluster.js"></script>
<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
<script src="dropdown-multiselect/angularjs-dropdown-multiselect.min.js"></script>
<script src="controller/map-controller.min.js"></script>
<script src="bootstrap/multiselect.min.js"></script>
<script src="slider/jquery-ui.min.js"></script>
<script src="slider/angular-ui-slider.min.js"></script>
<script src="table/trNgGrid.min.js"></script>

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

<script>
  function animateScroll(e) {
      //e.preventDefault();
      var target = $(e);
      target = target.length ? target : $('[name=' + e.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 700);
        return false;
      }
  };
</script>
</body>
</html>