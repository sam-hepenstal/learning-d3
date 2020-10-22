import { BasicChart } from './basic-chart';

export class chapter4 extends BasicChart {
    constructor(data) {
        super(data);

        let eases = ['linear', 'poly(4)', 'quad', 'cubic', 'sin', 'exp',
            'circle', 'elastic(10, -5)', 'back(0.5)', 'bounce', 'cubic-in',
            'cubic-out', 'cubic-in-out', 'cubic-out-in'],
            y = d3.scale.ordinal().domain(eases).rangeBands([50, 500]);

        eases.forEach((ease) => {
            let transition = this.svg.append('circle')
                .attr({ cx: 130, cy: y(ease), r: y.rangeBand() / 2 - 5 })
                .transition()
                .delay(400)
                .duration(1500)
                .attr({ cx: 400 });

            if (ease.indexOf('(') > -1) {
                let args = ease.match(/[0-9]+/g),
                    type = ease.match(/^[a-z]+/);
                transition.ease(type, args[0], args[1]);
            } else {
                transition.ease(ease);
            }

            this.svg.append('text')
                .text(ease)
                .attr({ x: 10, y: y(ease) + 5 });
        });
    }


}

export class Spirograph extends BasicChart {
    constructor(data) {
        super(data);

        let position = (t) => {
            let a = 80, b = 1, c = 1, d = 80;
            return {
                x: Math.cos(a * t) - Math.pow(Math.cos(b * t), 3),
                y: Math.sin(c * t) - Math.pow(Math.sin(d * t), 3)
            };
        };

        let tScale = d3.scale.linear().domain([500, 25000])
            .range([0, 2 * Math.PI]),
            x = d3.scale.linear().domain([-2, 2]).range([100, this.width - 100]),
            y = d3.scale.linear().domain([-2, 2]).range([this.height - 100, 100]);

        let brush = this.chart.append('circle')
            .attr({ r: 4 }),
            previous = position(0);

        let step = (time) => {
            if (time > tScale.domain()[1]) {
                return true;
            }

            let t = tScale(time),
                pos = position(t);

            brush.attr({ cx: x(pos.x), cy: y(pos.y) });

            this.chart.append('line')
                .attr({
                    x1: x(previous.x),
                    y1: y(previous.y),
                    x2: x(pos.x),
                    y2: y(pos.y),
                    stroke: 'steelblue',
                    'stroke-width': 1.3
                });

            previous = pos;
        };
        let timer = d3.timer(step, 500);
    }
}

export class PrisonPopulationChart extends BasicChart {
    constructor(path) {
        super();

        this.margin.left = 50;
        let d3 = require('d3');

        let p = new Promise((res, rej) => {
            d3.csv(path, (err, data) => err ? rej(err) : res(data));
        });

        require('./index.css');

        this.x = d3.scale.ordinal().rangeBands([this.margin.left, this.width], 0.1);

        p.then((data) => {
            this.data = data;
            this.drawChart();
        });

        return p;
    }

    drawChart() {
        let data = this.data;
        data = data.filter((d) => d.year >= d3.min(data, (d) => d.year) && d.year <= d3.max(data, (d) => d.year));

        this.y = d3.scale.linear().range([this.height, this.margin.bottom]);
        this.x.domain(data.map((d) => d.year));
        this.y.domain([0, d3.max(data, (d) => Number(d.total))]);

        this.xAxis = d3.svg.axis().scale(this.x).orient('bottom').tickValues(this.x.domain().filter((d, i) => !(i % 5)));
        this.yAxis = d3.svg.axis().scale(this.y).orient('left');

        this.chart.append('g')
            .classed('axis x', true)
            .attr('transform', `translate(0, ${this.height})`)
            .call(this.xAxis);

        this.chart.append('g')
            .classed('axis y', true)
            .attr('transform', `translate(${this.margin.left}, 0)`)
            .call(this.yAxis);

        this.bars = this.chart.append('g').classed('bars', true).selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .style('x', (d) => {
                return this.x(d.year);
            })
            .style('y', () => this.y(0))
            .style('width', this.x.rangeBand())
            .style('height', 0);

        // Run CSS animation
        setTimeout(() => {
            this.bars.classed('bar', true)
                .style('height', (d) => this.height - this.y(+d.total))
                .style('y', (d) => this.y(+d.total));
        }, 1000);
    }
}