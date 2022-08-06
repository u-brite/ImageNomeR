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

	barGraph = new BarGraph({
		dim: {w: canvas.width, h: canvas.height}
	});
	boxPlot = new BoxPlot(barGraph);
		
	barGraph.displayLabels = displayLabels.checked;
	boxPlot.displayLabels = displayLabels.checked;

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
	}

	runCheckboxes.forEach(box => {
		const runid = parseInt(box.id.substring(3));
		// Get weights data
		fetch(`/data?id=${id}&runid=${runid}`)
		.then(resp => resp.json())
		.then(json => dataLoadCb(json))
		.catch(err => console.log(err));
		// Get BFN metadata
		//fetch(`/data?id=${id}&
	});

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
});
