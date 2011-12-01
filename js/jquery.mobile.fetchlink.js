(function( $, undefined ) {

$.widget( "mobile.fetchlink", $.mobile.widget, {
	options: {
		initSelector: ":jqmData(role='fetchlink')"
	},
	_create: function() {
		
		// Prototyping.
	//	$( this.element.data( 'fragment' ) ).hide();
		
		$( this.element ).click(function() {
			var el			= $( this ),
				url		    = el.attr( 'href' ),
				target		= el.data( "target" ),
				targetEl	= target && $( target ) || el,
				load		= el.data( "fragment" ) /* Needs a proper default (page, most likely). */,
				threshold	= screen.width > parseInt( el.data( "breakpoint" ) || 0 ),
				methods		= [ "append", "prepend", "replace", "before", "after" ],
				method      = "html",
				url;
			
			if ( threshold ) {
				for( var ml = methods.length, i=0; i < ml; i++ ){
					if( el.is( "[data-include='" + methods[ i ] + "']" ) ){
						method	= methods[ i ];
					}
				}

				if ( method === "replace" ){
					method += "With";
				}

				if ( url && method ){
					$.get( url, function( data ) {
						/* Swiped from the jQuery core; $.get() should really be replaced by .load() */
						var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
							responseEl = $( load ? $("<div/>").append( data.replace( rscript, "" ) ).find( load ) : data );

						/* Do we want to do this? */
						$( load ).remove();
						targetEl[ method ]( responseEl )
												
						responseEl
							.trigger( "create" )
							.trigger( "fetchlink", { target : targetEl, data: responseEl } );
					});
				}
			}
			return false;
		});

	}
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$( $.mobile.fetchlink.prototype.options.initSelector, e.target ).fetchlink();
});

})( jQuery );
