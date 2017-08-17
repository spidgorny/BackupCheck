// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const fs = require('fs');
const moment = require('moment');

export class Renderer {

	paths = [
		"D:\\AutoBackup\\Web\\webHP.rar",
		"N:\\AutoBackup\\Web\\webHP.rar",
	];

	table: Element;

	tableData = {};

	constructor() {
		this.table = document.querySelector('table tbody');
		this.render();
	}

	render() {
		this.paths.forEach(p => {
			this.tableData[p] = [
				p, `<div class="progress">
      					<div class="indeterminate"></div>
  					</div>`
			];
			fs.stat(p, this.appendLine.bind(this, p));
		});
		this.renderTable();
	}

	appendLine(path, err, stats) {
		// console.log(path, stats);
		const mtime = moment(stats.mtime);
		const age = moment().from(mtime, true);
		const hours = moment().diff(moment(mtime), 'hours');
		const ok = hours < 24;

		const rowData = [
			path, mtime.format('YYYY-MM-DD'), age + ' ago', ok
				? `<span class="badge green-text">
					<i class="material-icons">check_circle</i>
					</span>`
				: `<span class="badge red-text">
					<i class="material-icons">check_circle</i>
					</span>`
		];
		this.tableData[path] = rowData;
		this.renderTable();
	}

	renderTable() {
		// https://stackoverflow.com/questions/7271490/delete-all-rows-in-an-html-table
		while (this.table.hasChildNodes()) {
			this.table.removeChild(this.table.lastChild);
		}

		Object.keys(this.tableData).forEach((key => {
			let row = this.tableData[key];
			this.appendLineToDOM(row);
		});
	}

	appendLineToDOM(rowData: Array<string>) {
		const row = document.createElement("tr");
		rowData.forEach(value => {
			// Create a <td> element and a text node, make the text
			// node the contents of the <td>, and put the <td> at
			// the end of the table row
			let cell = document.createElement("td");
			// let cellText = document.createTextNode(value);
			// cell.appendChild(cellText);
			cell.insertAdjacentHTML('beforeend', value);
			row.appendChild(cell);
		});

		// add the row to the end of the table body
		this.table.appendChild(row);
	}

}
