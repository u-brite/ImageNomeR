function zip(a, b) {
	return a.map((e,i) => [e, b[i]]);
}

function strokeLine(ctx, p0, p1) {
	ctx.strokeStyle = '#000';
	ctx.beginPath();
	ctx.moveTo(p0.x, p0.y);
	ctx.lineTo(p1.x, p1.y);
	ctx.stroke();
}

class Bar {
	constructor(params) {
		this.label = params.label;
		this.pos = params.pos;
		this.dim = params.dim;
		this.color = params.color ?? '#204e8a';
		this.hoverColor = params.hoverColor ?? '#630094';
		this.display = params.display ?? true;
	}

	contains(p) {
		return p.x > this.pos.x && p.x < this.pos.x+this.dim.w &&
			p.y > this.pos.y && p.y < this.pos.y+this.dim.h;
	}

	draw(ctx, n) {
		n = n ?? 0;
		ctx.fillStyle = (this.hovering) ? this.hoverColor : this.color;
		ctx.fillRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
		if (this.hovering || this.display) {
			const y = (n%2 == 0) ? this.pos.y-12 : this.pos.y+this.dim.h+12;
			ctx.fillStyle = '#000';
			ctx.font = 'normal 12px Sans-serif';
			ctx.fillText(this.label, this.pos.x, y);
		}
	}
}

class Box {
	constructor(params) {
		this.label = params.label;
		this.outerPos = params.outerPos;
		this.innerPos = params.innerPos;
		this.outerDim = params.outerDim; 
		this.innerDim = params.innerDim;
		this.median = params.median;
		this.outliers = params.outliers;
		this.color = params.color ?? '#204e8a';
		this.hoverColor = params.hoverColor ?? '#630094';
		this.display = params.display ?? true;
	}
	
	contains(p) {
		return p.x > this.innerPos.x && p.x < this.innerPos.x+this.innerDim.w &&
			p.y > this.innerPos.y && p.y < this.innerPos.y+this.innerDim.h;
	}
	
	draw(ctx, n) {
		ctx.fillStyle = (this.hovering) ? this.hoverColor : this.color;
		ctx.fillRect(this.innerPos.x, this.innerPos.y, this.innerDim.w, this.innerDim.h);
		strokeLine(ctx, this.outerPos, {x: this.outerPos.x+this.outerDim.w, y: this.outerPos.y});
		strokeLine(
			ctx,
			{x: this.outerPos.x, y: this.outerPos.y+this.outerDim.h}, 
			{x: this.outerPos.x+this.outerDim.w, y: this.outerPos.y+this.outerDim.h}
		);
		strokeLine(
			ctx,
			{x: this.outerPos.x+0.5*this.outerDim.w, y: this.outerPos.y},
			{x: this.outerPos.x+0.5*this.outerDim.w, y: this.outerPos.y+this.outerDim.h}
		);
		if (this.hovering || this.display) {
			const y = (n%2 == 0) ? this.innerPos.y-12 : this.innerPos.y+this.innerDim.h+12;
			ctx.fillStyle = '#000';
			ctx.font = 'normal 12px Sans-serif';
			ctx.fillText(this.label, this.innerPos.x, y);
		}
	}
}

class BarGraph {
	constructor(params) {
		this.dim = params.dim;
		this.runs = [];
		this.view = [0,20];
		this.sorted = true;
		this.abs = true;
		this.composite = [];
	}

	set displayLabels(display) {
		this.display = display;
		if (this.bars) this.bars.forEach(bar => bar.display = display);
	}

	mousemove(p) {
		this.mouseout();
		this.bars.forEach(bar => {
			if (bar.contains(p)) bar.hovering = true;	
		});
	}

	mouseout() {
		this.bars.forEach(bar => bar.hovering = false);
	}

	recalc() {
		this.composite = new Array(this.runs[0].Weights.length).fill(0);
		this.runs.forEach(run => {
			for (let i=0; i<this.composite.length; i++) {
				this.composite[i] += run.Weights[i];
			}
		});
		if (this.abs) {
			this.composite = this.composite.map(a => Math.abs(a));
		}
		const old = this.composite;
		this.composite = zip(this.composite, this.runs[0].Labels);
		if (this.sorted) {
			this.composite.sort((a,b) => b[0]-a[0]);
		}
		this.min = Math.min(...old);
		this.max = Math.max(...old);
		this.bars = [];
		// Make bars
		const n = this.view[1]-this.view[0];
		console.assert(n > 0 && n < 1e5);
		const dx = (this.dim.w-50)/n
		const bx = 0.6*dx;
		const uh = this.dim.h-50;
		const zy = this.max/(this.max+Math.abs(this.min))*uh+25;
		const dy = uh/(this.max-this.min);
		for (let i=0, j=this.view[0], x=0; i<n; i++, j++, x+=dx) {
			const y = zy-dy*this.composite[j][0];
			this.bars.push(new Bar({
				label: this.composite[j][1],
				pos: {x: i*dx+25, y: y},
				dim: {w: bx, h: Math.abs(y-zy)},
				display: this.display
			}));
		}
		this.zy = zy;
	}

	repaint(ctx) {
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, this.dim.w, this.dim.h);
		strokeLine(ctx, {x: 0, y: this.zy}, {x: this.dim.w, y: this.zy});
		let count = 0;
		this.bars.forEach(bar => bar.draw(ctx, count++));
	}
}

class BoxPlot {
	constructor(barGraph) {
		this.barGraph = barGraph;
		this.boxes = [];
	}

	get dim() {
		return this.barGraph.dim;
	}

	set dim(dim) {
		this.barGraph.dim = dim;
	}

	set displayLabels(display) {
		this.display = display;
		this.boxes.forEach(box => box.display = display);
	}
	
	mousemove(p) {
		this.mouseout();
		this.boxes.forEach(bar => {
			if (bar.contains(p)) bar.hovering = true;	
		});
	}

	mouseout() {
		this.boxes.forEach(bar => bar.hovering = false);
	}

	recalc() {
		this.stats = new Array(this.runs[0].Weights.length);
		const m = this.runs.length;
		for (let i=0; i<this.stats.length; i++) {
			const dist = this.runs.map(run => run.Weights[i]);
			dist.sort((a,b) => a-b);
			// minimum, maximum, median, 1st quartile, 3rd quartile, outliers
			const stats = [
				dist[0], 
				dist.at(-1), 
				(m%2 == 0) ? (dist[m/2]+dist[m/2-1])/2 : dist[Math.floor(m/2)], 
				dist[Math.floor(m/4)],
				dist[Math.floor(3*m/4)]
			];
			stats.push(dist.filter(val => (val-stats[2])>1.5*(val-stats[3]) || (val-stats[2])>1.5*(val-stats[4])));
			this.stats[i] = stats;
		}
		this.stats = zip(this.stats, this.runs[0].Labels);
		if (this.barGraph.sorted) {
			this.stats.sort((a,b) => Math.abs(b[0][2])-Math.abs(a[0][2]));
		}
		this.min = Math.min(...this.stats.filter(dist => dist[0][0]).map(a => a[0][0]));
		this.max = Math.max(...this.stats.filter(dist => dist[0][1]).map(a => a[0][1]));
		this.boxes = [];
		this.dim = this.barGraph.dim;
		// Make boxes
		const n = this.view[1]-this.view[0];
		console.assert(n > 0 && n < 1e5);
		const dx = (this.dim.w-50)/n
		const bx = 0.6*dx;
		const uh = this.dim.h-50;
		const zy = this.max/(this.max+Math.abs(this.min))*uh+25;
		const dy = uh/(this.max-this.min);
		for (let i=0, j=this.view[0], x=0; i<n; i++, j++, x+=dx) {
			const y0 = zy-dy*this.stats[j][0][0]; // min
			const y1 = zy-dy*this.stats[j][0][1]; // max
			const y2 = zy-dy*this.stats[j][0][2]; // median
			const y3 = zy-dy*this.stats[j][0][3]; // 1st quart
			const y4 = zy-dy*this.stats[j][0][4]; // 3rd quart
			const x = i*dx+25;
			this.boxes.push(new Box({
				label: this.stats[j][1],
				outerPos: {x: x+0.25*bx, y: y1},
				innerPos: {x: x, y: y4},
				outerDim: {w: 0.5*bx, h: y0-y1},
				innerDim: {w: bx, h: y3-y4},
				median: {x: x, y: y2},
				outliers: this.stats[j][0][5].map(val => ({x: x+0.5*bx, y: zy-dy*val})),
				display: this.display
			}));
		}
		this.zy = zy;
	}

	get runs() {
		return this.barGraph.runs;
	}

	set runs(runs) {
		this.barGraph.runs = runs;
	}

	repaint(ctx) {
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, this.dim.w, this.dim.h);
		strokeLine(ctx, {x: 0, y: this.zy}, {x: this.dim.w, y: this.zy});
		let count = 0;
		this.boxes.forEach(box => box.draw(ctx, count++));
	}

	get view() {
		return this.barGraph.view;
	}

	set view(view) {
		this.barGraph.view = view;
	}
}
