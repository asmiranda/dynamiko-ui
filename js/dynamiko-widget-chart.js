class WidgetChartRule {
    constructor() {
        console.log("WidgetChartRule");
    }

    doAreaChart(ecanvas, data) {
        var lineChartCanvas = $(ecanvas).get(0).getContext('2d')

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
        var areaChart = new Chart(lineChartCanvas, {
            type: 'line',
            data: lineChartData,
            options: chartOptions
        });
    }

    doLineChart(index, data) {
        var offset = index + 1;
        var chartTitle = $('.chartTitle'+offset+":visible");
        $(chartTitle).html(data.getProp("chartTitle"));
        var lineChartCanvas = $('canvas.chart'+offset+":visible").get(0).getContext('2d')

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
    }

    doBarChart(index, data) {
        var offset = index + 1;
        var chartTitle = $('.chartTitle'+offset+":visible");
        $(chartTitle).html(data.getProp("chartTitle"));
        var barChartCanvas = $('canvas.chart'+offset+":visible").get(0).getContext('2d')

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
        var offset = index + 1;
        var chartTitle = $('.chartTitle'+offset+":visible");
        $(chartTitle).html(data.getProp("chartTitle"));
        var pieChartCanvas = $('canvas.chart'+offset+":visible").get(0).getContext('2d')

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
