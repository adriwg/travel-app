var arrival_date = "";
var departure_date = "";

$(function() {
    $('#date-range-picker').daterangepicker({
      opens: "left",
      applyClass: "btn-primary",
      cancelClass: "btn-default",
      
    }, function(start, end, label) {
      //console.log("A new date range was chosen: " + start.format('DD/MM/YYYY') + ' to ' + end.format('DD/MM/YYYY'));
      arrival_date = start.format('YYYY-MM-DD');
      departure_date = end.format('YYYY-MM-DD');
      /* console.log(typeof(arrival_date), arrival_date);
      console.log(typeof(departure_date), departure_date); */
    });


  });
  
