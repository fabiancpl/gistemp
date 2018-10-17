{

	var selection = {
		'global' : [ {
			'serie' : 'Global Temperature',
			'trend' : 'Global Trend'
		} ],
		'hemispheres' : [ {
			'serie' : 'Northern Temperature',
			'trend' : 'Northern Trend'
		},
		{
			'serie' : 'Southern Temperature',
			'trend' : 'Southern Trend'
		} ],
	}

	var attrselection = ''

	function drawTimeSeries( data ) {

		var svg = d3.select( '#timeseries' ),
			margin = { top: 50, right: 30, bottom: 70, left: 40 },
			iwidth = +svg.attr( "width" ) - margin.left - margin.right,
			iheight = +svg.attr( "height" ) - margin.top - margin.bottom;
		
		var g = svg.append( 'g' ).attr( 'transform', 'translate(' + margin.left + ',' + margin.top + ')' );

		var x = d3.scaleBand()
			.rangeRound( [ 0, iwidth ] )
			.padding( 0.1 );

		var y = d3.scaleLinear()
			.rangeRound( [ iheight, 0 ] );

		var z = d3.scaleOrdinal( d3.schemeCategory10 );

		var serie = d3.line()
    		.x( d => x( d[ 'Year-Season' ] ) )
    		.y( d => y( d[ 'Global Temperature' ] ) );

    	var trend = d3.line()
    		.x( d => x( d[ 'Year-Season' ] ) )
    		.y( d => y( d[ 'Global Trend' ] ) );

		x.domain( data.map( d => d[ 'Year-Season' ] ) );
		y.domain( [ 0, d3.max( data, d => d[ 'Global Temperature' ] ) ] );

		function make_x_gridlines() {		
			return d3.axisBottom( x )
				.ticks( 5 );
		}

		function make_y_gridlines() {		
 			return d3.axisLeft( y )
				.ticks( 5 );
		}

		g.append( "g" )			
			.attr( "class", "grid" )
			.attr( "transform", "translate(0," + iheight + ")" )
			.call( make_x_gridlines()
				.tickSize( -iheight )
				.tickFormat( "" )
			)

		g.append( "g" )			
			.attr( "class", "grid" )
			.call( make_y_gridlines()
				.tickSize( -iwidth )
				.tickFormat( "" )
			)

		var xAxis = g.append( 'g' )
			.attr( 'class', 'axis' )
			.attr( 'transform', 'translate(0,' + iheight + ')' )
			.call( d3.axisBottom( x ) );
		
		xAxis.selectAll("text")  
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", "rotate(-65)" );
		
		xAxis.append( 'text' )
				.attr( 'fill', '#000' )
				.attr( 'y', 45 )
				.attr( 'x', iwidth )
				.attr( 'dy', '1em' )
				.attr( 'text-anchor', 'end' )
				.text( 'Year-Season' )
				.style( "font", "12px sans-serif" );

		g.append( 'g' )
			.attr( 'class', 'axis' )
			.call( d3.axisLeft( y ).ticks( null, ".1f" ) )
			.append( 'text' )
				.attr( 'fill', '#000' )
				.attr( 'transform', 'rotate(-90)' )
				.attr( 'y', -40 )
				.attr( 'dy', '1em' )
				.attr( 'text-anchor', 'end' )
				.text( 'Temperature Anomaly Mean' )
				.style( "font", "12px sans-serif" );

		color = z()

		g.append( "path" )
			.datum( data )
			.attr( "class", "serie" )
			.attr( "fill", "none" )
			.attr( "stroke", color )
			.attr( "stroke-width", 1.5 )
			.attr( "stroke-linejoin", "round" )
			.attr( "stroke-linecap", "round" )
			.attr( "d", serie );

		g.append( "path" )
			.datum( data )
			.attr( "class", "trend" )
			.attr( "fill", "none" )
			.attr( "stroke", z(1) )
			.attr( "stroke-width", 1.5 )
			.attr( "stroke-linejoin", "round" )
			.attr( "stroke-linecap", "round" )
			.style( "stroke-dasharray", ( "3, 3" ) )
			.attr( "d", trend );

	}

	function drawBarChart( data ) {

		var svg = d3.select( '#ipsByNature' ),
			margin = { top: 50, right: 30, bottom: 35, left: 40 },
			iwidth = +svg.attr( "width" ) - margin.left - margin.right,
			iheight = +svg.attr( "height" ) - margin.top - margin.bottom;
		
		var g = svg.append( 'g' ).attr( 'transform', 'translate(' + margin.left + ',' + margin.top + ')' );

		var x = d3.scaleBand()
			.rangeRound( [ 0, iwidth ] )
			.padding( 0.1 );

		var y = d3.scaleLinear()
			.rangeRound( [ iheight, 0 ] );

		var z = d3.scaleOrdinal( d3.schemeCategory10 );

		var divTooltip = d3.select( "body" ).append( "div" )	
			.style( "position", "absolute" )
			.style( "text-align", "center" )
			.style( "width", "100px" )
			.style( "height", "28px" )
			.style( "padding", "2px" )
			.style( "font", "12px sans-serif" )
			.style( "background", "lightsteelblue" )
			.style( "border", "0px" )
			.style( "border-radius", "8px" )
			.style( "pointer-events", "none" )
			.style( "opacity", 0 );

		x.domain( data.map( d => d[ 'key' ] ) );
		y.domain( [ 0, d3.max( data, d => d[ 'value' ] ) ] )
		
		g.append( 'g' )
			.attr( 'class', 'axis' )
			.attr( 'transform', 'translate(0,' + iheight + ')' )
			.call( d3.axisBottom( x ) )
			.append( 'text' )
				.attr( 'fill', '#000' )
				.attr( 'y', 20 )
				.attr( 'x', iwidth )
				.attr( 'dy', '1em' )
				.attr( 'text-anchor', 'end' )
				.text( 'Naturaleza' )
				.style( "font", "12px sans-serif" );

		g.append( 'g' )
			.attr( 'class', 'axis' )
			.call( d3.axisLeft( y ).ticks( null, ".0f" ) )
			.append( 'text' )
				.attr( 'fill', '#000' )
				.attr( 'transform', 'rotate(-90)' )
				.attr( 'y', 6 )
				.attr( 'dy', '1em' )
				.attr( 'text-anchor', 'end' )
				.text( 'Num. IPSs' )
				.style( "font", "12px sans-serif" );


		g.selectAll( '.bar' )
			.data( data )
			.enter().append( 'rect' )
				.attr( 'class', 'bar' )
				.attr( 'x', function( d ) { return x( d[ 'key' ] ); } )
				.attr( 'y', function( d ) { return y( d[ 'value' ] ); })
				.attr( 'width', x.bandwidth() )
				.attr( 'height', function( d ) { return iheight - y( d[ 'value' ] ); } )
				.attr( 'fill', d => z( d[ 'key' ] ) )
				.on( "mouseover", function( d ) {		
					
					divTooltip.transition()		
						.duration( 200 )		
						.style( "opacity", .9 );		
					
					divTooltip.html( d.key + "<br/>"  + d.value )	
						.style( "left", ( d3.event.pageX ) + "px" )		
						.style( "top", ( d3.event.pageY ) + "px" );
        
					d3.selectAll( "svg" ).selectAll( "rect.bar" )
						.select( function( di ) { return di.key !== d.key ? this : null ; } )
						.transition()
							.style( "opacity", "0.2" );

				} )
				.on( "mouseout", function( d ) {		

					divTooltip.transition()
						.duration( 500 )		
						.style( "opacity", 0 );
        
					d3.selectAll( "svg" ).selectAll( "rect" )
						.select( function( di ) { return di.key !== d.key ? this : null ; } )
						.transition()
							.style( "opacity", "1" );
     
      } );

	}

	function drawGropuedBarChart( data, id, attrselection = 'Núm. IPSs' ) {

		d3.select( ( '#' + id ) ).html( '' );

		var svg = d3.select( ( '#' + id ) ),
			margin = { top: 50, right: 30, bottom: 35, left: 40 },
			iwidth = +svg.attr( "width" ) - margin.left - margin.right,
			iheight = +svg.attr( "height" ) - margin.top - margin.bottom;
		
		var g = svg.append( 'g' ).attr( 'transform', 'translate(' + margin.left + ',' + margin.top + ')' );

		var x0 = d3.scaleBand()
			.rangeRound( [ 0, iwidth ] )
			.paddingInner( 0.1 );

			var x1 = d3.scaleBand()
			.padding( 0.05 );

			var y = d3.scaleLinear()
			.rangeRound( [ iheight, 0 ] );

			var z = d3.scaleOrdinal( d3.schemeCategory10 );
  
		var divTooltip = d3.select( "body" ).append( "div" )	
			.style( "position", "absolute" )
			.style( "text-align", "center" )
			.style( "width", "100px" )
			.style( "height", "28px" )
			.style( "padding", "2px" )
			.style( "font", "12px sans-serif" )
			.style( "background", "lightsteelblue" )
			.style( "border", "0px" )
			.style( "border-radius", "8px" )
			.style( "pointer-events", "none" )
			.style( "opacity", 0 );

		var keys = Object.keys( data[ 0 ] ).slice( 1 );
		
		x0.domain( data.map( d => d[ 'Nivel de Atención' ] ) );
		x1.domain( keys ).rangeRound( [ 0, x0.bandwidth() ] );
		y.domain( [ 0, d3.max( data, function(d) { return d3.max( keys, function( key ) { return d[ key ]; } ); } ) ] ).nice();

		g.append( "g" )
			.attr( 'class', 'axis' )
			.attr( 'transform', 'translate(0,' + iheight + ')' )
			.call( d3.axisBottom( x0 ) )
			.append( 'text' )
				.attr( 'fill', '#000' )
				.attr( 'y', 20 )
				.attr( 'x', iwidth )
				.attr( 'dy', '1em' )
				.attr( 'text-anchor', 'end' )
				.text( 'Nivel de Atención' )
				.style( "font", "12px sans-serif" );

		g.append( "g" )
			.attr( 'class', 'axis' )
			.call( d3.axisLeft( y ).ticks( null, ".0f" ) )
			.append( 'text' )
				.attr( 'fill', '#000' )
				.attr( 'transform', 'rotate(-90)' )
				.attr( 'y', 6 )
				.attr( 'dy', '1em' )
				.attr( 'text-anchor', 'end' )
				.text( attrselection )
				.style( "font", "12px sans-serif" );

		g.append( "g" )
			.selectAll( "g" )
			.data( data )
			.enter().append( "g" )
				.attr( "transform", d => "translate(" + x0( d[ 'Nivel de Atención' ] ) + ",0)" )
				.selectAll( "rect" )
				.data( function( d ) { return keys.map( function( key ) { return { key: key, value: d[ key ] }; } ); } )
				.enter().append( "rect" )
				.attr( "class", "bar" )
				.attr( "x", d => x1( d.key ) )
				.attr( "y", d => y( d.value ) )
				.attr( "width", x1.bandwidth())
				.attr( "height", d => iheight - y( d.value ) )
				.attr( "fill", d => z( d.key ) )
				.on("mouseover", function( d ) {		
					
					divTooltip.transition()		
						.duration( 200 )		
						.style( "opacity", .9 );		
				
					divTooltip.html( d.key + "<br/>"  + d.value )	
						.style( "left", ( d3.event.pageX ) + "px" )		
						.style( "top", ( d3.event.pageY ) + "px" );

					d3.selectAll( "svg" ).selectAll( "rect.bar" )
						.select( function( di ) { return di.key !== d.key ? this : null ; } )
						.transition()
							.style( "opacity", "0.2" );

				} )					
				.on( "mouseout", function( d ) {

					divTooltip.transition()		
						.duration( 500 )		
						.style( "opacity", 0 );

					d3.selectAll( "svg" ).selectAll( "rect" )
						.select( function( di ) { return di.key !== d.key ? this : null ; } )
						.transition()
							.style( "opacity", "1" );

				} );

	}

	function filterByDesc( data, attribute ) {

		return ipsByLevelByNature = d3.nest()
			.key( function( d ) { return d[ 'Nivel de Atención' ]; } )
			.key( function( d ) { return d[ 'Naturaleza' ]; } )
			.rollup( function( v ) { return d3.sum( v, function( d ) { return d[ attribute ]; } ); } )
			.entries( data );

	}

	d3.csv( './data/timeseries.csv', function ( d ) {
		return {
			'Year-Season': d[ 'Year-Season' ],
			'Global Temperature': +d[ 'Global Temperature' ],
			'Global Trend': +d[ 'Global Trend' ],
			'Northern Temperature': +d[ 'Northern Temperature' ],
			'Northern Trend': +d[ 'Northern Trend' ],
			'Southern Temperature	': +d[ 'Southern Temperature' ],
			'Southern Trend': +d[ 'Southern Trend' ]			
		};
	} ).then( function( data ) {

		console.log( data );

		drawTimeSeries( data );

		/* Chart 1 */

		var ipsByNature = d3.nest()
			.key( function( d ) { return d[ 'Naturaleza' ]; } )
			.rollup( function( v ) { return v.length; } )
			.entries( data );

		drawBarChart( ipsByNature )

		/* Chart 2 */

		var ipsByLevelByNature = d3.nest()
			.key( function( d ) { return d[ 'Nivel de Atención' ]; } )
			.key( function( d ) { return d[ 'Naturaleza' ]; } )
			.rollup( function( v ) { return v.length; } )
			.entries( data );

		ipsByLevelByNature_new = []
		ipsByLevelByNature.forEach( function( level, level_i ) {
			a = { 'Nivel de Atención' : level.key };			
			level.values.forEach( function( nature, nature_i ) {
				a[ nature.key ] = nature.value;
			} );
			ipsByLevelByNature_new.push( a );
		} );

		drawGropuedBarChart( ipsByLevelByNature_new, 'ipsByLevelByNature' );

		/* Chart 3 */

		function draw( attrselection ) {

			ipsByLevelByNatureByDesc = filterByDesc( data, attrselection )
		
			ipsByLevelByNatureByDesc_new = []
			ipsByLevelByNatureByDesc.forEach( function( level, level_i ) {
				a = { 'Nivel de Atención' : level.key };			
				level.values.forEach( function( nature, nature_i ) {
					a[ nature.key ] = nature.value;
				} );
				ipsByLevelByNatureByDesc_new.push( a );
			} );

			drawGropuedBarChart( ipsByLevelByNatureByDesc_new, 'ipsByLevelByNatureByDesc', attrselection );

		}

		draw( 'Camas Adultos' );

		d3.select( "#attrselection" ).on( "change", function() {
			attrselection = this.value;
			console.log( attrselection + " selected" );
			draw( attrselection );
		} );

  } );

}