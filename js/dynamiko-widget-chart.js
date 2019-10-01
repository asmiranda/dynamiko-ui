class WidgetChartRule {
    constructor() {
        console.log("WidgetChartRule");
    }

    doChart(ecanvas, data, chartType) {
        if (chartType=='BAR') {
            this.doBarChart(ecanvas, data);
        }
        else if (chartType=='LINE') {
            this.doLineChart(ecanvas, data);
        }
        else if (chartType=='AREA') {
            this.doAreaChart(ecanvas, data);
        }
        else {
            this.doPieChart(ecanvas, data);
        }
    }

    doAreaChart(ecanvas, data) {
        var lineChartCanvas = $(ecanvas).get(0).getContext('2d')

        var chartData = data.chartData;
        var lineChartData = this.getLineData(chartData);
        var chartOptions = this.getChartOption();
        var areaChart = new Chart(lineChartCanvas, {
            type: 'line',
            data: lineChartData,
            options: chartOptions
        });
    }

    doLineChart(ecanvas, data) {
        var lineChartCanvas = $(ecanvas).get(0).getContext('2d')

        var chartData = data.chartData;
        var lineChartData = this.getLineData(chartData);
        var chartOptions = this.getChartOption();
        var lineChart = new Chart(lineChartCanvas, {
            type: 'line',
            data: lineChartData,
            options: chartOptions
        });
    }

    doBarChart(ecanvas, data) {
        var lineChartCanvas = $(ecanvas).get(0).getContext('2d')

        var chartData = data.chartData;
        var lineChartData = this.getLineData(chartData);
        var chartOptions = this.getChartOption();
        var barChart = new Chart(lineChartCanvas, {
            type: 'bar',
            data: lineChartData,
            options: chartOptions
        });
    }

    doPieChart(ecanvas, data) {
        var pieChartCanvas = $(ecanvas).get(0).getContext('2d')

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
                }
            ]
        }
        if (chartData.label2) {
            pieChartData.datasets.push({
                label: chartData.label2,
                backgroundColor: [
                    color(window.chartColors.red).alpha(0.5).rgbString(),
                    color(window.chartColors.orange).alpha(0.5).rgbString(),
                    color(window.chartColors.yellow).alpha(0.5).rgbString(),
                    color(window.chartColors.green).alpha(0.5).rgbString(),
                    color(window.chartColors.blue).alpha(0.5).rgbString(),
                ],
                data: chartData.data2
            });
        }
        if (chartData.label3) {
            pieChartData.datasets.push({
                label: chartData.label3,
                backgroundColor: [
                    color(window.chartColors.red).alpha(0.5).rgbString(),
                    color(window.chartColors.orange).alpha(0.5).rgbString(),
                    color(window.chartColors.yellow).alpha(0.5).rgbString(),
                    color(window.chartColors.green).alpha(0.5).rgbString(),
                    color(window.chartColors.blue).alpha(0.5).rgbString(),
                ],
                data: chartData.data3
            });
        }
        var chartOptions = this.getChartOption();
        var pieChart = new Chart(pieChartCanvas, {
            type: 'doughnut',
            data: pieChartData,
            options: chartOptions
        });
    }

    getLineData(chartData) {
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
        return lineChartData;
    }

    getChartOption() {
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
                position: 'top',
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
