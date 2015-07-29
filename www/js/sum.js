$(document).on('mobileinit', function() {
	$.mobile.defaultPageTransition = 'none';
});


$(document).on('pagecreate', '#sum', function() {
	UTL.generate_pad($("#sumPad"));
	UTL.config_common($("#sumCommon"));

	SUM.generate();
	SUM.initialize();
	SUM.calculate();
	SUM.display();

	$("#sumPad .ui-btn").tap(function(e){
		if ( !SUM.isSleep && SUM.verify($(this).val()) ) {
			SUM.isSleep = true;
			setTimeout( function(){
				if ( SUM.isSleep ) {
					SUM.shift();
					SUM.calculate();
					SUM.display();
					SUM.isSleep = false;
				}
			}, 1000);
		}
		e.preventDefault();
	});
	$("#sumGen").tap(function(){
		SUM.initialize();
		SUM.calculate();
		SUM.display();
	});
	$("#row_size").change(function(){
		SUM.set_row($("#row_size").val());
		SUM.generate();
		SUM.validate_help_mode();
		SUM.initialize();
		SUM.calculate();
		SUM.display();
		window.history.back();
	});
	$("#help_mode").change(function(){
		SUM.validate_help_mode();
	});
	$("#rand_mode").change(function(){
		UTL.randomize_pad("#sumPad", $("#rand_mode").prop("checked"));
	});
});


var SUM = (function(UTL) {
	var my = {};

	var Term = function(add, sum, car) {
		var length = arguments.length;

		this.add = length < 1 ? [] : add;
		this.sum = length < 2 ? '&#160;' : sum;
		this.car = length < 3 ? '&#160;' : car;

		while ( this.add.length < row ) {
			this.add.push('&#160;');
		}
	};

	var row = 4;
	var addend;
	var numSum;
	var numCar;

	var max = 4;
	var arrExp = new Array(max);

	my.isSleep = true;


	my.set_row = function (size) {
		row = size;
	};

	my.validate_help_mode = function () {
		if ( $("#help_mode").prop("checked") ) {
			$("#sumCarRow").show();
		} else {
			$("#sumCarRow").hide();
		}
	};

	my.generate = function () {
		var r, c;
		var inner = '<TABLE cellspacing="0" cellpadding="0">';

		for ( r = 0; r < row-1; r++ ) {
			inner += '<TR>';
			inner += '<TD class="td__title">addend ' + (r+1) + ':&#160;</TD>';
			inner += '<TD class="td__column" colspan="2"></TD>';
			inner += '<TD class="td__column"><SPAN id="addend' + r + '"></SPAN></TD>';
			for ( c = 0; c < max; c++ ) {
				inner += '<TD class="td__column"><SPAN id="addend' + r + '_' + c + '"></SPAN></TD>';
			}
			inner += '<TD class="td__column">&#160;</TD>';
			inner += '</TR>';
		}

		inner += '<TR>';
		inner += '<TD class="td__title">addend ' + row + ':&#160;</TD>';
		inner += '<TD class="td__column--under" colspan="2">+&#160;</TD>';
		inner += '<TD class="td__column--under"><SPAN id="addend' + (row-1) + '">&#160;</SPAN></TD>';
		for ( c = 0; c < max; c++ ) {
			inner += '<TD class="td__column--under"><SPAN id="addend' + (row-1) + '_' + c + '">&#160;&#160;</SPAN></TD>';
		}
		inner += '<TD class="td__column--under">&#160;</TD>';
		inner += '</TR>';

		inner += '<TR>';
		inner += '<TD class="td__title">sum:&#160;</TD>';
		inner += '<TD class="td__column" colspan="2"><SPAN id="addRes"></SPAN></TD>';
		inner += '<TD class="td__column--bold"><SPAN id="addSum">?</SPAN></TD>';
		for ( c = 0; c < max; c++ ) {
			inner += '<TD class="td__column"><SPAN id="addSum' + c + '"></SPAN></TD>';
		}
		inner += '<TD class="td__column"></TD>';
		inner += '</TR>';

		inner += '<TR id="sumCarRow">';
		inner += '<TD class="td__title">carry:&#160;</TD>';
		inner += '<TD class="td__column"></TD>';
		inner += '<TD class="td__super" colspan="2">?</TD>';
		for ( c = 0; c < max; c++ ) {
			inner += '<TD class="td__super"><SPAN id="addCar' + c + '"></SPAN></TD>';
		}
		inner += '<TD class="td__column">&#160;</TD>';
		inner += '</TR>';

		inner += '</TABLE>';

		$("#sumHTML").html(inner);
	};

	my.initialize = function () {
		var c;

		numCar = 0;
		for ( c = 0; c < max; c++ ) {
			arrExp[c] = new Term();
		}

		my.isSleep = false;
	};

	my.calculate = function () {
		var r;
		var result = numCar;

		addend = new Array(row);
		for ( r = 0; r < row; r++ ) {
			addend[r] = UTL.random_digit(1);
			result += addend[r];
		}

		numSum = result % 16;
		numCar = Math.floor( result / 16 );
	};

	my.display = function () {
		var c, r;

		for ( r = 0; r < row; r++ ) {
			$("#addend"+r).html(UTL.convert_hex(addend[r]));
		}

		$("#addRes").html("&#160;");
		$("#addSum").html("?");

		for ( c = 0; c < max; c++ ) {
			for ( r = 0; r < row-1; r++ ) {
				$("#addend"+r+"_"+c).html(arrExp[c].add[r]);
			}
			$("#addend"+(row-1)+"_"+c).html("&#160;" + arrExp[c].add[row-1]);
			$("#addSum"+c).html(arrExp[c].sum);
			$("#addCar"+c).html(arrExp[c].car);
		}
	};

	my.verify = function (val) {
		if ( val == numSum ) {
			$("#addRes").html("&#10004;").css("color","green");
			$("#addSum").html(UTL.convert_hex(val));
			return true;
		} else {
			$("#addRes").html("&#10005;").css("color","red");
			$("#addSum").html(UTL.convert_hex(val));
			return false;
		}
	};

	my.shift = function () {
		var r;
		var arrNew = new Array(row);

		for ( r = 0; r < row; r++ ) {
			arrNew[r] = UTL.convert_hex(addend[r]);
		}

		arrExp.unshift(new Term(arrNew, UTL.convert_hex(numSum), UTL.convert_hex(numCar)));

		while ( arrExp.length > max ) {
			arrExp.pop();
		}
	};


	return my;
}(UTL));
