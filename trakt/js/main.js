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
					var director, runtime;

					$.when(ajax_director(trakt_movie_id), ajax_runtime(trakt_movie_id)).done(function(a1, a2) {
						director = a1[0].crew.directing[a1[0].crew.directing.findIndex(e => e.jobs.indexOf('Director') > -1)].person.name;
						runtime = a2[0].runtime;
						
						$("#watchlist tbody").append(`
						<tr>
							<td>${e.movie.title}</td>
							<td>${e.movie.year}</td>
							<td>${director}</td>
							<td>${runtime}</td>
						</tr>
						`);
					});
				});
			},
			error: function(err) {
				console.log(err);
			}
		});
	});
});