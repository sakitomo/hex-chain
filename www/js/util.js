var UTL = (function() {
	var my = {};


	my.random_digit = function (min) {
		var max = 15;

		if ( $("#hard_mode").prop("checked") ) {
			if ( Math.floor( Math.random() * 2 ) ) {
				max = 9;
			} else {
				min = 10;
			}
		}

		return Math.floor( Math.random() * (max-min+1) + min );
	};

	my.random_unique = function (min, arr) {
		var digit, hex;
		var i;

		do {
			digit = my.random_digit(min);

			for ( i = 0; i < arr.length; i++ ) {
				if ( digit == arr[i] ) {
					digit = 0;
					break;
				}
			}
		} while ( digit == 0 );

		return digit;
	};

	my.convert_hex = function (dec) {
		var letter = ['A', 'B', 'C', 'D', 'E', 'F'];

		if (dec >= 10) {
			return letter[dec-10];
		} else {
			return dec;
		}
	};

	my.convert_to_dec = function (hex) {
		var letter = ['A', 'B', 'C', 'D', 'E', 'F'];
		var i;

		for ( i = 0; i < 6; i++ ) {
			if (hex == letter[i]) {
				return i + 10;
			}
		}
		return hex * 1;
	};


	my.generate_pad = function ($pad) {
		var inner = '';
		var block = ['a', 'b', 'c', 'd'];
		var i, j;

		inner += '<div class="ui-grid-c numpad">';
		for ( i = 0; i < 16; ) {
			for ( j = 0; j < 4; j++, i++ ) {
				inner += '<div class="ui-block-' + block[j] + '">';
				inner += '<button value="' + i + '" class="ui-btn ui-corner-all">' + my.convert_hex(i) + '</button>';
				inner += '</div>';
			}
		}
		inner += '</div>';

		$pad.html(inner);
	};

	my.randomize_pad = function (pad, isRandom) {
		var nums = new Array(16);
		var i, j;

		for ( i = 0; i < 16; i++ ) {
			nums[i] = i;
		}

		if ( isRandom ) {
			for ( i = 15; i >= 0; i-- ) {
				j = Math.floor( Math.random() * (i+1) );
				nums[j] = [nums[i], nums[i]=nums[j]][0];
			}
		}

		$(pad+" .ui-btn").each(function(i) {
			$(this).val(nums[i]);
			$(this).text(my.convert_hex(nums[i]));
		});
	};


	my.config_common = function ($div) {
		var Field = function(id, label, checked) {
			this.id = id;
			this.label = label;
			this.checked = checked;
		};
		Field.prototype.propChecked = function() {
			return this.checked ? ' checked' : '';
		};

		var fields = [
			new Field('hard_mode', 'Weight digits A-F', true),
			new Field('help_mode', 'Display carry row', true),
			new Field('rand_mode', 'Shuffle number pad', false)
		];
		var inner = '';
		var i;

		for ( i = 0; i < fields.length; i++ ) {
			inner += '<div class="ui-field-contain">';
			inner += '<label for="' + fields[i].id + '">' + fields[i].label + ':</label>';
			inner += '<input type="checkbox" id="' + fields[i].id + '" data-role="flipswitch"' + fields[i].propChecked() + '>';
			inner += '</div>';
		}

		$div.html(inner);
	};


	return my;
}());


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
