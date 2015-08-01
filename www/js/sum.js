$(document).on('mobileinit', function() {
	$.mobile.defaultPageTransition = 'none';
});


$(document).on('pagecreate', '#sum', function() {
	UTL.generate_pad($("#sumPad"));
	UTL.config_common($("#sumCommon"));

	SUM.generate();
	SUM.new_game();

	$("#sumPad .ui-btn").tap(function(e){
		if ( !SUM.isSleep && SUM.verify($(this).val()) ) {
			SUM.isSleep = true;
			setTimeout( function(){
				if ( SUM.isSleep ) {
					SUM.do();
					SUM.isSleep = false;
					$("#sumUndo").removeClass("ui-state-disabled");
				}
			}, 1000);
		}
		e.preventDefault();
	});
	$("#sumGen").tap(function(){
		SUM.isSleep = false;
		SUM.new_game();
		$("#sumUndo,#sumRedo").addClass("ui-state-disabled");
	});
	$("#sumUndo").tap(function(){
		SUM.isSleep = false;
		if ( !SUM.undo() ) {
			$("#sumUndo").addClass("ui-state-disabled");
		}
		$("#sumRedo").removeClass("ui-state-disabled");
	});
	$("#sumRedo").tap(function(){
		SUM.isSleep = false;
		if ( !SUM.redo() ) {
			$("#sumRedo").addClass("ui-state-disabled");
		}
		$("#sumUndo").removeClass("ui-state-disabled");
	});
	$("#row_size").change(function(){
		SUM.set_row($("#row_size").val());
		SUM.generate();
		SUM.validate_help_mode();
		SUM.isSleep = false;
		SUM.new_game();
		window.history.back();
		$("#sumUndo,#sumRedo").addClass("ui-state-disabled");
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
	var arrExp = new FixedArray(max);
	var arrRedo;

	my.isSleep = false;


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
			inner += '<TD class="td__column" id="tdline"><SPAN id="addend' + r + '"></SPAN></TD>';
			for ( c = 0; c < max; c++ ) {
				inner += '<TD class="td__column"><SPAN id="addend' + r + '_' + c + '"></SPAN></TD>';
			}
			inner += '<TD class="td__column"></TD>';
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
		inner += '<TD class="td__column--symbol" colspan="2"><SPAN id="addRes"></SPAN></TD>';
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


	var initialize = function () {
		numCar = 0;

		arrExp.clear();
		arrRedo = new Array();

		my.isSleep = false;
	};

	var calculate = function (end) {
		var r;
		var result;

		if ( end ) {
			addend = end;
		} else {
			addend = new Array(row);
			for ( r = 0; r < row; r++ ) {
				addend[r] = UTL.random_digit(1);
			}
		}

		result = addend.reduce(function(x, y) { return x + y; }) + numCar;

		numSum = result % 16;
		numCar = Math.floor( result / 16 );
	};

	var display = function () {
		var c, r;
		var term;

		for ( r = 0; r < row; r++ ) {
			$("#addend"+r).html(UTL.convert_hex(addend[r]));
		}

		$("#addRes").html("&#160;");
		$("#addSum").html("?");

		for ( c = 0; c < max; c++ ) {
			term = arrExp.at(c) || new Term();

			for ( r = 0; r < row-1; r++ ) {
				$("#addend"+r+"_"+c).html(term.add[r]);
			}
			$("#addend"+(row-1)+"_"+c).html("&#160;" + term.add[row-1]);
			$("#addSum"+c).html(term.sum);
			$("#addCar"+c).html(term.car);
		}
	};


	my.verify = function (val) {
		if ( val == numSum ) {
			$("#addRes").html("&#10004;").css("color","green");
			$("#addSum").html(UTL.convert_hex(val));
			return true;
		} else {
			$("#addRes").html("&#10006;").css("color","red");
			$("#addSum").html(UTL.convert_hex(val));
			return false;
		}
	};


	var encode = function () {
		arrExp.unshift(new Term(addend.map(UTL.convert_hex), UTL.convert_hex(numSum), UTL.convert_hex(numCar)));
	};

	var decode = function (term) {
		addend = term.add.map(UTL.convert_to_dec);
		numSum = UTL.convert_to_dec(term.sum);
		numCar = UTL.convert_to_dec(term.car);
	};


	my.new_game = function () {
		initialize();
		calculate();
		display();
	};

	my.do = function () {
		arrRedo = new Array();

		encode();
		calculate();
		display();
	};

	my.undo = function () {
		var term;

		if (arrExp.arr.length > 0) {
			term = arrExp.shift();
			arrRedo.push(addend);

			decode(term);
			display();

			return arrExp.arr.length > 0;
		}
		return false;
	};

	my.redo = function () {
		if (arrRedo.length > 0) {
			encode();
			calculate(arrRedo.pop());
			display();

			return arrRedo.length > 0;
		}
		return false;
	};


	return my;
}(UTL));
