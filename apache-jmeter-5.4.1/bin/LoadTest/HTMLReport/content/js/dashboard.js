/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9310344827586207, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/LocationDataFromDB.do"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/SiteLogs.do"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/Pages/Common/footer.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/DashboardData.do?version=1613565831619"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/shared/modules/magnet-monitoring/views/magnet-monitoring-dashboard.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/Pages/Common/header.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/getMaxTabsOpened.do"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/Pages/Dashboard/dashboard.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/systemlock/logout/false/vinayak.naik.do"], "isController": false}, {"data": [1.0, 500, 1500, "Click on System History"], "isController": true}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/SystemDetailsDropdownData.do?stateLoc=RMW"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/shared/components/create-comment-case/views/createCommentCase.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/fetchGeneratedPlots.do"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/SD/views/common/SDleftpane.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/userFilterPreference.do"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/shared/components/sd-comment-case/views/sd-comment-case.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/NotesArchive/00007.do"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/usersComponent.do"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/SD/modules/SystemOverview/views/SDsystemOverview.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/Pages/Common/leftpane.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/fetchBlueBannerDetails.do?systemUID=00007"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/historicalCommentsAndCases.do?systemUID=00007&caseTitle=MR%20Cooling&fromDate=2020-02-18&toDate=2021-02-17"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/SD/modules/SystemOverview/views/SDsystemOverviewPartial.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/systemlock/00007/true/vinayak.naik.do"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/systemDashboardFilters.do"], "isController": false}, {"data": [0.0, 500, 1500, "Click on System Dashboard"], "isController": true}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/GlobalStatsData.do"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/systemDashboardFilterSearch/true.do"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/SD/views/SystemDashlanding.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/fetchPlotsForDashboard.do?stateLoc=RMW"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/notification/info?t=1613565871587"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/notification/682/qt53lyqb/xhr_streaming?t=1613565872453"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/readConfig"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/historicalalerts/00007.do"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/actionhistory/00007.do"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/SD/views/sysDashboardGrid.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/shared/components/system-details-header/views/system-details-header.component.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/historicalcases/00007/PHC-192168230023/RDW.do"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/GetSystemFlag.do?systemUID=00007"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/Script/App/dashboard-resize.js?_=1613565830713"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/Script/App/dashboard-resize.js?_=1613565830712"], "isController": false}, {"data": [0.0, 500, 1500, "Launch RMW"], "isController": true}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/Pages/SystemOverview/History/systemHistory.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/SystemOverview/00007.do?version=1613565907389"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/shared/components/sd-action-history/views/sd-action-history.component.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/supportedModalities/null.do"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/Pages/Dashboard/dashboardGrid.html"], "isController": false}, {"data": [0.5, 500, 1500, "Open System Overview page"], "isController": true}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/shared/components/site-logs/views/site-logs.component.html"], "isController": false}, {"data": [0.5, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/#/home/dashboard"], "isController": false}, {"data": [0.0, 500, 1500, "Click on any System"], "isController": true}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/systemDashboardFiltersData.do"], "isController": false}, {"data": [1.0, 500, 1500, "https://rswapplication2.eu-west.philips-healthsuite.com/historicalCommentsAndCases.do?systemUID=00007&caseTitle=MR%20Helium&fromDate=2020-02-18&toDate=2021-02-17"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 53, 0, 0.0, 191.52830188679246, 156, 1471, 163.0, 180.0, 192.19999999999996, 1471.0, 5.087837189209945, 25.97888742560238, 2.6049478916674667], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/LocationDataFromDB.do", 2, 0, 0.0, 170.5, 167, 174, 170.5, 174.0, 174.0, 174.0, 1.0649627263045793, 5.593134318423855, 0.5033612886048988], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/SiteLogs.do", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 32.639023680124225, 3.797069099378882], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/Pages/Common/footer.html", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 31.34881882440476, 2.830868675595238], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/DashboardData.do?version=1613565831619", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 29.664457514044944, 2.748639396067416], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/shared/modules/magnet-monitoring/views/magnet-monitoring-dashboard.html", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 28.30992353723404, 2.7738530585106385], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/Pages/Common/header.jsp", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 30.59138808139535, 2.759356831395349], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/getMaxTabsOpened.do", 2, 0, 0.0, 174.0, 168, 180, 174.0, 180.0, 180.0, 180.0, 1.277139208173691, 6.707475255427841, 0.6011534163473818], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/Pages/Dashboard/dashboard.html", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 29.765845692090398, 2.720030014124294], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/systemlock/logout/false/vinayak.naik.do", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 30.095880681818183, 3.251509232954546], "isController": false}, {"data": ["Click on System History", 1, 0, 0.0, 326.0, 326, 326, 326.0, 326.0, 326.0, 326.0, 3.067484662576687, 32.37035084355828, 2.989599309815951], "isController": true}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/SystemDetailsDropdownData.do?stateLoc=RMW", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 170.0, 5.88235294117647, 31.054687499999996, 2.895220588235294], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/shared/components/create-comment-case/views/createCommentCase.html", 1, 0, 0.0, 158.0, 158, 158, 158.0, 158.0, 158.0, 158.0, 6.329113924050633, 33.65432159810126, 3.269630142405063], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/fetchGeneratedPlots.do", 1, 0, 0.0, 158.0, 158, 158, 158.0, 158.0, 158.0, 158.0, 6.329113924050633, 33.30201740506329, 5.9520866297468356], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/SD/views/common/SDleftpane.html", 1, 0, 0.0, 162.0, 162, 162, 162.0, 162.0, 162.0, 162.0, 6.172839506172839, 32.58222415123457, 2.977912808641975], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/userFilterPreference.do", 1, 0, 0.0, 159.0, 159, 159, 159.0, 159.0, 159.0, 159.0, 6.289308176100629, 33.031151729559745, 2.984964622641509], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/shared/components/sd-comment-case/views/sd-comment-case.html", 1, 0, 0.0, 167.0, 167, 167, 167.0, 167.0, 167.0, 167.0, 5.9880239520958085, 31.782138847305387, 3.058336452095808], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/NotesArchive/00007.do", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 32.66328610248447, 2.935753105590062], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/usersComponent.do", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 28.053977272727273, 2.5066844919786098], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/SD/modules/SystemOverview/views/SDsystemOverview.html", 1, 0, 0.0, 162.0, 162, 162, 162.0, 162.0, 162.0, 162.0, 6.172839506172839, 32.744984567901234, 3.1105324074074074], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/Pages/Common/leftpane.html", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 29.765845692090398, 2.697960805084746], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/fetchBlueBannerDetails.do?systemUID=00007", 2, 0, 0.0, 166.5, 161, 172, 166.5, 172.0, 172.0, 172.0, 3.8167938931297707, 20.1574427480916, 1.8785782442748091], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/historicalCommentsAndCases.do?systemUID=00007&caseTitle=MR%20Cooling&fromDate=2020-02-18&toDate=2021-02-17", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 31.999860491071427, 3.2958984375], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/SD/modules/SystemOverview/views/SDsystemOverviewPartial.html", 1, 0, 0.0, 162.0, 162, 162, 162.0, 162.0, 162.0, 162.0, 6.172839506172839, 32.763069058641975, 3.1527295524691357], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/systemlock/00007/true/vinayak.naik.do", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 33.09326171875, 3.564453125], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/systemDashboardFilters.do", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 32.861328125, 2.978515625], "isController": false}, {"data": ["Click on System Dashboard", 1, 0, 0.0, 1844.0, 1844, 1844, 1844.0, 1844.0, 1844.0, 1844.0, 0.5422993492407809, 31.438004168926245, 3.014951362527115], "isController": true}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/GlobalStatsData.do", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 31.255812872023807, 3.0691964285714284], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/systemDashboardFilterSearch/true.do", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 31.82652484939759, 3.423851656626506], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/SD/views/SystemDashlanding.html", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 32.1312881097561, 2.9415967987804876], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/fetchPlotsForDashboard.do?stateLoc=RMW", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 29.4987342877095, 2.733283868715084], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/notification/info?t=1613565871587", 1, 0, 0.0, 156.0, 156, 156, 156.0, 156.0, 156.0, 156.0, 6.41025641025641, 4.000150240384615, 2.917167467948718], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/notification/682/qt53lyqb/xhr_streaming?t=1613565872453", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 3.2875582298136643, 3.4695263975155277], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/readConfig", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 25.95625773514851, 2.2867032797029703], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/historicalalerts/00007.do", 1, 0, 0.0, 162.0, 162, 162, 162.0, 162.0, 162.0, 162.0, 6.172839506172839, 32.48577353395061, 2.9417438271604937], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/actionhistory/00007.do", 2, 0, 0.0, 160.5, 160, 161, 160.5, 161.0, 161.0, 161.0, 1.4792899408284024, 7.780718380177515, 0.7006402551775147], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/SD/views/sysDashboardGrid.html", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 29.29144965277778, 2.674696180555556], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/shared/components/system-details-header/views/system-details-header.component.html", 1, 0, 0.0, 159.0, 159, 159, 159.0, 159.0, 159.0, 159.0, 6.289308176100629, 33.54092963836478, 3.3473368710691824], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/historicalcases/00007/PHC-192168230023/RDW.do", 2, 0, 0.0, 160.0, 159, 161, 160.0, 161.0, 161.0, 161.0, 0.9225092250922509, 4.8819116120848705, 0.4576510608856088], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/GetSystemFlag.do?systemUID=00007", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 32.76033579192546, 3.0024747670807455], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/Script/App/dashboard-resize.js?_=1613565830713", 1, 0, 0.0, 162.0, 162, 162, 162.0, 162.0, 162.0, 162.0, 6.172839506172839, 32.702787422839506, 3.689236111111111], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/Script/App/dashboard-resize.js?_=1613565830712", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 32.88164790372671, 3.7121506211180124], "isController": false}, {"data": ["Launch RMW", 1, 0, 0.0, 3911.0, 3911, 3911, 3911.0, 3911.0, 3911.0, 3911.0, 0.25568908207619534, 20.221910157248786, 1.882460927512145], "isController": true}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/Pages/SystemOverview/History/systemHistory.html", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 32.256335746951216, 3.03687118902439], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/SystemOverview/00007.do?version=1613565907389", 1, 0, 0.0, 163.0, 163, 163, 163.0, 163.0, 163.0, 163.0, 6.134969325153374, 32.44224501533742, 3.0435199386503067], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/shared/components/sd-action-history/views/sd-action-history.component.html", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 33.075747282608695, 3.257230201863354], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/supportedModalities/null.do", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 30.76457419590643, 3.003929093567251], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/Pages/Dashboard/dashboardGrid.html", 1, 0, 0.0, 165.0, 165, 165, 165.0, 165.0, 165.0, 165.0, 6.0606060606060606, 31.977982954545453, 2.941524621212121], "isController": false}, {"data": ["Open System Overview page", 1, 0, 0.0, 807.0, 807, 807, 807.0, 807.0, 807.0, 807.0, 1.2391573729863692, 32.721499380421314, 3.034967472118959], "isController": true}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/shared/components/site-logs/views/site-logs.component.html", 1, 0, 0.0, 159.0, 159, 159, 159.0, 159.0, 159.0, 159.0, 6.289308176100629, 33.39352397798742, 3.199931210691824], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/#/home/dashboard", 1, 0, 0.0, 1471.0, 1471, 1471, 1471.0, 1471.0, 1471.0, 1471.0, 0.6798096532970768, 3.6632711590754585, 0.3319383072739633], "isController": false}, {"data": ["Click on any System", 1, 0, 0.0, 3263.0, 3263, 3263, 3263.0, 3263.0, 3263.0, 3263.0, 0.30646644192460926, 29.605735711002147, 3.3067848797119215], "isController": true}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/systemDashboardFiltersData.do", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 32.65722049689441, 2.9842779503105588], "isController": false}, {"data": ["https://rswapplication2.eu-west.philips-healthsuite.com/historicalCommentsAndCases.do?systemUID=00007&caseTitle=MR%20Helium&fromDate=2020-02-18&toDate=2021-02-17", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 33.38509316770186, 3.433132763975155], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 53, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
