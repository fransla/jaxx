(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes
lib.webFontTxtFilters = {}; 

// library properties:
lib.properties = {
	width: 400,
	height: 661,
	fps: 60,
	color: "#202732",
	webfonts: {},
	manifest: [
		{src:"images/shapeshiftlogo_2_360.png", id:"shapeshiftlogo_2_360"}
	]
};



lib.webfontAvailable = function(family) { 
	lib.properties.webfonts[family] = true;
	var txtFilters = lib.webFontTxtFilters && lib.webFontTxtFilters[family] || [];
	for(var f = 0; f < txtFilters.length; ++f) {
		txtFilters[f].updateCache();
	}
};
// symbols:



(lib.shapeshiftlogo_2_360 = function() {
	this.initialize(img.shapeshiftlogo_2_360);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,186,277);


(lib.Symbol7 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.shapeshiftlogo_2_360();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,186,277);


(lib.Symbol2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FA7333").s().p("AltFvQiZiZAAjWQAAjVCZiYQCZiaDUABQDWgBCZCaQCZCYgBDVIAAIAIjmAAIAAoGQgCh3hVhUQhWhUh1AAIgDAAQh5gBhWBWQhWBWAAB4IAAACQAAB4BWBWQBWBWB5AAIADAAQBRAABBgoIAAD3QhIAUhJAAQjUAAiZiYg");
	this.shape.setTransform(120.5,71.9);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FA7333").s().p("AkCHzQC4gOBIiFQAihEAAhNIAAumIDiAAIAAOmQADE0kECJQiABEiDAIg");
	this.shape_1.setTransform(25.9,72.8);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FA7333").s().p("AAADLIj0FAIi7iQIEblyIkqmDIC7iQIEDFUIEElUIC7CQIkqGDIEbFyIi7CQg");
	this.shape_2.setTransform(329.8,72.1);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FA7333").s().p("AAADLIj1FAIi6iQIEclyIkrmDIC6iQIEEFUIEElUIC7CQIkqGDIEbFyIi7CQg");
	this.shape_3.setTransform(230.8,72.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,374.6,145.6);


(lib.Cubesvg = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#3C4B5E").ss(2,0,0,4).p("ABUxOIP7P7QAjAjAAAwQAAAygjAjIv7P6QgjAjgxAAQgwAAgjgjIv7v6QgjgjAAgyQAAgwAjgjIP7v7QAjgjAwAAQAxAAAjAjg");
	this.shape.setTransform(114.8,114.8);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,229.7,229.6);


(lib.bridgy = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.mainParent = this.parent;
		
		this.setScale = function(scale) {
			console.log("parent :: " + parent + " :: scale :: " + scale);
			this.mainParent.anim.scaleX = scale;
			this.mainParent.anim.scaleY = scale;
		}
		
		this.setOffset = function(x, y) {
			console.log("parent :: " + parent + " :: x :: " + x + " :: y :: " + y);
			this.mainParent.anim.x = x;
			this.mainParent.anim.y = y;
		}
		
		this.fadeIn = function() {
			this.mainParent.anim.alpha = 1.0;
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#548E87").s().p("Ai9C+IAAl7IF7AAIAAF7g");
	this.shape.setTransform(19.1,19.1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,38.1,38.1);


(lib.Symbol6 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("Ag8CnQghgPgYgXQgXgZgNghQgOghAAgmQAAglANgiQANggAYgZQAXgYAggNQAfgOAjAAQAoAAAfAOQAfANAUAXQAVAYALAeQAKAfAAAjIAAAJIAAANIkbAAQABAZAJAXQAKAWAQARQASASAWAJQAXALAYAAQAUgBAQgFQARgEAPgIQAcgTAPgXIAlAdQgQATgQAPQgSANgSAJQglARgrAAQgkAAgggNgAB2gZQgDgwgdghQgdgfg1AAQgXAAgVAJQgVAJgRAQQgQAPgJAVQgKAUgBAWIDoAAIAAAAg");
	this.shape.setTransform(825,58.3);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AgvCnQgigPgYgXQgYgZgNghQgNghAAgmQAAglANgiQANggAYgZQAXgYAjgNQAhgOAoAAQAjAAAjAPQAkAPAVAeIgmAcQgMgVgYgNQgYgMgcAAQgdAAgYAKQgYALgRASQgSAUgIAYQgJAaAAAcQAAAdAJAYQAIAZARATQASATAXAKQAZAMAcAAQAhAAAWgNQAYgNAOgTIAmAcQgXAbgfAQQgRAHgSAFQgUAEgWAAQgoAAghgNg");
	this.shape_1.setTransform(787.2,58.3);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("AhECuQgVgFgRgMQgSgNgLgUQgLgUAAgcQAAgVAFgPQAFgQAKgLQAUgWAigLQAigMAqgDIBagDIAAgLQAAgsgYgXQgLgLgRgFQgSgFgWAAQgcAAgbALQgbAKgRATIgdghQAVgVAkgOQAigOAqAAQAdAAAXAIQAZAHASAQQASAPAKAYQALAXAAAfIAACVIABApIAFAkIgtAAIgDgbIgCgdIgCAAQgMARgNANQgNANgPAHQgeAPgoAAQgTAAgVgGgAARACQgdACgZAJQgaAHgPAOQgRAPAAAYQAAATAHANQAHAMAMAHQALAIAPADIAdAEQAYAAAUgJQAWgKAOgPQAOgQAGgVQAIgUAAgXIAAgZIgPAAg");
	this.shape_2.setTransform(747.1,58.3);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AgqEZIAAkrIhHAAIAAgqIBHAAIAAheQAAg7AdgiQANgQAWgJQAVgIAeAAIAVABIAUAEIgJAsIgQgEIgSgBQgUAAgNAGQgNAHgHAMQgGAMgDARIgDAiIAABYIBRAAIAAAqIhRAAIAAErg");
	this.shape_3.setTransform(719,47.2);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FFFFFF").s().p("AhdCwIAAkLIgBgkIgCgmIAvAAIADAeIAAAbIACAAQAOgdAegTQAbgSAlAAIARAAIAQADIgHAvIgOgDIgVAAQgUgBgSAIQgRAHgNAPQgNAQgJAZQgIAYAAAhIAACwg");
	this.shape_4.setTransform(696.3,57.8);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FFFFFF").s().p("Ag8CnQghgPgYgXQgXgZgNghQgOghAAgmQAAglANgiQANggAYgZQAXgYAggNQAfgOAjAAQAoAAAfAOQAfANAUAXQAVAYALAeQAKAfAAAjIAAAJIAAANIkbAAQABAZAJAXQAKAWAQARQASASAWAJQAXALAYAAQAUgBAQgFQARgEAPgIQAcgTAPgXIAlAdQgQATgQAPQgSANgSAJQglARgrAAQgkAAgggNgAB2gZQgDgwgdghQgdgfg1AAQgXAAgVAJQgVAJgRAQQgQAPgJAVQgKAUgBAWIDoAAIAAAAg");
	this.shape_5.setTransform(659.3,58.3);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#FFFFFF").s().p("AAVDaQgQgEgLgKQgNgKgJgSQgIgRAAgdIAAjUIhHAAIAAgqIBHAAIAAhhIAwAAIAABhIBgAAIAAAqIhgAAIAADGQAAATADAMQAEANAHAHQAHAHAJACIAVADIAWgDIAVgIIACAsIgbAHIgfADg");
	this.shape_6.setTransform(626.3,53.6);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FFFFFF").s().p("ABkCwIAAi8QAAgcgFgWQgEgWgLgPQgKgQgSgJQgTgJgaAAQgTAAgSAIQgTAIgOARQgPARgJAZQgIAZgBAhIAACwIgyAAIAAkLIgBgkIgCgmIAwAAIADAeIAAAbIACAAQAOgdAhgTQARgJARgFQAQgFASABQBBAAAhAmQARAUAIAZQAHAaAAAgIAADRg");
	this.shape_7.setTransform(593.8,57.8);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#FFFFFF").s().p("AgZEDIAAoFIAzAAIAAIFg");
	this.shape_8.setTransform(563,49.4);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#FFFFFF").s().p("ABjCwIAAi8QABgcgEgWQgFgWgLgPQgKgQgSgJQgTgJgaAAQgTAAgSAIQgTAIgOARQgPARgJAZQgJAZAAAhIAACwIgxAAIAAkLIgCgkIgCgmIAwAAIADAeIAAAbIACAAQAOgdAhgTQARgJARgFQAPgFATABQBBAAAhAmQARAUAIAZQAHAaABAgIAADRg");
	this.shape_9.setTransform(513.8,57.8);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#FFFFFF").s().p("AgYD/IAAlVIAxAAIAAFVgAgXjBQgLgKAAgQQAAgPALgKQALgKAMAAQANAAALAKQALAKAAAPQAAAQgLAKQgLAKgNAAQgMAAgLgKg");
	this.shape_10.setTransform(483.3,49.9);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#FFFFFF").s().p("AhECuQgVgFgRgMQgSgNgLgUQgLgUAAgcQAAgVAFgPQAFgQAKgLQAUgWAigLQAigMApgDIBbgDIAAgLQAAgsgXgXQgNgLgQgFQgSgFgWAAQgdAAgaALQgbAKgRATIgcghQAUgVAkgOQAigOArAAQAcAAAXAIQAYAHATAQQATAPAJAYQALAXAAAfIAACVIACApIAEAkIgtAAIgDgbIgCgdIgCAAQgLARgNANQgOANgPAHQgdAPgoAAQgUAAgVgGgAARACQgdACgZAJQgaAHgPAOQgRAPAAAYQAAATAHANQAHAMAMAHQALAIAPADIAdAEQAZAAATgJQAWgKANgPQAPgQAGgVQAIgUAAgXIAAgZIgOAAg");
	this.shape_11.setTransform(453.9,58.3);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#FFFFFF").s().p("ABjEVIAAi+QAAgbgGgXQgEgVgKgQQgLgOgSgJQgSgIgbAAQgSAAgTAHQgSAJgPAPQgOAQgJAZQgJAZAAAjIAACwIgyAAIAAopIAyAAIAAEMIABAAQAPgeAfgSQAhgRAjAAQBBAAAhAnQAPATAJAXQAIAaAAAgIAADTg");
	this.shape_12.setTransform(413.9,47.7);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#FFFFFF").s().p("AgvCnQgigPgYgXQgYgZgNghQgNghAAgmQAAglANgiQANggAYgZQAYgYAigNQAhgOAoAAQAjAAAjAPQAkAPAVAeIgmAcQgMgVgYgNQgYgMgcAAQgdAAgYAKQgYALgRASQgSAUgIAYQgJAaAAAcQAAAdAJAYQAIAZARATQASATAYAKQAYAMAcAAQAhAAAWgNQAYgNAOgTIAmAcQgXAbgfAQQgRAHgSAFQgUAEgWAAQgoAAghgNg");
	this.shape_13.setTransform(375.4,58.3);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#FFFFFF").s().p("ABMEVIiti1IgCAAIAAC1IgxAAIAAopIAxAAIAAFsIACAAICdiYIBIAAIirCaIC9C7g");
	this.shape_14.setTransform(340,47.7);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#FFFFFF").s().p("AgvCnQgigPgYgXQgYgZgNghQgNghAAgmQAAglANgiQANggAYgZQAXgYAjgNQAhgOAoAAQAiAAAkAPQAkAPAVAeIgnAcQgMgVgYgNQgYgMgbAAQgcAAgZAKQgXALgSASQgSAUgIAYQgKAaABAcQgBAdAKAYQAIAZASATQAQATAYAKQAZAMAcAAQAhAAAWgNQAXgNAPgTIAmAcQgWAbggAQQgRAHgSAFQgUAEgWAAQgoAAghgNg");
	this.shape_15.setTransform(301.4,58.3);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#FFFFFF").s().p("AhICnQgigPgYgXQgZgZgNghQgOghAAgmQAAglAOgiQANggAZgZQAYgYAigNQAhgOAnAAQAnAAAiAOQAiANAYAYQAYAZAOAgQAOAiAAAlQAAAmgOAhQgOAhgYAZQgYAXgiAPQgiANgnAAQgnAAghgNgAg1h+QgYALgRASQgRATgJAZQgJAaAAAbQAAAcAJAZQAJAZARATQARATAYAKQAYAMAdAAQAdAAAYgMQAZgKAQgTQARgTAKgZQAJgZAAgcQAAgbgJgaQgKgZgRgTQgQgSgZgLQgYgLgdAAQgdAAgYALg");
	this.shape_16.setTransform(259.2,58.3);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#FFFFFF").s().p("AgXEVIAAopIAvAAIAAIpg");
	this.shape_17.setTransform(227.6,47.7);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#FFFFFF").s().p("AisEDIAAoFICbAAQAbAAAfAGQAdAGAYAPQAYAPAPAaQAPAaAAAnQAAAUgHASQgFASgNAPQgMAPgRAKQgRAKgVAFIAAACQAyAFAiAgQAQAQAJAXQAIAXAAAdQAAAggOAaQgNAbgZATQgZATgkAKQgkAKgqAAgAh3DWIBiAAQAaAAAbgGQAagFATgMQATgMAMgUQAMgTAAgcQAAgZgIgTQgJgTgSgNQgigZg+AAIhsAAgAh3gfIBqAAQARAAAUgEQATgFARgKQAQgLAJgRQAKgSAAgaQAAgZgKgRQgJgRgRgLQgRgLgXgFQgVgFgZAAIhcAAg");
	this.shape_18.setTransform(196,49.4);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#FFFFFF").s().p("AhdCwIAAkLIgBgkIgCgmIAvAAIADAeIAAAbIACAAQAOgdAegTQAbgSAlAAIARAAIAQADIgHAvIgOgDIgVAAQgUgBgSAIQgRAHgNAPQgNAQgJAZQgIAYAAAhIAACwg");
	this.shape_19.setTransform(143,57.8);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#FFFFFF").s().p("AhLCmQgYgKgRgUQghgmABhBIAAjPIAxAAIAAC7QAAAcAFAVQAFAXAKAPQAKAQATAIQASAKAbgBQARABATgJQATgHAPgRQAOgQAJgaQAIgaAAghIAAiuIAzAAIAAEJIABAjIABApIgvAAIgCggIgBgbIgCAAQgGAPgNAMQgMAMgQAKQghASgjABQgggBgZgJg");
	this.shape_20.setTransform(105.7,58.7);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#FFFFFF").s().p("AhICnQgigPgYgXQgZgZgNghQgOghAAgmQAAglAOgiQANggAZgZQAYgYAigNQAhgOAnAAQAnAAAiAOQAiANAYAYQAYAZAOAgQAOAiAAAlQAAAmgOAhQgOAhgYAZQgYAXgiAPQgiANgnAAQgnAAghgNgAg1h+QgYALgRASQgRATgJAZQgJAaAAAbQAAAcAJAZQAJAZARATQARATAYAKQAYAMAdAAQAdAAAYgMQAZgKAQgTQARgTAKgZQAJgZAAgcQAAgbgJgaQgKgZgRgTQgQgSgZgLQgYgLgdAAQgdAAgYALg");
	this.shape_21.setTransform(62,58.3);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#FFFFFF").s().p("AgZEDIAAjgIjCklIBCAAICaD7ICej7IA9AAIjCElIAADgg");
	this.shape_22.setTransform(24.1,49.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_22},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,848.2,104.3);


(lib.Cube1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.Cubesvg("synched",0);
	this.instance.setTransform(113.9,113.8,1,1,0,0,0,114.8,114.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,229.7,229.6);


(lib.Anim = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
		
		this.maybe = function(woot) {
			console.log("wooting :: " + woot);
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(60));

	// Layer 5
	this.instance = new lib.Symbol2();
	this.instance.setTransform(801.4,1245.9,1.852,1.852,0,0,0,187.3,72.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(60));

	// Layer 11
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AgvCvQgWgKgPgQQgPgPgIgWQgJgVAAgZQAAgZAJgWQAIgUAPgQQAPgPAWgJQAVgJAaAAQALAAALACIAYAJQAXALAOAWIABAAIAAixIAhAAIAAFpIghAAIAAgmIgBAAQgOAVgXAMQgXALgXAAQgaAAgVgJgAgggQQgQAIgLAKQgLAMgFARQgGAQAAATQAAASAGARQAFAQALANQALAMAQAHQAQAHASAAQASAAAQgHQAQgHAMgMQALgMAHgQQAGgRAAgTQAAgUgGgQQgHgRgLgMQgMgKgQgHQgQgHgSAAQgSAAgQAHg");
	this.shape.setTransform(1004.1,2471.8);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("Ag9BzIAAiuIAAgXIgBgaIAfAAIABAUIABASIABAAQAJgTATgMQASgNAYAAIALABIAKACIgEAfIgKgCIgNgBQgNAAgMAFQgLAFgIAKQgJAKgFAQQgGAQAAAVIAABzg");
	this.shape_1.setTransform(983.8,2478.1);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("AgsByQgNgEgMgIQgLgIgIgNQgHgNAAgTQAAgNAEgKQADgLAGgHQANgNAXgIQAVgHAbgCIA7gDIAAgHQAAgdgPgOQgIgHgLgEQgLgDgPAAQgSAAgRAHQgSAHgLAMIgSgWQANgNAXgJQAXgKAbAAQASAAAPAFQARAFAMALQALAKAIAPQAGAPAAAVIAABgIABAbIADAYIgdAAIgDgSIgBgTIgBAAQgHALgJAJQgJAIgKAFQgTAKgaAAQgMAAgOgEgAALABQgTACgQAFQgQAFgLAJQgLAKAAAQQABAMAEAIQAEAIAIAFQAIAFAKADIASACQAQAAANgGQANgGAKgLQAJgKAEgOQAFgNAAgPIAAgQIgJAAg");
	this.shape_2.setTransform(960,2478.4);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AgvBtQgWgJgQgQQgQgQgIgWQgJgVAAgZQAAgYAJgWQAIgVAQgQQAQgQAWgJQAWgJAZAAQAZAAAXAJQAWAJAPAQQAQAQAJAVQAJAWAAAYQAAAZgJAVQgJAWgQAQQgPAQgWAJQgXAJgZAAQgZAAgWgJgAgihSQgQAHgLAMQgLANgGAQQgGARAAARQAAASAGARQAGAQALAMQALANAQAHQAQAHASAAQATAAAQgHQAQgHALgNQALgMAGgQQAGgRAAgSQAAgRgGgRQgGgQgLgNQgLgMgQgHQgQgHgTAAQgSAAgQAHg");
	this.shape_3.setTransform(933,2478.4);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FFFFFF").s().p("AgsCtQgYgMgOgVIgBAAIAAAmIghAAIAAlpIAhAAIAACxIABAAQAOgWAYgLIAWgJQAMgCAKAAQAbAAAVAJQAWAJAPAPQAPAQAIAUQAJAWAAAZQAAAZgJAVQgIAWgPAPQgPAQgWAKQgVAJgbAAQgWAAgWgLgAgjgQQgQAHgLAKQgMAMgGARQgHAQAAAUQAAATAHARQAGAQAMAMQALAMAQAHQAPAHAUAAQARAAARgHQAPgHALgMQALgNAFgQQAGgRAAgSQAAgTgGgQQgFgRgLgMQgLgKgPgIQgRgHgRAAQgUAAgPAHg");
	this.shape_4.setTransform(904,2471.8);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FFFFFF").s().p("ABBBzIAAh6QAAgSgDgPQgDgOgHgKQgGgLgMgGQgNgFgRAAQgLAAgMAFQgNAFgJALQgKALgFARQgGAQAAAVIAABzIghAAIAAiuIgBgXIgBgaIAgAAIABAUIABASIABAAQAJgTAVgMQALgHAMgDQAJgDAMAAQArAAAWAaQAKANAFAQQAGARAAAVIAACIg");
	this.shape_5.setTransform(873.9,2478.1);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#FFFFFF").s().p("AgjCvQgSgEgQgGQgQgHgOgKQgOgIgMgNQgMgMgJgOQgJgOgHgQQgNggAAgnQAAgSACgRQAEgTAHgQQAHgRAJgOQAJgOAMgLQAYgYAggOQAQgGASgEQASgDARAAQATAAARADQARAEAQAGQAiAOAXAYQAYAXANAhQAHAQAEATQACARABASQgBATgCASQgEASgHAQQgGAQgKAOQgJAOgMAMQgMANgOAIQgOAKgRAHQgQAGgRAEQgRADgTAAQgRAAgSgDgAg5iGQgbALgRAVQgTAUgJAcQgKAkAAASQADAnAHARQAJAbATAUQARAVAbALQAaAMAfAAQAgAAAagMQAagLATgVQASgUAKgbQAJgaAAgeQAAgcgJgaQgKgcgSgUQgTgVgagLQgagNggAAQgfAAgaANg");
	this.shape_6.setTransform(839.6,2472.7);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FFFFFF").s().p("AANCOQgKgCgHgHQgIgHgGgLQgFgLAAgTIAAiLIgvAAIAAgbIAvAAIAAg/IAeAAIAAA/IBAAAIAAAbIhAAAIAACCQAAANADAHQACAJAFAEQAEAEAHACIANACIAOgCIAOgFIACAdIgSAEIgVACg");
	this.shape_7.setTransform(799.3,2475.4);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#FFFFFF").s().p("AgbC4IAAjEIguAAIAAgbIAuAAIAAg9QAAgnATgWQAIgLAOgFQAOgGATAAIAOABIANACIgFAdIgLgCIgMgBQgNAAgIAEQgIAFgFAIQgFAHgBALIgCAXIAAA5IA1AAIAAAbIg1AAIAADEg");
	this.shape_8.setTransform(786.5,2471.2);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#FFFFFF").s().p("AgPCnIAAjfIAfAAIAADfgAgPh+QgGgGAAgLQAAgKAGgGQAIgHAHABQAIgBAHAHQAIAGAAAKQAAALgIAGQgHAHgIAAQgHAAgIgHg");
	this.shape_9.setTransform(772.4,2473);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#FFFFFF").s().p("ABAC1IAAh8QAAgSgDgOQgDgPgHgKQgGgIgMgHQgMgFgSAAQgLAAgMAFQgMAFgKAKQgJAKgGARQgGAQAAAWIAAB0IghAAIAAlpIAhAAIAACvIABAAQAJgUAVgLQAVgLAWAAQArAAAWAZQAKANAFAPQAGAQAAAVIAACKg");
	this.shape_10.setTransform(752.6,2471.5);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#FFFFFF").s().p("AgfCvQgPgDgOgGQgOgHgMgJQgMgKgJgMIAdgWQALASAUAMQAUAMAbAAQALAAAOgEQANgEALgIQALgJAHgMQAHgMAAgRQAAgRgHgMQgHgMgMgHQgLgJgPgFIgdgLIgigJQgQgHgNgLQgNgLgIgPQgIgQAAgYQAAgYAKgRQAKgTAQgLQAQgMATgEQATgGARAAQAjAAAYAMQAYANANAQIgbAWQgLgPgSgKQgRgIgZgBQgKAAgNAEQgNAEgLAIQgKAHgHANQgGAMAAAQQAAAQAGALQAGAKALAIQAKAHANAFIAaAKIAjAMQASAFAPALQAOAKAJARQAJARAAAZQAAAagJASQgKASgQAMQgPANgUAFQgUAGgSAAQgPAAgQgDg");
	this.shape_11.setTransform(724.7,2472.7);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#FFFFFF").s().p("AgnBtQgVgJgQgQQgPgQgJgWQgJgVAAgZQAAgYAJgWQAIgVAQgQQAPgQAVgJQAVgJAVAAQAbAAAUAJQAUAJAOAPQANAPAHAVQAHAUAAAXIAAAFIAAAIIi5AAQABARAGAPQAGAPALALQALALAPAGQAPAHAPAAQANAAALgDQALgDAJgGQATgMAJgPIAZATQgKANgLAJQgMAJgMAFQgYAMgcAAQgXAAgVgJgABNgQQgCgfgTgVQgTgVgjAAQgOAAgOAGQgOAGgKAKQgLAKgGANQgGAOgBAOICXAAIAAAAg");
	this.shape_12.setTransform(697.7,2478.4);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#FFFFFF").s().p("Ah0CsIAAlSIAhAAIAAAnIABAAQAOgWAXgLIAYgJQAMgCAKAAQAaAAAWAJQAVAJAPAPQAPAQAJAWQAIAWAAAZQAAAZgIAVQgJAUgPAPQgPAQgVAKQgWAJgaAAQgKAAgMgDIgYgIQgXgMgOgVIgBAAIAACZgAgjiJQgQAHgMAMQgLAMgHARQgGAQAAAUQAAATAGARQAHAQALAKQAMAMAQAHQAQAHASAAQATAAAPgHQAQgHALgMQALgLAGgQQAFgRABgSQgBgTgFgQQgGgRgLgMQgLgMgQgIQgPgHgTAAQgSAAgQAHg");
	this.shape_13.setTransform(669.6,2483.9);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#FFFFFF").s().p("AgsByQgNgEgMgIQgLgIgIgNQgHgNAAgTQAAgNADgKQADgLAHgHQANgNAWgIQAXgHAagCIA7gDIAAgHQAAgdgPgOQgIgHgLgEQgLgDgPAAQgSAAgRAHQgRAHgNAMIgSgWQAOgNAXgJQAXgKAbAAQASAAAQAFQAQAFAMALQALAKAIAPQAGAPAAAVIAABgIABAbIADAYIgdAAIgDgSIgBgTIgBAAQgHALgJAJQgJAIgKAFQgTAKgaAAQgNAAgNgEgAALABQgSACgRAFQgQAFgLAJQgLAKAAAQQAAAMAFAIQAFAIAHAFQAIAFAJADIATACQAPAAAOgGQANgGAJgLQAKgKAFgOQAEgNAAgPIAAgQIgJAAg");
	this.shape_14.setTransform(640.2,2478.4);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#FFFFFF").s().p("ABAC1IAAh8QAAgSgDgOQgDgPgHgKQgGgIgMgHQgMgFgSAAQgLAAgMAFQgMAFgKAKQgJAKgGARQgGAQAAAWIAAB0IghAAIAAlpIAhAAIAACvIABAAQAJgUAVgLQAVgLAWAAQArAAAWAZQAKANAFAPQAGAQAAAVIAACKg");
	this.shape_15.setTransform(614.1,2471.5);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#FFFFFF").s().p("AgfCvQgPgDgOgGQgOgHgMgJQgMgKgJgMIAdgWQALASAUAMQAUAMAbAAQALAAAOgEQANgEALgIQALgJAHgMQAHgMAAgRQAAgRgHgMQgHgMgMgHQgLgJgPgFIgdgLIgigJQgQgHgNgLQgNgLgIgPQgIgQAAgYQAAgYAKgRQAKgTAQgLQAQgMATgEQATgGARAAQAjAAAYAMQAYANANAQIgbAWQgLgPgSgKQgRgIgZgBQgKAAgNAEQgNAEgLAIQgKAHgHANQgGAMAAAQQAAAQAGALQAGAKALAIQAKAHANAFIAaAKIAjAMQASAFAPALQAOAKAJARQAJARAAAZQAAAagJASQgKASgQAMQgPANgUAFQgUAGgSAAQgPAAgQgDg");
	this.shape_16.setTransform(586.2,2472.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(60));

	// Layer 10
	this.instance_1 = new lib.Symbol7();
	this.instance_1.setTransform(827.9,2342.3,0.514,0.514,0,0,0,93,138.5);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#FFFFFF").s().p("AhGCnQgbgRgQgeIAigQQAKAXAUANQAJAHALADQALADAMAAQAQAAAQgGQAPgGAMgLQALgMAHgQQAGgQAAgTQAAgTgHgQQgHgQgMgMQgMgJgRgGQgQgGgRAAQgUAAgSAFQgUAFgRAIIADi5IC3AAIAAAhIiVAAIgCBwIAYgHIAZgBQAXAAAWAIQAVAIARAPQAPAPAJATQAJAVgBAZQABAagJAWQgJAWgPARQgQAQgXAJQgWAJgYAAQgnAAgbgSg");
	this.shape_17.setTransform(880.8,1596.6);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#FFFFFF").s().p("AgSASQgIgHAAgLQAAgJAIgJQAHgIALAAQAMAAAHAIQAIAJAAAJQAAALgIAHQgHAJgMAAQgLAAgHgJg");
	this.shape_18.setTransform(860,1611.8);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#FFFFFF").s().p("AAZC0IAAk6Ig/A4IgXgZIBahNIAhAAIAAFog");
	this.shape_19.setTransform(835.8,1596.1);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#FFFFFF").s().p("AgSASQgIgHAAgLQAAgJAIgJQAHgIALAAQALAAAIAIQAIAJAAAJQAAALgIAHQgIAJgLAAQgLAAgHgJg");
	this.shape_20.setTransform(817.1,1611.8);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#FFFFFF").s().p("AAZC0IAAk6Ig/A4IgXgZIBahNIAhAAIAAFog");
	this.shape_21.setTransform(792.9,1596.1);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#FFFFFF").s().p("AgSC0IiKloIAoAAIB0E5IAAAAIB2k5IAnAAIiKFog");
	this.shape_22.setTransform(753.1,1596.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_22},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.instance_1}]}).wait(60));

	// Layer 4
	this.instance_2 = new lib.Symbol6();
	this.instance_2.setTransform(616.6,1490.5,1,1,0,0,0,227.6,52.1);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(60));

	// roundedRects
	this.instance_3 = new lib.Cube1();
	this.instance_3.setTransform(2831.3,-1002.1,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_4 = new lib.Cube1();
	this.instance_4.setTransform(2176.1,-994.5,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_5 = new lib.Cube1();
	this.instance_5.setTransform(2500,-665.6,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_6 = new lib.Cube1();
	this.instance_6.setTransform(2831.3,-336.8,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_7 = new lib.Cube1();
	this.instance_7.setTransform(2821.1,309,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_8 = new lib.Cube1();
	this.instance_8.setTransform(2500,-11.5,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_9 = new lib.Cube1();
	this.instance_9.setTransform(2177.5,-336.8,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_10 = new lib.Cube1();
	this.instance_10.setTransform(1846.6,-663.7,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_11 = new lib.Cube1();
	this.instance_11.setTransform(1531.1,-998.3,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_12 = new lib.Cube1();
	this.instance_12.setTransform(896.2,-1002.1,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_13 = new lib.Cube1();
	this.instance_13.setTransform(1211.9,-665.6,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_14 = new lib.Cube1();
	this.instance_14.setTransform(233.6,-1010.7,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_15 = new lib.Cube1();
	this.instance_15.setTransform(564.2,-681.9,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_16 = new lib.Cube1();
	this.instance_16.setTransform(-92.8,-681.6,2.454,2.454,0,0,0,113.8,113.9);

	this.instance_17 = new lib.Cube1();
	this.instance_17.setTransform(-429.5,-1005,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_18 = new lib.Cube1();
	this.instance_18.setTransform(-1085.2,-1023.4,2.454,2.454,0,0,0,113.8,113.9);

	this.instance_19 = new lib.Cube1();
	this.instance_19.setTransform(-1417.4,-688.9,2.454,2.454,0,0,0,113.8,113.9);

	this.instance_20 = new lib.Cube1();
	this.instance_20.setTransform(-1417.4,-31,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_21 = new lib.Cube1();
	this.instance_21.setTransform(-1417.4,618.7,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_22 = new lib.Cube1();
	this.instance_22.setTransform(-1417.4,1258.6,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_23 = new lib.Cube1();
	this.instance_23.setTransform(-1417.2,1914.7,2.454,2.454,0,0,0,113.9,113.9);

	this.instance_24 = new lib.Cube1();
	this.instance_24.setTransform(-1087.4,3552.3,2.454,2.454,0,0,0,113.9,113.9);

	this.instance_25 = new lib.Cube1();
	this.instance_25.setTransform(-1417.2,3223.5,2.454,2.454,0,0,0,113.9,113.9);

	this.instance_26 = new lib.Cube1();
	this.instance_26.setTransform(-758.7,3223.5,2.454,2.454,0,0,0,113.8,113.9);

	this.instance_27 = new lib.Cube1();
	this.instance_27.setTransform(-1092.4,2894.5,2.454,2.454,0,0,0,113.8,113.9);

	this.instance_28 = new lib.Cube1();
	this.instance_28.setTransform(-1417.2,2567.7,2.454,2.454,0,0,0,113.9,113.9);

	this.instance_29 = new lib.Cube1();
	this.instance_29.setTransform(-100.7,3223.5,2.454,2.454,0,0,0,113.9,113.9);

	this.instance_30 = new lib.Cube1();
	this.instance_30.setTransform(-427.2,2894.5,2.454,2.454,0,0,0,113.9,113.9);

	this.instance_31 = new lib.Cube1();
	this.instance_31.setTransform(552.3,3202.8,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_32 = new lib.Cube1();
	this.instance_32.setTransform(223.2,2881.6,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_33 = new lib.Cube1();
	this.instance_33.setTransform(1533,3543.3,2.454,2.454,0,0,0,113.8,113.9);

	this.instance_34 = new lib.Cube1();
	this.instance_34.setTransform(1204.1,3214.4,2.454,2.454,0,0,0,113.8,113.9);

	this.instance_35 = new lib.Cube1();
	this.instance_35.setTransform(2194.5,3543.1,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_36 = new lib.Cube1();
	this.instance_36.setTransform(1865.6,3214.1,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_37 = new lib.Cube1();
	this.instance_37.setTransform(1533,2881.6,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_38 = new lib.Cube1();
	this.instance_38.setTransform(2508.5,3202.8,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_39 = new lib.Cube1();
	this.instance_39.setTransform(3154.5,2557.6,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_40 = new lib.Cube1();
	this.instance_40.setTransform(2831.6,2881.6,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_41 = new lib.Cube1();
	this.instance_41.setTransform(3164.2,1914.4,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_42 = new lib.Cube1();
	this.instance_42.setTransform(2831.6,2240.6,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_43 = new lib.Cube1();
	this.instance_43.setTransform(2508.5,2560,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_44 = new lib.Cube1();
	this.instance_44.setTransform(2185.5,2881.6,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_45 = new lib.Cube1();
	this.instance_45.setTransform(3164.2,1269.1,2.454,2.454,0,0,0,113.9,113.9);

	this.instance_46 = new lib.Cube1();
	this.instance_46.setTransform(2831.6,1595.6,2.454,2.454,0,0,0,113.9,113.9);

	this.instance_47 = new lib.Cube1();
	this.instance_47.setTransform(2508.5,1917.2,2.454,2.454,0,0,0,113.9,113.9);

	this.instance_48 = new lib.Cube1();
	this.instance_48.setTransform(2185.5,2240.6,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_49 = new lib.Cube1();
	this.instance_49.setTransform(2821.3,947.7,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_50 = new lib.Cube1();
	this.instance_50.setTransform(2500,1269.1,2.454,2.454,0,0,0,113.8,113.9);

	this.instance_51 = new lib.Cube1();
	this.instance_51.setTransform(2176.4,1588.4,2.454,2.454,0,0,0,113.9,113.9);

	this.instance_52 = new lib.Cube1();
	this.instance_52.setTransform(-763.5,-674.1,2.454,2.454,0,0,0,113.9,113.9);

	this.instance_53 = new lib.Cube1();
	this.instance_53.setTransform(-1087.7,-352.5,2.454,2.454,0,0,0,113.8,113.9);

	this.instance_54 = new lib.Cube1();
	this.instance_54.setTransform(-1090.1,2241.1,2.454,2.454,0,0,0,113.9,113.9);

	this.instance_55 = new lib.Cube1();
	this.instance_55.setTransform(-753.7,2567.7,2.454,2.454,0,0,0,113.9,113.9);

	this.instance_56 = new lib.Cube1();
	this.instance_56.setTransform(1854.8,2560,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_57 = new lib.Cube1();
	this.instance_57.setTransform(873.5,2881.8,2.454,2.454,0,0,0,113.8,113.9);

	this.instance_58 = new lib.Cube1();
	this.instance_58.setTransform(1854.8,1914.7,2.454,2.454,0,0,0,113.9,113.9);

	this.instance_59 = new lib.Cube1();
	this.instance_59.setTransform(1528.3,2240.6,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_60 = new lib.Cube1();
	this.instance_60.setTransform(1204.1,2560,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_61 = new lib.Cube1();
	this.instance_61.setTransform(544.6,2560,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_62 = new lib.Cube1();
	this.instance_62.setTransform(876,2240.6,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_63 = new lib.Cube1();
	this.instance_63.setTransform(2500,623.9,2.454,2.454,0,0,0,113.8,113.9);

	this.instance_64 = new lib.Cube1();
	this.instance_64.setTransform(2176.1,947.7,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_65 = new lib.Cube1();
	this.instance_65.setTransform(1854.8,1270.3,2.454,2.454,0,0,0,113.9,113.9);

	this.instance_66 = new lib.Cube1();
	this.instance_66.setTransform(1533,1588.1,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_67 = new lib.Cube1();
	this.instance_67.setTransform(1204.1,1914.7,2.454,2.454,0,0,0,113.8,113.9);

	this.instance_68 = new lib.Cube1();
	this.instance_68.setTransform(879.2,1591.6,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_69 = new lib.Cube1();
	this.instance_69.setTransform(552.3,1914.7,2.454,2.454,0,0,0,113.9,113.9);

	this.instance_70 = new lib.Cube1();
	this.instance_70.setTransform(223.2,2231.3,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_71 = new lib.Cube1();
	this.instance_71.setTransform(-100.7,2557.6,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_72 = new lib.Cube1();
	this.instance_72.setTransform(-1090,1585.7,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_73 = new lib.Cube1();
	this.instance_73.setTransform(-758.7,1917.2,2.454,2.454,0,0,0,113.8,113.9);

	this.instance_74 = new lib.Cube1();
	this.instance_74.setTransform(-427.2,2241.1,2.454,2.454,0,0,0,113.9,113.9);

	this.instance_75 = new lib.Cube1();
	this.instance_75.setTransform(-100.7,1914.7,2.454,2.454,0,0,0,113.9,113.9);

	this.instance_76 = new lib.Cube1();
	this.instance_76.setTransform(223.2,1595.4,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_77 = new lib.Cube1();
	this.instance_77.setTransform(552.3,1270.3,2.454,2.454,0,0,0,113.9,113.9);

	this.instance_78 = new lib.Cube1();
	this.instance_78.setTransform(1204.1,1270.3,2.454,2.454,0,0,0,113.8,113.9);

	this.instance_79 = new lib.Cube1();
	this.instance_79.setTransform(2176.1,309,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_80 = new lib.Cube1();
	this.instance_80.setTransform(1854.8,631.1,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_81 = new lib.Cube1();
	this.instance_81.setTransform(1528.3,947.7,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_82 = new lib.Cube1();
	this.instance_82.setTransform(1528.3,-333,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_83 = new lib.Cube1();
	this.instance_83.setTransform(1854.8,-6.5,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_84 = new lib.Cube1();
	this.instance_84.setTransform(885,-333,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_85 = new lib.Cube1();
	this.instance_85.setTransform(1528.3,309,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_86 = new lib.Cube1();
	this.instance_86.setTransform(1204.1,-6.5,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_87 = new lib.Cube1();
	this.instance_87.setTransform(1204.1,631.1,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_88 = new lib.Cube1();
	this.instance_88.setTransform(885,947.7,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_89 = new lib.Cube1();
	this.instance_89.setTransform(-1085.2,942.9,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_90 = new lib.Cube1();
	this.instance_90.setTransform(-429.8,1597.9,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_91 = new lib.Cube1();
	this.instance_91.setTransform(-758.7,1272.7,2.454,2.454,0,0,0,113.8,113.9);

	this.instance_92 = new lib.Cube1();
	this.instance_92.setTransform(-105.7,1272.7,2.454,2.454,0,0,0,113.8,113.9);

	this.instance_93 = new lib.Cube1();
	this.instance_93.setTransform(223.2,947.7,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_94 = new lib.Cube1();
	this.instance_94.setTransform(552.3,631.1,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_95 = new lib.Cube1();
	this.instance_95.setTransform(873.5,309,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_96 = new lib.Cube1();
	this.instance_96.setTransform(232.5,-348.2,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_97 = new lib.Cube1();
	this.instance_97.setTransform(552.3,-11.5,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_98 = new lib.Cube1();
	this.instance_98.setTransform(-429.8,950.2,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_99 = new lib.Cube1();
	this.instance_99.setTransform(-100.7,631.1,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_100 = new lib.Cube1();
	this.instance_100.setTransform(223.2,309,2.454,2.454,0,0,0,113.9,113.8);

	this.instance_101 = new lib.Cube1();
	this.instance_101.setTransform(-761.2,619,2.454,2.454,0,0,0,113.8,113.9);

	this.instance_102 = new lib.Cube1();
	this.instance_102.setTransform(-1092.4,288.1,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_103 = new lib.Cube1();
	this.instance_103.setTransform(-102.3,-27.2,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_104 = new lib.Cube1();
	this.instance_104.setTransform(-426.1,-358.8,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_105 = new lib.Cube1();
	this.instance_105.setTransform(-429.8,301.5,2.454,2.454,0,0,0,113.8,113.8);

	this.instance_106 = new lib.Cube1();
	this.instance_106.setTransform(-758.7,-31,2.454,2.454,0,0,0,113.8,113.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_106},{t:this.instance_105},{t:this.instance_104},{t:this.instance_103},{t:this.instance_102},{t:this.instance_101},{t:this.instance_100},{t:this.instance_99},{t:this.instance_98},{t:this.instance_97},{t:this.instance_96},{t:this.instance_95},{t:this.instance_94},{t:this.instance_93},{t:this.instance_92},{t:this.instance_91},{t:this.instance_90},{t:this.instance_89},{t:this.instance_88},{t:this.instance_87},{t:this.instance_86},{t:this.instance_85},{t:this.instance_84},{t:this.instance_83},{t:this.instance_82},{t:this.instance_81},{t:this.instance_80},{t:this.instance_79},{t:this.instance_78},{t:this.instance_77},{t:this.instance_76},{t:this.instance_75},{t:this.instance_74},{t:this.instance_73},{t:this.instance_72},{t:this.instance_71},{t:this.instance_70},{t:this.instance_69},{t:this.instance_68},{t:this.instance_67},{t:this.instance_66},{t:this.instance_65},{t:this.instance_64},{t:this.instance_63},{t:this.instance_62},{t:this.instance_61},{t:this.instance_60},{t:this.instance_59},{t:this.instance_58},{t:this.instance_57},{t:this.instance_56},{t:this.instance_55},{t:this.instance_54},{t:this.instance_53},{t:this.instance_52},{t:this.instance_51},{t:this.instance_50},{t:this.instance_49},{t:this.instance_48},{t:this.instance_47},{t:this.instance_46},{t:this.instance_45},{t:this.instance_44},{t:this.instance_43},{t:this.instance_42},{t:this.instance_41},{t:this.instance_40},{t:this.instance_39},{t:this.instance_38},{t:this.instance_37},{t:this.instance_36},{t:this.instance_35},{t:this.instance_34},{t:this.instance_33},{t:this.instance_32},{t:this.instance_31},{t:this.instance_30},{t:this.instance_29},{t:this.instance_28},{t:this.instance_27},{t:this.instance_26},{t:this.instance_25},{t:this.instance_24},{t:this.instance_23},{t:this.instance_22},{t:this.instance_21},{t:this.instance_20},{t:this.instance_19},{t:this.instance_18},{t:this.instance_17},{t:this.instance_16},{t:this.instance_15},{t:this.instance_14},{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3}]}).wait(60));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1699.1,-1305.3,5144.9,5139.2);


// stage content:
(lib.introScene = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		var hasInit = false;
		var self = this;
		
		function init() {
			console.log("init :: " + self);
			console.log("anim :: " + self.anim);
		
			self.anim.alpha = 0;
			//self.anim.scaleX = 2;
			//self.anim.scaleY = 2;
			//self.anim.cacheAsBitmap = true;
			//window.maybeAfter();
		}
		
		init();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// bridge
	this.bridgy = new lib.bridgy();
	this.bridgy.setTransform(199.5,333.1,10.499,17.35,0,0,0,19,19.2);
	this.bridgy.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.bridgy).wait(1));

	// animation
	this.anim = new lib.Anim();
	this.anim.setTransform(0,0,0.25,0.25);

	this.timeline.addTween(cjs.Tween.get(this.anim).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-224.8,4.2,1286.2,1284.8);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, createjs, ss;