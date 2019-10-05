/******************************************
Treehouse FSJS Techdegree:
project 3 - Interactive Form

******************************************/

const $name = $('#name');
const $title = $('#title');
const $titleOther = $('#other-title');
const $design = $('#design');
const $color = $('#color');

const hiddenClass = 'is-hidden';
const defaultColorText = 'Please select a T-shirt theme';


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
    Step 4: Job Role
*/