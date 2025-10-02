$(document).ready(function () {

    
    $('#submitButton').click(function () {
        const inputData = $('#inputData').val();
        const selectedDay = $('#inputDate').val();


        // This new code lets the page log input data
        const logItem = $(`<li><strong>January ${selectedDay}: </strong> ${inputData}</li>`);
        $('#logList').append(logItem);

        // This new code clears input fields
        $('#inputData').val('');
        $('#inputDate').val('');
    });

});