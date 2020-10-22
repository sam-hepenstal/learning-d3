let d3 = require('d3');

import { max } from 'lodash';
import { BasicChart } from './basic-chart';

export class Master extends BasicChart {
    constructor() {
        super();

        let fill = "#cdeab7";

        let circleData = [
            {
                cx: this.width / 2,
                cy: this.height / 2,
                r: this.width / 4.5,
                fill: fill,
                stroke: fill
            }, {
                cx: this.width / 2,
                cy: this.height / 2,
                r: this.width / 5,
                fill: "white",
                stroke: fill
            }, {
                cx: this.width / 2,
                cy: this.height / 2,
                r: this.width / 8,
                fill: fill,
                stroke: fill
            }, {
                cx: this.width / 2,
                cy: this.height / 2,
                r: this.width / 10,
                fill: "white",
                stroke: fill
            }, {
                cx: this.width / 2,
                cy: this.height / 2,
                r: this.width / 20,
                fill: fill,
                stroke: fill
            }, {
                cx: this.width / 2,
                cy: this.height / 2,
                r: this.width / 28,
                fill: "white",
                stroke: fill
            }

        ];

        var circles = this.svg.selectAll("circle").data(circleData).enter().append("circle");

        var circleAttributes = circles
            .attr("cx", (d) => { return d.cx; })
            .attr("cy", (d) => { return d.cy; })
            .attr("r",  (d) => { return d.r; })
            .style("fill", (d) => { return d.fill; })
            .style("stroke", (d) => { return d.stroke; });
        
        let sentence = "Canterbury people are well and healthy in their own homes & communities"
        var text = this.svg.append("text").attr({x: this.width / 2, y: this.height / 2, fill: "black", fontsize: "20px"}).text();

    }
}