d3.csv("../images/element_of_anatomy.csv", function(error, data) {
    if (error) throw error;

    var margin = {
            top: 20,
            left: 20,
            bottom: 20,
            right: 20
        },
        height = 500 - margin.top - margin.bottom,
        width = 500 - margin.left - margin.right;

    data.forEach(function(d) {
        d.atomic_number = +d.atomic_number;
        d.fraction_of_mass = +d.fraction_of_mass;
        d.mass_kg = +d.mass_kg * 50;
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

    var color = d3.scaleLinear()
        .range(["deepskyblue", "#cc0000"])
        .domain([0, d3.max(data, function(d) {
            return d.atomic_radius_in_pm;
        })]);


    // var groupColor = ["#D02D44", "#AD1328", "#1F7E01", "#165B00","#8E0114", "#66000E",  "#953B01", "#6B2A00", 
    // 					"#1E8C76", "#0D7460", "#DB732F", "#B65414", "#4BB928", "#329A11", "#165B00","#8E0114",
    // 					"#E4566A", "#3A9986", "#005F4D", "#004437"];

    var pack = d3.pack()
        .size([width, height])
        .padding(0.5);

    var svg = d3.select("#elements")
        .append("div")
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 500 500")
        .classed("svg-content-responsive", true);

    var test = [];

    data.forEach(function(d) {
        for (var i = 0; i < d.mass_kg; i++) {
            test.push({
                atom: d.atomic_radius_in_pm,
                element: d.element_anatomy_elements,
                color: d.CPK_color_in_RRGGBB_hex_format,
                group: d.periodic_group
            });
        }
    });

    // console.log(test, data.element_anatomy_elements);

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

    d3.selection.prototype.moveToFront = function() {
        return this.each(function() {
            this.parentNode.appendChild(this);
        });
    };

    test.shuffle();

    // console.log(test);

    var root = d3.hierarchy({
            children: test
        })
        .sum(function(d) {
            // console.log(d.atom);
            return d.atom;
        });
    // .sort(function (a, b) {
    // 	// console.log(a.value);
    // 	return a.value - b.value;
    // });

    pack(root);


    function go(d) {


        circles = svg.selectAll("circle")
            .data(root.descendants().slice(1))
            .enter().append("circle")
            .attr("r", function(d) {
                return d.r;
            })
            .attr("cx", function(d) {
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            })
            .style("fill", function(d) {
                // console.log("#" + d.data.color);
                // return (groupColor[d.data.group]);
                return color(d.data.atom);
            })
            .on("mouseover", function(d) {
                d3.select(this)
                    .attr("r", function(d) {
                        return d.r * 5;
                    })
                    .style("stroke", "white")
                    .moveToFront();
            })
            .on("mouseout", function(d) {
                d3.select(this)
                    .attr("r", function(d) {
                        return d.r;
                    })
                    .style("stroke", null);
            });
    }

    d3.select("#switch").on("click", function() {
        console.log(test);
        // go(data);
        test.shuffle();

        // console.log(test);

        root = d3.hierarchy({
                children: test
            })
            .sum(function(d) {
                // console.log(d.atom);
                return d.atom;
            });
        // .sort(function (a, b) {
        // 	// console.log(a.value);
        // 	return a.value - b.value;
        // });

        pack(root);

        svg.selectAll("circle")
            .data(root.descendants().slice(1));

        circles.transition()
            .duration(3000)
            .attr("r", function(d) {
                return d.r;
            })
            .attr("cx", function(d) {
                // console.log(d);
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            })
            .style("fill", function(d) {
                // console.log("#" + d.data.color);
                // return (groupColor[d.data.group]);
                return color(d.data.atom);
            });

    });
    go(data);
});