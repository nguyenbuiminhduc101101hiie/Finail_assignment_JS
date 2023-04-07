
$(document).ready(function() {
	// Function to update the cart count
	function updateCartCount() {
	$.ajax({
		type: 'GET',
		url: '/cart/count',
		success: function(data) {
		// Update the cart icon with the count
		$('#cart-count').text(data.count);
		},
		error: function() {
		console.error('Error');
		}
	});
	}

	// Call the updateCartCount function on page load and on every cart update
	updateCartCount();
	$(document).on('cartUpdated', updateCartCount);
});
	
