$(document).ready(function() {
	var api_key = '90bc62ae93bc6cdb8d726039ef45cbcb375c4b5c23bb22cf58ca039e96ecb1ef';

	function ajax_director(movie_id) {
		$.ajax({
			type: 'GET',
			url: 'https://api.trakt.tv/movies/' + movie_id + '/people',
			headers: {
				"trakt-api-key": api_key,
				"trakt-api-version": 2
			},
			dataType: 'json',
			success: function(res) {
				return res.crew.directing[res.crew.directing.findIndex(e => e.job == 'Director')].person.name;
			},
			error: function(err) {
				return err;
			}
		});
	}

	function ajax_runtime(movie_id) {
		$.ajax({
			type: 'GET',
			url: 'https://api.trakt.tv/movies/' + movie_id,
			headers: {
				"trakt-api-key": api_key,
				"trakt-api-version": 2
			},
			dataType: 'json',
			data: {
				extended: 'full'
			},
			success: function(res) {
				return res.runtime;
			},
			error: function(err) {
				return err;
			}
		});
	}

	$('#load-data').on('click', function() {
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
						console.log(a1, a2);
					})

					$("#watchlist tbody").empty().append(`
						<tr>
							<td>${e.movie.title}</td>
							<td>${e.movie.year}</td>
							<td>${director}</td>
							<td>${runtime}</td>
						</tr>
					`);
				})
			},
			error: function(err) {
				console.log(err);
			}
		});
	});
});