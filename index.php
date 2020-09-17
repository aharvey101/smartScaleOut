<?php

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$files = glob('data/*.csv');
usort($files, function($a, $b) {
    return filemtime($a) < filemtime($b);
});
$files = array_map(function($element){return urlencode(basename($element)); }, $files);
$latestCSV = urlencode($files[0]);

$allCSVs = '"' . implode('", "', $files) . '"';

?><!DOCTYPE html>
<html>

<head>
  <title>CHART - 1 MIN LIVE STRATEGY DATA</title>
  <script src="https://cdn.anychart.com/releases/8.7.1/js/anychart-core.min.js" type="text/javascript"></script>
  <script src="https://cdn.anychart.com/releases/8.7.1/js/anychart-stock.min.js" type="text/javascript"></script>
  <script src="https://cdn.anychart.com/releases/8.7.1/js/anychart-data-adapter.min.js"></script>
  <script>
  csvs = [<?=$allCSVs?>];
  offset = parseInt(window.location.search.length>0?window.location.search.replace(/[^0-9]/g,''):0)
  disableRefresh = offset>0?true:false
  </script>
  <style>
    html,
    body,
    #container {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      font-family: Arial;
      background-color: #131722;
    }
    .button {
      display: inline-block;
      padding: 10px;
      cursor: pointer;
      background: #CCC;
      text-transform: uppercase;
    }
    .button:hover {
      background: #EEE;
    }
    #nav {
      position: fixed;
      z-index: 99;
      right: 2px;
      bottom: 66px;
      text-align: right;
    }
    #nav #name {
      color: #fff;
      display: block;
      font-size: 13px;
    }
  </style>
</head>

<body>
  <div id="nav">
    <span id="name"></span>
    <span id="prev" class="button" onclick="offset+=1;updateData();">Prev</span> 
    <span id="next" class="button" onclick="if(offset-1>=0){offset-=1;updateData();}">Next</span>
  </div>
  <div id="container"></div>
  <script>
    var dataTable = undefined;
    var chart = undefined;
    var series = undefined;
    var ctsSeries = undefined;
    var cmaSeries = undefined;
    var bearEntrySeries = undefined;
    var bullEntrySeries = undefined;

    anychart.onDocumentReady(function () {
      drawChart();
    });

    function updateDataFilename(){
      document.getElementById('name').innerHTML = decodeURIComponent(csvs[offset]);
    }

    function drawChart(){

      document.addEventListener('keydown', function(e){
        var Key = {
          LEFT:   37,
          UP:     38,
          RIGHT:  39,
          DOWN:   40
        };
        switch (e.keyCode) {
          case Key.LEFT:
            offset += 1;
            updateData();
            break;
          case Key.UP:
            window.location.href = window.location.origin;
            break;
          case Key.RIGHT:
            if (offset-1>=0) {
              offset -= 1;
              updateData();
            }
            break;
          case Key.DOWN:
            //
            break;
          default:
            //
        }
      }, false);

      
      // load data
      anychart.data.loadCsvFile("data/"+csvs[offset], function (data) {
        updateDataFilename();

        // create a data table
        dataTable = anychart.data.table(0);
        dataTable.addData(data);

        // map data
        var mapping = dataTable.mapAs({ 'open': 1, 'high': 2, 'low': 3, 'close': 4 });
        var ctsmapping = dataTable.mapAs({ value : 6 });
        var cmamapping = dataTable.mapAs({ value : 7 });
        var bearEntryMapping = dataTable.mapAs({ value: 8 });
        var bullEntryMapping = dataTable.mapAs({ value: 9 });

        // set the chart type
        chart = anychart.stock();
        chart.background('#131722');

        // set the series
        series = chart.plot(0).candlestick(mapping);
        series.name("Chart data");
        series.risingStroke("#26A69A");
        series.risingFill("#26A69A");
        series.fallingStroke("#EF5350");
        series.fallingStroke("#EF5350");

        ctsSeries = chart.plot(0).line(ctsmapping);
        ctsSeries.name("CTS");
        ctsSeries.stroke("2 #1E4BC9");

        cmaSeries = chart.plot(0).line(cmamapping);
        cmaSeries.name("CMA");
        cmaSeries.stroke("2 #FF5252");

        bearEntrySeries = chart.plot(0).line(bearEntryMapping);
        bearEntrySeries.name("bearEntry");
        bearEntrySeries.stroke("4 #FF5252");

        bullEntrySeries = chart.plot(0).line(bullEntryMapping);
        bullEntrySeries.name("bullEntry");
        bullEntrySeries.stroke("4 #4CAF50");

        var mapping2 = dataTable.mapAs({ 'open': 10, 'high': 11, 'low': 12, 'close': 13 });
        series2 = chart.plot(0).candlestick(mapping2);
        series2.name("Chart data");
        series2.risingStroke("#FFEB3B");
        series2.risingFill("#FFEB3B");
        series2.fallingStroke("#FF9800");
        series2.fallingStroke("#FF9800");

        // var ctsmapping2 = dataTable.mapAs({ value : 14 });
        // ctsSeries2 = chart.plot(0).line(ctsmapping2);
        // ctsSeries2.name("CTS");
        // ctsSeries2.stroke("2 #1E4BC9");

        // var cmamapping2 = dataTable.mapAs({ value : 15 });
        // cmaSeries2 = chart.plot(0).line(cmamapping2);
        // cmaSeries2.name("CMA stop");
        // cmaSeries2.stroke("2 #FF5252");

        var stopmapping = dataTable.mapAs({ value : 14 });
        stopSeries = chart.plot(0).line(stopmapping);
        stopSeries.name("CMA stop");
        stopSeries.stroke("2 #00FFFF");

        var bearEntryActualMapping = dataTable.mapAs({ value : 15 });
        bearEntryActualSeries = chart.plot(0).line(bearEntryActualMapping);
        bearEntryActualSeries.name("bearEntryActual");
        bearEntryActualSeries.stroke("2 #FF5252");
        
        var bullEntryActualMapping = dataTable.mapAs({ value : 16 });
        bullEntryActualSeries = chart.plot(0).line(bullEntryActualMapping);
        bullEntryActualSeries.name("bullEntryActual");
        bullEntryActualSeries.stroke("2 #4CAF50");

        var grouping = chart.grouping();
        // Disabled grouping.
        grouping.enabled(false);

        // profit fill long:
        // var longProfitMapping = dataTable.mapAs();
        // longProfitMapping.addField('high', 16);
        // longProfitMapping.addField('low', 14)
        // var longProfitSeries = chart.plot(0).rangeArea(longProfitMapping);
        // longProfitSeries.fill("#4CAF50");
        
        // var shortProfitMapping = dataTable.mapAs();
        // shortProfitMapping.addField('high', 15);
        // shortProfitMapping.addField('low', 14)
        // var shortProfitSeries = chart.plot(0).rangeArea(shortProfitMapping);
        // shortProfitSeries.fill("#4CAF50");


        // set the container id
        chart.container('container');

        // draw the chart
        chart.draw();
        chart.selectRange('hour', 5, 'last-date', true);

      });
    }

    function updateData() {
      disableRefresh = true;
      anychart.data.loadCsvFile("data/"+csvs[offset], function (data) {
        updateDataFilename();
        dataTable.remove();
        dataTable.addData(data);
        chart.selectRange('hour', 5, 'last-date', true);

        console.log('updated data - ', decodeURIComponent(csvs[offset]));
      });
    }


    var now = new Date()
    var utcMidnight = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    var millisecondsSinceUTCMidnight = now.getTime() - utcMidnight.getTime()
    var thisPeriodMilliseconds = 60000 // currently hardcoded to every minute - should extract from filename
    var millisecondsTilClose = thisPeriodMilliseconds - (millisecondsSinceUTCMidnight % thisPeriodMilliseconds)

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function loop() {
      await sleep(millisecondsTilClose + 6000);

      if(!disableRefresh){
        window.location.reload(true); 
      }
    }

    if(!disableRefresh){ loop(); }
    
  </script>
</body>

</html>