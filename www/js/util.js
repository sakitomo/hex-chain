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
