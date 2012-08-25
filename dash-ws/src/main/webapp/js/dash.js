/* dash.js */

var myData;
var timestamps, points, groups;
var pos = 0, i, j;
var width = 800, height = 600;
var l_margin = 100, b_margin = 100;
var x_scale, y_scale, y_min, y_max;
var chart_x = l_margin, chart_height = height - b_margin, chart_width = width
		- l_margin;

var time = new Date().getTime();
alert(time/1000);

function RRDGraph(data, settings) {
	/**
	 * valid settings: width height left-margin right-margin top-margin
	 * bottom-margin
	 */
	this.data = data;
	this.settings = settings;
}

RRDGraph.prototype.draw = function() {

}

function dash_init() {
	

}

function drawGraph(svg) {
	var g = svg.group({
		'transform' : 'translate(' + l_margin + ', 0)'
	});

	// find local maxima and minima
	x_scale = (width - l_margin) / myData.length;
	var num = parseFloat(myData[0].points[0]);
	y_max = num;
	y_min = num;
	for (i = 0; i < myData.length; i++) {
		for (j = 0; j < myData[i].points.length; j++) {
			num = parseFloat(myData[i].points[j]);
			if (y_min > num)
				y_min = num;
			if (y_max < num)
				y_max = num;
		}
	}

	y_scale = (height - b_margin) / (y_max - y_min);
	for (i = 1; i < myData.length; i++) {
		// svg.line(parent, x1, y1, x2, y2, settings)
		var x1 = (i - 1) * x_scale;
		var x2 = i * x_scale;
		for (j = 0; j < myData[i].points.length; j++) {
			var y1 = (height - b_margin)
					- ((myData[i - 1].points[j] - y_min) * y_scale);
			var y2 = (height - b_margin)
					- ((myData[i].points[j] - y_min) * y_scale);
			svg.line(g, x1, y1, x2, y2, {
				'stroke' : 'lightgray',
				'stroke-width' : '.5px'
			});
		}
	}
}
