let colorChoice = 'yellow';
let strokeWidth = 1;
let backgroundColor = '#edeff2';

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

$('tool-button').on('click', function(){
    $('tool-button').removeClass('selected');
    $(this).addClass('selected');
});


(function()
{
  	//'use strict'; JAK JEST WLACZONE TO NIE WYSZUKUJE PATH() TODO: FIX
  	paper.install(window);
  	paper.setup(document.getElementById('myCanvas'));

	// Main axis
	let canvasSize = new Size(view.viewSize);

	let backgroundRect = new Path.Rectangle(0, 0, canvasSize.width, canvasSize.height);
	//backgroundRect.fillColor = backgroundColor;
	backgroundRect.sendToBack;

	let pathX = new Path();
	let start = new Point(100, 200);
	pathX.moveTo(start);
	pathX.lineTo(start + [ 100, 100 ]);

	let paths = new Group();
	let axisX = new Path([0, (canvasSize.height)/2], [canvasSize.width, (canvasSize.height)/2]);
	let axisY = new Path([canvasSize.width/2, 0], [canvasSize.width/2, canvasSize.height]);
	let axisX2 = new Path([0, 0], [canvasSize.width, canvasSize.height]);
	let axisY2 = new Path([0, canvasSize.height], [canvasSize.width, 0]);

	axisX.strokeColor = 'grey';
	axisY.strokeColor = 'grey';
	axisX2.strokeColor = '#d9d9d9';
	axisY2.strokeColor = '#d9d9d9';
	

	view.on('resize', function() {
		groupAxis.fitBounds(this.bounds);
		paths.position = view.center;
		view.update();
	});

	var groupAxis = new Group({
		children: [axisX2, axisY2, axisX, axisY],
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
		tool.onMouseUp = function(event) {
			path = new Path.Circle(event.middlePoint, event.delta.length / 2)
			path.fillColor = colorChoice
			clonePaths(path)
		}
		return tool
	}

	// TOOL AXIS displays the main axis
	const showAxis = () => {
		const tool = new paper.Tool()
		tool.name = 'showAxis'
		
		tool.onMouseMove = function(event) {
			groupAxis.visible = true
		}

			groupAxis.visible = false
	
		return tool
	}

	// TOOL AXIS displays the main axis
	const hideAxis = () => {
		const tool = new paper.Tool()
		tool.name = 'hideAxis'
		
		tool.onMouseMove = function(event) {
			groupAxis.visible = false
		}
		
		return tool
	}


	// TOOL UNDO NIE DZIAŁA
	const undo = () => {
		const tool = new paper.Tool()
		tool.name = 'undo'
			paths.visible = false
		
		
		return tool
	}
	
	// Construct a Toolstack, passing your Tools
	const toolStack = new ToolStack([toolBrush, toolCloud, toolLine, toolCircle, showAxis, hideAxis, undo])
	
	// Activate a certain Tool
	toolStack.activateTool('toolBrush')
	
	// Attach click handlers for Tool activation on all
	// DOM buttons with class '.tool-button'
	document.querySelectorAll('.tool-button').forEach(toolBtn => {
		toolBtn.addEventListener('click', e => {
		  toolStack.activateTool(e.target.getAttribute('data-tool-name'))
		})
	})	

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

		paths.addChildren(path, path2, path3, path4);
	}

	function clearProject() {
		paths.removeChildren();
	}


	paper.view.draw();
}())

function changeStroke(size)
	{
		switch(size)
		{
		case 2:
			strokeWidth = 2;
			break;

		case 5:
			strokeWidth = 5;
			break;

		case 10:
			strokeWidth = 10;
			break;

		case 15:
			strokeWidth = 15;
			break;

		case 20:
			strokeWidth = 20;
			break;

		default:
			strokeWidth = 2;
			break;
		}
	}

function prjClear() {
	//project.clear();
	//paper.view.draw();
	project.clearProject();
	
}

function finClear() {
	document.getElementById('imgLocation').innerHTML = "";
}

function createPNG() {
	finClear();

	let canvas = document.getElementById('myCanvas');
	let img = new Image();
	img.src = canvas.toDataURL();
	document.getElementById('imgLocation').innerHTML =
	"<a href='"+img.src+"' download><img src='"+img.src+"'></a>";
}