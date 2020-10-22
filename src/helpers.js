let d3 = require('d3');

export function uniques(data, name) {
    let uniques = [];
    data.forEach((d) => {
        if (uniques.indexOf(name(d)) < 0) {
            uniques.push(name(d));
        }
    });
    return uniques;
}

export function nameId(data, name) {
    let uniqueNames = uniques(data, name);
    return d3.scale.ordinal()
        .domain(uniqueNames)
        .range(d3.range(uniqueNames.length));
}