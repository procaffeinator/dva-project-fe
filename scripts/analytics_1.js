let response;

fetch('data/response_abhi.json')
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok');
    })
    .then(data => {
        response = data;
        // use the response
        force_graph(response, '');
    })
    .catch(error => {
        // handle the error
        console.error('Error:', error);
    });

function force_graph(response, category)
{
  // filter the data by category if it's provided
  if (category !== '') {
    response = response.filter(recipe => recipe.recipe_category === category);
  }

  fetch('data/response_abhi.json')
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok');
    })
    .then(recepies => {
        console.log(recepies);
        let source = [];
        let target = [];
        let value = [];

        // var data_arr = Array.from(data);

        var links = []
        var all_recepies = [];

        for (let i=0;i<recepies.length;i++) {
            recepie = recepies[i];
            console.log(recepie);
            var recepie_name = recepie.name;
            var ingredients = recepie.ingredients;
            console.log(ingredients);
            all_recepies.push(recepie_name);
            for (let j=0;j<ingredients.length;j++) {
                ing = ingredients[j];
                source.push(recepie_name);
                target.push(ing);
                value.push(0);
                var cur_link = {
                    source: recepie_name,
                    target: ing,
                    value: 0
                };
                links.push(cur_link);
            }
            
        }
        

        var nodes = {};

        // compute the distinct nodes from the links.
        links.forEach(function(link) {
            link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
            link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
        });

        var width = 1200,
            height = 700;

        var force = d3.forceSimulation()
            .nodes(d3.values(nodes))
            .force("link", d3.forceLink(links).distance(100))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .force("charge", d3.forceManyBody().strength(-250))
            .alphaTarget(1)
            .on("tick", tick);

        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

        svg.append("text")
            .attr("id","credit")
            .attr("x", width - 30 * 1.5)
            .attr("y", 0+30/1.5)
            .attr("text-anchor", "middle")
            .style("font-size", "15px")
            

        var path = svg.append("g")
            .selectAll("path")
            .data(links)
            .enter()
            .append("path")
            .attr("class", function(d) { return "link " + d.type; })
            .style('fill', '#ffffff')
            .style("stroke", function(d) { 
              if(d.value == 0)
              {
                  // console.log(d.value);
                  return "#808080";
              }
              else{
                  // console.log(d.value);
                  return "#00FF00"}
              })
             .style("stroke-dasharray", function(d) {
              if(d.value == 1)
              {
                  return "10 3"
              }
             })
             .style("stroke-width", function(d) {
              if(d.value == 0)
              {
                  return "3"
              }
              else
              {
                  return "1"
              }
             });

        // define the nodes
        var node = svg.selectAll(".node")
            .data(force.nodes())
            .enter().append("g")
            .attr("class", "node")
            .on("dblclick",on_click_listener)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        // add the nodes
        node.each(function(d){
            d.degree = 0;
            return null;
        });

        links.forEach(function(d){
            d.source.degree += 1;
            d.target.degree += 1;
        });
        var grad_color = ['#e5f5f9','#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#006d2c','#00441b'];
        node.append("circle")
            .attr("id", function(d){
                return (d.name.replace(/\s+/g,'').toLowerCase());
            })
            .attr("r", function(d){
                console.log(d.degree)
                if (d.degree == 1){
                return 9;
                }
                else{
                return 1+Math.pow(d.degree,1.4);}
            })
            .style("fill",function(d){
                console.log(d);
                // return grad_color[parseInt(d.degree)-1];
                if (all_recepies.includes(d.name)) {
                    return '#cdc0b0'
                } else {
                    return '#b85d0d'
                }
                // return '#ffffff'
            })
            .style("stroke", "black")
            .style("stroke-width", "1px")
            // .style("stroke-width","1px");
            // .style("fill", '#00ab66')

        // add the text label

            
        node.append("text")
        .text(function(d) {return d.name;})
        .style("text-anchor", "top-right")
        .style("fill", "#555")
        .style('font-weight', 'bold')
        .style("font-family", "Arial")
        .style("font-size", 9);

        // add the curvy lines
        function tick() {
            path.attr("d", function(d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
                return "M" +
                    d.source.x + "," +
                    d.source.y + "A" +
                    dr + "," + dr + " 0 0,1 " +
                    d.target.x + "," +
                    d.target.y;
            });

            node.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")"; 
            });
        };

        function dragstarted(d) {
            if (!d3.event.active) force.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        };

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        };

        function dragended(d) {
                d.fx = d.x;
                d.fy = d.y;
                d3.select(this).select("circle")
                .style("fill", "#0000FF");
        };
        

        function on_click_listener(d) {
                d.fixed = false;
                d.fx = null;
                d.fy = null;
                d3.select(this).select("circle")
                .style("fill",function(d){
                return grad_color[parseInt(d.degree)-1];});
        };
    })
    .catch(error => {
        // handle the error
        console.error('Error:', error);
    });

}
