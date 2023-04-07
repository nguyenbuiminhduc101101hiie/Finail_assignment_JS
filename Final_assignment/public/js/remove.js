       
   $(document).ready(function() {
    // Attach a click event handler to the "Add to Cart" button
          $('.product-remove').click(function() {
             if (confirm("Do you want to remove this product?")) {
          
                // Get the product ID from a data attribute on the button
                let id = $(this).data('product-id');
          
                // Send an AJAX request to the "add to cart" route
                $.ajax({
                type: 'POST',
                url: '/cart/remove/' + id,
                success: function(datas) {

                   if (datas.success) {
                   }
                }
             });
             }
          location.reload()
          });
       });