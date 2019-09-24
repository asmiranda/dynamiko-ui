class ChartRule {
    constructor(moduleName, mainForm) {
        console.log("ChartRule");
        this.moduleName = moduleName;
        this.mainForm = mainForm;
    }

    doChartRule() {
        var context = this;
        console.log("doRule called");
        var convertFormToJSON = new ConvertFormToJSON($(context.mainForm));
        var vdata = JSON.stringify(convertFormToJSON.convert());
        console.log(vdata);
        var url = MAIN_URL + '/api/generic/chartrule/' + context.moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function (data) {
            console.log(data);
            $(data).each(function (index, obj) {
                console.log(obj);
                var chartType = obj.getProp("chartType");
                if (chartType == "BAR") {
                    context.doBarChart(index, obj);
                }
                else if (chartType == "PIE") {
                    context.doPieChart(index, obj);
                }
                else if (chartType == "LINE") {
                    context.doLineChart(index, obj);
                }
                else if (chartType == "AREA") {
                    context.doAreaChart(index, obj);
                }
            });
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxPost();
    }

    doAreaChart(index, data) {
        var chartTitle = $('.chartTitle' + (index + 1));
        $(chartTitle).html(data.getProp("chartTitle"));
        var lineChartCanvas = $('.chart' + (index + 1)).get(0).getContext('2d')

        var chartData = data.chartData;
        var color = Chart.helpers.color;
        var lineChartData = {
            labels: chartData.horizontalLabels,
            datasets: [
                {
                    label: chartData.label1,
                    backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                    borderColor: window.chartColors.red,
                    data: chartData.data1
                },
            ]
        }
        if (chartData.label2) {
            lineChartData.datasets.push({
                label: chartData.label2,
                backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                borderColor: window.chartColors.blue,
                data: chartData.data2
            });
        }
        if (chartData.label3) {
            lineChartData.datasets.push({
                label: chartData.label3,
                backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
                borderColor: window.chartColors.green,
                data: chartData.data3
            });
        }

        // var lineChart = new Chart(lineChartCanvas)
        var lineChart = new Chart(lineChartCanvas, {
            type: 'line',
            data: lineChartData,
            options: {
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
                    position: 'top',
                    labels: {
                        boxWidth: 20,
                        fontSize: 8,
                    }
                },
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }

    doLineChart(index, data) {
        var chartTitle = $('.chartTitle' + (index + 1));
        $(chartTitle).html(data.getProp("chartTitle"));
        var lineChartCanvas = $('.chart' + (index + 1)).get(0).getContext('2d')

        var chartData = data.chartData;
        var color = Chart.helpers.color;
        var lineChartData = {
            labels: chartData.horizontalLabels,
            datasets: [
                {
                    label: chartData.label1,
                    backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                    borderColor: window.chartColors.red,
                    fill: false,
                    data: chartData.data1
                },
                {
                    label: chartData.label2,
                    backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                    borderColor: window.chartColors.blue,
                    fill: false,
                    data: chartData.data2
                },
                {
                    label: chartData.label3,
                    backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
                    borderColor: window.chartColors.green,
                    fill: false,
                    data: chartData.data3
                },
            ]
        }

        var lineChart = new Chart(lineChartCanvas, {
            type: 'line',
            data: lineChartData,
            options: {
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
                    position: 'top',
                    labels: {
                        boxWidth: 20,
                        fontSize: 8,
                    }
                },
                responsive: true,
                maintainAspectRatio: true
            }
        });

        // var lineChart = new Chart(lineChartCanvas)
        // lineChartOptions.datasetFill = false
        // lineChart.Line(lineChartData, lineChartOptions)
    }

    doBarChart(index, data) {
        var chartTitle = $('.chartTitle' + (index + 1));
        $(chartTitle).html(data.getProp("chartTitle"));

        var chartData = data.chartData;
        var color = Chart.helpers.color;
        var barChartData = {
            labels: chartData.horizontalLabels,
            datasets: [
                {
                    label: chartData.label1,
                    backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                    borderColor: window.chartColors.red,
                    data: chartData.data1
                },
                {
                    label: chartData.label2,
                    backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                    borderColor: window.chartColors.blue,
                    data: chartData.data2
                },
                {
                    label: chartData.label3,
                    backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
                    borderColor: window.chartColors.green,
                    data: chartData.data3
                },
            ]
        }

        var barChartCanvas = $('.chart' + (index + 1)).get(0).getContext('2d');
        var barChart = new Chart(barChartCanvas, {
            type: 'bar',
            data: barChartData,
            options: {
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
                    position: 'top',
                    labels: {
                        boxWidth: 20,
                        fontSize: 8,
                    }
                },
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }

    doPieChart(index, data) {
        var chartTitle = $('.chartTitle' + (index + 1));
        $(chartTitle).html(data.getProp("chartTitle"));

        var chartData = data.chartData;
        var color = Chart.helpers.color;
        var pieChartData = {
            labels: chartData.horizontalLabels,
            datasets: [
                {
                    label: chartData.label1,
                    backgroundColor: [
                        color(window.chartColors.red).alpha(0.5).rgbString(),
                        color(window.chartColors.orange).alpha(0.5).rgbString(),
                        color(window.chartColors.yellow).alpha(0.5).rgbString(),
                        color(window.chartColors.green).alpha(0.5).rgbString(),
                        color(window.chartColors.blue).alpha(0.5).rgbString(),
                    ],
                    data: chartData.data1
                },
                {
                    label: chartData.label2,
                    backgroundColor: [
                        color(window.chartColors.red).alpha(0.5).rgbString(),
                        color(window.chartColors.orange).alpha(0.5).rgbString(),
                        color(window.chartColors.yellow).alpha(0.5).rgbString(),
                        color(window.chartColors.green).alpha(0.5).rgbString(),
                        color(window.chartColors.blue).alpha(0.5).rgbString(),
                    ],
                    data: chartData.data2
                },
                {
                    label: chartData.label3,
                    backgroundColor: [
                        color(window.chartColors.red).alpha(0.5).rgbString(),
                        color(window.chartColors.orange).alpha(0.5).rgbString(),
                        color(window.chartColors.yellow).alpha(0.5).rgbString(),
                        color(window.chartColors.green).alpha(0.5).rgbString(),
                        color(window.chartColors.blue).alpha(0.5).rgbString(),
                    ],
                    data: chartData.data3
                },
            ]
        }
        var pieChartCanvas = $('.chart' + (index + 1)).get(0).getContext('2d')

        var pieChart = new Chart(pieChartCanvas, {
            type: 'doughnut',
            data: pieChartData,
            options: {
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
                    position: 'top',
                    labels: {
                        boxWidth: 20,
                        fontSize: 8,
                    }
                },
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }
}
