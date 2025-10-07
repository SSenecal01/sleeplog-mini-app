$(document).ready(function () {
  const API_URL = '/api/sleep';

  function fetchEntries(name = '') {
    const url = name ? `${API_URL}/user/${name}` : API_URL;
    $.get(url, function (data) {
      $('#sleepList').empty();
      data.forEach(entry => {
        $('#sleepList').append(`
          <li class="list-group-item">
            <strong>${entry.name}</strong> on ${entry.date}<br/>
            Slept at ${entry.sleepTime}, Woke at ${entry.wakeTime}<br/>
            <em>Hours Slept:</em> ${entry.hoursSlept}<br/>
            <em>Quality:</em> ${entry.quality}
            <button class="btn btn-sm btn-primary float-end update" data-id="${entry._id}" 
            data-name="${entry.name}" data-date="${entry.date}" 
            data-sleepTime="${entry.sleepTime}" data-wakeTime="${entry.wakeTime}" 
            data-quality="${entry.quality}">Update</button>
            <button class="btn btn-sm btn-danger float-end delete" data-id="${entry._id}">Delete</button>
          </li>
        `);
      });
    });
  }

  $('#sleepForm').submit(function (e) {
    e.preventDefault();
    const id = $('#sleepForm').data('update-id');
    const entry = {
      name: $('#name').val(),
      date: $('#date').val(),
      sleepTime: $('#sleepTime').val(),
      wakeTime: $('#wakeTime').val(),
      quality: $('#quality').val()
    };
  
    if (id) {
      $.ajax({
        url: `${API_URL}/${id}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(entry),
        success: () => {
          fetchEntries(entry.name);
          $('#sleepForm').removeData('update-id'); 
          $('#sleepForm')[0].reset(); 
        }
      });
    } else {
      $.post(API_URL, entry, () => {
        fetchEntries(entry.name);
        $('#sleepForm')[0].reset();
      });
    }
  });

  $('#sleepList').on('click', '.update', function () {
    const id = $(this).data('id');
    const name = $(this).data('name');
    const date = $(this).data('date');
    const sleepTime = $(this).data('sleepTime');
    const wakeTime = $(this).data('wakeTime');
    const quality = $(this).data('quality');
    $('#name').val(name);
    $('#date').val(date);
    $('#sleepTime').val(sleepTime);
    $('#wakeTime').val(wakeTime);
    $('#quality').val(quality);
    $('#sleepForm').data('update-id', id);
  });


  $('#sleepList').on('click', '.delete', function () {
    const id = $(this).data('id');
    $.ajax({ url: `${API_URL}/${id}`, type: 'DELETE', success: () => fetchEntries($('#name').val()) });
  });

  $('#searchBtn').click(function () {
    const name = $('#searchName').val();
    $.get(`${API_URL}/search?name=${name}`, function (data) {
      $('#sleepList').empty();
      data.forEach(entry => {
        $('#sleepList').append(`
          <li class="list-group-item">
            <strong>${entry.name}</strong> on ${entry.date}<br/>
            Slept at ${entry.sleepTime}, Woke at ${entry.wakeTime}<br/>
            <em>Hours Slept:</em> ${entry.hoursSlept}<br/>
            <em>Quality:</em> ${entry.quality}
            <button class="btn btn-sm btn-danger float-end delete" data-id="${entry._id}">Delete</button>
          </li>
        `);
      });
    });
  });

  fetchEntries();
});
