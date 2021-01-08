
$(document).ready(function () {

	const map = L.map('map', { 
		// recommended for performance
		renderer: L.canvas() 
	}).setView([26.490519, 124.119987], 9);

	L.tileLayer("http://{s}.sm.mapstack.stamen.com/(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/{z}/{x}/{y}.png")
		.addTo(map);
	const tempVal='mass_oil'
	// OPTIONAL - simple example of dynamic styling with chromajs
	const colorProp = data.features.map(f => +f.properties[tempVal]);
	const min = Math.min(...colorProp);
	const max = Math.max(...colorProp);
	const color = chroma.scale(chroma.brewer.Viridis.reverse()).domain([min, max]);
	
	// OPTIONAL - custom pane
	const paneName = 'myCustom';
	

	// INIT
	const temporalGeoJSONLayer = L.temporalGeoJSONLayer({
		features: data.features,
		style(feature) {
			return {
				// do custom styling things
				fillColor: color(feature.properties[tempVal]),
				stroke: false
			}
		},
		circleMarkerOptions: {
			radius: 3
		},
		paneName: paneName,
		timeKey: "time",

		// OPTIONAL
		popupFunction(layer) {
			return `wow, very popup: ${layer.feature.properties.time}`;
		}
	});

	// GENERAL - layer stuff
	const layerControl = L.control.layers({}, { 'Demo': temporalGeoJSONLayer });
	layerControl.addTo(map);
	temporalGeoJSONLayer.addTo(map);

	// DEMO - get a list of frame keys, and set first frame active
	const frameKeys = temporalGeoJSONLayer.getFrameKeys();
	temporalGeoJSONLayer.setFrame(frameKeys[0]);
	
	// RECOMMENDED - throttle superfluous calls to setFrame
	const keyFrameHandler = function () {
		temporalGeoJSONLayer.setFrame(frameKeys[this.value]);
	};
	const throttledHandler = _.throttle(keyFrameHandler, 50, { leading: false });

	$('#keyFrameSlider').on('input', throttledHandler);
	$('#keyFrameSlider').prop('max', frameKeys.length - 1);

	// DEMO - update style function
	$('#setStyle').on('click', () => {
		temporalGeoJSONLayer.setStyle(function(feature) { return {
			fill: false,
			stroke: true,
			color: color(feature.properties[tempVal]),
			weight: 1
		}});
	});

});