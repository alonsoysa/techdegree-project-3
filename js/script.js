/******************************************
Treehouse FSJS Techdegree:
project 3 - Interactive Form

******************************************/

const $name = $('#name');
const $email = $('#mail');
const $title = $('#title');
const $titleOther = $('#other-title');
const $design = $('#design');
const $color = $('#color');
const $payment = $('#payment');
const $ccNum = $('#cc-num');
const $ccZip = $('#zip');
const $activities = $('.activities input[type="checkbox"]');

// Options
const hiddenClass = 'is-hidden';
const defaultColorText = 'Please select a T-shirt theme';

const options = {
    errorPre : 'error-field--',
    errorClass : 'error'
};

const regex = {
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};


// Validation settings
// Credit validation regex from:
//https://stackoverflow.com/questions/40775674/credit-card-input-validation-using-regular-expression-in-javascript
//https://medium.com/hootsuite-engineering/a-comprehensive-guide-to-validating-and-formatting-credit-cards-b9fa63ec7863
// Email validaiton from
//https://emailregex.com/
const validation = {
    required: 'This field is required',
    name : [],
    email: [
        {
            regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: 'Sorry the email is not valid'
        }
    ],
    card: {
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
        amex: /^3[47][0-9]{13}$/,
        discovery: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/
    },
    zip: /(^\d{5}$)|(^\d{5}-\d{4}$)/
};

/*
    Step 1: Set focus on the first text field
*/
$name.focus();


/*
    Step 2: Job Role
*/

// Hide Other job role text field
$titleOther.addClass(hiddenClass);

// Displays other text field when $title field = other
$title.on('change', function(){
    if ($(this).val() === 'other' && $titleOther.hasClass(hiddenClass)) {
        $titleOther.removeClass(hiddenClass).focus();
    } else {
        $titleOther.addClass(hiddenClass);
    }
});


/*
    Step 3: T-Shirt Info
*/

// Adds default color option
const defaultColourOption = '<option>' + defaultColorText + '</option>';
$color.find('option').addClass(hiddenClass);
$color.prepend(defaultColourOption).val(defaultColorText);

// Listen for design field changes
$design.on('change', function(){

    // gets the value of the selected option
    // and removes the 'Theme - '
    $value = $(this)
                .parent()
                .find('option:selected')
                .text()
                .replace('Theme - ', '');
    

    // loops and activates only those with the matching text
    $('#color option').each(function(){
        let $this = $(this);
        if ( $this.is(':contains('+$value+')') )  {
            $this.removeClass(hiddenClass);
        } else {
            $this.addClass(hiddenClass);
        }
    });

    // pre-select the value using the first available option
    $newOption = $('#color option:not(.' + hiddenClass + ')').first().val();
    if ($newOption) {
        $color.val($newOption);
    }else {
        $color.val(defaultColorText);
    }
});


/*
    Step 4: Register for Activities
*/
$('.activities input[data-day-and-time]').on('change', function(){
    
    const $this = $(this);
    const $time = $this.attr('data-day-and-time');

    // disable any matching day and time
    // otherwise restore it
    if ( $this.is(':checked') ) {
        $('.activities input[data-day-and-time="' + $time + '"]:not(:checked)').attr('disabled', true);
    } else {
        $('.activities input[data-day-and-time="' + $time + '"]').removeAttr('disabled');
    }
});

/*
    Step 5: Payment Info
*/

// hide payment div
$('.paypal, .bitcoin, .credit-card').addClass(hiddenClass);

$payment.on('change', function(){

    // get the current target class
    // use regex to replace spaces with -
    const $targetClass = '.' + $(this).val()
                                .toLowerCase()
                                .replace(/\s/, '-');
    
    // remove hidden class from targeted div
    $($targetClass)
        .removeClass(hiddenClass)
        .siblings('div')
            .addClass(hiddenClass);
   
});

// remove the default option. We don't want users to pick it
$payment.find('option').first().remove();

// activate the default payment method
$payment.val('Credit Card').trigger('change');


/*
    Step 6: Form validation
*/
const validateField = ($field, $validations) => {
    const string = $field.val().toLowerCase();

    if( !string ) {
        console.log(validation.required);
        return false;
    }

    for (let i = 0; i < $validations.length; i++){
        if ( !$validations[i].regex.test(string) ) {
            console.log($validations[i].message);
            return false;
        }
    }

    console.log('good');
    return true;
};

const validateActivities = () => {
    $activities.each(function () {
        if ($(this).is(':checked')) {
            $valid = true;
        }
    });
    return false;
};

const validateCard = () => {

    const $ccNumVal = $ccNum.val();

    if ( !$ccNumVal ) {
        console.log(validation.required);
        return false;
    }

    const isVisa = validation.card.visa.test($ccNumVal) === true;
    const isMast = validation.card.mastercard.test($ccNumVal) === true;
    const isAmex = validation.card.amex.test($ccNumVal) === true;
    const isDisc = validation.card.discovery.test($ccNumVal) === true;

    if (isVisa || isMast || isAmex || isDisc) {
        // at least one regex matches, so the card number is valid.

        if (isVisa) {
            // Visa-specific logic goes here
            console.log('Visa Good');
        }
        else if (isMast) {
            // Mastercard-specific logic goes here
            console.log('Mastercard Good');
        }
        else if (isAmex) {
            // AMEX-specific logic goes here
            console.log('Amex Good');
        }
        else if (isDisc) {
            // Discover-specific logic goes here
            console.log('Discovery Good');
        }

        return true;

    } else {
        console.log('Not valid');
        return false;
    }
};

const validateZip = () => {
    console.log($ccZip.val());
    if (validation.zip.test($ccZip.val() )) {
        console.log('good zip');
        return true;
    } else {
        console.log('bad zip');
        return false;
    }
};

const validateCredit = () => {
    if ( $payment.val() === 'Credit Card' ) {

        validateCard();
        validateZip();

    } else {
        return true;
    }
};

const buildErrorHTML = ($field, string) => {
    const label = $field.prev().text().toLowerCase();
    let html = '<div class="error-field" ';
        html += 'id="' + options.errorPre + label + '">  ';
        html += string + ' ' + label + '</div>';

    if ($field.hasClass(options.errorClass)) {
        $('#' + options.errorPre + label).remove();
    }

    $field.addClass(options.errorClass);
    $(html).insertAfter($field);
};

const destroyErrorHTML = ($field) => {
    const label = $field.prev().text().toLowerCase();
    $field.removeClass(options.errorClass);
    $('#' + options.errorPre + label).remove();
}

const validateName = () => {
    if ($name.val() === '') {
        buildErrorHTML($name, 'Please enter your');
    } else {
        destroyErrorHTML($name);
    }
}

const validateEmail = () => {
    $val = $email.val();
    if ($val === '') {
        buildErrorHTML($email, 'Please enter your');
    } else if (!regex.email.test($val) ) {
        buildErrorHTML($email, 'Please enter a valid');
    } else {
        destroyErrorHTML($email);
    }
}

$name.on('keyup', function () {
    validateName();
});

$email.on('keyup', function () {
    validateEmail();
});

$('form').submit(function (event) {

    // prevent refresh
    event.preventDefault();

    const validName = validateName();

    //validateField($name, validation.name);
    //validateField($email, validation.email);
    //validateActivities();


    //validateCredit();
    
});