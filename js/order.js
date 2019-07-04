 //   The ready() method is used to make a function available after the document is loaded.
  $(document).ready(function() {
    /*
     * get order details by order id
     * pass the Access Token
     * return the order details form order endpoint
     */
    // The change() method triggers the change event, or attaches a function to run when a change event occurs.
    $('#order-id').change(function() {
      //  val() is used to get input elements values in jQuery
      var orderId = $("#order-id").val();
      //  var customurl = "<?php echo $this->getUrl().'frontname/index/index'?>";
      //  check the order is correct
      // this is the magento end point for orders

      var URL = "https://ciaranquinlan.com/rest/V1/orders/" + orderId;

      if (orderId) {
        //               must set these variables for accessing the M2 api
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": URL,
          "method": "GET",
          "headers": {
            // This is the Integrations authorization Access Token setup in Magento
            // Log in to Admin and click System > Extensions > Integrations to display the Integrations page
            "authorization": "Bearer az5t8r5a35mzbv3ssflcxfuh2g0b2ixq",
            "cache-control": "no-cache"
          },
          fail: function(xhr, textStatus, errorThrown) {
            $(".order-details").html("<div class='error'>Request has failed, Server on fire, Please try again later</div>");
          },
          error: function(xhr, ajaxOptions, thrownError) {
            $(".order-details").html("<div class='error'>We are really sorry, we cant find your order!</div>");
          }
        }
      }
      // You can access the M2 api with AJAX functions and done returns values into response from the endpoint
      // The order details will be put into the response json array
      $.ajax(settings).done(function(response) {
        // all the contents of the response are sent to console.  
        console.log(response);
        // In M2 the following api varables are use for orders: 
        // order_id is the internal Magento order ID (database table auto increment id)
        // increment_id is the ID which you communicate to your customer - this is what we need.
        // quote_id is the internal quote id 

        if (response.increment_id) {
          // need to check if customer is undefined, this will happen if ordered and are not registered customers.
          var firstName = response.customer_firstname;
          if (firstName === undefined || firstName === null) {
            firstName = "Guest Visitor";
          }
          // get the day they placed the order and reformat it.
          var datelogCreate = new Date(response.created_at);
          var longDateCreate = datelogCreate.toString()
          var dayMonDateCreate = longDateCreate.substring(0, 10);
          // get the update day they placed the order and reformat it.
          var datelogUpdate = new Date(response.created_at);
          var longDateUpdate = datelogUpdate.toString()
          var dayMonDateUpdate = longDateUpdate.substring(0, 10);
          // blot out part of the email address - next version!
          console.log("the day of order is", dayMonDateCreate, dayMonDateUpdate);
          $(".order-details").html(" " +
            "Hi " + firstName + "<br>" + "Thank you for your order ref#:" + orderId + " on " + dayMonDateCreate + "." + "<br>" +
            "Your order was updated on " + dayMonDateUpdate + " to order status of " + response.status + "." + "<br>" +
            "We sent the details to email " + response.customer_email + "." + "<br>" +
            "The Order total was: " + "$" + response.grand_total + "." + "<br>" +
            "Thanks for you custom." + "<br>"
          )
        } else {
          $(".order-details").html("<div class='error'>I'm really sorry your order details are missing.</div>");
        }
      });

    });

  });