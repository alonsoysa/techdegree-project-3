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
const $ccCVV = $('#cvv');
const $activities = $('.activities input[type="checkbox"]');
const $activitiesHeading = $('.activities legend');
const $tshirtColor = $('#colors-js-puns');

// Options
const hiddenClass = 'is-hidden';
const defaultColorText = 'Please select a T-shirt theme';

let typeOfCreditCard = '';

const options = {
    errorPre : 'error-field--',
    errorClass : 'error'
};

const regex = {
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    numbers: /^\d+$/
};


// helpers

$ccNum.attr('maxlength', 16);
$ccZip.attr('maxlength', 5);


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
        destroyErrorHTML($titleOther);
    }
});


/*
    Step 3: T-Shirt Info
*/

// Hide
$tshirtColor.addClass(hiddenClass);

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
    if ($value === 'Select Theme') {
        $tshirtColor.addClass(hiddenClass);
        validateDesign();
    } else {
        $tshirtColor.removeClass(hiddenClass);
        destroyErrorHTML($design);
    }

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
$('.activities input').on('change', function(){
    
    const $this = $(this);
    const $time = $this.attr('data-day-and-time');

    validateActivities();

    if ( $time ) {
        // disable any matching day and time
        // otherwise restore it
        if ($this.is(':checked')) {
            $('.activities input[data-day-and-time="' + $time + '"]:not(:checked)').attr('disabled', true);
        } else {
            $('.activities input[data-day-and-time="' + $time + '"]').removeAttr('disabled');
        }
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



const validateCard = () => {

    if ($payment.val() !== 'Credit Card') {
        return true;
    }

    const $ccNumVal = $ccNum.val();
    const isVisa = validation.card.visa.test($ccNumVal) === true;
    const isMast = validation.card.mastercard.test($ccNumVal) === true;
    const isAmex = validation.card.amex.test($ccNumVal) === true;
    const isDisc = validation.card.discovery.test($ccNumVal) === true;
    
    if (!$ccNumVal) {
        buildErrorHTML($ccNum, 'Please enter a credit');
        return false;
    }

    if ( !regex.numbers.test($ccNumVal) ) {
        buildErrorHTML($ccNum, 'Please don\'t add letters or symbols in your credit');
        return false;
    }

    if ( !($ccNumVal.length >= 13 &&$ccNumVal.length <= 16) ) {
        buildErrorHTML($ccNum, 'Please enter a number that is between 13 and 16 digits long');
        return false;
    }
    
    if (isVisa || isMast || isAmex || isDisc) {
        // at least one regex matches, so the card number is valid.
        destroyErrorHTML($ccNum);

        if (isVisa) {
            typeOfCreditCard = 'visa';
        }
        else if (isMast) {
            typeOfCreditCard = 'mast';
        }
        else if (isAmex) {
            typeOfCreditCard = 'amex';
        }
        else if (isDisc) {
            typeOfCreditCard = 'disc';
        }

        validateCVV();

    } else {
        buildErrorHTML($ccNum, 'Please enter a valid credit');
        typeOfCreditCard = '';
    }
};

const validateZip = () => {

    if ($payment.val() !== 'Credit Card') {
        return true;
    }

    const $ccZipVal = $ccZip.val();

    if (!$ccZipVal) {
        buildErrorHTML($ccZip, 'Please enter your');
        return false;
    }

    if (!validation.zip.test($ccZipVal)) {
        buildErrorHTML($ccZip, 'Please enter a valid');
        return false;
    } else {
        destroyErrorHTML($ccZip);
    }
};

const validateCVV = () => {

    if ($payment.val() !== 'Credit Card') {
        return true;
    }

    const $ccCVVVal = $ccCVV.val();

    if (!$ccCVVVal) {
        buildErrorHTML($ccCVV, 'Please enter your');
        return false;
    }

    if (typeOfCreditCard === 'amex') {
        if ($ccCVVVal.length === 4) {
            destroyErrorHTML($ccCVV);
        } else {
            buildErrorHTML($ccCVV, 'Please enter a valid');
            return false;
        }
    } else {
        if ($ccCVVVal.length === 3) {
            destroyErrorHTML($ccCVV);
        } else {
            buildErrorHTML($ccCVV, 'Please enter a valid');
            return false;
        }
    }

    
};


const buildErrorHTML = ($field, string, custom) => {
    const label = $field.prevAll('label').first().text().toLowerCase();
    const id = label.replace(/\s+/g, '-');
    let html = '<div class="error-field" ';

    if ( custom ) {
        html += 'id="' + options.errorPre + custom + '">';
        html += string + '</div>';

        $('#' + options.errorPre + custom).remove();
    } else {
        html += 'id="' + options.errorPre + id + '">';
        html += string + ' ' +label + '</div>';

        $('#' + options.errorPre + id).remove();
    }

    

    $field.addClass(options.errorClass);
    $(html).insertAfter($field);
};


const destroyErrorHTML = ($field, custom) => {
    if (custom) {
        $('#' + options.errorPre + custom).remove();
    } else {
        const id = $field.prevAll('label').first().text().replace(/\s+/g, '-').toLowerCase();
        $('#' + options.errorPre + id).remove();
    }
    $field.removeClass(options.errorClass);
    
}

const validateName = () => {
    if ($name.val() === '') {
        buildErrorHTML($name, 'Please enter your');
        return false;
    } else {
        destroyErrorHTML($name);
    }
    return true;
}

const validateEmail = () => {
    const $val = $email.val();
    if ($val === '') {
        buildErrorHTML($email, 'Please enter your');
    } else if (!regex.email.test($val) ) {
        buildErrorHTML($email, 'Please enter a valid');
    } else {
        destroyErrorHTML($email);
    }
}

const validateTitle = () => {
    if ($title.val() === 'other' && $titleOther.val() === '') {
        buildErrorHTML($titleOther, 'Please enter your');
    } else {
        destroyErrorHTML($titleOther);
    }
};

const validateDesign = () => {
    if ($design.val() === 'Select Theme') {
        buildErrorHTML($design, 'Please select your');
    } else {
        destroyErrorHTML($design);
    }
};

const validateActivities = () => {
    let $valid = false;

    $activities.each(function () {
        if ($(this).is(':checked')) {
            $valid = true;
        }
    });

    if ( !$valid ) {
        buildErrorHTML($activitiesHeading, 'Please select at least one activity', 'custom-activity');
    } else {
        destroyErrorHTML($activitiesHeading, 'custom-activity');
    }
};

$name.on('keyup', function () {
    validateName();
});

$email.on('keyup', function () {
    validateEmail();
});

$titleOther.on('keyup', function () {
    validateTitle();
});

$ccNum.on('keyup', function () {
    validateCard();
});

$ccZip.on('keyup', function () {
    validateZip();
});

$ccCVV.on('keyup', function () {
    validateCVV();
});

$('form').submit(function (event) {

    // prevent refresh
    event.preventDefault();

    validateName();
    validateEmail();
    validateTitle();
    validateDesign();
    validateActivities();
    validateCard();
    validateZip();
    validateCVV();

    $error = $('.error').first();

    if ($error) {
        $('html, body').animate({
            scrollTop: ($error.offset().top - 40)
        }, 500);
        return false;
    } else {
        console.log('ALL GOOD');
    }
    
});