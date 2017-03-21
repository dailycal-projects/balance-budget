var MONEY_TO_PIXELS = 20;
var REVENUE_DENSITY = 0.1;

var state = {
    revenue: 2,
    expenses: 1
};

var kinematics = {
    x: -22,
    vel: 0
};

var sgn = function (x) {
    if (x == 0) {
        return 0;
    } else if (x > 0) {
        return 1;
    } else {
        return -1;
    }
};

var bound_volume = function (vol) {
    if (vol <= 0) {
        return 0;
    } else if (vol > state.expenses + state.revenue) {
        return state.expenses + state.revenue;
    } else {
        return vol;
    }
};

var update = function (t) {
    state.revenue = d3.select("#revenue-slider").property('value');
    state.expenses = d3.select("#expenses-slider").property('value');
    var expense_density = 2.0;
    var volume_underwater = bound_volume(1/2 * (state.expenses + state.revenue) + kinematics.x);

    var expected_x = (state.expenses - state.revenue) * MONEY_TO_PIXELS;

    var restoring_force = (expected_x - kinematics.x);
    var damping_force = -1 * kinematics.vel * 3;
    var net_force = restoring_force + damping_force;
    kinematics.vel += net_force / 500;
    kinematics.x += kinematics.vel;
};

var sinking_ship = d3.select("#sinking-ship");

var frame = function (t) {
    update(t);
    var revenue_height = state.revenue * MONEY_TO_PIXELS;
    var expenses_height = state.expenses * MONEY_TO_PIXELS;
    var translate = 150 + kinematics.x - state.revenue * MONEY_TO_PIXELS;
    sinking_ship.select("#ship")
        .attr("transform", "translate(-25," + translate + ")");
    sinking_ship.select("#revenue")
        .attr("height", revenue_height)
        .attr("width", "50px");
    sinking_ship.select("#expenses")
        .attr("height", expenses_height)
        .attr("width", "50px")
        .attr("y", revenue_height);
    var shortfall_height = revenue_height - expenses_height;
    var shortfall_translate = 0;
    var shortfall_color = "red";
    if (revenue_height - expenses_height > 0) {
        shortfall_translate = -1 * (shortfall_height);
        shortfall_color = "green";
    }
    sinking_ship.select("#shortfall")
        .attr("height", Math.abs(shortfall_height) + "px")
        .attr("width", "5px")
        .attr("y", 150)
        .attr("transform", "translate(35," + shortfall_translate + ")")
        .attr("fill", shortfall_color);
    requestAnimationFrame(frame);
};

requestAnimationFrame(frame);