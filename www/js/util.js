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
	var i, j;
	var inner = '';
	var val = 0;
	var block = ['a', 'b', 'c', 'd'];

	inner += '<div class="ui-grid-c divNum">';
	for ( i = 0; i < 4; i++ ) {
		for ( j = 0; j < 4; j++ ) {
			inner += '<div class="ui-block-' + block[j] + '">';
			inner += '<button value="' + val + '" class="ui-btn ui-corner-all">' + convert_hex(val) + '</button>';
			inner += '</div>';
			val++;
		}
	}
	inner += '</div>';

	$pad.html(inner);
}
