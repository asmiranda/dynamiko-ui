class DataVisualizer {
    constructor() {
        this.pivot;
        this.chart;
    }

    init() {
        var context = this;
        $(".pivotTable").click(function () {
            context.showPivot();
        });
    }

    showPivot() {
        var context = this;
        $("#content-main").empty();
        var str = `
            <div style="padding: 10px;">
                <div class="col-md-8">
                    <div id="wdr-component"></div>
                </div>
                <div class="col-md-4">
                    <div class="box box-primary">
                        <div class="box-header with-border">
                            <h3 class="box-title">Data Visualization</h3>
                        </div>
                        <div class="box-body">
                            <div class="chart">
                                <canvas id="wdr-chart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $("#content-main").append(str);
        this.pivot = new WebDataRocks({
            container: "#wdr-component",
            toolbar: true,
            report: {
                dataSource: {
                    data: context.getData()
                },
            },
            reportcomplete: function () {
                $(".wdr-toolbar-group-right").css("padding-right", "10px");
                context.createPolarChart();
            }
        });
    }

    prepareDataFunction(rawData) {
        var result = {};
        var labels = [];
        var data = [];
        for (var i = 0; i < rawData.data.length; i++) {
            var record = rawData.data[i];
            if (record.c0 == undefined && record.r0 !== undefined) {
                var _record = record.r0;
                labels.push(_record);
            }
            if (record.c0 == undefined & record.r0 == undefined) continue;
            if (record.v0 != undefined) {
                data.push(!isNaN(record.v0) ? record.v0 : null);
            }
        }
        result.labels = labels;
        result.data = data;
        return result;
    }

    createPolarChart() {
        var context = this;
        var drawChart = function(rawData) {
            context.drawChart(rawData);
        };
        var rewriteChart = function(rawData) {
            context.chart.destroy();
            context.drawChart(rawData);
        };
        this.pivot.getData({
            slice: {
                "rows": [{
                    "uniqueName": "Country",
                    "sort": "asc"
                }],
                "columns": [{
                    "uniqueName": "Measures"
                }],
                "measures": [{
                    "uniqueName": "Profit",
                    "aggregation": "sum"
                }]
            },
        }, drawChart, rewriteChart);
    }

    drawChart(rawData) {
        var context = this;
        var data = context.prepareDataFunction(rawData);
        var data_for_charts = {
            datasets: [{
                data: data.data,
                backgroundColor: [
                    "#FF6384",
                    "#4BC0C0",
                    "#FFCE56",
                    "#E7E9ED",
                    "#36A2EB",
                    "#9ccc65",
                    "#b3e5fc"
                ]
            }],
            labels: data.labels
        };
        var options = {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                fontSize: 18,
                text: 'Profit by Countries'
            },
            scale: {
                ticks: {
                    beginAtZero: true
                },
                reverse: false
            },
            animation: {
                animateRotate: false,
                animateScale: true
            }
        };
        var ctx = document.getElementById("wdr-chart").getContext("2d");
        context.chart = new Chart(ctx, {
            data: data_for_charts,
            type: 'polarArea',
            options: options
        });
    }

    getData() {
        return [{
            "Country": "USA",
            "Product Category": "Entertainment equipment",
            "Profit": 455,
            "Actual Expenses": 250,
            "Budgeted Expenses": 55,
            "Date": "2015-02-14T07:34:08",
            "Price Per Unit": 45
        },
        {
            "Country": "USA",
            "Product Category": "Entertainment equipment",
            "Profit": 156,
            "Actual Expenses": 501,
            "Budgeted Expenses": 55,
            "Date": "2015-02-14T07:34:08",
            "Price Per Unit": 48
        },
        {
            "Country": "Spain",
            "Product Category": "Entertainment equipment",
            "Profit": 455,
            "Actual Expenses": 302,
            "Budgeted Expenses": 75,
            "Date": "2016-01-11T07:28:30",
            "Price Per Unit": 95
        },
        {
            "Country": "Spain",
            "Product Category": "Entertainment equipment",
            "Profit": 455,
            "Actual Expenses": 205,
            "Budgeted Expenses": 75,
            "Date": "2016-01-11T07:28:30",
            "Price Per Unit": 14
        },
        {
            "Country": "USA",
            "Product Category": "Entertainment equipment",
            "Profit": 236,
            "Actual Expenses": 63,
            "Budgeted Expenses": 55,
            "Date": "2017-11-27T06:52:07",
            "Price Per Unit": 45
        },
        {
            "Country": "USA",
            "Product Category": "Entertainment equipment",
            "Profit": 355,
            "Actual Expenses": 140,
            "Budgeted Expenses": 55,
            "Date": "2017-11-27T06:52:07",
            "Price Per Unit": 43
        },
        {
            "Country": "USA",
            "Product Category": "Entertainment equipment",
            "Profit": 354,
            "Actual Expenses": 88,
            "Budgeted Expenses": 65,
            "Date": "2017-10-13T05:34:44",
            "Price Per Unit": 45
        }, {
            "Country": "USA",
            "Product Category": "Sports equipment",
            "Profit": 354,
            "Actual Expenses": 170,
            "Budgeted Expenses": 65,
            "Date": "2017-10-13T05:34:44",
            "Price Per Unit": 45
        },
        {
            "Country": "France",
            "Product Category": "Sports equipment",
            "Profit": 354,
            "Actual Expenses": 230,
            "Budgeted Expenses": 55,
            "Date": "2014-11-20T07:16:26",
            "Price Per Unit": 45
        },
        {
            "Country": "France",
            "Product Category": "Sports equipment",
            "Profit": 354,
            "Actual Expenses": 160,
            "Budgeted Expenses": 25,
            "Date": "2018-12-18T01:26:57",
            "Price Per Unit": 22
        },
        {
            "Country": "France",
            "Product Category": "Sports equipment",
            "Profit": 352,

            "Actual Expenses": 180,

            "Date": "2015-09-12T05:29:36",
            "Price Per Unit": 89
        },
        {
            "Country": "France",

            "Product Category": "Entertainment equipment",
            "Profit": 654,

            "Actual Expenses": 190,
            "Budgeted Expenses": 23,

            "Date": "2016-06-13T11:43:37",
            "Price Per Unit": 78
        },
        {
            "Country": "USA",
            "Product Category": "Entertainment equipment",
            "Profit": 355,
            "Actual Expenses": 140,
            "Budgeted Expenses": 55,
            "Date": "2015-10-03T05:41:44",
            "Price Per Unit": 23
        },
        {
            "Country": "USA",
            "Product Category": "Entertainment equipment",
            "Profit": 770,
            "Actual Expenses": 177,
            "Budgeted Expenses": 23,
            "Date": "2014-04-28T06:05:53",
            "Price Per Unit": 15
        },
        {
            "Country": "USA",
            "Product Category": "Entertainment equipment",
            "Profit": 770,
            "Actual Expenses": 200,
            "Budgeted Expenses": 45,
            "Date": "2014-06-13T03:03:22",
            "Price Per Unit": 44
        },
        {

            "Country": "USA",
            "Product Category": "Entertainment equipment",
            "Profit": 770,

            "Actual Expenses": 300,
            "Budgeted Expenses": 55,

            "Date": "2015-07-28T12:04:26",
            "Price Per Unit": 22
        },
        {
            "Country": "USA",
            "Product Category": "Entertainment equipment",
            "Profit": 770,
            "Actual Expenses": 140,
            "Budgeted Expenses": 55,
            "Date": "2014-12-31T10:21:58",
            "Price Per Unit": 45
        },
        {
            "Country": "USA",
            "Product Category": "Entertainment equipment",
            "Profit": 550,

            "Actual Expenses": 120,
            "Budgeted Expenses": 55,

            "Date": "2017-09-09T07:11:20",
            "Price Per Unit": 88
        },
        {

            "Country": "France",
            "Product Category": "Entertainment equipment",
            "Profit": 655,
            "Actual Expenses": 88,
            "Budgeted Expenses": 45,
            "Date": "2014-06-15T12:41:23",
            "Price Per Unit": 35
        },
        {
            "Country": "USA",
            "Product Category": "Entertainment equipment",
            "Profit": 354,
            "Actual Expenses": 90,
            "Budgeted Expenses": 55,
            "Date": "2017-12-08T11:25:50",
            "Price Per Unit": 74
        },
        {
            "Country": "France",
            "Product Category": "Cameras",
            "Profit": 322,
            "Actual Expenses": 30,
            "Budgeted Expenses": 55,
            "Date": "2018-03-18T04:39:25",
            "Price Per Unit": 41
        },
        {
            "Country": "France",
            "Product Category": "Cameras",
            "Profit": 322,
            "Actual Expenses": 140,
            "Budgeted Expenses": 55,
            "Date": "2014-11-18T11:59:17",
            "Price Per Unit": 44
        },
        {
            "Country": "USA",
            "Product Category": "Entertainment equipment",
            "Profit": 774,
            "Actual Expenses": 220,
            "Budgeted Expenses": 123,
            "Date": "2016-08-06T03:38:09",
            "Price Per Unit": 99
        },
        {
            "Country": "USA",
            "Product Category": "Entertainment equipment",
            "Profit": 436,
            "Actual Expenses": 130,
            "Budgeted Expenses": 123,
            "Date": "2014-07-16T08:27:06",
            "Price Per Unit": 36
        },
        {
            "Country": "USA",
            "Product Category": "Entertainment equipment",
            "Profit": 655,
            "Actual Expenses": 70,
            "Budgeted Expenses": 123,
            "Date": "2019-02-01T01:16:28",
            "Price Per Unit": 98
        },
        {
            "Country": "USA",
            "Product Category": "Entertainment equipment",
            "Profit": 455,
            "Actual Expenses": 140,
            "Budgeted Expenses": 123,
            "Date": "2019-02-01T01:16:28",
            "Price Per Unit": 105
        },
        {
            "Country": "Australia",
            "Product Category": "Entertainment equipment",
            "Profit": 1500,
            "Actual Expenses": 140,
            "Budgeted Expenses": 123,
            "Date": "2019-02-01T01:16:28",
            "Price Per Unit": 105
        },
        {
            "Country": "Italy",
            "Product Category": "Entertainment equipment",
            "Profit": 5000,
            "Actual Expenses": 140,
            "Budgeted Expenses": 123,
            "Date": "2019-02-01T01:16:28",
            "Price Per Unit": 105
        },
        {
            "Country": "Sweden",
            "Product Category": "Entertainment equipment",
            "Profit": 3405,
            "Actual Expenses": 140,
            "Budgeted Expenses": 123,
            "Date": "2019-02-01T01:16:28",
            "Price Per Unit": 105
        }
        ]
    }
}