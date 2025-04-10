const svg = d3.select("#chart"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

const margin = { top: 20, right: 30, bottom: 30, left: 60 },
  innerWidth = width - margin.left - margin.right,
  innerHeight = height - margin.top - margin.bottom;

const tooltip = d3.select("#tooltip");
const g = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

let rawData = [];

d3.json("name.json").then(data => {
  rawData = data;
  drawChart(); // initial draw after data is loaded
});

function drawChart(genderFilter = "all", languageFilter = "all") {
  const data = rawData.filter(d =>
    (genderFilter === "all" || d.gender === genderFilter) &&
    (languageFilter === "all" || d.language === languageFilter)
  );

  const names = Array.from(new Set(data.map(d => d.name)));
  const years = d3.range(2000, 2005); // x-axis from 2000–2005

  const yearData = years.map(year => {
    const row = { year };
    names.forEach(name => {
      const match = data.find(d => d.year === year && d.name === name);
      row[name] = match ? match.count : 0;
    });
    return row;
  });

  const stackedData = d3.stack().keys(names)(yearData);

  const x = d3.scaleLinear()
    .domain(d3.extent(years))
    .range([0, innerWidth]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
    .range([innerHeight, 0]);

  const color = d3.scaleOrdinal()
    .domain(names)
    .range(d3.schemeTableau10);

  g.selectAll("*").remove();

  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  g.append("g")
    .call(d3.axisLeft(y));

  g.selectAll(".area")
    .data(stackedData)
    .enter().append("path")
    .attr("class", "area")
    .attr("fill", d => color(d.key))
    .attr("d", d3.area()
      .x((d, i) => x(years[i]))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]))
    )
    .on("mousemove", function (event, d) {
      const [mx] = d3.pointer(event);
      const year = Math.round(x.invert(mx));
      const name = d.key;
      const match = rawData.find(r => r.year === year && r.name === name);
      if (match) {
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 30) + "px")
          .style("display", "block")
          .html(`<strong>${match.name}</strong><br>Year: ${match.year}<br>Count: ${match.count}<br>Language: ${match.language}`);
      }
    })
    .on("mouseout", () => tooltip.style("display", "none"));
}

d3.select("#gender").on("change", function () {
  drawChart(this.value, d3.select("#language").node().value);
});

d3.select("#language").on("change", function () {
  drawChart(d3.select("#gender").node().value, this.value);
});
