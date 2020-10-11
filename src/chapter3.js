let d3 = require('d3');

import { BasicChart } from './basic-chart';

export class UlamSpiral extends BasicChart {
    constructor(data) {
        super(data);
        let dot = d3.svg.symbol().type('circle').size(3),
            center = 400,
            l = 2,
            x = (x, l) => center + l * x,
            y = (y, l) => center + l * y;
        let primes = this.generatePrimes(2000);
        let sequence = this.generateSpiral(d3.max(primes))
            .filter((d) => primes.indexOf(d['n']) > -1);
        this.chart.selectAll('path')
            .data(sequence)
            .enter()
            .append('path')
            .attr('transform',
                d => `translate(${x(d['x'], l)}, ${y(d['y'], l)})`)
            .attr('d', dot);
        let scale = 8;
        let regions = d3.nest()
            .key((d) => Math.floor(d['x'] / scale))
            .key((d) => Math.floor(d['y'] / scale))
            .rollup((d) => d.length)
            .map(sequence);

        let values = d3.merge(
            d3.keys(regions).map((_x) => d3.values(regions[_x])));
        let median = d3.median(values),
            extent = d3.extent(values),
            shades = (extent[1] - extent[0]) / 2;

        d3.keys(regions).forEach((_x) => {
            d3.keys(regions[_x]).forEach((_y) => {
                let color,
                    red = '#e23c22',
                    green = '#497c36';

                if (regions[_x][_y] > median) {
                    color = d3.rgb(green).brighter(regions[_x][_y] / shades);
                } else {
                    color = d3.rgb(red).darker(regions[_x][_y] / shades);
                }
                this.chart.append('rect')
                    .attr({
                        x: x(_x, l * scale),
                        y: y(_y, l * scale),
                        width: l * scale,
                        height: l * scale
                    })
                    .style({ fill: color, 'fill-opacity': 0.9 });
            });
        });
    }

    generateSpiral(n) {
        let spiral = [], x = 0, y = 0, min = [0, 0], max = [0, 0], add = [0, 0], direction = 0, directions = { up: [0, -1], left: [-1, 0], down: [0, 1], right: [1, 0] };

        d3.range(1, n).forEach((i) => { spiral.push({ x: x, y: y, n: i }); add = directions[['up', 'left', 'down', 'right'][direction]]; x += add[0], y += add[1]; if (x < min[0]) { direction = (direction + 1) % 4; min[0] = x; } if (x > max[0]) { direction = (direction + 1) % 4; max[0] = x; } if (y < min[1]) { direction = (direction + 1) % 4; min[1] = y; } if (y > max[1]) { direction = (direction + 1) % 4; max[1] = y; } }); return spiral;
    }

    generatePrimes(n) {
        function* numbers(start) {
            while (true) {
                yield start++;
            }
        }
        function* primes() {
            var seq = numbers(2); // Start on 2.
            var prime;

            while (true) {
                prime = seq.next().value;
                yield prime;
                seq = filter(seq, prime);
            }
        }

        function* getPrimes(count, seq) {
            while (count) {
                yield seq.next().value;
                count--;
            }
        }

        function* filter(seq, prime) {
            for (var num of seq) {
                if (num % prime !== 0) {
                    yield num;
                }
            }
        }

        let results = [];
        for (let prime of getPrimes(n, primes())) {
            results.push(prime);
        }

        return results;
    }
}