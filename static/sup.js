var inititate = function(){

console.log(d3.select("body"));

window.svg = d3.select("body")
.insert("svg","form")
.attr("class","top_plot")
.attr("width", train_pool_width*2)
.attr("height", train_pool_height*2);

window.svg.append("rect").attr({
    "x" : 0,
    "y" : 0,
    "width" : "1000",
    "height" : "500",
    "fill": "none",
    "stroke":"pink",
    "stroke-width" : 10
});

window.svg.append("rect").attr({
    "x": 1005,
    "y": 0,
    "width" : "1000",
    "height" : "500",
    "fill": "none",
    "stroke":"black",
    "stroke-width" : 10 
});



window.states = [];

for (i = 0; i < total_data.length; i++) { 
    row = parseInt( i/points_per_row );     
    col = (i+1) % 20 - 1;
    key = Object.keys(total_data[i]);
    window.states.push({x:col*radius*2+radius,y: row*radius*2+radius,label:label_to_color_map[[total_data[i][key]]],'data_path':key });
}


var gStates = svg.selectAll( "g.state").data(states);

var gState = gStates.enter().append( "g")
    .attr({
        "transform" : function( d) {
            return "translate("+ [d.x,d.y] + ")";
        },
        'class'     : 'state' 
    });


gState.call( drag);

gState.append( "circle")
    .attr({
        r       : radius + 4,
        class   : 'outer',
        fill    : function(d) {return d.label;}
    })
;
gState.append( "circle")
    .attr({
        r       : radius,
        class   : 'inner'
    })
    .on( "click", function( d, i) {
        var e = d3.event,
            g = this.parentNode,
            isSelected = d3.select( g).classed( "selected");

        if( !e.ctrlKey) {
            d3.selectAll( 'g.selected').classed( "selected", false);
        }
        
        d3.select( g).classed( "selected", !isSelected);

            // reappend dragged element as last 
            // so that its stays on top 
        g.parentNode.appendChild( g);
    })
    .on("mouseover", function(){
        d3.select(this).style( "fill", "aliceblue");
    })
    .on("mouseout", function() { 
        d3.select(this).style("fill", "white");
    });
;        


}


// ------------------------------------------
// ------------------------------------------
// Start the game of rect selection
// ------------------------------------------
// ------------------------------------------
var Rect_Display = true;
var Prohibit_Mouse_Start_From_Circle_Check = true;

window.svg.on( "mousedown", function() {

    if( !d3.event.ctrlKey) {
        d3.selectAll( 'g.selected').classed( "selected", false);
    }
    
    var p = d3.mouse( this);

    d3.selectAll( 'g.state >circle.inner').each( function( state_data, i) {
            if( 
                Math.abs(state_data.x-p[0])<=radius && Math.abs(state_data.y-p[1])<=radius ) {
                d3.select( this.parentNode)
                .classed( "selected", true);
                Rect_Display = false;
            }
        });


    if(Rect_Display){


    svg.append( "rect")
    .attr({
        rx      : 6,
        ry      : 6,
        class   : "selection",
        x       : p[0],
        y       : p[1],
        width   : 0,
        height  : 0
    })
    }
    
})
.on( "mousemove", function() {

	if(Rect_Display){

	
    var s = svg.select( "rect.selection");

    if( !s.empty()) {
        var p = d3.mouse( this),
            d = {
                x       : parseInt( s.attr( "x"), 10),
                y       : parseInt( s.attr( "y"), 10),
                width   : parseInt( s.attr( "width"), 10),
                height  : parseInt( s.attr( "height"), 10)
            },
            move = {
                x : p[0] - d.x,
                y : p[1] - d.y
            }
        ;

        if( move.x < 1 || (move.x*2<d.width)) {
            d.x = p[0];
            d.width -= move.x;
        } else {
            d.width = move.x;       
        }

        if( move.y < 1 || (move.y*2<d.height)) {
            d.y = p[1];
            d.height -= move.y;
        } else {
            d.height = move.y;       
        }
       
        s.attr( d);

            // deselect all temporary selected state objects
        d3.selectAll( 'g.state.selection.selected').classed( "selected", false);

        d3.selectAll( 'g.state >circle.inner').each( function( state_data, i) {
            if( 
                !d3.select( this).classed( "selected") && 
                    // inner circle inside selection frame
                state_data.x-radius>=d.x && state_data.x+radius<=d.x+d.width && 
                state_data.y-radius>=d.y && state_data.y+radius<=d.y+d.height
            ) {

                d3.select( this.parentNode)
                .classed( "selection", true)
                .classed( "selected", true);
            }
        });
    }}
})
.on( "mouseup", function() {
       // remove selection frame (the rectangle)
    svg.selectAll( "rect.selection").remove();

    var p = d3.mouse(this);
    console.log(p);
        // remove temporary selection marker class
    var slection_objects = d3.selectAll('.selected>circle.inner');

        var new_time = new Date().getTime() / 1000;
        mouseup_timer += (new_time - current_time);
        current_time = new_time;
    

    slection_objects.each(function(d,i){
        if(decide_enter_redzone(d.x)){
        var the_elements = d3.selectAll('g.selected>circle');
        universal_tester = the_elements;
        console.log(this);
        var adjustment = String(train_pool_width*2 - p[0])+ " " + String(parseInt(train_pool_height/2)-p[1])
        
        the_elements.append("animateTransform").attr(
            {
                attributeName:"transform",
                type:"translate",
                from:"0 0",
                to:adjustment,
                begin :String(mouseup_timer)+"s",
                dur:"2s",
                repeatCount:1,
                fill : "freeze"
            });

        setTimeout(function(){
        the_elements.each(function(){
            this.style.visibility = "hidden";
            d3.select(this.parentNode).classed("selected",false);
        });

        },1500);
        var data_in_the_element = the_elements.data()[0];
        var new_key = data_in_the_element['data_path'][0];
        var new_obj = {};
        new_obj[new_key] = data_in_the_element['label'];
        data_json["train_set"].push(new_obj);
        data_json["test_set"].splice(data_json["test_set"].indexOf(new_obj),1);

        }

    });

    //d3.selectAll( 'g.state.selection').classed( "selection", false);


          //if(decide_enter_redzone(se))
           /*d3.selectAll('g.state.selection>circle').append("animateTransform").attr(
            {
                attributeName:"transform",
                type:"translate",
                from:"0 0",
                to:"300 20",
                begin :"0s",
                dur:"1s",
                repeatCount:1
            });

            */
    if(d3.selectAll('.selected')[0].length >0){
    	Rect_Display = !Rect_Display;

    }
        d3.selectAll( 'g.state.selection').classed( "selection", false); 
        d3.selectAll( 'g.state.selection').classed( "selected", false); 

});