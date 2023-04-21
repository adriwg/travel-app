
$(function() {
    $('#date-range-picker').daterangepicker({
      opens: "left",
      applyClass: "btn-primary",
      cancelClass: "btn-default",
      
    }, function(start, end, label) {
      console.log("A new date range was chosen: " + start.format('DD/MM/YYYY') + ' to ' + end.format('DD/MM/YYYY'));
      let arrival = start.format('DD/MM/YYYY');
      let departure = end.format('DD/MM/YYYY');
      console.log(typeof(arrival), arrival);
      console.log(typeof(departure), departure);
    });


  });
  
