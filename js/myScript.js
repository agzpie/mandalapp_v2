/*
var brushTool = new Tool();
var lineTool = new Tool();
var circleTool = new Tool();

var currentTool = "brush";

var brushIcon = new Path.Circle({
	center: new Point(20, 20),
	radius: 10,
	fillColor: 'black'
});

var lineIcon = new Path.Circle({
	center: new Point(50, 20),
	radius: 10,
	fillColor: 'red'
});

brushIcon.onClick = function(event) {
        currentTool = "brush";
        this.fillColor = "grey";
        Draw(currentTool);
        
}

function Draw(currentTool) {
    if (currentTool == "brush") {
        var myPath = new Path();
        //myPath.strokeColor = 'black';
    
        function onMouseDown(event) {
            myPath = new Path();
            myPath.strokeColor = 'red';
    
            myPath.add(event.point);
        }
    
        function onMouseUp(event) {
            myPath.add(event.point);
        }
    } else {
        var myPath = new Path();
    
        function onMouseDown(event) {
            myPath = new Path();
            myPath.strokeColor = 'red';
    
            myPath.add(event.point);
        }
    
        function onMouseUp(event) {
            myPath.add(event.point);
        }
    }
}




lineIcon.onClick = function(event) {
    currentTool = "line";
}

//paper.install(window); 

/*
function onResize(event) {
	// Whenever the window is resized, recenter the path:
	path.position = view.center;
    //myPath.position = view.center;

    //TODO center all the paths
}


var myPath = new Path();
//myPath.strokeColor = 'black';

function onMouseDown(event) {
    myPath = new Path();
    myPath.strokeColor = 'black';

    myPath.add(event.point);
}

function onMouseUp(event) {
    myPath.add(event.point);
}

function SetupCanvas() {

}

function ChangeTool(toolClicked) {
    document.getElementById("open").className = "";
    document.getElementById("save").className = "";
    document.getElementById("brush").className = "";
    document.getElementById("line").className = "";
    document.getElementById("rectangle").className = "";
    document.getElementById("circle").className = "";
    document.getElementById("ellipse").className = "";
    document.getElementById("polygon").className = "";
    // Highlight the last selected tool on toolbar
    document.getElementById(toolClicked).className = "selected";
    // Change current tool used for drawing
    currentTool = toolClicked;
}

//var eventListener = document.getElementById("toolbar");
//eventListener.addEventListener("click", ChangeTool(toolClicked), false);


function onMouseDown(event) {
	console.log('You pressed the mouse!');
}

function onMouseDrag(event) {
	console.log('You dragged the mouse!');
}

function onMouseUp(event) {
	console.log('You released the mouse!');
}

function drawBrush() {
    // The minimum distance the mouse has to drag
    // before firing the next onMouseDrag event:
    tool.minDistance = 10;

    var path;

    function onMouseDown(event) {
        // Create a new path and select it:
        path = new Path();
        path.strokeColor = '#00000';

        // Add a segment to the path where
        // you clicked:
        path.add(event.point);
    }

    function onMouseDrag(event) {
        // Every drag event, add a segment
        // to the path at the position of the mouse:
        path.add(event.point);
    }
}
*/


/*

	paper.install(window);
	// Keep global references to both tools, so the HTML
	// links below can access them.
	var tool1, tool2, reset;
    var currentTool = "brush";

    var brushIcon = new Path.Circle({
        center: new Point(20, 20),
        radius: 20,
        fillColor: 'black'
    });
    
    var lineIcon = new Path.Circle({
        center: new Point(70, 20),
        radius: 20,
        fillColor: 'red'
    });
    

	window.onload = function() {
	  paper.setup('myCanvas');

	  // Create two drawing tools.
	  // tool1 will draw straight lines,
	  // tool2 will draw clouds.

	  // Both share the mouseDown event:
	  var path;

      brushIcon.onClick = function(event) {
        this.fillColor = "grey"; 
        currentTool = "brush"; 
      }

      lineIcon.onClick = function(event) {
          this.fillColor = "grey";
          currentTool = "line";

          changeTool(currentTool);
      }

	  function onMouseDown(event) {
	    path = new Path();
	    path.strokeColor = 'rebeccaPurple';
      path.strokeWidth = 3;
	    path.add(event.point);
	  }

      function changeTool(currentTool) {
        if (currentTool == "line") {
            tool1 = new Tool();
            tool1.onMouseDown = onMouseDown;
      
            tool1.onMouseDrag = function(event) {
              path.add(event.point);
            }
      
        }
      }


	  tool2 = new Tool();
	  tool2.minDistance = 20;
	  tool2.onMouseDown = onMouseDown;

	  tool2.onMouseDrag = function(event) {
	    // Use the arcTo command to draw cloudy lines
	    path.arcTo(event.point);
	  }
	}
    paper.view.draw();

function drawShape() {
// strokeStyle
    var myPath = new Path();
    myPath.strokeColor = 'black';

    if(currentTool === 'brush') {
        drawBrush();
    }
}

*/

// TODO 
// paths flip transform
// paths' position relative to the axis' center
// fix cloning after resizing

var canvasSize = new Size(view.viewSize);
var simplePath = 'true';
var paths = new Group();
var axisX = new Path([0, (canvasSize.height)/2], [canvasSize.width, (canvasSize.height)/2]);
var axisY = new Path([canvasSize.width/2, 0], [canvasSize.width/2, canvasSize.height]);
// TODO fix axisOn
var axisOn = 'false';

view.on('resize', function() {
    groupAxis.fitBounds(this.bounds);
    paths.position = view.center;
    view.update();
});
console.log(canvasSize);

var groupAxis = new Group({
    children: [axisX, axisY],
    strokeColor: 'blue'
});

function showAxis(axisOn) {
    if (axisOn) {
        groupAxis.visible = 'true'
    } else {
        groupAxis.visible = 'false'
    }
}

function onMouseDown(event) {
    path = new Path();
    path.strokeColor = 'black';
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

    var distX = canvasSize.width - path.position.x;
    var distY = canvasSize.height - path.position.y;

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

//showAxis(axisOn);

window.app = {

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

    // TODO fix line cloning
    lineTool: new Tool({
        minDistance: 10,
        onMouseDown: onMouseDown,
        onMouseUp: function(event) {
            path.add(event.point);
        },
        onMouseUp: function(event) {
            clonePaths(path);
            paths.addChild(path); 
        }
    })
};