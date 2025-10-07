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
            <button class="btn btn-sm btn-danger float-end delete" data-id="${entry._id}">Delete</button>
          </li>
        `);
      });
    });
  }

  $('#sleepForm').submit(function (e) {
    e.preventDefault();
    const entry = {
      name: $('#name').val(),
      date: $('#date').val(),
      sleepTime: $('#sleepTime').val(),
      wakeTime: $('#wakeTime').val(),
      quality: $('#quality').val()
    };
    $.post(API_URL, entry, () => fetchEntries(entry.name));
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
