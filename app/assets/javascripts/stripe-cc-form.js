//ON DOCUMENT READY
$(document).ready(function() {
  console.log('doc is ready');
  // Watch for cc form submission

  $("#payment-form").submit(function(event) {
    event.preventDefault();
    //Disable submit to prevent multiple submissions
    $('#submitBtn').attr('disabled', 'disabled');

    //Remove old error messages
    $('#payment-errors').text('');
    $('#input-error').removeAttr('id', 'input-error');
    var error = false;

    // Get the values:
    var ccNum = $('.card-number').val(),
        cvcNum = $('.card-cvc').val(),
        expMonth = $('#expiry-month').val(),
        expYear = $('#expiry-year').val();

    console.log('ccNum: ', ccNum, ' expMonth: ', expMonth);

    // Validate the number:
    if (!Stripe.card.validateCardNumber(ccNum)) {
        error = true;
        reportError('The credit card number appears to be invalid.', 'card-number');
    }

    // Validate the CVC:
    if (!Stripe.card.validateCVC(cvcNum)) {
        error = true;
        reportError('The CVC number appears to be invalid.', 'card-cvc');
    }

    // Validate the expiration:
    if (!Stripe.card.validateExpiry(expMonth, expYear)) {
        error = true;
        reportError('The expiration date appears to be invalid.', 'select-dropdown');
    }

    if (!error) {
        // Get the Stripe token:
        Stripe.card.createToken({
            number: ccNum,
            cvc: cvcNum,
            exp_month: expMonth,
            exp_year: expYear
        }, stripeResponseHandler);
     }

    // Prevent the form from submitting:
    return false;
  });
});


//HANDLE ASYNC RESPONSE FROM STRIPE
 function stripeResponseHandler(status, response) {
  if (response.error) {
      reportError(response.error.message);
  } else {
    // No errors, submit the form.
    // Get a reference to the form:
    var f = $("#payment-form");
    // Get the token from the response:
    var token = response.id;
    console.log('TOKEN RETURNED FROM STRIPE: ', token);
    // Add the token to the form:
    f.append('<input type="hidden" name="stripeToken" value="' + token + '" />');

    // Submit the form:
    // f.get(0).submit();
  }
}

//HANDLE USER ERRORS IN PAYMENT FORM
function reportError(msg, input) {

  //re-initialize text fields
  Materialize.updateTextFields();
  //remove old error msgs
  $('#payment-errors').text('');
  $('.input-error').removeClass('input-error');
  // Show the error in the form:
  $('#payment-errors').text(msg);
  //If error relates to specific input, highlight the input
  if(input) {
    $('input.' + input).addClass('input-error');
  }
  // Re-enable the submit button:
  $('#submitBtn').prop('disabled', false);

  return false;
}