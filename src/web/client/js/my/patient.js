// JS for patient screen
$(document).ready(function() {

  var patientRowMaker = function(mr_id, lastName, firstName, dob, gender){

    var $element = $(" \
    <td>" + mr_id + "</td> \
    <td>"+ lastName + "</td> \
    <td>"+ firstName + "</td> \
    <td>"+ dob + "</td> \
    <td>"+ gender +"</td>");

    return $element;
  };

  var procedureRowMaker = function(ac, dos, completed, factulty){

    var $element = $(" \
    <tr class='clickable-row' data-href='main.html'> \
    <td class='ac-id'>" + ac + "</td> \
    <td>"+ dos + "</td> \
    <td>"+ completed + "</td> \
    <td>"+ factulty +"</td> \
    </tr>");

    return $element;
  };


  var patient_id = Cookies.getCookie("patient_id");
  var mr_id = Cookies.getCookie("mr_id");
  var last_name = Cookies.getCookie("last_name");
  var firt_name = Cookies.getCookie("firt_name");
  var dob = Cookies.getCookie("dob");
  var next_procedure = Cookies.getCookie("next_procedure");

  $("#patient-info").append(patientRowMaker(mr_id, last_name, firt_name,
    dob, next_procedure));

  var salts = JSON.parse(Cookies.getCookie("salts"));

  getPatientProcedure(salts, session_id, session_key,
    user_id, mr_id, patient_id).done(function(data) {
    if (debug) console.log(data);
    if(data.error == "false"){
      Cookies.addToCookieArray("salts", data.salt, 1);

      var procedureArray = data.procedures;

      for (var i = 0; i < procedureArray.length; i++) {
        var procedure = procedureArray[i];
        $("#procedure-rows").append(procedureRowMaker(procedure.ac_id,
          procedure.date_time_of_service, procedure.completed, procedure.faculty_id));
        }
        $(".clickable-row").click(function() {
          var ac_id = $(this).find('.ac-id').text();
          if (debug) console.log(ac_id);
          Cookies.setCookie("ac_id", ac_id, 1);
          window.document.location = $(this).data("href");
        });
        $('#procedure-table').dataTable();
      } else {
        // window.location.href = "admin.html";
      }
    });

    $('#operationDate').datetimepicker({
      format: 'MM/DD/YYYY'}
    );

    $('#operationTime').datetimepicker({
      format: 'HH:mm'}
    );

    $("#addProcedure").click(function(){
      var salts = JSON.parse(Cookies.getCookie("salts"));
      addProcedure(salts, session_id, session_key, user_id, mr_id, patient_id);
    });

    $("#addProcedureForm").submit(function(){
      event.preventDefault();
      var salts = JSON.parse(Cookies.getCookie("salts"));
      var ac_id = $("#ac").val();
      var date_of_service = $("#operationDate").val();
      var service_time = $("#operationTime").val();
      var date_time_of_service = date_of_service + " " + service_time;
      var faculty_id = $("#faculty").val();
      var procedure_id = Cookies.getCookie("procedure_id");

      if (procedure_id != null){
        if (debug) console.log(ac_id + "" + date_time_of_service
        + faculty_id + procedure_id);
        updateProcedure(salts, user_id, session_id, session_key, patient_id,
          procedure_id, {"ac_id": ac_id,
          "date_time_of_service": date_time_of_service,
          "faculty_id": faculty_id}).done(
            function(data) {
              if (debug) console.log(data);
              if(data.error == "false"){
                Cookies.addToCookieArray("salts", data.salt, 1);
                window.document.location = "patient.html";
              }
            });
        }
    });

});
