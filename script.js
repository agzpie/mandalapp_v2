const { Path, Point, Size } = require("paperjs-v0.12.15/dist/paper-core");

	// Create a Paper.js Path to draw a line into it:
	var path = new Path();
	// Give the stroke a color
	path.strokeColor = 'black';
	var start = new Point(100, 100);
	// Move to start and draw a line from there
	path.moveTo(start);
	// Note the plus operator on Point objects.
	// PaperScript does that for us, and much more!
	path.lineTo(start + [ 100, -50 ]);
    console.log("what");
    
    let size = new Size();

    let axis = new Path();
    axis.strokeColor = "He3e6e8";
    let start1 = new Point(size.width/2, 0);

    axis.moveTo(start1);
    axis.lineTo(size.width/2, size.height);
    axis.moveTo(0, size.height/2);
    axis.lineTo(size.width, size.height/2);
