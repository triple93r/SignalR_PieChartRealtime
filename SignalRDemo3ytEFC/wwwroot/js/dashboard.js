"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/dashboardHub").build();

$(function () {
	connection.start().then(function () {
		alert('Connected to dashboardHub');

		InvokeProducts();

	}).catch(function (err) {
		return console.error(err.toString());
	});
});

// Product
function InvokeProducts() {
	debugger;
	connection.invoke("SendProducts").catch(function (err) {
		return console.error(err.toString());
	});
}

connection.on("ReceivedProducts", function (products) {
	BindProductsToGrid(products);
});

function BindProductsToGrid(products) {
	$('#tblProduct tbody').empty();

	var tr;
	$.each(products, function (index, product) {
		tr = $('<tr/>');
		tr.append(`<td>${(index + 1)}</td>`);
		tr.append(`<td>${product.name}</td>`);
		tr.append(`<td>${product.category}</td>`);
		tr.append(`<td>${product.price}</td>`);
		$('#tblProduct').append(tr);
	});
}

connection.on("ReceivedProductsForGraph", function (productsForGraph) {
	BindProductsToGraph(productsForGraph);
});

function BindProductsToGraph(productsForGraph) {
	var labels = [];
	var data = [];
	debugger;
	$.each(productsForGraph, function (index, item) {
		labels.push(item.category);
		data.push(item.products);
	});

	DestroyCanvasIfExists('canvasProudcts');

	const context = $('#canvasProudcts');
	const myChart = new Chart(context, {
		type: 'doughnut',
		data: {
			labels: labels,
			datasets: [{
				label: '# of Products',
				data: data,
				backgroundColor: backgroundColors,
				borderColor: borderColors,
				borderWidth: 1
			}]
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			}
		}
	});
}


connection.on("ReceivedProductsForGraph", function (productsForGraph) {
	ChartGraph(productsForGraph);
});

function ChartGraph(productsForGraph) {
	var labels = [];
	var data = [];

	$.each(productsForGraph, function (index, item) {
		labels.push(item.category);
		data.push(item.products);
	});

	DestroyCanvasIfExists('canvasChart');

	const context = $('#canvasChart');
	const myChart = new Chart(context, {
		type: 'line',
		data: {
			labels: labels,
			datasets: [{
				label: '#Chart of Products',
				data: data,
				backgroundColor: backgroundColors,
				borderColor: borderColors,
				borderWidth: 1
			}]
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			}
		}
	});
}


connection.on("ReceivedProductsForGraph", function (productsForGraph) {
	BindCustomersToGraph(productsForGraph);
});

function BindCustomersToGraph(productsForGraph) {
	var datasets = [];
	var labels = ['Products']
	var data = [];
	$.each(productsForGraph, function (index, item) {
		data = [];
		data.push(item.products);

		var dataset = {
			label: item.category,
			data: data,
			backgroundColor: backgroundColors[index],
			borderColor: borderColors[index],
			borderWidth: 1
		};

		datasets.push(dataset);
	});

	DestroyCanvasIfExists('canvasBarGraph');

	const context = $('#canvasBarGraph');
	const myChart = new Chart(context, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: datasets,
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			}
		}
	});
}



// supporting functions for Graphs
function DestroyCanvasIfExists(canvasId) {
	let chartStatus = Chart.getChart(canvasId);
	if (chartStatus != undefined) {
		chartStatus.destroy();
	}
}

var backgroundColors = [
	'rgba(255, 99, 132, 0.2)',
	'rgba(54, 162, 235, 0.2)',
	'rgba(255, 206, 86, 0.2)',
	'rgba(75, 192, 192, 0.2)',
	'rgba(153, 102, 255, 0.2)',
	'rgba(255, 159, 64, 0.2)'
];
var borderColors = [
	'rgba(255, 99, 132, 1)',
	'rgba(54, 162, 235, 1)',
	'rgba(255, 206, 86, 1)',
	'rgba(75, 192, 192, 1)',
	'rgba(153, 102, 255, 1)',
	'rgba(255, 159, 64, 1)'
];