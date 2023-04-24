var arrival_date = "";
var departure_date = "";
var defaut_startDate = moment().format('DD/MM/YYYY');// Today
var default_endDate = moment().add(5, 'day').format('DD/MM/YYYY');
var default_date_range = defaut_startDate+" - "+default_endDate;

setDefaultDateRange();

$(function() {
    $('#date-range-picker').daterangepicker({
      opens: "left",
      applyClass: "btn-primary",
      cancelClass: "btn-default",
      locale: { 
        format: 'DD/MM/YYYY'
      }
    }, function(start, end, label) {
      arrival_date = start.format('YYYY-MM-DD');
      departure_date = end.format('YYYY-MM-DD');
    });
  });

  // Set default date range 
  function setDefaultDateRange() {
    $('#date-range-picker').val(default_date_range);
  }
  
