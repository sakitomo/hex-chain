function random_digit(min) {
	var max = 15;

	if ( $("#hard_mode").prop("checked") ) {
		if ( Math.floor( Math.random() * 2 ) ) {
			max = 9;
		} else {
			min = 10;
		}
	}

	return Math.floor( Math.random() * (max-min+1) + min );
}

function random_unique(min, arr) {
	var digit, hex;
	var i;

	do {
		digit = random_digit(min);
		hex = convert_hex(digit);

		for ( i = 0; i < arr.length; i++ ) {
			if ( hex == arr[i] ) {
				digit = 0;
				break;
			}
		}
	} while ( digit == 0 );

	return digit;
}

function convert_hex(dec) {
	var hex = ['A', 'B', 'C', 'D', 'E', 'F'];

	if (dec >= 10) {
		return hex[dec-10];
	} else {
		return dec;
	}
}


function generate_pad($pad) {
	var inner = '';
	var block = ['a', 'b', 'c', 'd'];
	var i, j;

	inner += '<div class="ui-grid-c divNum">';
	for ( i = 0; i < 16; ) {
		for ( j = 0; j < 4; j++, i++ ) {
			inner += '<div class="ui-block-' + block[j] + '">';
			inner += '<button value="' + i + '" class="ui-btn ui-corner-all">' + convert_hex(i) + '</button>';
			inner += '</div>';
		}
	}
	inner += '</div>';

	$pad.html(inner);
}

function randomize_pad(pad, isRandom) {
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
		$(this).text(convert_hex(nums[i]));
	});
}


function config_common($div) {
	var Field = function(id, label, checked) {
		this.id = id || 'undef ID';
		this.label  = label || 'undef LABEL';
		this.checked  = checked;
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
}
