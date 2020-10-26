let d3 = require('d3');

import { max } from 'lodash';
import { BasicChart } from './basic-chart';

export class Master extends BasicChart {
    constructor() {
        super();
        let originX = this.width / 2;
        let originY = this.height / 2;
        let fill = "#cdeab7";

        let innerRadius = this.width / 26;
        let outerRadius = this.width / 4.5;
        let availableRadii = outerRadius - innerRadius;
        let whiteWidth = availableRadii / 3;
        let fillWidth = whiteWidth / 3;
        let firstFillRadius = innerRadius + fillWidth;
        let secondWhiteRadius = firstFillRadius + whiteWidth;
        let secondFillRadius = secondWhiteRadius + fillWidth;
        let thirdWhiteRadius = secondFillRadius + whiteWidth;

        let circleData = [
            {
                cx: originX,
                cy: originY,
                r: outerRadius,
                fill: fill,
                stroke: fill
            }, {
                cx: originX,
                cy: originY,
                r: thirdWhiteRadius,
                fill: "white",
                stroke: fill
            }, {
                cx: originX,
                cy: originY,
                r: secondFillRadius,
                fill: fill,
                stroke: fill
            }, {
                cx: originX,
                cy: originY,
                r: secondWhiteRadius,
                fill: "white",
                stroke: fill
            },
            {
                cx: originX,
                cy: originY,
                r: firstFillRadius,
                fill: fill,
                stroke: fill
            }, {
                cx: originX,
                cy: originY,
                r: innerRadius,
                fill: "white",
                stroke: fill
            }

        ];

        var circles = this.svg.selectAll("circle").data(circleData).enter().append("circle");

        var circleAttributes = circles
            .attr("cx", (d) => { return d.cx; })
            .attr("cy", (d) => { return d.cy; })
            .attr("r", (d) => { return d.r; })
            .style("fill", (d) => { return d.fill; })
            .style("stroke", (d) => { return d.stroke; });

        let sentence = "Canterbury people are well and healthy in their own homes & communities"
        
        this.drawText(sentence, originX, originY, innerRadius);
        let theta = [1, 2, 3, 4, 5, 6, 7].map(x =>  this.radians((360 / 7) * x))
        console.log(theta)
        theta.forEach(element => {
            let circleAOriginX = originX + ((firstFillRadius + (0.5 * whiteWidth)) * Math.sin(element));
            let circleAOriginY = originY - ((firstFillRadius + (0.5 * whiteWidth)) * Math.cos(element));

            let sentence2 = "Fewer people need hospital care";
            this.drawText(sentence2, circleAOriginX, circleAOriginY, whiteWidth / 2.5);
        });
        
        //var circleA = this.svg.append("circle").attr({cx : circleAOriginX, cy: circleAOriginY, r: whiteWidth / 2})
    }
    radians(degrees) {
        return degrees * Math.PI / 180;
    }

    drawText(text, originX, originY, radius) {
        let words = this.words(text);
        let lineHeight = 12;
        let width = Math.sqrt(this.measureWidth(text.trim()) * lineHeight)
        let lines = this.lines(words, width)
        let textRadius = this.textRadius(lines, lineHeight)
        console.log(textRadius)

        //var s = this.svg.append("text").attr({ x: this.width / 2, y: this.height / 2, fill: "black", fontsize: "20px" }).text();

        this.svg.append("text")
            .attr("transform", `translate(${originX},${originY}) scale(${radius / textRadius})`)
            .selectAll("tspan")
            .data(lines)
            .enter().append("tspan")
            .attr("x", 0)
            .attr("y", (d, i) => (i - lines.length / 2 + 0.8) * lineHeight)
            .text(d => d.text)
            .style("font", "10px sans-serif")
            .style("max-width", "100%")
            .style("height", "auto")
            .attr("text-anchor", "middle");
    }

    words(text) {
        const words = text.split(/\s+/g); // To hyphenate: /\s+|(?<=-)/
        if (!words[words.length - 1]) words.pop();
        if (!words[0]) words.shift();
        return words;
    }

    measureWidth(text) {
        const context = document.createElement("canvas").getContext("2d");
        return context.measureText(text).width;
    }

    lines(words, targetWidth) {
        let line;
        let lineWidth0 = Infinity;
        const lines = [];
        for (let i = 0, n = words.length; i < n; ++i) {
            let lineText1 = (line ? line.text + " " : "") + words[i];
            let lineWidth1 = this.measureWidth(lineText1);
            if ((lineWidth0 + lineWidth1) / 2 < targetWidth) {
                line.width = lineWidth0 = lineWidth1;
                line.text = lineText1;
            } else {
                lineWidth0 = this.measureWidth(words[i]);
                line = { width: lineWidth0, text: words[i] };
                lines.push(line);
            }
        }
        return lines;
    }

    textRadius(lines, lineHeight) {
        let radius = 0;
        for (let i = 0, n = lines.length; i < n; ++i) {
            const dy = (Math.abs(i - n / 2 + 0.5) + 0.5) * lineHeight;
            const dx = lines[i].width / 2;
            radius = Math.max(radius, Math.sqrt(dx ** 2 + dy ** 2));
        }
        return radius;
    }
}