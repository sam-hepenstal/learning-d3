import * as helpers from './helpers';
import { BasicChart } from './basic-chart';
let d3 = require('d3');

export class PoliticalDonorChart extends BasicChart {
    constructor(chartType, ...args) {
        super();
        require('./chapter5.css');

        let p = new Promise((res, rej) => {
            d3.csv('data/uk_political_donors.csv',
                (err, data) => err ? rej(err) : res(data));
        });


        p.then((data) => {
            this.data = data;
            this[chartType].call(this, ...args);
        });

        return p;
    }

    histogram() {
        let data = this.data.filter((d) => d.EntityName.match(' MP'));

        let nameId = helpers.nameId(data, (d) => d.EntityName);
        let histogram = d3.layout.histogram()
            .bins(nameId.range())
            .value((d) => nameId(d.EntityName))(data);

        this.margin = { top: 10, right: 40, bottom: 100, left: 50 };

        let x = d3.scale.linear()
            .domain([0, d3.max(histogram, (d) => d.x)])
            .range([this.margin.left, this.width - this.margin.right]);

        let y = d3.scale.log().domain([1, d3.max(histogram, (d) => d.y)])
            .range([this.height - this.margin.bottom, this.margin.top]);

        let yAxis = d3.svg.axis()
            .scale(y)
            .tickFormat(d3.format('f'))
            .orient('left');

        this.chart.append('g')
            .classed('axis', true)
            .attr('transform', 'translate(50, 0)')
            .call(yAxis);

        let bar = this.chart.selectAll('.bar')
            .data(histogram)
            .enter()
            .append('g')
            .classed('bar', true)
            .attr('transform', (d) => `translate(${x(d.x)},${y(d.y)})`);

        bar.append('rect')
            .attr({
                x: 1,
                width: x(histogram[0].dx) - this.margin.left - 1,
                height: (d) => this.height - this.margin.bottom - y(d.y)
            })
            .classed('histogram-bar', true);

        bar.append('text')
            .text((d) => d[0].EntityName)
            .attr({
                transform: (d) => `translate(0, ${this.height - this.margin.bottom - y(d.y) + 7}) rotate(60)`
            });
    }
}