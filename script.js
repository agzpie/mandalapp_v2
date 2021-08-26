let colorChoice = 'yellow';
let strokeWidth = 1;

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

	// Main axis
	let canvasSize = new Size(view.viewSize);
	let pathX = new Path();
	let start = new Point(100, 200);
	pathX.moveTo(start);
	pathX.lineTo(start + [ 100, 100 ]);

	let paths = new Group();
	let axisX = new Path([0, (canvasSize.height)/2], [canvasSize.width, (canvasSize.height)/2]);
	let axisY = new Path([canvasSize.width/2, 0], [canvasSize.width/2, canvasSize.height]);

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

	// Toolstack
	class ToolStack {
		constructor(tools) {
		  this.tools = tools.map(tool => tool())
		}
	
		activateTool(name) {
		  const tool = this.tools.find(tool => tool.name === name)
		  tool.activate()
		}
		// add more methods here as you see fit ...
	}

	const toolBrush = () => {
		const tool = new paper.Tool()
		tool.name = 'toolBrush'
		let path

		tool.onMouseDown = function(event) {
			path = new paper.Path()
			path.strokeColor = colorChoice
			path.strokeWidth = strokeWidth
			path.add(event.point)
		}
		tool.onMouseDrag = function(event) {
			path.add(event.point)
		}
		tool.onMouseUp = function(event) {
			path.simplify(10)
			clonePaths(path)
		}
		return tool
	}
	
	// Tool cloud, draws clouds 
	const toolCloud = () => {
		const tool = new paper.Tool()
		tool.name = 'toolCloud'
		let path

		tool.minDistance = 20
		tool.onMouseDown = function(event) {
			path = new paper.Path()
			path.strokeColor = colorChoice
			path.strokeWidth = strokeWidth
			path.add(event.point)
		}
		tool.onMouseDrag = function(event) {
		  path.arcTo(event.point)
		}
		tool.onMouseUp = function(event) {
			clonePaths(path)
		}
	
		return tool
	}
	
	// Tool line draws lines, surprisingly
	const toolLine = () => {
		const tool = new paper.Tool()
		tool.name = 'toolLine'
		let path

		tool.minDistance = 10
		tool.onMouseDown = function(event) {
			path = new paper.Path()
			path.strokeColor = colorChoice
			path.strokeWidth = strokeWidth
			path.add(event.point)
		}
		tool.onMouseUp = function(event) {
			path.add(event.point)
			clonePaths(path)
		}
	
		return tool
	}

	// Tool Circle, draws a 60px circle on mousedown TODO FIX RADIUS CHANGING
	const toolCircle = () => {
		const tool = new paper.Tool()
		tool.name = 'toolCircle'
		let pathR, path
		
		tool.onMouseDown = function(event) {
			pathR = new paper.Path.Circle({
			center: event.point,
			})
		}
		//tool.onMouseDrag = function(event) {
		//	radius = event.delta.length / 2
		//}
		tool.onMouseUp = function(event) {
			path = new Path.Circle(event.middlePoint, 30)
			path.fillColor = colorChoice
			clonePaths(path)
		}
		return tool
	}

	// TODO doesn't work at all
	const backgroundColor = () => {
		const tool = new paper.Tool()
		tool.name = 'backgroundColor'
		let backgroundRect = new Path.Rectangle(0, 0, canvasSize.width, canvasSize.height)
		
		tool.onClick = function(event) {
			backgroundRect.fillColor = colorChoice
			backgroundRect.sendToBack()
		}

		return tool
	}
	
	// Construct a Toolstack, passing your Tools
	const toolStack = new ToolStack([toolBrush, toolCloud, toolLine, toolCircle, backgroundColor])
	
	// Activate a certain Tool
	toolStack.activateTool('toolBrush')
	
	// Attach click handlers for Tool activation on all
	// DOM buttons with class '.tool-button'
	document.querySelectorAll('.tool-button').forEach(toolBtn => {
		toolBtn.addEventListener('click', e => {
		  toolStack.activateTool(e.target.getAttribute('data-tool-name'))
		})
	})

	function onResize(event) {
		// Whenever the window is resized, recenter the path:
		//axisX.position = view.center;
		//axisY.position = view.center;
		//Project.position = view.center;
		//path.position = view.center;
	// canvasSize = view.viewSize;
	}

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

		paths.addChild(path);
		paths.addChild(path2);
		paths.addChild(path3);
		paths.addChild(path4);
	}

	paper.view.draw();
}())

function changeStroke(size)
	{
		switch(size)
		{
		case 5:
			strokeWidth = 5;
			break;

		case 10:
			strokeWidth = 10;
			break;

		case 20:
			strokeWidth = 20;
			break;

		case 30:
			strokeWidth = 30;
			break;

		case 40:
			strokeWidth = 40;
			break;

		default:
			strokeWidth = 5;
			break;
		}
	}