function getCursorPosition(canvas, e) {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    return {x: x, y: y};
}

let barGraph = null;
let boxPlot = null;

window.addEventListener('load', e => {
	const hId = document.querySelector('.h-id');
	const id = hId.id;
	const runCheckboxes = document.querySelectorAll('#runs-list input[type=checkbox]');
	const canvas = document.querySelector('#mainCanvas');
	const ctx = canvas.getContext('2d');
	const barBoxButton = document.querySelector('#barBoxButton');
	const displayLabels = document.querySelector('#displayLabels');
	const displayMeta = document.querySelector('#displayMeta');
	const fromRange = document.querySelector('#fromRange');
	const toRange = document.querySelector('#toRange');
	const rangeSpan = document.querySelector('#rangeSpan');
	const bfnCanvas = document.querySelector('#bfnCanvas');
	const bfnsRadio = document.querySelector('#bfnsRadio');
	const roisRadio = document.querySelector('#roisRadio');
	const metaNotLoadedSpan = document.querySelector('#metaNotLoadedSpan');
	const bfnMetaNotLoadedSpan= document.querySelector('#bfnMetaNotLoadedSpan');

	barGraph = new BarGraph({
		dim: {w: canvas.width, h: canvas.height}
	});
	boxPlot = new BoxPlot(barGraph);
		
	barGraph.displayLabels = displayLabels.checked;
	barGraph.displayMeta = displayMeta;
	boxPlot.displayLabels = displayLabels.checked;
	boxPlot.displayMeta = displayMeta;

	function dataLoadCb(run) {
		barGraph.runs.push(run);
		barGraph.recalc();
		boxPlot.recalc();
		barGraph.repaint(ctx);
		runCheckboxes.forEach(box => {
			if (box.id == `run${run.runid}`) {
				box.parentNode.querySelector('.loading').innerText = 'Complete!';
			}
		});
		plotBfn();
	}

	function metadataLoadCb(meta) {
		if (meta) {
			barGraph.meta = meta;
			boxPlot.meta = meta;
			metaNotLoadedSpan.innerText = '';
			bfnMetaNotLoadedSpan.innerText = '';
		}
	}

	runCheckboxes.forEach(box => {
		const runid = parseInt(box.id.substring(3));
		// Get weights data
		fetch(`/data?id=${id}&runid=${runid}`)
		.then(resp => resp.json())
		.then(json => dataLoadCb(json))
		.catch(err => console.log(err));
	});

	// Get BFN metadata
	fetch(`/data?id=${id}&metadata`)
	.then(resp => resp.json())
	.then(json => metadataLoadCb(json))
	.catch(err => console.log(err));

	canvas.addEventListener('mousemove', e => {
		graph = barBoxButton.innerText == 'Box Plot' ? barGraph : boxPlot;
		graph.mousemove(getCursorPosition(canvas, e));
		graph.repaint(ctx);
	});

	canvas.addEventListener('mouseout', e => {
		graph = barBoxButton.innerText == 'Box Plot' ? barGraph : boxPlot;
		graph.mouseout();
		graph.repaint(ctx);
	});

	canvas.addEventListener('click', e => {
		graph = barBoxButton.innerText == 'Box Plot' ? barGraph : boxPlot;
		graph.click(getCursorPosition(canvas, e));
		graph.repaint(ctx);
	});

	barBoxButton.addEventListener('click', e => {
		e.preventDefault();
		if (barBoxButton.innerText == 'Bar Graph') {
			barBoxButton.innerText = 'Box Plot';
			barGraph.repaint(ctx);	
		} else {
			if (barGraph.runs.length < 5) {
				alert('Need at least 5 runs for box plot');
			} else {
				barBoxButton.innerText = 'Bar Graph';
				boxPlot.repaint(ctx);
			}
		}
	});

	displayLabels.addEventListener('change', e => {
		barGraph.displayLabels = displayLabels.checked;
		boxPlot.displayLabels = displayLabels.checked;
		graph = barBoxButton.innerText == 'Box Plot' ? barGraph : boxPlot;
		graph.repaint(ctx);
	});

	displayMeta.addEventListener('change', e => {
		graph = barBoxButton.innerText == 'Box Plot' ? barGraph : boxPlot;
		graph.repaint(ctx);
	});

	function rangeChange() {
		const from = fromRange.value;
		const to = toRange.value;
		rangeSpan.innerText = `${from} - ${to}`;
		plotBfn();
	}

	fromRange.addEventListener('input', e => rangeChange());
	toRange.addEventListener('input', e => rangeChange());
	roisRadio.addEventListener('change', e => plotBfn());
	bfnsRadio.addEventListener('change', e => plotBfn());

	const baselineCounts = [30,5,14,13,58,5,31,25,18,13,9,11,4,28].map(a => a/264);

	function plotBfn() {
		const from = fromRange.value;
		const to = toRange.value;
		const bins = bfnsRadio.checked && barGraph.meta ? Array(14).fill(0) : Array(264).fill(0);
		for (let i=Math.round(from); i<to; i++) {
			const val = barGraph.composite[i][0];
			const label = barGraph.composite[i][1];
			let [a,b] = label.split('-').map(a => parseInt(a));
			if (bfnsRadio.checked && barGraph.meta) {
				a = barGraph.meta.CommunityMap[a];
				b = barGraph.meta.CommunityMap[b];
			}
			bins[a] += val;
			bins[b] += val;
		}
		const ctx = bfnCanvas.getContext('2d');
		ctx.fillStyle = '#fff';
		ctx.fillRect(0,0, bfnCanvas.width, bfnCanvas.height);
		const baseline = (bfnsRadio.checked && barGraph.meta) ? baselineCounts : null;
		const meta = (bfnsRadio.checked && barGraph.meta) ? barGraph.meta : null;
		(new BarGraphSimple({data: bins, dim: {w: bfnCanvas.width, h: bfnCanvas.height}, baseline: baseline, meta: meta})).draw(ctx);
	}
});
