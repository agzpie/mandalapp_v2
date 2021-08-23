var colorChoice = 'black';
var drawSize = 20;

spectrumColor = $("#colorpicker").spectrum({
	showInput: true,
	showPalette: true,
	showSelectionPalette: true,
	palette: [],
	localStorageKey: "spectrum.homepage",
	clickoutFiresChange: true,
});

$(colorpicker).on('move.spectrum', function(e, tinyColor) {
	colorChoice = tinyColor.toHexString();
});

(function()
{
  	//'use strict'; JAK JEST WLACZONE TO NIE WYSZUKUJE PATH() TODO: FIX
  	paper.install(window);
  	paper.setup(document.getElementById('myCanvas'));

	var pathX = new Path();
	var start = new Point(100, 200);
	pathX.moveTo(start);
	pathX.lineTo(start + [ 100, 100 ]);

	var canvasSize = new Size(view.viewSize);
	var paths = new Group();
	var axisX = new Path([0, (canvasSize.height)/2], [canvasSize.width, (canvasSize.height)/2]);
	var axisY = new Path([canvasSize.width/2, 0], [canvasSize.width/2, canvasSize.height]);
	var strokeWidth = 1;

	view.on('resize', function() {
		groupAxis.fitBounds(this.bounds);
		paths.position = view.center;
		view.update();
	});

	var groupAxis = new Group({
		children: [axisX, axisY],
		strokeColor: 'grey',
		visible: 'true'
	});

	function onMouseDown(event) {
		path = new Path();
		path.strokeColor = colorChoice;
		path.strokeWidth = strokeWidth;
		path.add(event.point);
		view.update();
	}

	function onResize(event) {
		// Whenever the window is resized, recenter the path:
		//axisX.position = view.center;
		//axisY.position = view.center;
		//Project.position = view.center;
		//path.position = view.center;
	// canvasSize = view.viewSize;
		
	}

	function clonePaths(path) {
		var path2 = path.clone();
		var path3 = path.clone();
		var path4 = path.clone();

		var horizontalMatrix = new Matrix(-1, 0, 0, 1, 0, 0);
		var verticalMatrix = new Matrix(1, 0, 0, -1, 0, 0);

		path3.rotate(180);
		path2.transform(horizontalMatrix);
		path4.transform(verticalMatrix);
		
		path2.position.x = canvasSize.width - path.position.x;
		path3.position.x = canvasSize.width - path.position.x;
		path3.position.y = canvasSize.height - path.position.y;
		path4.position.y = canvasSize.height - path.position.y;

		paths.addChild(path2);
		paths.addChild(path3);
		paths.addChild(path4);
	}


	var center;
	var radius;

	var showAxisButton = new Path.Rectangle({
		point: [25, 105],
		size: [30, 30],
		fillColor: 'blue'
	});

	showAxisButton.onClick = function(event) {
		groupAxis.visible = !groupAxis.visible;
	}

	var strokeWidthUpButton = new Path.Circle({
		center: [40, 40],
		radius: 15,
		fillColor: 'black'
	});

	strokeWidthUpButton.onClick = function(event) {
		strokeWidth++;  
	}

	var strokeWidthDownButton = new Path.Circle({
		center: [40, 80],
		radius: 15,
		fillColor: 'black'
	});

	strokeWidthDownButton.onClick = function(event) {
		if (strokeWidth>0) {
			strokeWidth--;
		}
	}

	/*
	// SAVE CANVAS
	var downloadAsSVG = function (fileName) {
	
		if(!fileName) {
			fileName = "paperjs_example.svg"
		}
	
		var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({asString:true}));
		
		var link = document.createElement("a");
		link.download = fileName;
		link.href = url;
		link.click();
	}*/

	var saveButton = new Path.Circle({
		center: [40, 160],
		radius: 15,
		fillColor: 'green'
	});

	saveButton.onClick = function(event) {
		var svg = paper.project.exportSVG({asString: true});
		var blob = new Blob([svg], {type:     "image/svg+xml;charset=utf-8"});
		saveAs(blob, 'image.svg');
		//document.body.appendChild(project.exportSVG());
	}

	//var serializer = new paper.XMLSerializer();
	//var svg = paper.project.exportSVG();
	//var svg_string = serializer.serializeToString(svg);

	window.onload = {

		brushTool: new Tool({
			onMouseDown: onMouseDown,
			onMouseDrag: function(event) {
				path.add(event.point);
			},
			onMouseUp: function(event) {
				path.simplify(10);
				clonePaths(path);
				paths.addChild(path); 
			}
		}),

		cloudTool: new Tool({
			minDistance: 20,
			onMouseDown: onMouseDown,
			onMouseDrag: function(event) {
				// Use the arcTo command to draw cloudy lines
				path.arcTo(event.point);
			},
			onMouseUp: function(event) {
				clonePaths(path);
				paths.addChild(path); 
			}
		}),

		// TODO live line drawing? on mouse drag view update
		lineTool: new Tool({
			minDistance: 10,
			onMouseDown: onMouseDown,
			onMouseUp: function(event) {
				path.add(event.point);
				clonePaths(path);
				paths.addChild(path);
			}
		}),
		// TODO make circle work smooth like vegan butter
		circleTool: new Tool({
			onMouseDown: function(event) {
				center = event.point;
				//path = new Path.Circle();
				//path.add(event.point);
				//view.update();
			},
			onMouseDrag: function(event) {
				//radius = event.delta.length / 2;

			},
			onMouseUp: function(event) {
				var circle = new Path.Circle(event.middlePoint, radius);
				circle.fillColor = 'black';
			/* path = new Path.Circle({
					center: center,
					radius: event.point
				}),
				path.strokeColor = 'black';
				path.simplify(10);
				clonePaths(path);
				paths.addChild(path); */
			}
		}),

		colorTool: new Tool({
			onMouseDown: function(event) {
				var path1 = new Path.Circle({
					center: event.point,
					radius: 25,
					fillColor: 'black'
				});
			}
		}),

		brushSizeTool: new Tool({
			onClick: function(event) {
				path.strokeWidth = 22;
			}
			//strokeWidth: 5,
		})
	};

	paper.view.draw();
}())

