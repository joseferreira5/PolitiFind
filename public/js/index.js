// Get references to page elements
var $userAddress = $("#user-address");
var $submit = $("#submit");

// Add event listeners to the submit and delete buttons
$submit.on("submit", function() {
  if ($userAddress.val().trim() === "") {
    event.preventDefault();
  }
});
