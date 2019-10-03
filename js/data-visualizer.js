class DataVisualizer {
    constructor() {
        this.pivot;
        this.chart;
        this.serverData;
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
                    <div class="box box-primary">
                        <div class="box-header with-border">
                            <div class="form-group">
                                <label for="dataVisualizer" class="col-sm-2 control-label wdr-ui-element">
                                    <h3 class="box-title" style="margin: 7px;">Select Data</h3>
                                </label>
                                <div class="input-group col-sm-10" style="margin-left:2px;">
                                    <select id="dataVisualizer" class="form-control"></select>
                                </div>
                            </div>
                        </div>
                        <div class="box-body">
                            <div id="wdr-component"></div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="box box-primary">
                        <div class="box-header with-border">
                            <h3 class="box-title">Data Visualization</h3>
                        </div>
                        <div class="box-body">
                            <div class="chartContainer">
                                <canvas id="wdr-chart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $("#content-main").append(str);
        $("#dataVisualizer").change(function () {
            context.updateData();
        });
        this.loadAllDataVisualizers();
        this.pivot = new WebDataRocks({
            container: "#wdr-component",
            toolbar: true,
            reportcomplete: function () {
                $(".wdr-toolbar-group-right").css("padding-right", "10px");
                context.createChart();
            }
        });
    }

    updateData() {
        var context = this;
        var val = $("#dataVisualizer").val();

        var url = MAIN_URL + '/api/generic/visualizer/' + val;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function (vdata) {
            console.log(vdata);
            context.serverData = vdata;
            context.pivot.updateData({
                data: vdata.data
            });
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }

    loadAllDataVisualizers() {
        var context = this;
        console.log("LOAD ALL VISUALIZERS...");

        var url = MAIN_URL + '/api/generic/visualizer/all';
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function (data) {
            console.log(data);
            $("#dataVisualizer").empty();
            $("#dataVisualizer").append('<option value="">-- Select Data --</option>');
            $(data).each(function (index, obj) {
                $("#dataVisualizer").append('<option value="' + obj.name + '">' + obj.title + '</option>');
            });
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
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

    createChart() {
        var context = this;
        var drawPolar = function (rawData) {
            context.drawPolar(rawData);
        };
        var rewritePolar = function (rawData) {
            context.chart.destroy();
            context.drawPolar(rawData);
        };

        var drawBar = function (rawData) {
            context.drawBar(rawData);
        };
        var rewriteBar = function (rawData) {
            context.chart.destroy();
            context.drawBar(rawData);
        };

        var drawPie = function (rawData) {
            context.drawPie(rawData);
        };
        var rewritePie = function (rawData) {
            context.chart.destroy();
            context.drawPie(rawData);
        };

        $("div.chartContainer").children().hide();
        $("div.chartContainer").empty();
        $("div.chartContainer").append('<canvas id="wdr-chart"></canvas>');        

        if ($("#dataVisualizer").val() != "") {
            if (context.serverData.chartType == 'polarArea') {
                this.pivot.getData({
                    slice: context.getSlice(),
                }, drawPolar, rewritePolar);
            }
            else if (context.serverData.chartType == 'pie' || 
                context.serverData.chartType == 'doughnut') {
                this.pivot.getData({
                    slice: context.getSlice(),
                }, drawPie, rewritePie);
            }
            else if (context.serverData.chartType == 'bar' || 
                context.serverData.chartType == 'area' || 
                context.serverData.chartType == 'line') {
                this.pivot.getData({
                    slice: context.getSlice(),
                }, drawBar, rewriteBar);
            }
        }
    }

    getSlice() {
        var slice = {
            "rows": [{
                "uniqueName": "PRODUCTCODE",
                "sort": "asc"
            }],
            "columns": [{
                "uniqueName": "WFSTATUS"
            }],
            "measures": [{
                "uniqueName": "QUANTITY",
                "aggregation": "sum"
            }]
        };
        return slice;
    }

    drawPie(rawData) {
        var context = this;
        var ctx = document.getElementById("wdr-chart").getContext("2d");
        context.chart = new Chart(ctx, {
            data: context.getPieData(rawData),
            type: context.serverData.chartType,
            options: context.getLineChartOption()
        });
    }

    drawBar(rawData) {
        var context = this;
        console.log(this.serverData);
        var ctx = document.getElementById("wdr-chart").getContext("2d");
        context.chart = new Chart(ctx, {
            data: context.getLineData(rawData),
            type: context.serverData.chartType,
            options: context.getLineChartOption()
        });
    }

    drawPolar(rawData) {
        var context = this;
        console.log(this.serverData);
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
                position: context.serverData.legendPosition
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
            type: context.serverData.chartType,
            options: options
        });
    }

    getLineData(rawData) {
        var color = Chart.helpers.color;
        var data = this.prepareDataFunction(rawData);
        var lineChartData = {
            labels: data.labels,
            datasets: [
                {
                    backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                    borderColor: window.chartColors.red,
                    data: data.data
                },
            ]
        }
        return lineChartData;
    }

    getPieData(rawData) {
        var color = Chart.helpers.color;
        var data = this.prepareDataFunction(rawData);
        var lineChartData = {
            labels: data.labels,
            datasets: [
                {
                    backgroundColor: [
                        color(window.chartColors.red).alpha(0.5).rgbString(),
                        color(window.chartColors.orange).alpha(0.5).rgbString(),
                        color(window.chartColors.yellow).alpha(0.5).rgbString(),
                        color(window.chartColors.green).alpha(0.5).rgbString(),
                        color(window.chartColors.blue).alpha(0.5).rgbString(),
                    ],
                    data: data.data
                },
            ]
        }
        return lineChartData;
    }

    getLineChartOption() {
        var context = this;
        var chartOptions = {
            //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
            scaleBeginAtZero: true,
            //Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines: true,
            //String - Colour of the grid lines
            scaleGridLineColor: 'rgba(0,0,0,.05)',
            //Number - Width of the grid lines
            scaleGridLineWidth: 1,
            //Boolean - Whether to show horizontal lines (except X axis)
            scaleShowHorizontalLines: true,
            //Boolean - Whether to show vertical lines (except Y axis)
            scaleShowVerticalLines: true,
            //Boolean - If there is a stroke on each bar
            barShowStroke: true,
            //Number - Pixel width of the bar stroke
            barStrokeWidth: 2,
            //Number - Spacing between each of the X value sets
            barValueSpacing: 5,
            //Number - Spacing between data sets within X values
            barDatasetSpacing: 1,
            //String - A legend template
            // legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
            //Boolean - whether to make the chart responsive
            legend: {
                position: context.serverData.legendPosition,
                labels: {
                    boxWidth: 20,
                    fontSize: 8,
                }
            },
            responsive: true,
            maintainAspectRatio: true
        }
        return chartOptions;
    }

    getPieChartOption() {
        var context = this;
        var chartOptions = {
            //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
            scaleBeginAtZero: true,
            //Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines: true,
            //String - Colour of the grid lines
            scaleGridLineColor: 'rgba(0,0,0,.05)',
            //Number - Width of the grid lines
            scaleGridLineWidth: 1,
            //Boolean - Whether to show horizontal lines (except X axis)
            scaleShowHorizontalLines: true,
            //Boolean - Whether to show vertical lines (except Y axis)
            scaleShowVerticalLines: true,
            //Boolean - If there is a stroke on each bar
            barShowStroke: true,
            //Number - Pixel width of the bar stroke
            barStrokeWidth: 10,
            //Number - Spacing between each of the X value sets
            barValueSpacing: 5,
            //Number - Spacing between data sets within X values
            barDatasetSpacing: 1,
            //String - A legend template
            // legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
            //Boolean - whether to make the chart responsive
            legend: {
                position: context.serverData.legendPosition,
                labels: {
                    boxWidth: 20,
                    fontSize: 8,
                }
            },
            responsive: true,
            maintainAspectRatio: true
        }
        return chartOptions;
    }
}