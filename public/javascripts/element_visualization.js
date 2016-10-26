
$(document).ready(function() {
// Sticky navbar
$(window).scroll(function() {

    if ($(window).scrollTop() > 50) {
        $('.navigation').addClass('sticky');
    } else {
        $('.navigation').removeClass('sticky');
    }
});

 // scroll navigation
    $('nav a').click(function(e) {
        var link = $(this).attr('href');
        var offset = 70;
        var posi = $(link).offset().top - offset;
        e.preventDefault();
        $('body,html').animate({
            scrollTop: posi
        }, 500);
    });
});


// 'what' visualization
d3.csv("../images/element_of_anatomy.csv", function(error, data) {
    if (error) throw error;

    var margin = {
            top: 20,
            left: 20,
            bottom: 20,
            right: 20
        },
        height = 250 - margin.top - margin.bottom,
        width = 250 - margin.left - margin.right;

    // ensure each integer is actually an integer
    // convert numbers into manageable sizes to create visualization
    data.forEach(function(d) {
        d.atomic_number = +d.atomic_number;
        d.fraction_of_mass = +d.fraction_of_mass;
        d.mass_kg = +d.mass_kg * 75;
        if (d.mass_kg < 1e-5) {
            d.mass_kg = 1e-5;
        }
        d.atomic_percent = +d.atomic_percent / 100;
        d.periodic_group = +d.periodic_group;
        d.atomic_mass_in_au_or_g_mol = +d.atomic_mass_in_au_or_g_mol;
        d.ion_radius_in_pm = +d.ion_radius_in_pm;
        d.van_der_Waals_radius_in_pm = +d.van_der_Waals_radius_in_pm;
        d.density_in_g_mL = +d.density_in_g_mL;
        if (!d.atomic_radius_in_pm) {
            d.atomic_radius_in_pm = 100;
        }
        d.atomic_radius_in_pm = d.atomic_radius_in_pm ** 4;

    });

    // color scale from 0 through the max radius, from one color to the next
    var color = d3.scaleLinear()
        .range(["deepskyblue", "#cc0000"])
        .domain([0, d3.max(data, function(d) {
            return d.atomic_radius_in_pm;
        })]);

    var group_colors = d3.scaleLinear()
        .range(["#450cc2", "#0bc1bb"])
        .domain([0, d3.max(data, function(d) {
            return d.periodic_group ** 2;
        })]);

    // set up the d3 pack
    var pack = d3.pack()
        .size([width, height])
        .padding(0.5);

    // set up the svg canvas to keep aspect ratio and responsiveness
    var svg = d3.select("#elements")
        .append("div")
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 250 250")
        .classed("svg-content-responsive", true);


    // for every 1 mass of element per kg of an average 150lb adult male, 
    // append an object with respective elements radius, symbol, etc.
    var test = [];
    data.forEach(function(d) {
        for (var i = 0; i < d.mass_kg; i++) {
            test.push({
                atom: d.atomic_radius_in_pm,
                symbol: d.symbol,
                element: d.element_anatomy_elements,
                color: d.CPK_color_in_RRGGBB_hex_format,
                group: d.periodic_group
            });
        }
    });

    // function for shuffling an array of data
    Array.prototype.shuffle = function() {
        var input = this;

        for (var i = input.length - 1; i >= 0; i--) {

            var randomIndex = Math.floor(Math.random() * (i + 1));
            var itemAtIndex = input[randomIndex];

            input[randomIndex] = input[i];
            input[i] = itemAtIndex;
        }
        return input;
    };

    // function for moving object to top of view
    d3.selection.prototype.moveToFront = function() {
        return this.each(function() {
            this.parentNode.appendChild(this);
        });
    };

    test.shuffle();

    // create root of d3 hierarchy
    var root = d3.hierarchy({
            children: test
        })
        .sum(function(d) { return d.atom; });

    pack(root);

    // initialize the visualization with a shuffled array of data
    function build_visualization(d) {

        circles = svg.selectAll("circle")
            .data(root.descendants().slice(1))
            .enter().append("g").append("circle")
            .attr("r", function(d) { return d.r; })
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .style("fill", function(d) { return color(d.data.atom); })

            .on("mouseover", function(d) {
				d3.select(this.parentNode)
					.moveToFront()
                    .append("text")
                    .attr("x",d.x)
                    .attr("y",d.y)
                    .attr("text-anchor", "middle")
                    .text(d.data.symbol)
                    .style("fill", "black")
                    .style("font-size", "15px");

            	d3.select(this)
                    .attr("r", "25px")
                    .style("stroke", "white"); 

                d3.select("#element_info")
                	.append("text")
                	.text(d.data.element);
                })

            .on("mouseout", function(d) {
                d3.select(this)
                    .attr("r", function(d) { return d.r; })
                    .style("stroke", null);

                d3.select(this.parentNode)
                	.select("text").remove();

                d3.select("#element_info")
                	.select("text").remove();
            });

    } // end build visualization function

    // function for sorting elements
    function order() {

        root = d3.hierarchy({
                children: test
            })
            .sum(function(d) { return d.atom; })
        .sort(function (a, b) {
        	return a.value - b.value;
        });

        pack(root);

        svg.selectAll("circle")
            .data(root.descendants().slice(1));

        circles.transition()
            .duration(4000)
            .attr("r", function(d) { return d.r; })
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .style("fill", function(d) { return color(d.data.atom);
            });
    }

    function shuffle() {
    	test.shuffle();
        root = d3.hierarchy({
                children: test
            })
            .sum(function(d) { return d.atom; });
      
        pack(root);

        svg.selectAll("circle")
            .data(root.descendants().slice(1));

        circles.transition()
            .duration(4000)
            .attr("r", function(d) { return d.r; })
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .style("fill", function(d) { return color(d.data.atom);
            });
	}

	function color_by_group() {
		circles.transition()
		.duration(4000)
		.style("fill", function(d) {
			return group_colors(d.data.group * 17);
		});
	}

    d3.select("#order").on("click", function() {
    	order();
	});
    d3.select("#shuffle").on("click", function() {
    	shuffle();
    });
    d3.select("#groupcolor").on("click", function() {
    	color_by_group();
    });

    build_visualization(data);

});