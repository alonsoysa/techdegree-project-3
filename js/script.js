/******************************************
Treehouse FSJS Techdegree:
project 3 - Interactive Form

0. Global variables
1. Structure Modifications
2. Build Error
3. Destroy Error
4. Validate Name
5. Validate Email
6. Validate Title
7. Validate Design
8. Validate Activities
9. Validate Card
10. Validate Zip
11. Validate CVV
12. Event listener: $title
13. Event listener: $design
14. Event listener: $activities
15. Event listener: $payment
16. Event listener: $name
17. Event listener: $email
18. Event listener: $titleOther
19. Event listener: $ccNum
20. Event listener: $ccZip
21. Event listener: $ccCVV
22. Event listener: $form

******************************************/

/**
* 0. Global variables
*/
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
const $form = $('form');
let typeOfCreditCard = '';

// Keeping all text here so that 
// it can be updated easily
const options = {
    hiddenClass: 'is-hidden',
    errorPre : 'error-field--',
    errorClass : 'error',
    defaultColorText: 'Please select a T-shirt theme',
    nameText: 'Please enter your',
    emailText: 'Please enter your',
    emailInvalid: 'Please enter a valid',
    titleText: 'Please enter your',
    designText: 'Please select your',
    activitiesText: 'Please select at least one activity',
    ccNumText: 'Please enter a credit',
    ccNumInvalid: 'Please enter a valid credit',
    ccNumInvalidSymbols: 'Please don\'t add letters or symbols in your credit',
    ccNumInvalidLength: 'Please enter a number that is between 13 and 16 digits long',
    ccZipText: 'Please enter your',
    ccZipInvalid: 'Please enter a valid',
    ccCVVText: 'Please enter your',
    ccCVVInvalid: 'Please enter a valid',
};

// Regex validation research from:
//https://stackoverflow.com/questions/40775674/credit-card-input-validation-using-regular-expression-in-javascript
//https://medium.com/hootsuite-engineering/a-comprehensive-guide-to-validating-and-formatting-credit-cards-b9fa63ec7863
const regex = {
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    numbers: /^\d+$/,
    zip: /(^\d{5}$)|(^\d{5}-\d{4}$)/,
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
    amex: /^3[47][0-9]{13}$/,
    discovery: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/
};


/**
* 1. Structure Modifications
*/

// Focus on the name field
$name.focus();

// Hide Other job role text field
$titleOther.addClass(options.hiddenClass);

// Hide t-shirt color option
$tshirtColor.addClass(options.hiddenClass);

// Adds default color option
const defaultColourOption = '<option>' + options.defaultColorText + '</option>';
$color.find('option').addClass(options.hiddenClass);
$color.prepend(defaultColourOption).val(options.defaultColorText);

// Insert a total counter for activities
$('<hr><div id="total"><strong>Total Cost:</strong> $<span id="total-value">0</span></div>').appendTo('.activities-inner');

// Hide payment information
$('.paypal, .bitcoin').addClass(options.hiddenClass);

// Remove the default option from payment dropdown.
// We don't want users to pick it
$payment.find('option').first().remove();

// Set a maxlength attribute to credit card fields
$ccNum.attr('maxlength', 16);
$ccZip.attr('maxlength', 5);


/**
* 2. Build Error
* - Creates an html error message
*     $field = jQuery element input
*     $string = Message error with a pre-default label
*     $custom = Custom message error no pre-default label (optional)
*/
const buildErrorHTML = ($field, string, custom) => {
    const label = $field.prevAll('label').first().text().toLowerCase();
    const id = label.replace(/\s+/g, '-');
    let html = '<div class="error-field" ';

    // displays error using a custom id and the string is not modified
    if ( custom ) {
        html += 'id="' + options.errorPre + custom + '">';
        html += string + '</div>';
        $('#' + options.errorPre + custom).remove();
    }
    // default displays an auto generated id with the 
    // label from the html document.
    else {
        html += 'id="' + options.errorPre + id + '">';
        html += string + ' ' +label + '</div>';
        $('#' + options.errorPre + id).remove();
    }

    // Adds an error class and inserts the error field
    $field.addClass(options.errorClass);
    $(html).insertAfter($field);
};


/**
* 3. Destroy Error
* - Removes html error message
*     $field = jQuery element input
*     $custom = Custom error id (optional)
*/
const destroyErrorHTML = ($field, custom) => {
    if (custom) {
        $('#' + options.errorPre + custom).remove();
    } else {
        // Selects the field and uses the text for the id
        const id = $field.prevAll('label').first().text().replace(/\s+/g, '-').toLowerCase();
        $('#' + options.errorPre + id).remove();
    }
    $field.removeClass(options.errorClass);
}


/**
* 4. Validate Name
* - Ensures that a name is provided
*/
const validateName = () => {
    // Check for empty field
    if ($name.val() === '') {
        buildErrorHTML($name, options.nameText);
        return false;
    } else {
        destroyErrorHTML($name);
    }
    return true;
}


/**
* 5. Validate Email
* - Ensures that a valid email is provided
*/
const validateEmail = () => {
    const $val = $email.val();

    // Check for empty fields
    if ($val === '') {
        buildErrorHTML($email, options.emailText);
        return false;
    } 
    // Check for a valid email
    else if (!regex.email.test($val) ) {
        buildErrorHTML($email, options.emailInvalid);
        return false;
    } 
    // If is good
    else {
        destroyErrorHTML($email);
    }

    return true;
}


/**
* 6. Validate Title
* - Ensures that the other title is not empty if is is selected
*/
const validateTitle = () => {
    // Check if other is selected and is not empty
    if ($title.val() === 'other' && $titleOther.val() === '') {
        buildErrorHTML($titleOther, options.titleText);
    } else {
        destroyErrorHTML($titleOther);
    }
};


/**
* 7. Validate Design
* - Ensures that a design is selected
*/
const validateDesign = () => {
    if ($design.val() === 'Select Theme') {
        buildErrorHTML($design, options.designText);
        return false;
    } else {
        destroyErrorHTML($design);
    }
    return true;
};


/**
* 8. Validate Activities
*/
const validateActivities = () => {
    let $valid = false;
    let $price = 0;
    
    // loop to see if one of the checkboxes is checked
    $activities.each(function () {
        if ($(this).is(':checked')) {
            $valid = true;
            
            // Update price number
            $price = $price + parseInt( $(this).attr('data-cost').replace('$', '') );
        }
    });

    // Update total text
    $('#total-value').text($price);

    // Displays error if all checkboxes are unchecked
    if ( !$valid ) {
        buildErrorHTML($activitiesHeading, options.activitiesText, 'custom-activity');
        return false;
    } else {
        destroyErrorHTML($activitiesHeading, 'custom-activity');
    }

    return true;
};


/**
* 9. Validate Card
* - Ensures that a valid credit card is provided
*/
const validateCard = () => {
    // Return valid if the credit card payment is NOT selected
    if ($payment.val() !== 'Credit Card') {
        destroyErrorHTML($ccNum);
        return true;
    }
    
    // cache the value
    const $ccNumVal = $ccNum.val();

    // These variables check test the value using regex
    const isVisa = regex.visa.test($ccNumVal) === true;
    const isMast = regex.mastercard.test($ccNumVal) === true;
    const isAmex = regex.amex.test($ccNumVal) === true;
    const isDisc = regex.discovery.test($ccNumVal) === true;

    // Display error if value is empty
    if (!$ccNumVal) {
        buildErrorHTML($ccNum, options.ccNumText);
        return false;
    }

    // Display error if symbols or letters are being used.
    if (!regex.numbers.test($ccNumVal)) {
        buildErrorHTML($ccNum, options.ccNumInvalidSymbols);
        return false;
    }

    // Display error if there are less than 13 or more than 16 characters
    if (!($ccNumVal.length >= 13 && $ccNumVal.length <= 16)) {
        buildErrorHTML($ccNum, options.ccNumInvalidLength);
        return false;
    }

    // At this point the numbers are valid, but we need to validate
    // it against specific credit card patterns
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

        // We run a CVV validation because Amex uses a different pattern
        validateCVV();
    } else {
        buildErrorHTML($ccNum, options.ccNumInvalid);
        typeOfCreditCard = '';
        return false;
    }

    return true;
};


/**
* 10. Validate Zip
* - Ensures that a valid zip code is provided
*/
const validateZip = () => {
    // Returns valid if the user is not using credit card payment menthod
    if ($payment.val() !== 'Credit Card') {
        destroyErrorHTML($ccZip);
        return true;
    }

    const $ccZipVal = $ccZip.val();

    // Checks that zip is not empty
    if (!$ccZipVal) {
        buildErrorHTML($ccZip, options.ccZipText);
        return false;
    }

    // Checks that a zip is valid
    if (!regex.zip.test($ccZipVal)) {
        buildErrorHTML($ccZip, options.ccZipInvalid);
        return false;
    } else {
        destroyErrorHTML($ccZip);
    }

    return true;
};


/**
* 11. Validate CVV
* - Ensures that a CVV is provided
*/
const validateCVV = () => {
    // Returns valid if the user is not using credit card payment method
    if ($payment.val() !== 'Credit Card') {
        destroyErrorHTML($ccCVV);
        return true;
    }

    const $ccCVVVal = $ccCVV.val();

    // Checks that CVV is not empty
    if (!$ccCVVVal) {
        buildErrorHTML($ccCVV, options.ccCVVText);
        return false;
    }
    
    // Amex requires 4 digits
    if (typeOfCreditCard === 'amex') {
        if ($ccCVVVal.length !== 4) {
            buildErrorHTML($ccCVV, options.ccCVVInvalid);
            return false;
        } else {
            destroyErrorHTML($ccCVV);
        }
    }

    // All other cards only need 3 digits
    else {
        if ($ccCVVVal.length !== 3) {
            buildErrorHTML($ccCVV, options.ccCVVInvalid);
            return false;
        } else {
            destroyErrorHTML($ccCVV);
        }
    }

    return true;
};


/**
* 12. Event listener: $title
* - Displays other text field when $title field = other
*/
$title.on('change', function () {
    if ($(this).val() === 'other' && $titleOther.hasClass(options.hiddenClass)) {
        $titleOther.removeClass(options.hiddenClass).focus();
    } else {
        $titleOther.addClass(options.hiddenClass);
        
        // Remove errors if other is deselected
        destroyErrorHTML($titleOther);
    }
});


/**
* 13. Event listener: $design
* - Listen for design field changes
*/
$design.on('change', function () {
    // gets the value of the selected option
    // and removes the 'Theme - '
    $value = $(this)
        .parent()
        .find('option:selected')
        .text()
        .replace('Theme - ', '');

    // loops and activates only those with the matching text
    if ($value === 'Select Theme') {
        $tshirtColor.addClass(options.hiddenClass);
        validateDesign();
    } else {
        $tshirtColor.removeClass(options.hiddenClass);
        destroyErrorHTML($design);
    }

    // Only display the available options based on parents selection
    $('#color option').each(function () {
        let $this = $(this);
        if ($this.is(':contains(' + $value + ')')) {
            $this.removeClass(options.hiddenClass);
        } else {
            $this.addClass(options.hiddenClass);
        }
    });

    // pre-select the value using the first available option
    const $newOption = $('#color option:not(.' + options.hiddenClass + ')').first().val();
    if ($newOption) {
        $color.val($newOption);
    } else {
        $color.val(options.defaultColorText);
    }
});


/**
* 14. Event listener: $activities
* - Enables and disables activities if a certain
* - time block is selected.
*/
$activities.on('change', function () {
    const $this = $(this);
    const $time = $this.attr('data-day-and-time');

    // disable any matching day and time otherwise restore it
    if ($time) {
        
        if ($this.is(':checked')) {
            $('.activities input[data-day-and-time="' + $time + '"]:not(:checked)').attr('disabled', true);
        } else {
            $('.activities input[data-day-and-time="' + $time + '"]').removeAttr('disabled');
        }
    }

    // Validate activities
    validateActivities();
});


/**
* 15. Event listener: $payment
* - Display or hide the credit card fields
*/
$payment.on('change', function () {
    // get the current target class use regex to replace spaces with -
    const $targetClass = '.' + $(this).val()
        .toLowerCase()
        .replace(/\s/, '-');

    // remove hidden class from targeted div
    $($targetClass)
        .removeClass(options.hiddenClass)
        .siblings('div')
        .addClass(options.hiddenClass);
});


/**
* 16. Event listener: $name
* - Validates name field on keyup
*/
$name.on('keyup', function () {
    validateName();
});


/**
* 17. Event listener: $email
* - Validates email field on keyup
*/
$email.on('keyup', function () {
    validateEmail();
});


/**
* 18. Event listener: $titleOther
* - Validates other title field on keyup
*/
$titleOther.on('keyup', function () {
    validateTitle();
});


/**
* 19. Event listener: $ccNum
* - Validates credit card field on keyup
*/
$ccNum.on('keyup', function () {
    validateCard();
});


/**
* 20. Event listener: $ccZip
* - Validates zip code field on keyup
*/
$ccZip.on('keyup', function () {
    validateZip();
});


/**
* 21. Event listener: $ccCVV
* - Validates CVV field on keyup
*/
$ccCVV.on('keyup', function () {
    validateCVV();
});


/**
* 22. Event listener: $form
* - Validates all the fields inside the form
*/
$form.submit(function (event) {
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

    // Handle the errors
    $error = $('.error').first();
    if ($error.length) {
        $('html, body').animate({
            scrollTop: ($error.offset().top - 40)
        }, 500);
        return false;
    } else {
        alert('Everything is valid');
    }
});