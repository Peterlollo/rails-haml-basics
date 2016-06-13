$(document).ready(function() {
  // Watch for a form submission:
  $("#payment-form").submit(function(event) {
    $('#submitBtn').attr('disabled', 'disabled');

    var ccNum = $('.card-number').val(),
        cvcNum = $('.card-cvc').val(),
        expMonth = $('select#expiry-month').val()
        expYear = $('select#expiry-year').val()

    console.log('ccNum ' + ccNum + 'cvcNum ' + cvcNum + 'expMonth ' + expMonth + 'expYear ' + expYear);

    return false;
  });
})