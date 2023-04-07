$(document).ready(function() {
    // Attach a click event handler to the "Add to Cart" button

    $('.add-to-cart').click(function() {
      // Get the product ID from a data attribute on the button
      let id = $(this).data('product-id');
      // Send an AJAX request to the "add to cart" route
      $.ajax({
        type: 'POST',
        url: '/cart/add/' + id
      });
      $(document).trigger('cartUpdated');
      alert("Added Succed");
      
    });
  });