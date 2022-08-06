function zip(a, b) {
	return a.map((e,i) => [e, b[i]]);
}

class Bar {
	constructor(params) {
		this.label = params.label;
		this.pos = params.pos;
		this.dim = params.dim;
		this.color = params.color ?? '#204e8a';
		this.hoverColor = params.hoverColor ?? '#630094';
	}

	contains(p) {
		return p.x > this.pos.x && p.x < this.pos.x+this.dim.w &&
			p.y > this.pos.y && p.y < this.pos.y+this.dim.h;
	}

	draw(ctx) {
		ctx.fillStyle = (this.hovering) ? this.hoverColor : this.color;
		ctx.fillRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
		if (this.hovering) {
			ctx.fillStyle = '#000';
			ctx.font = 'normal 12px Sans-serif';
			ctx.fillText(this.label, this.pos.x+this.dim.w, this.pos.y-12);
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
		const dy = uh/this.max;
		for (let i=0, j=this.view[0], x=0; i<n; i++, j++, x+=dx) {
			const y = zy-dy*this.composite[j][0];
			this.bars.push(new Bar({
				label: this.composite[j][1],
				pos: {x: i*dx+25, y: Math.min(y,zy)},
				dim: {w: bx, h: Math.abs(y-zy)}
			}));
		}
	}

	repaint(ctx) {
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, this.dim.w, this.dim.h);
		this.bars.forEach(bar => bar.draw(ctx));
	}
}
