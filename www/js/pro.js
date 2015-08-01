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
					PRO.do();
					$("#proUndo").removeClass("ui-state-disabled");
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
	$("#proUndo").tap(function(){
		if ( !PRO.undo() ) {
			$("#proUndo").addClass("ui-state-disabled");
		}
		$("#proRedo").removeClass("ui-state-disabled");
	});
	$("#proRedo").tap(function(){
		if ( !PRO.redo() ) {
			$("#proRedo").addClass("ui-state-disabled");
		}
		$("#proUndo").removeClass("ui-state-disabled");
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


var FixedArray = function(size) {
	this.arr = new Array();
	this.capacity = arguments.length < 1 ? 1 : size;
};
FixedArray.prototype = {
	length: function() {
		return this.arr.length;
	},
	at: function(i) {
		return i < this.arr.length ? this.arr[i] : undefined;
	},
	push: function(item) {
		this.arr.push(item);
		if (this.arr.length > this.capacity) {
			this.arr.shift();
		}
	},
	pop: function() {
		return this.arr.pop();
	},
	unshift: function(item) {
		this.arr.unshift(item);
		if (this.arr.length > this.capacity) {
			this.arr.pop();
		}
	},
	shift: function() {
		return this.arr.shift();
	},
	clear: function() {
		this.arr = new Array();
	}
};


var PRO = (function(UTL) {
	var my = {};

	var Term = function(mul, pro, car) {
		var length = arguments.length;

		this.mul = length < 1 ? '&#160;' : mul;
		this.pro = length < 2 ? '&#160;' : pro;
		this.car = length < 3 ? '&#160;' : car;
	};

	var mLier = 0;
	var mCand;
	var numPro;
	var numCar;

	var max = 4;
	var arrExp = new FixedArray(max);
	var arrMul = new FixedArray(max);
	var arrRedo;

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
		inner += '<TD class="td__symbol" colspan="2"><SPAN id="mulRes"></SPAN></TD>';
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

		my.isSleep = false;

		mLier = arguments.length < 1 ? UTL.random_unique(2, [mLier]) : lier;
		numCar = 0;

		arrExp.clear();
		arrMul.clear();
		arrRedo = new Array();
	};

	my.calculate = function (cand) {
		var result;

		mCand = arguments.length < 1 ? UTL.random_unique(1, arrMul.arr) : cand;
		result = mCand * mLier + numCar;

		numPro = result % 16;
		numCar = Math.floor( result / 16 );
	};

	my.display = function () {
		var i, term;

		$("#muland").html(UTL.convert_hex(mCand));
		$("#mulier").html(UTL.convert_hex(mLier));

		$("#mulRes").html("&#160;");
		$("#mulPro").html("?");

		for ( i = 0; i < max; i++ ) {
			term = arrExp.at(i) || new Term();

			$("#muland"+i).html(term.mul);
			$("#mulPro"+i).html(term.pro);
			$("#mulCar"+i).html(term.car);
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


	my.encode = function () {
		arrExp.unshift(new Term(UTL.convert_hex(mCand), UTL.convert_hex(numPro), UTL.convert_hex(numCar)));
		arrMul.unshift(mCand);
	};

	my.decode = function (term) {
		mCand = UTL.convert_to_dec(term.mul);
		numPro = UTL.convert_to_dec(term.pro);
		numCar = UTL.convert_to_dec(term.car);
	};


	my.do = function () {
		my.isSleep = false;

		arrRedo = new Array();

		my.encode();
		my.calculate();
		my.display();
	};

	my.undo = function () {
		var term;

		my.isSleep = false;

		if (arrExp.arr.length > 0) {
			term = arrExp.shift();
			arrMul.shift();
			arrRedo.push(mCand);

			my.decode(term);
			my.display();

			return arrExp.arr.length > 0;
		}
		return false;
	};

	my.redo = function () {
		my.isSleep = false;

		if (arrRedo.length > 0) {
			my.encode();
			my.calculate(arrRedo.pop());
			my.display();

			return arrRedo.length > 0;
		}
		return false;
	};


	return my;
}(UTL));
