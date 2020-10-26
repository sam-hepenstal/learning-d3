let d3 = require('d3');

import { max } from 'lodash';
import { BasicChart } from './basic-chart';

export class Master extends BasicChart {
    constructor() {
        super();

        let sentence = "Canterbury people are well and healthy in their own homes & communities"
        let innerRingText = ["Fewer people need hospital care",
            "Living within our means",
            "People are supported to stay well",
            "Equity",
            "People are seen and treated early",
            "Death with dignity",
            "No harm or needless death"]

        let outerRingText = ["Decreased acute care rate & " +
            "increased planned care rate",
            "Decreased wait times (Community, 1, 2, diagnostic)",
            "Delayed/avoided burden of disease & long term conditions",
            "Improved environment supports health and wellbeing",
            "No wasted resources",
            "Decreased avoidable mortality",
            "Decreased adverse events",
            "Decreased istitutionalisation rates"]

        let originX = this.width / 2;
        let originY = this.height / 2;
        let fill = "#cdeab7";
        let innerRadius = this.width / 26;
        let outerRadius = this.width / 6.5;
        let mainCircle = this.createCircleData(originX, originY, innerRadius, outerRadius, fill);
        let outerCircles = this.calculateOuterCircleOrigins(outerRingText, originX, originY, 1.6 * mainCircle.outerRadius + 20, innerRadius * 0.6, outerRadius * 0.6, fill);
        let circleData = [];
        circleData = circleData.concat(mainCircle.circleData)
        outerCircles.forEach((element) => { circleData = circleData.concat(element.circleData) });
        this.drawCircles(circleData)
        this.drawText(sentence, mainCircle.originX, mainCircle.originY, mainCircle.innerRadius * 0.9);
        this.drawRingOfText(innerRingText, mainCircle.originX, mainCircle.originY, mainCircle.firstFillRadius + (0.5 * mainCircle.whiteWidth), mainCircle.whiteWidth / 2);
        this.drawRingOfText(outerRingText, originX, originY, mainCircle.secondFillRadius + (0.5 * mainCircle.whiteWidth), mainCircle.whiteWidth / 2);
    }
    drawCircles(circleData) {


        var circles = this.svg.selectAll("circle").data(circleData).enter().append("circle");

        var circleAttributes = circles
            .attr("cx", (d) => { return d.cx; })
            .attr("cy", (d) => { return d.cy; })
            .attr("r", (d) => { return d.r; })
            .style("fill", (d) => { return d.fill; })
            .style("stroke", (d) => { return d.stroke; });


    }
    createCircleData(originX, originY, innerRadius, outerRadius, fill) {
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

        return {
            circleData: circleData,
            originX: originX,
            originY: originY,
            innerRadius: innerRadius,
            firstFillRadius: firstFillRadius,
            secondWhiteRadius: secondWhiteRadius,
            secondFillRadius: secondFillRadius,
            outerRadius: outerRadius,
            whiteWidth: whiteWidth,
            fillWidth: fillWidth
        }
    }

    radians(degrees) {
        return degrees * Math.PI / 180;
    }

    calculateOuterCircleOrigins(texts, originX, originY, radiusFromCenter, innerRadius, outerRadius, fill) {
        let theta = Array.from(texts.keys()).map(x => this.radians((360 / texts.length * x)))
        let circleData = [];
        theta.forEach((element, i) => {
            let x = originX + (radiusFromCenter * Math.sin(element));
            let y = originY - (radiusFromCenter * Math.cos(element));

            circleData.push(this.createCircleData(x, y, innerRadius, outerRadius, fill))
        });
        return circleData;
    }

    drawRingOfText(texts, originX, originY, radiusFromCenter, radiusOfText) {
        let theta = Array.from(texts.keys()).map(x => this.radians((360 / texts.length * x)))
        theta.forEach((element, i) => {
            let textX = originX + (radiusFromCenter * Math.sin(element));
            let textY = originY - (radiusFromCenter * Math.cos(element));

            this.drawText(texts[i], textX, textY, radiusOfText * 0.9);
        });
    }

    drawText(text, originX, originY, radius) {
        let words = this.words(text);
        let lineHeight = 12;
        let width = Math.sqrt(this.measureWidth(text.trim()) * lineHeight)
        let lines = this.lines(words, width)
        let textRadius = this.textRadius(lines, lineHeight)

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