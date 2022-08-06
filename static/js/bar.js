function zip(a, b) {
	return a.map((e,i) => [e, b[i]]);
}

function strokeLine(ctx, p0, p1, color) {
	ctx.strokeStyle = color ?? '#000';
	ctx.beginPath();
	ctx.moveTo(p0.x, p0.y);
	ctx.lineTo(p1.x, p1.y);
	ctx.stroke();
}

class Bar {
	constructor(params) {
		this.label = params.label;
		this.graph = params.graph;
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
		ctx.fillStyle = (this.hovering || this.selected) ? this.hoverColor : this.color;
		ctx.fillRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
		if (this.hovering || this.selected || this.display) {
			const y = (n%2 == 0) ? this.pos.y-12 : this.pos.y+this.dim.h+12;
			ctx.fillStyle = '#000';
			ctx.font = 'normal 8px Sans-serif';
			const label = this.graph.displayMeta.checked && this.graph.meta ? this.metaLabel : this.label;
			const labelWidth = ctx.measureText(label).width;
			ctx.fillText(label, this.pos.x-labelWidth/2+this.dim.w/2, y);
		}
	}

	get metaLabel() {
		let [a,b] = this.label.split('-')
		a = this.graph.meta.CommunityNames[this.graph.meta.CommunityMap[parseInt(a)]]
		b = this.graph.meta.CommunityNames[this.graph.meta.CommunityMap[parseInt(b)]]
		return `${a}-${b}`
	}
}

class Box {
	constructor(params) {
		this.label = params.label;
		this.graph = params.graph;
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
		ctx.fillStyle = (this.hovering || this.selected) ? this.hoverColor : this.color;
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
		if (this.hovering || this.selected || this.display) {
			const y = (n%2 == 0) ? this.innerPos.y-12 : this.innerPos.y+this.innerDim.h+12;
			ctx.fillStyle = '#000';
			ctx.font = 'normal 8px Sans-serif';
			const label = this.graph.displayMeta.checked && this.graph.meta ? this.metaLabel : this.label;
			const labelWidth = ctx.measureText(label).width;
			ctx.fillText(label, this.innerPos.x-labelWidth/2+this.innerDim.w/2, y);
		}
	}
	
	get metaLabel() {
		let [a,b] = this.label.split('-')
		a = this.graph.meta.CommunityNames[this.graph.meta.CommunityMap[parseInt(a)]]
		b = this.graph.meta.CommunityNames[this.graph.meta.CommunityMap[parseInt(b)]]
		return `${a}-${b}`
	}
}

class BarGraphSimple {
	constructor(params) {
		this.dim = params.dim;
		this.data = params.data;
		this.labels = params.labels ?? null;
		this.baseline = params.baseline ?? null;
		this.meta = params.meta ?? null;
	}

	draw(ctx) {
		const min = Math.min(...this.data);
		const max = Math.max(...this.data);
		const dataCopy = [...this.data];
		// Display 6 largest ROIs
		dataCopy.sort((a,b) => b-a);
		const bigLim = dataCopy[6];
		// Make bars
		const n = this.data.length;
		const dx = (this.dim.w-50)/n
		const bx = 0.8*dx;
		const uh = this.dim.h-50;
		const zy = max/(max-min)*uh+25;
		const dy = uh/(max-min);
		strokeLine(ctx, {x: 20, y: zy}, {x: this.dim.w-20, y: zy});
		for (let i=0; i<n; i++) {
			const y = zy-dy*this.data[i];
			ctx.fillStyle = '#204e8a';
			ctx.fillRect(i*dx+25, y, bx, zy-y);
			if (this.baseline) {
				const sumData = this.data.reduce((prev, cur) => prev+cur, 0);
				const sumBase = this.baseline.reduce((prev, cur) => prev+cur, 0);
				const by = zy-this.baseline[i]*sumData/sumBase*dy;
				ctx.lineWidth = 3;
				strokeLine(ctx, {x:i*dx+25, y: by}, {x: i*dx+25+bx, y: by}, '#f00');
				ctx.lineWidth = 1;
				const label = this.meta.CommunityNames[i];
				ctx.fillStyle = '#000';
				ctx.font = '8px Sans-serif';
				ctx.fillText(label, i*dx+25-ctx.measureText(label).width/2+bx/2, Math.min(by, y)-10);
			} else if (this.data[i] > bigLim) {
				ctx.fillStyle = '#000';
				ctx.font = '8px Sans-serif';
				ctx.fillText(i, i*dx+25+3, y+2);
			}
		}
		const ny = 6;
		const _dy = (this.dim.h-50)/ny;
		const _dyy = (max-min)/ny;
		for (let i=0; i<=ny; i++) {
			const x = 2;
			const y = 25+i*_dy;
			ctx.fillStyle = '#000';
			ctx.font = '8px Sans-serif';
			ctx.fillText((max-i*_dyy).toFixed(3), x, y);
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

	click(p) {
		this.bars.forEach(bar => {
			if (bar.contains(p)) bar.selected = !bar.selected;
		});
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
				graph: this,
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
		strokeLine(ctx, {x: 20, y: this.zy}, {x: this.dim.w-20, y: this.zy});
		let count = 0;
		this.bars.forEach(bar => bar.draw(ctx, count++));
		const ny = 6;
		const dy = (this.dim.h-50)/ny;
		const dyy = (this.max-this.min)/ny;
		for (let i=0; i<=ny+.1; i++) {
			const x = 2;
			const y = 25+i*dy;
			ctx.fillStyle = '#000';
			ctx.font = '8px Sans-serif';
			ctx.fillText((this.max-i*dyy).toFixed(3), x, y);
		}
	}
}

class BoxPlot {
	constructor(barGraph) {
		this.barGraph = barGraph;
		this.boxes = [];
	}
	
	click(p) {
		this.boxes.forEach(box => {
			if (box.contains(p)) box.selected = !box.selected;
		});
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
				graph: this,
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
		strokeLine(ctx, {x: 20, y: this.zy}, {x: this.dim.w-20, y: this.zy});
		let count = 0;
		this.boxes.forEach(box => box.draw(ctx, count++));
		const ny = 6;
		const dy = (this.dim.h-50)/ny;
		const dyy = (this.max-this.min)/ny;
		for (let i=0; i<=ny+.1; i++) {
			const x = 2;
			const y = 25+i*dy;
			ctx.fillStyle = '#000';
			ctx.font = '8px Sans-serif';
			ctx.fillText((this.max-i*dyy).toFixed(3), x, y);
		}
	}

	get view() {
		return this.barGraph.view;
	}

	set view(view) {
		this.barGraph.view = view;
	}
}
