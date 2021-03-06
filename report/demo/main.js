function showImage(a) {
  document.querySelector("#backstep").classList.toggle('hidden');
  if (a.text.indexOf("С") > -1) {
    a.text = "Результат обратной прогонки";
  } else {
    a.text = "Скрыть результат обратной прогонки";
  }
}

function showSVG(a) {
  document.querySelector("svg").classList.toggle('hidden');
  if (a.text.indexOf("П") > -1) {
    a.text = "Скрыть траекторию";
  } else {
    a.text = "Показать траекторию";
  }
}

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.close); });

    var svg = d3.select(".images").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr('class', 'hidden')
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("data.csv", type, function(error, data) {
      if (error) throw error;
      var min = -1;
     
      
      min = d3.max(data, function(d) { return -d.x1; });
      x.domain([-min - 0.1, 1.1]);

      y.domain(d3.extent(data, function(d) { return d.close; }));

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
            .attr("x", width)
            .attr("y", 15)
            .text("x1");


      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("x2");

      svg.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", line);

        svg.append("circle")
                .attr("cx", function(dd){return x(1)})
                .attr("cy", function(dd){return y(0)})
                .attr('fill', 'red')
                .attr("r", 2);

        //////////////////////////////////////////////////
        var path = svg.select("path.line"),
        startPoint = pathStartPoint(path);
        var marker = svg.append("circle");
        marker.attr("r", 7)
        .attr("transform", "translate(" + startPoint + ")");

        transition();

        //Get path start point for placing marker
        function pathStartPoint(path) {
        var d = path.attr("d");

        var dsplitted = d.split(" ");
        //console.log(dsplitted);
        return dsplitted[0].split(",");
        }

        function transition() {
        marker.transition()
            .duration(7500)
            .attrTween("transform", translateAlong(path.node()))
            .each("end", transition);// infinite loop
        }

        function translateAlong(path) {
        var l = path.getTotalLength();
        return function(i) {
          return function(t) {
            var p = path.getPointAtLength(t * l);
            return "translate(" + p.x + "," + p.y + ")";//Move marker
          }
        }
        }
        //////////////////////////////////////////////////////
    });

    function type(d) {
      d.date = +d.x1;
      d.close = +d.x2;
      return d;
    }