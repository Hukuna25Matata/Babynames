const svg = d3.select("#chart"), // Select svg element and get its width and height
      width = +svg.attr("width"),
      height = +svg.attr("height");

const margin = { top: 20, right: 30, bottom: 30, left: 60 },// Set margins and inner dimensions for the chart area
      innerWidth = width - margin.left - margin.right,
      innerHeight = height - margin.top - margin.bottom;

const tooltip = d3.select("#tooltip");// Tooltip for showing info on hover

const g = svg.append("g")// Create a group for the chart
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Full dataset including language
let rawData = [ 
  { "year": 2000, "name": "Aryan", "gender": "male", "count": 1200, "language": "Hindi" },
  { "year": 2001, "name": "Aryan", "gender": "male", "count": 1350, "language": "Hindi" },
  { "year": 2002, "name": "Aryan", "gender": "male", "count": 1600, "language": "Hindi" },
  { "year": 2000, "name": "Anjali", "gender": "female", "count": 900, "language": "Hindi" },
  { "year": 2001, "name": "Anjali", "gender": "female", "count": 1100, "language": "Hindi" },
  { "year": 2002, "name": "Anjali", "gender": "female", "count": 950, "language": "Hindi" },
  { "year": 2000, "name": "Kabir", "gender": "male", "count": 700, "language": "Hindi" },
  { "year": 2001, "name": "Kabir", "gender": "male", "count": 800, "language": "Hindi" },
  { "year": 2002, "name": "Kabir", "gender": "male", "count": 850, "language": "Hindi" },
  { "year": 2000, "name": "Lakshmi", "gender": "female", "count": 1200, "language": "Tamil" },
  { "year": 2001, "name": "Lakshmi", "gender": "female", "count": 1300, "language": "Tamil" },
  { "year": 2002, "name": "Lakshmi", "gender": "female", "count": 1400, "language": "Tamil" },
  { "year": 2000, "name": "Venkatesh", "gender": "male", "count": 750, "language": "Telugu" },
  { "year": 2001, "name": "Venkatesh", "gender": "male", "count": 800, "language": "Telugu" },
  { "year": 2002, "name": "Venkatesh", "gender": "male", "count": 850, "language": "Telugu" },
  { "year": 2000, "name": "Harini", "gender": "female", "count": 870, "language": "Tamil" },
  { "year": 2001, "name": "Harini", "gender": "female", "count": 920, "language": "Tamil" },
  { "year": 2002, "name": "Harini", "gender": "female", "count": 970, "language": "Tamil" },
  { "year": 2000, "name": "Pranav", "gender": "male", "count": 1100, "language": "Telugu" },
  { "year": 2001, "name": "Pranav", "gender": "male", "count": 1200, "language": "Telugu" },
  { "year": 2002, "name": "Pranav", "gender": "male", "count": 1250, "language": "Telugu" },
  { "year": 2000, "name": "Kavya", "gender": "female", "count": 1300, "language": "Telugu" },
  { "year": 2001, "name": "Kavya", "gender": "female", "count": 1400, "language": "Telugu" },
  { "year": 2002, "name": "Kavya", "gender": "female", "count": 1500, "language": "Telugu" },
  { "year": 2000, "name": "Rajesh", "gender": "male", "count": 950, "language": "Hindi" },
  { "year": 2001, "name": "Rajesh", "gender": "male", "count": 1000, "language": "Hindi" },
  { "year": 2002, "name": "Rajesh", "gender": "male", "count": 1050, "language": "Hindi" },
  { "year": 2000, "name": "Sruthi", "gender": "female", "count": 990, "language": "Tamil" },
  { "year": 2001, "name": "Sruthi", "gender": "female", "count": 1050, "language": "Tamil" },
  { "year": 2002, "name": "Sruthi", "gender": "female", "count": 1100, "language": "Tamil" },
  { "year": 2000, "name": "Rahul", "gender": "male", "count": 1400, "language": "Hindi" },
  { "year": 2001, "name": "Rahul", "gender": "male", "count": 1500, "language": "Hindi" },
  { "year": 2002, "name": "Rahul", "gender": "male", "count": 1600, "language": "Hindi" },
  { "year": 2000, "name": "Aishwarya", "gender": "female", "count": 1250, "language": "Tamil" },
  { "year": 2001, "name": "Aishwarya", "gender": "female", "count": 1350, "language": "Tamil" },
  { "year": 2002, "name": "Aishwarya", "gender": "female", "count": 1450, "language": "Tamil" },
  { "year": 2000, "name": "Bharath", "gender": "male", "count": 850, "language": "Telugu" },
  { "year": 2001, "name": "Bharath", "gender": "male", "count": 950, "language": "Telugu" },
  { "year": 2002, "name": "Bharath", "gender": "male", "count": 1050, "language": "Telugu" },
  { "year": 2000, "name": "Deepika", "gender": "female", "count": 1150, "language": "Hindi" },
  { "year": 2001, "name": "Deepika", "gender": "female", "count": 1250, "language": "Hindi" },
  { "year": 2002, "name": "Deepika", "gender": "female", "count": 1350, "language": "Hindi" },
  { "year": 2000, "name": "Siddharth", "gender": "male", "count": 920, "language": "Hindi" },
  { "year": 2001, "name": "Siddharth", "gender": "male", "count": 1020, "language": "Hindi" },
  { "year": 2002, "name": "Siddharth", "gender": "male", "count": 1120, "language": "Hindi" }

];


function drawChart(genderFilter = "all", languageFilter = "all") {
  const data = rawData.filter(d =>
    (genderFilter === "all" || d.gender === genderFilter) &&
    (languageFilter === "all" || d.language === languageFilter)
  );

  const names = Array.from(new Set(data.map(d => d.name)));
  const years = Array.from(new Set(data.map(d => d.year))).sort();

  const stackedData = d3.stack()
    .keys(names)
    .value((d, key) => {
      const record = d.values.find(r => r.name === key);
      return record ? record.count : 0;
    })(years.map(y => ({
      year: y,
      values: data.filter(d => d.year === y)
    })));
// Define scales for x and y axes
  const x = d3.scaleLinear()
    .domain(d3.extent(years))
    .range([0, innerWidth]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
    .range([innerHeight, 0]);

  const color = d3.scaleOrdinal()
    .domain(names)
    .range(d3.schemeCategory10);

  g.selectAll("*").remove();
// Draw the x-axis and y-axis
  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  g.append("g")
    .call(d3.axisLeft(y));
// Draw the stacked area chart
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
    .on("mousemove", function(event, d) {
      const [mx] = d3.pointer(event);  // Show tooltip on hover
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

// Initial draw
drawChart();

// Filter dropdown listeners
d3.select("#gender").on("change", function () {
  drawChart(this.value, d3.select("#language").node().value);
});

d3.select("#language").on("change", function () {
  drawChart(d3.select("#gender").node().value, this.value);
});
