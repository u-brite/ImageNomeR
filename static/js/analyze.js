function getCursorPosition(canvas, e) {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    return {x: x, y: y};
}

let barGraph = null;

window.addEventListener('load', e => {
	const hId = document.querySelector('.h-id');
	const id = hId.id;
	const runCheckboxes = document.querySelectorAll('#runs-list input[type=checkbox]');
	const canvas = document.querySelector('#mainCanvas');
	const ctx = canvas.getContext('2d');

	console.log(runCheckboxes);

	barGraph = new BarGraph({
		dim: {w: canvas.width, h: canvas.height}
	});

	function dataLoadCb(run) {
		barGraph.runs.push(run);
		barGraph.recalc();
		barGraph.repaint(ctx);
		runCheckboxes.forEach(box => {
			if (box.id == `run${run.runid}`) {
				box.parentNode.querySelector('.loading').innerText = 'Complete!';
			}
		});
	}

	runCheckboxes.forEach(box => {
		const runid = parseInt(box.id.substring(3));
		fetch(`/data?id=${id}&runid=${runid}`)
		.then(resp => resp.json())
		.then(json => dataLoadCb(json))
		.catch(err => console.log(err));
	});

	canvas.addEventListener('mousemove', e => {
		barGraph.mousemove(getCursorPosition(canvas, e));
		barGraph.repaint(ctx);
	});

	canvas.addEventListener('mouseout', e => {
		barGraph.mouseout();
		barGraph.repaint(ctx);
	});

});
