$(document).ready(function() {
    $("#submit-button").click(function(e) {
      e.preventDefault();
  
      var isValid = true;
      
      // Validate the fields
      var fields = ['#username', '#firstname', '#lastname', '#phone', '#fax', '#email']
      var fieldNames = ['Username', 'First Name', 'Last Name', 'Phone', 'Fax', 'Email'];
  
      fields.forEach(function(field, index) {
        if(!$(field).val()) {
          $(field).parent().addClass('has-error');
          toastr.error(fieldNames[index] + ' is missing');
          isValid = false;
        } else {
          $(field).parent().removeClass('has-error');
        }
      });
      
      var cost = $("#cost");
      if (!cost.val() || isNaN(cost.val())) {
        toastr.error("No cost was calculated");
        isValid = false;
      } else if (parseFloat(cost.val()) <= 0) {
        toastr.error("Cost is negative");
        isValid = false;
      }
      
      if (isValid) {
        toastr.success("Form was successfully submitted");
      }
    });
    
    $("#reset-button").click(function() {
      toastr.info("Fields have been successfully cleared");
      $('.has-error').removeClass('has-error');
    });
  
    $("#adults, #check-in, #check-out").change(function() {
      var adults = $("#adults").val();
      var checkin = moment($("#check-in").val());
      var checkout = moment($("#check-out").val());
  
      duration = checkout.diff(checkin, 'days');
  
      $("#days").val(duration);
  
      cost = 150 * adults * duration;
  
      $("#cost").val(cost);
    });
  });