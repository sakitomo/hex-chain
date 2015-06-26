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
