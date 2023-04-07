$(document).ready(function() {
    // Attach click event handler to checkout button
    $('#checkout-button').click(function() {
       if (confirm("Are you sure to pay product")) {
      // Send an AJAX request to the "checkout" route
      $.ajax({
        type: 'POST',
        url: '/cart/payment'
      });
    
    alert("Payment successful!");
    location.reload();
    }
    });
    
  });