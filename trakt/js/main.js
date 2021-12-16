$(document).ready(function() {
	var api_key = '90bc62ae93bc6cdb8d726039ef45cbcb375c4b5c23bb22cf58ca039e96ecb1ef';

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

					$.ajax({
						type: 'GET',
						url: 'https://api.trakt.tv/movies/' + trakt_movie_id + '/people',
						headers: {
							"trakt-api-key": api_key,
							"trakt-api-version": 2
						},
						dataType: 'json',
						success: function(res) {
							// director = res.crew.directing[res.crew.directing.findIndex(e => e.job == 'Director')].person.name;
							console.log(res);
						},
						error: function(err) {
							console.log(err);
						}
					});

					$.ajax({
						type: 'GET',
						url: 'https://api.trakt.tv/movies/' + trakt_movie_id,
						headers: {
							"trakt-api-key": api_key,
							"trakt-api-version": 2
						},
						dataType: 'json',
						data: {
							extended: 'full'
						}
						success: function(res) {
							// runtime = res.runtime;
							console.log(res);
						},
						error: function(err) {
							console.log(err);
						}
					});

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