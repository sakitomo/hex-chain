$(document).on('pagecreate', '#sum', function() {
	var max = 4;
	var row = 4;

	var addend;
	var numSum;
	var numCar;

	var arrAdd = new Array(max);
	var arrSum = new Array(max);
	var arrCar = new Array(max);

	var isSleep;


	generate();
	initialize();
	calculate();
	display();
	$("#sum div.divNum input:button").click(function(){
		if ( !isSleep && verify($(this).val()) ) {
			isSleep = true;
			setTimeout( function() {
				if ( isSleep ) {
					shift();
					calculate();
					display();
					isSleep = false;
				}
			}, 1000);
		}
	});
	$("#sumGen").click(function(){
		initialize();
		calculate();
		display();
	});
	$("#help_mode").change(function(){
		if ( $("#help_mode").prop("checked") ) {
			$("#sumCarRow").show();
		} else {
			$("#sumCarRow").hide();
		}
	});
	$("#row_size").change(function(){
		row = $("#row_size").val();
		generate();
		initialize();
		calculate();
		display();
		window.history.back();
	});


	function generate() {
		var i, j;
		var inner = '<TABLE cellspacing="0" cellpadding="0">';

		for ( i = 0; i < row-1; i++ ) {
			inner += '<TR>';
			inner += '<TD class="tdTitle">addend ' + (i+1) + ':&#160;</TD>';
			inner += '<TD class="tdColumn"></TD>';
			inner += '<TD class="tdColumn"><SPAN id="addend' + i + '"></SPAN></TD>';
			for ( j = 0; j < max; j++ ) {
				inner += '<TD class="tdColumn"><SPAN id="addend' + i + '_' + j + '"></SPAN></TD>';
			}
			inner += '<TD class="tdColumn">&#160;</TD>';
			inner += '</TR>';
		}

		inner += '<TR>';
		inner += '<TD class="tdTitle">addend ' + row + ':&#160;</TD>';
		inner += '<TD class="tdColumn tdColUnder">+&#160;</TD>';
		inner += '<TD class="tdColumn tdColUnder"><SPAN id="addend' + (row-1) + '">&#160;</SPAN></TD>';
		for ( i = 0; i < max; i++ ) {
			inner += '<TD class="tdColumn tdColUnder"><SPAN id="addend' + (row-1) + '_' + i + '">&#160;&#160;</SPAN></TD>';
		}
		inner += '<TD class="tdColumn tdColUnder">&#160;</TD>';
		inner += '</TR>';

		inner += '<TR>';
		inner += '<TD class="tdTitle">sum:&#160;</TD>';
		inner += '<TD class="tdColumn"><SPAN id="addRes"></SPAN></TD>';
		inner += '<TD class="tdColumn tdColBold"><SPAN id="addSum">?</SPAN></TD>';
		for ( i = 0; i < max; i++ ) {
			inner += '<TD class="tdColumn"><SPAN id="addSum' + i + '"></SPAN></TD>';
		}
		inner += '<TD class="tdColumn"></TD>';
		inner += '</TR>';

		inner += '<TR id="sumCarRow">';
		inner += '<TD class="tdTitle">carry:&#160;</TD>';
		inner += '<TD class="tdColumn"></TD>';
		inner += '<TD class="tdColumn">&#160;</TD>';
		for ( i = 0; i < max; i++ ) {
			inner += '<TD class="tdUpper"><SPAN id="addCar' + i + '"></SPAN></TD>';
		}
		inner += '<TD class="tdColumn"></TD>';
		inner += '</TR>';

		inner += '</TABLE>';

		$("#sumHTML").html(inner);
	}

	function initialize() {
		var i, j;

		numCar = 0;
		for ( i = 0; i < max; i++ ) {
			arrAdd[i] = new Array(row);
			for ( j = 0; j < row; j++ ) {
				arrAdd[i][j] = '&#160;';
			}
			arrSum[i] = '&#160;';
			arrCar[i] = '&#160;';
		}

		isSleep = false;
	}

	function calculate() {
		var result = numCar;

		addend = new Array(row);
		for ( i = 0; i < row; i++ ) {
			addend[i] = random_digit(1);
			result += addend[i];
		}

		numSum = result % 16;
		numCar = Math.floor( result / 16 );
	}

	function display() {
		var i;

		for ( i = 0; i < row; i++ ) {
			$("#addend"+i).html( convert_hex(addend[i]) );
		}

		$("#addRes").html("&#160;");
		$("#addSum").html("?");

		for ( i = 0; i < max; i++ ) {
			for ( j = 0; j < row; j++ ) {
				$("#addend"+j+"_"+i).html( "&#160;" + arrAdd[i][j] );
			}
			$("#addSum"+i).html( arrSum[i] );
			$("#addCar"+i).html( arrCar[i] );
		}
	}

	function verify(val) {
		if ( val == convert_hex(numSum) ) {
			$("#addRes").html("&#10004;").css("color","green");
			$("#addSum").html(val);
			return true;
		} else {
			$("#addRes").html("&#10005;").css("color","red");
			$("#addSum").html(val);
			return false;
		}
	}

	function shift() {
		var arr = new Array(row);

		for ( i = 0; i < row; i++ ) {
			arr[i] = convert_hex(addend[i]);
		}

		arrAdd.unshift( arr );
		arrSum.unshift( convert_hex(numSum) );
		arrCar.unshift( convert_hex(numCar) );

		while ( arrAdd.length > max ) {
			arrAdd.pop();
		}

		while ( arrSum.length > max ) {
			arrSum.pop();
		}

		while ( arrCar.length > max ) {
			arrCar.pop();
		}
	}


});
