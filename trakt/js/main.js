$(document).ready(function() {
	var api_key = '90bc62ae93bc6cdb8d726039ef45cbcb375c4b5c23bb22cf58ca039e96ecb1ef';

	function ajax_director(movie_id) {
		return $.ajax({
			type: 'GET',
			url: 'https://api.trakt.tv/movies/' + movie_id + '/people',
			headers: {
				"trakt-api-key": api_key,
				"trakt-api-version": 2
			},
			dataType: 'json'
		});
	}

	function ajax_runtime(movie_id) {
		return $.ajax({
			type: 'GET',
			url: 'https://api.trakt.tv/movies/' + movie_id,
			headers: {
				"trakt-api-key": api_key,
				"trakt-api-version": 2
			},
			dataType: 'json',
			data: {
				extended: 'full'
			}
		});
	}

	$('#load-data').on('click', function() {
		$("#watchlist tbody").empty();

		$.ajax({
			type: 'GET',
			url: 'https://api.trakt.tv/users/loljiaxi/watchlist/movies/added',
			headers: {
				"trakt-api-key": api_key,
				"trakt-api-version": 2
			},
			dataType: 'json',
			success: function(res) {
				$.each(res, function(i, e) {
					var trakt_movie_id = e.movie.ids.trakt;

					$("#watchlist tbody").append(`
					<tr data-trakt-index="${trakt_movie_id}">
						<td id="title">${e.movie.title}</td>
						<td id="year">${e.movie.year}</td>
						<td id="director"></td>
						<td id="runtime"></td>
					</tr>
					`);
				});
			},
			error: function(err) {
				console.log(err);
			},
			complete: function() {
				$.each($('#watchlist tbody tr'), function(i, e) {
					var trakt_movie_id = $(e).data('trakt-index');

					$.when(ajax_director(trakt_movie_id), ajax_runtime(trakt_movie_id)).done(function(a1, a2) {
						var director = a1[0].crew.directing[a1[0].crew.directing.findIndex(e => e.jobs.indexOf('Director') > -1)].person.name;
						var runtime = a2[0].runtime;

						$(e).find('td#director').html(director);
						$(e).find('td#runtime').html(runtime);
					});
				});
			}
		});
	});
});