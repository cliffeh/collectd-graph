var testes;

function RRDGraph(parent, id, settings) {
	/**
	 * valid settings (default) : width (600), height (400), left-margin (50),
	 * right-margin (0), bottom-margin (50), top-margin (0), point-count
	 * (width), colors ([ 'color1', color2', ..., 'colorn' ])
	 */

	// pick some sane defaults
	// TODO be careful about int conversion
	// note: total width = width+lmargin+rmargin
	this.width = settings['width'] ? settings['width'] : 600;
	this.leftMarginWidth = settings['left-margin'] ? settings['left-margin']
			: 50;
	this.rightMarginWidth = settings['right-margin'] ? settings['right-margin']
			: 0;

	// note: total height = height + tmargin + bmargin
	this.height = settings['height'] ? settings['height'] : 300;
	this.bottomMarginHeight = settings['bottom-margin'] ? settings['bottom-margin']
			: 50;
	this.topMarginHeight = settings['top-margin'] ? settings['top-margin'] : 0;

	// TODO come up with some sane colors
	// TODO names should come with the data
	this.colors = settings['colors'];
	this.names = settings['names'];

	// internal data
	this.ymin = 9007199254740992;
	this.ymax = -9007199254740992;
	this.data = new Array();

	this.pointCount = settings['point-count'] ? settings['top-margin']
			: this.width;

	// create the initial svg node
	this.parent = parent;
	this.id = id;
	$('#dash').svg(
			{
				settings : {
					'id' : this.id,
					'width' : this.width + this.leftMarginWidth
							+ this.rightMarginWidth,
					'height' : this.height + this.topMarginHeight
							+ this.bottomMarginHeight
				}
			});
	this.svg = $('#dash').svg('get');

	// containers for the chart & margins
	this.chart = this.svg.group(this.id + 'chart', {
		'transform' : 'translate(' + this.leftMarginWidth + ' '
				+ this.topMarginHeight + ')'
	});
	this.chartLines = new Array(); // this.svg.group(this.chart, this.id +
	// 'lines');
	this.lmargin = this.leftMarginWidth ? this.svg.group(this.id + 'lmargin', {
		'transform' : 'translate(0 ' + this.topMarginHeight + ')'
	}) : null;
	this.rmargin = this.rightMarginWidth ? this.svg.group(this.id + 'rmargin',
			{
				'transform' : 'translate('
						+ (this.leftMarginWidth + this.width) + ' '
						+ this.topMarginHeight + ')'
			}) : null;
	this.tmargin = this.topMarginHeight ? this.svg.group(this.id + 'tmargin', {
		'transform' : 'translate(' + this.leftMarginWidth + ' 0)'
	}) : null;
	this.bmargin = this.bottomMarginHeight ? this.svg.group(
			this.id + 'bmargin', {
				'transform' : 'translate(' + this.leftMarginWidth + ' '
						+ (this.topMarginHeight + this.height) + ')'
			}) : null;

	// container for the legend, x & y tick-marks
	this.legend = this.svg.group(this.bmargin);
	this.xTicks = this.svg.group(this.bmargin);
	this.yTicks = this.svg.group(this.lmargin);

	// backgrounds and dividing lines for the chart & margins
	// TODO remove all formatting and handle w/CSS?
	this.svg.rect(this.chart, 0, 0, this.width, this.height, 0, 0, {
		'fill' : 'none',
		'stroke' : 'none'
	});
	if (this.lmargin) {
		this.svg.rect(this.lmargin, 0, 0, this.leftMarginWidth, this.height, 0,
				0, {
					'fill' : 'none'
				});
		this.svg.line(this.lmargin, this.leftMarginWidth, 0,
				this.leftMarginWidth, this.height, {
					'stroke' : 'black',
					'stroke-width' : '0.25'
				});
	}
	if (this.rmargin) {
		this.svg.rect(this.rmargin, 0, 0, this.rightMarginWidth, this.height,
				0, 0, {
					'fill' : 'none'
				});
		this.svg.line(this.rmargin, 0, 0, 0, this.height, {
			'stroke' : 'black',
			'stroke-width' : '0.25'
		});
	}
	if (this.tmargin) {
		this.svg.rect(this.tmargin, 0, 0, this.width, this.topMarginHeight, 0,
				0, {
					'fill' : 'none'
				});
		this.svg.line(this.tmargin, 0, this.topMarginHeight, this.width,
				this.topMarginHeight, {
					'stroke' : 'black',
					'stroke-width' : '0.25'
				});
	}
	if (this.bmargin) {
		this.svg.rect(this.bmargin, 0, 0, this.width, this.bottomMarginHeight,
				0, 0, {
					'fill' : 'none'
				});
		this.svg.line(this.bmargin, 0, 0, this.width, 0, {
			'stroke' : 'black',
			'stroke-width' : '0.25'
		});
	}

	// this.testBox = this.svg.rect(this.chart, 0, 0, 100, 100, 0, 0, {
	// 'fill' : 'black'
	// });
	// this.testBox.setAttribute('transform', 'scale(1 0.25)');

	// "sliding window" containers; TODO parameterize the size of these?
	// this.gs = new Array();
	// this.gptr = this.leftMarginWidth + this.width;
	// this.gs.push(this.svg.group(this.id + 'win1', {
	// 'transform' : 'translate(' + this.gptr + ' ' + this.topMarginHeight
	// + ')'
	// }));
	// this.gs.push(this.svg.group(this.id + 'win0', {
	// 'transform' : 'translate(' + this.leftMarginWidth + ' '
	// + this.topMarginHeight + ')'
	// }));
	//
	// this.gindex = 1;

}

RRDGraph.prototype.addData = function(points) {
	/*
	 * expected format for p: [timestamp, y1, y2, ..., yn]
	 */

	this.data.push(points);
	// drop early points if there are too many
	if (this.data.length > this.pointCount)
		this.data.shift();

	// TODO find a way to do this without cycling through the whole array
	for ( var i = 0; i < this.data.length; i++) {
		for ( var j = 1; j < this.data[i].length; j++) {
			this.ymin = (this.data[i][j] < this.ymin) ? this.data[i][j]
					: this.ymin;
			this.ymax = (this.data[i][j] > this.ymax) ? this.data[i][j]
					: this.ymax;
		}
	}
}

RRDGraph.prototype.draw = function() {
	// draw the entire graph "from scratch"

	// first, we'll remove all of the lines we've already drawn
	while (this.chartLines.length > 0)
		this.svg.remove(this.chartLines.pop());

	// calculate our x-scale and y-scale
	// TODO add a buffer at the top and bottom?
	var xScale = this.width
			/ (this.data[this.data.length - 1][0] - this.data[0][0]);
	var yScale = this.height / (this.ymax - this.ymin);

	// and we draw it
	for ( var i = 1; i < this.data.length; i++) {
		// FIXME assuming the x axis has regular intervals; need to fix this
		var x1 = (this.data[i - 1][0] - this.data[0][0]) * xScale;
		var x2 = (this.data[i][0] - this.data[0][0]) * xScale;
		for ( var j = 1; j < this.data[i].length; j++) {
			var y1 = this.height - ((this.data[i - 1][j] - this.ymin) * yScale);
			var y2 = this.height - ((this.data[i][j] - this.ymin) * yScale);
			var line = this.svg.line(this.chart, x1, y1, x2, y2, {
				'stroke-width' : '1px',
				'stroke' : this.colors[j - 1]
			});
			this.chartLines.push(line);
		}
	}

	// draw the legend, x and y tick lines
	this.drawLegend();
	this.drawXTicks();
	this.drawYTicks();
}

RRDGraph.prototype.drawLegend = function() {
	// clear the old legend
	this.svg.remove(this.legend);
	this.legend = this.svg.group(this.bmargin);

	// TODO 40 cannot be our "magic number"...
	var spacing = (this.width - 40) / (this.names.length - 1);
	for ( var i = 0; i < this.names.length; i++) {
		var x = i * spacing;
		this.svg.rect(this.legend, x, (this.bottomMarginHeight - 10), 8, 8, {
			'fill' : this.colors[i]
		});
		this.svg.text(this.legend, x + 10, this.bottomMarginHeight - 2,
				this.names[i], {
					'font-family' : 'Helvetica',
					'font-size' : '10pt'
				});
	}
}

RRDGraph.prototype.drawXTicks = function() {
	// clear the old x ticks
	this.svg.remove(this.xTicks);
	this.xTicks = this.svg.group(this.bmargin);

	var d1=new Date(this.data[0][0] * 1000);
	var d2=new Date(this.data[this.data.length-1][0] * 1000);
	
	var m = d1.getMinutes();
	m = (m > 9) ? m : "0" + m;
	var t1 = d1.getHours() + ":" + m;
	m = d2.getMinutes();
	m = (m > 9) ? m : "0" + m;
	var t2 = d2.getHours() + ":" + m;

	this.svg.text(this.xTicks, 0, 5, t1, {
		'font-family' : 'Helvetica',
		'font-size' : '10pt',
		'dominant-baseline' : 'hanging'
	});
	
	this.svg.text(this.xTicks, this.width, 5, t2, {
		'font-family' : 'Helvetica',
		'font-size' : '10pt',
		'text-anchor' : 'end',
		'dominant-baseline' : 'hanging'
		
	});
}

RRDGraph.prototype.drawYTicks = function() {
	// clear the old y ticks
	this.svg.remove(this.yTicks);
	this.yTicks = this.svg.group(this.lmargin);

	var x = this.leftMarginWidth - 5;
	// TODO allow for more than 4 ticks
	for ( var i = 0; i < 4; i++) {
		var y = this.height - ((this.height / 3) * parseFloat(i));
		var text = ""
				+ (((parseFloat(this.ymax) - parseFloat(this.ymin)) / 3)
						* parseFloat(i) + parseFloat(this.ymin)).toFixed(2);
		this.svg.text(this.yTicks, x, y, text, {
			'font-family' : 'Helvetica',
			'font-size' : '10pt',
			'text-anchor' : 'end',
			'dominant-baseline' : 'central'
		});
	}
}
