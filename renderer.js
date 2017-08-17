"use strict";
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var moment = require('moment');
var Renderer = (function () {
    function Renderer() {
        this.paths = [
            "D:\\AutoBackup\\Web\\webHP.rar",
            "N:\\AutoBackup\\Web\\webHP.rar",
        ];
        this.tableData = {};
        this.table = document.querySelector('table tbody');
        this.render();
    }
    Renderer.prototype.render = function () {
        var _this = this;
        this.paths.forEach(function (p) {
            _this.tableData[p] = [
                p, "<div class=\"progress\">\n      \t\t\t\t\t<div class=\"indeterminate\"></div>\n  \t\t\t\t\t</div>"
            ];
            fs.stat(p, _this.appendLine.bind(_this, p));
        });
        this.renderTable();
    };
    Renderer.prototype.appendLine = function (path, err, stats) {
        // console.log(path, stats);
        var mtime = moment(stats.mtime);
        var age = moment().from(mtime, true);
        var hours = moment().diff(moment(mtime), 'hours');
        var ok = hours < 24;
        var rowData = [
            path, mtime.format('YYYY-MM-DD'), age + ' ago', ok
                ? "<span class=\"badge green-text\">\n\t\t\t\t\t<i class=\"material-icons\">check_circle</i>\n\t\t\t\t\t</span>"
                : "<span class=\"badge red-text\">\n\t\t\t\t\t<i class=\"material-icons\">check_circle</i>\n\t\t\t\t\t</span>"
        ];
        this.tableData[path] = rowData;
        this.renderTable();
    };
    Renderer.prototype.renderTable = function () {
        var _this = this;
        // https://stackoverflow.com/questions/7271490/delete-all-rows-in-an-html-table
        while (this.table.hasChildNodes()) {
            this.table.removeChild(this.table.lastChild);
        }
        Object.keys(this.tableData).forEach((function (key) {
            var row = _this.tableData[key];
            _this.appendLineToDOM(row);
        }));
    };
    Renderer.prototype.appendLineToDOM = function (rowData) {
        var row = document.createElement("tr");
        rowData.forEach(function (value) {
            // Create a <td> element and a text node, make the text
            // node the contents of the <td>, and put the <td> at
            // the end of the table row
            var cell = document.createElement("td");
            // let cellText = document.createTextNode(value);
            // cell.appendChild(cellText);
            cell.insertAdjacentHTML('beforeend', value);
            row.appendChild(cell);
        });
        // add the row to the end of the table body
        this.table.appendChild(row);
    };
    return Renderer;
}());
exports.Renderer = Renderer;
