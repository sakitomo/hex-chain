$(document).on('pagecreate', '#pro', function() {
	var mLier = 0;
	var mCand;
	var numPro;
	var numCar;

	var max = 4;
	var arrMul = new Array(max);
	var arrPro = new Array(max);
	var arrCar = new Array(max);

	var isSleep;


	generate();
	initialize();
	calculate();
	display();
	$("#pro div.divNum input:button").click(function(){
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
	$("#proGen").click(function(){
		initialize();
		calculate();
		display();
	});
	$("#proCfg").click(function(){
		$("#clpsLier").collapsible("collapse");
	});
	$("#pro_cfg div.divNum input:button").click(function(){
		initialize($(this).val());
		calculate();
		display();
		window.history.back();
	});
	$("#help_mode").change(function(){
		if ( $("#help_mode").prop("checked") ) {
			$("#proCarRow").show();
		} else {
			$("#proCarRow").hide();
		}
	});


	function generate() {
		var i;
		var inner = '<TABLE cellspacing="0" cellpadding="0">';

		inner += '<TR>';
		inner += '<TD class="tdTitle">multiplicand:&#160;</TD>';
		inner += '<TD class="tdColumn"></TD>';
		inner += '<TD class="tdColumn"><SPAN id="mpland"></SPAN></TD>';
		for ( i = 0; i < max; i++ ) {
			inner += '<TD class="tdColumn"><SPAN id="multpl' + i + '"></SPAN></TD>';
		}
		inner += '<TD class="tdColumn"></TD>';
		inner += '</TR>';

		inner += '<TR>';
		inner += '<TD class="tdTitle">multiplier:&#160;</TD>';
		inner += '<TD class="tdColumn tdColUnder">&times;&#160;</TD>';
		inner += '<TD class="tdColumn tdColUnder"><SPAN id="mplier"></SPAN></TD>';
		for ( i = 0; i < max; i++ ) {
			inner += '<TD class="tdColumn tdColUnder">&#160;&#160;</TD>';
		}
		inner += '<TD class="tdColumn tdColUnder">&#160;</TD>';
		inner += '</TR>';

		inner += '<TR>';
		inner += '<TD class="tdTitle">product:&#160;</TD>';
		inner += '<TD class="tdColumn"><SPAN id="mulRes"></SPAN></TD>';
		inner += '<TD class="tdColumn tdColBold"><SPAN id="mulPro">?</SPAN></TD>';
		for ( i = 0; i < max; i++ ) {
			inner += '<TD class="tdColumn"><SPAN id="mulPro' + i + '"></SPAN></TD>';
		}
		inner += '<TD class="tdColumn"></TD>';
		inner += '</TR>';

		inner += '<TR id="proCarRow">';
		inner += '<TD class="tdTitle">carry:&#160;</TD>';
		inner += '<TD class="tdColumn"></TD>';
		inner += '<TD class="tdColumn">&#160;</TD>';
		for ( i = 0; i < max; i++ ) {
			inner += '<TD class="tdUpper"><SPAN id="mulCar' + i + '"></SPAN></TD>';
		}
		inner += '<TD class="tdColumn"></TD>';
		inner += '</TR>';

		inner += '</TABLE>';

		$("#proHTML").html(inner);
	}

	function initialize(lier) {
		var i;

		mLier = lier === undefined ? random_unique(2, [ convert_hex(mLier) ]) : lier;
		numCar = 0;
		for ( i = 0; i < max; i++ ) {
			arrMul[i] = '&#160;';
			arrPro[i] = '&#160;';
			arrCar[i] = '&#160;';
		}

		isSleep = false;
	}

	function calculate() {
		var result;

		mCand = random_unique(1, arrMul);
		result = mCand * mLier + numCar;

		numPro = result % 16;
		numCar = Math.floor( result / 16 );
	}

	function display() {
		var i;

		$("#mpland").html( convert_hex(mCand) );
		$("#mplier").html( convert_hex(mLier) );

		$("#mulRes").html("&#160;");
		$("#mulPro").html("?");

		for ( i = 0; i < max; i++ ) {
			$("#multpl"+i).html(arrMul[i]);
			$("#mulPro"+i).html(arrPro[i]);
			$("#mulCar"+i).html(arrCar[i]);
		}
	}

	function verify(val) {
		if (val == convert_hex(numPro)) {
			$("#mulRes").html("&#10004;").css("color","green");
			$("#mulPro").html(val);
			return true;
		} else {
			$("#mulRes").html("&#10005;").css("color","red");
			$("#mulPro").html(val);
			return false;
		}
	}

	function shift() {
		arrMul.unshift( convert_hex(mCand) );
		arrPro.unshift( convert_hex(numPro) );
		arrCar.unshift( convert_hex(numCar) );

		while ( arrMul.length > max ) {
			arrMul.pop();
		}

		while ( arrPro.length > max ) {
			arrPro.pop();
		}

		while ( arrCar.length > max ) {
			arrCar.pop();
		}
	}


});