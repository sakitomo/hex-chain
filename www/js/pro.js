$(document).on('mobileinit', function() {
	$.mobile.defaultPageTransition = 'none';
});


$(document).on('pagecreate', '#pro', function() {
	UTL.generate_pad($("#proPad"));
	UTL.generate_pad($("#proPadLier"));
	$("#proPadLier .ui-btn:lt(2)").addClass("ui-state-disabled");
	UTL.config_common($("#proCommon"));

	PRO.generate();
	PRO.initialize();
	PRO.calculate();
	PRO.display();

	$("#proPad .ui-btn").tap(function(e){
		if ( !PRO.isSleep && PRO.verify($(this).val()) ) {
			PRO.isSleep = true;
			setTimeout( function(){
				if ( PRO.isSleep ) {
					PRO.shift();
					PRO.calculate();
					PRO.display();
					PRO.isSleep = false;
				}
			}, 1000);
		}
		e.preventDefault();
	});
	$("#proGen").tap(function(){
		PRO.initialize();
		PRO.calculate();
		PRO.display();
	});
	$("#proCfg").click(function(){
		$("#clpsLier").collapsible("collapse");
	});
	$("#proPadLier .ui-btn").tap(function(e){
		PRO.initialize($(this).val());
		PRO.calculate();
		PRO.display();
		window.history.back();
		e.preventDefault();
	});
	$("#help_mode").change(function(){
		if ( $("#help_mode").prop("checked") ) {
			$("#proCarRow").show();
		} else {
			$("#proCarRow").hide();
		}
	});
	$("#rand_mode").change(function(){
		UTL.randomize_pad("#proPad", $("#rand_mode").prop("checked"));
	});
});


var PRO = (function(UTL) {
	var my = {};

	var mLier = 0;
	var mCand;
	var numPro;
	var numCar;

	var max = 4;
	var arrMul = new Array(max);
	var arrPro = new Array(max);
	var arrCar = new Array(max);

	my.isSleep = true;


	my.generate = function () {
		var i;
		var inner = '<TABLE cellspacing="0" cellpadding="0">';

		inner += '<TR>';
		inner += '<TD class="td__title">multiplicand:&#160;</TD>';
		inner += '<TD class="td__column" colspan="2"></TD>';
		inner += '<TD class="td__column"><SPAN id="muland"></SPAN></TD>';
		for ( i = 0; i < max; i++ ) {
			inner += '<TD class="td__column"><SPAN id="muland' + i + '"></SPAN></TD>';
		}
		inner += '<TD class="td__column"></TD>';
		inner += '</TR>';

		inner += '<TR>';
		inner += '<TD class="td__title">multiplier:&#160;</TD>';
		inner += '<TD class="td__column--under" colspan="2">&times;&#160;</TD>';
		inner += '<TD class="td__column--under"><SPAN id="mulier"></SPAN></TD>';
		for ( i = 0; i < max; i++ ) {
			inner += '<TD class="td__column--under">&#160;&#160;</TD>';
		}
		inner += '<TD class="td__column--under">&#160;</TD>';
		inner += '</TR>';

		inner += '<TR>';
		inner += '<TD class="td__title">product:&#160;</TD>';
		inner += '<TD class="td__column" colspan="2"><SPAN id="mulRes"></SPAN></TD>';
		inner += '<TD class="td__column--bold"><SPAN id="mulPro">?</SPAN></TD>';
		for ( i = 0; i < max; i++ ) {
			inner += '<TD class="td__column"><SPAN id="mulPro' + i + '"></SPAN></TD>';
		}
		inner += '<TD class="td__column"></TD>';
		inner += '</TR>';

		inner += '<TR id="proCarRow">';
		inner += '<TD class="td__title">carry:&#160;</TD>';
		inner += '<TD class="td__column"></TD>';
		inner += '<TD class="td__super" colspan="2">?</TD>';
		for ( i = 0; i < max; i++ ) {
			inner += '<TD class="td__super"><SPAN id="mulCar' + i + '"></SPAN></TD>';
		}
		inner += '<TD class="td__column">&#160;</TD>';
		inner += '</TR>';

		inner += '</TABLE>';

		$("#proHTML").html(inner);
	};

	my.initialize = function (lier) {
		var i;

		mLier = arguments.length < 1 ? UTL.random_unique(2, [UTL.convert_hex(mLier)]) : lier;
		numCar = 0;

		for ( i = 0; i < max; i++ ) {
			arrMul[i] = '&#160;';
			arrPro[i] = '&#160;';
			arrCar[i] = '&#160;';
		}

		my.isSleep = false;
	};

	my.calculate = function () {
		var result;

		mCand = UTL.random_unique(1, arrMul);
		result = mCand * mLier + numCar;

		numPro = result % 16;
		numCar = Math.floor( result / 16 );
	};

	my.display = function () {
		var i;

		$("#muland").html(UTL.convert_hex(mCand));
		$("#mulier").html(UTL.convert_hex(mLier));

		$("#mulRes").html("&#160;");
		$("#mulPro").html("?");

		for ( i = 0; i < max; i++ ) {
			$("#muland"+i).html(arrMul[i]);
			$("#mulPro"+i).html(arrPro[i]);
			$("#mulCar"+i).html(arrCar[i]);
		}
	};

	my.verify = function (val) {
		if (val == numPro) {
			$("#mulRes").html("&#10004;").css("color","green");
			$("#mulPro").html(UTL.convert_hex(val));
			return true;
		} else {
			$("#mulRes").html("&#10005;").css("color","red");
			$("#mulPro").html(UTL.convert_hex(val));
			return false;
		}
	};

	my.shift = function () {
		arrMul.unshift(UTL.convert_hex(mCand));
		arrPro.unshift(UTL.convert_hex(numPro));
		arrCar.unshift(UTL.convert_hex(numCar));

		while ( arrMul.length > max ) {
			arrMul.pop();
		}

		while ( arrPro.length > max ) {
			arrPro.pop();
		}

		while ( arrCar.length > max ) {
			arrCar.pop();
		}
	};


	return my;
}(UTL));
