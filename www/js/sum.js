$(document).on('pagecreate', '#sum', function() {
	var max = 4;
	var row = $("#row_size").val();

	var addend;
	var numSum;
	var numCar;

	var arrAdd = new Array(max);
	var arrSum = new Array(max);
	var arrCar = new Array(max);

	var isSleep;


	$.mobile.defaultPageTransition = 'none';

	generate_pad($("#sumPad"));

	generate();
	initialize();
	calculate();
	display();

	$("#sumPad .ui-btn").tap(function(){
		if ( !isSleep && verify($(this).val()) ) {
			isSleep = true;
			setTimeout( function(){
				if ( isSleep ) {
					shift();
					calculate();
					display();
					isSleep = false;
				}
			}, 1000);
		}
		return false;
	});
	$("#sumGen").tap(function(){
		initialize();
		calculate();
		display();
		return false;
	});
	$("#row_size").change(function(){
		row = $("#row_size").val();
		generate();
		validate_help_mode();
		initialize();
		calculate();
		display();
		window.history.back();
	});
	$("#help_mode").change(function(){
		validate_help_mode();
	});


	function validate_help_mode() {
		if ( $("#help_mode").prop("checked") ) {
			$("#sumCarRow").show();
		} else {
			$("#sumCarRow").hide();
		}
	}

	function generate() {
		var r, c;
		var inner = '<TABLE cellspacing="0" cellpadding="0">';

		for ( r = 0; r < row-1; r++ ) {
			inner += '<TR>';
			inner += '<TD class="tdTitle">addend ' + (r+1) + ':&#160;</TD>';
			inner += '<TD class="tdColumn"></TD>';
			inner += '<TD class="tdColumn"><SPAN id="addend' + r + '"></SPAN></TD>';
			for ( c = 0; c < max; c++ ) {
				inner += '<TD class="tdColumn"><SPAN id="addend' + r + '_' + c + '"></SPAN></TD>';
			}
			inner += '<TD class="tdColumn">&#160;</TD>';
			inner += '</TR>';
		}

		inner += '<TR>';
		inner += '<TD class="tdTitle">addend ' + row + ':&#160;</TD>';
		inner += '<TD class="tdColUnder">+&#160;</TD>';
		inner += '<TD class="tdColUnder"><SPAN id="addend' + (row-1) + '">&#160;</SPAN></TD>';
		for ( c = 0; c < max; c++ ) {
			inner += '<TD class="tdColUnder"><SPAN id="addend' + (row-1) + '_' + c + '">&#160;&#160;</SPAN></TD>';
		}
		inner += '<TD class="tdColUnder">&#160;</TD>';
		inner += '</TR>';

		inner += '<TR>';
		inner += '<TD class="tdTitle">sum:&#160;</TD>';
		inner += '<TD class="tdColumn"><SPAN id="addRes"></SPAN></TD>';
		inner += '<TD class="tdColBold"><SPAN id="addSum">?</SPAN></TD>';
		for ( c = 0; c < max; c++ ) {
			inner += '<TD class="tdColumn"><SPAN id="addSum' + c + '"></SPAN></TD>';
		}
		inner += '<TD class="tdColumn"></TD>';
		inner += '</TR>';

		inner += '<TR id="sumCarRow">';
		inner += '<TD class="tdTitle">carry:&#160;</TD>';
		inner += '<TD class="tdColumn"></TD>';
		inner += '<TD class="tdColumn">&#160;</TD>';
		for ( c = 0; c < max; c++ ) {
			inner += '<TD class="tdUpper"><SPAN id="addCar' + c + '"></SPAN></TD>';
		}
		inner += '<TD class="tdColumn"></TD>';
		inner += '</TR>';

		inner += '</TABLE>';

		$("#sumHTML").html(inner);
	}

	function initialize() {
		var c, r;

		numCar = 0;
		for ( c = 0; c < max; c++ ) {
			arrAdd[c] = new Array(row);
			for ( r = 0; r < row; r++ ) {
				arrAdd[c][r] = '&#160;';
			}
			arrSum[c] = '&#160;';
			arrCar[c] = '&#160;';
		}

		isSleep = false;
	}

	function calculate() {
		var r;
		var result = numCar;

		addend = new Array(row);
		for ( r = 0; r < row; r++ ) {
			addend[r] = random_digit(1);
			result += addend[r];
		}

		numSum = result % 16;
		numCar = Math.floor( result / 16 );
	}

	function display() {
		var c, r;

		for ( r = 0; r < row; r++ ) {
			$("#addend"+r).html(convert_hex(addend[r]));
		}

		$("#addRes").html("&#160;");
		$("#addSum").html("?");

		for ( c = 0; c < max; c++ ) {
			for ( r = 0; r < row; r++ ) {
				$("#addend"+r+"_"+c).html("&#160;" + arrAdd[c][r]);
			}
			$("#addSum"+c).html(arrSum[c]);
			$("#addCar"+c).html(arrCar[c]);
		}
	}

	function verify(val) {
		if ( val == numSum ) {
			$("#addRes").html("&#10004;").css("color","green");
			$("#addSum").html(convert_hex(val));
			return true;
		} else {
			$("#addRes").html("&#10005;").css("color","red");
			$("#addSum").html(convert_hex(val));
			return false;
		}
	}

	function shift() {
		var r;
		var arr = new Array(row);

		for ( r = 0; r < row; r++ ) {
			arr[r] = convert_hex(addend[r]);
		}

		arrAdd.unshift(arr);
		arrSum.unshift(convert_hex(numSum));
		arrCar.unshift(convert_hex(numCar));

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
