//ON DOCUMENT READY
$(document).ready(function() {
  console.log('doc is ready');
  // Watch for cc form submission
  $("#payment-form").submit(function(event) {

    //Disable submit to prevent multiple submissions
    $('#submitBtn').attr('disabled', 'disabled');

    //Remove old error messages
    $('#payment-errors').text('');
    $('#input-error').removeAttr('id', 'input-error');
    var error = false;

    // Validate the number:
    if (!Stripe.card.validateCardNumber(ccNum)) {
        error = true;
        reportError('The credit card number appears to be invalid.');
    }

    // Validate the CVC:
    if (!Stripe.card.validateCVC(cvcNum)) {
        error = true;
        reportError('The CVC number appears to be invalid.');
    }

    // Validate the expiration:
    if (!Stripe.card.validateExpiry(expMonth, expYear)) {
        error = true;
        reportError('The expiration date appears to be invalid.');
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

    console.log('TOKEN FROM STRIPE: ', token);
    // Submit the form:
    // f.get(0).submit();
  }
}

//HANDLE USER ERRORS IN PAYMENT FORM
function reportError(msg, input) {
  // Show the error in the form:
  $('#payment-errors').text(msg);
  //If error relates to specific input, highlight the input
  if(input) {
    $('input.' + input).attr('id', 'input-error');
  }

  // Re-enable the submit button:
  $('#submitBtn').prop('disabled', false);

  return false;
}