

	var app=angular.module('myApp', ['ui.router']);

	app.config(function($stateProvider, $urlRouterProvider){

		$stateProvider

		$urlRouterProvider.otherwise('/')
	})

	app.controller('homeCtrl', function($scope, $http, $rootScope){

		// Enter your own api key by signing up on http://api.openweathermap.org for free
		var API_KEY = "53b5e757611a67783fcc501a3f5ed57a";
		$scope.city ;
		var lat, lon, counter = 0;
				
		$scope.weatherQuery = function(currentCity, condition){

			if (condition == true) {
				currentCity = $scope.city;
			}
			// http://api.openweathermap.org/data/2.5/weather?q=bhopal&APPID=53b5e757611a67783fcc501a3f5ed57a
			$http.get("https://api.openweathermap.org/data/2.5/weather?q="+currentCity+"&APPID="+API_KEY)
			.then(success, failure);

			function success(response) {
				// console.log(response);

				$scope.weatherData = response.data;
				lat = $scope.weatherData.coord.lat;
				lon = $scope.weatherData.coord.lon;
				$scope.weatherIcon = "https://openweathermap.org/img/w/"+$scope.weatherData.weather[0].icon+".png";
				// Second http request
				$http.get("https://api.sunrise-sunset.org/json?lat="+lat+"&lng="+lon+"&date=today")
				.then(function(response){
					// console.log(response);
					$scope.sun = response.data.results;
				}, function(error){
					// console.log(error);
				});
				// console.log($rootScope.coordinates);

				var k = response.data.main.temp;
				var c = k-273.15;
				$scope.temprature = c.toFixed(0);
			}

			function failure(err) {
				// console.log(err);
			}

			$scope.warn = function() {
				// alert("You fool!");
			}
		}

		$scope.weatherQuery("Bhopal","false");

		$scope.more = function(){
			if (counter == 0){
				$(".temp-text").css("display", "none");
				$(".panel-extra").css("display", "block");
				// $(".image-placeholder").attr("src","https://source.unsplash.com/random/800x510");
				$(".clicker").html("Less");
				counter = 1;
			}	else	{
				$(".panel-extra").css("display", "none");
				$(".temp-text").css("display", "block");
				// $(".image-placeholder").attr("src","https://source.unsplash.com/random/720x250");
				$(".clicker").html("More");
				counter = 0;
			}
			
		};

		// Script for api mapper
		

	});


app.controller('apiCtrl', function($scope, $http){

	$scope.request = "";
	$scope.bodyText = $(".widget1body").html();
	var reference = 1, code = "";

	$scope.mapApi = function(){
		if ($scope.request == "")
			console.log("Invalid request");
		else	{
			$(".widget1body").html("");
			$http.get($scope.request)
			.then(function(response){
				objectCtrl(response)
				$(".widget1body").append(code);
			}, function(error){
				$(".widget1body").html(error.status+' : '+error.statusText);
			});
			$(".clear1").css("display", "inline");
		}
	}

	$scope.clear = function(){
		$(".widget1body").html($scope.bodyText);
		$scope.request = "";
		code = "";
		$(".clear1").css("display", "none");
	}
	
	var objectCtrl = function(object){	
		for (var key in object){
			var colorCode;
			if ((typeof(object[key]) == "object")) {
				reference = reference + 1;
				code = code +'<ul class="list-group"><li class="list-group-item small-text color-'+(reference-1)+' shift-'+(reference-1)+'">'+key+' <em>('+typeof(object[key])+')</em></li>';
				objectCtrl(object[key])
				code = code + '</ul>';
				reference = reference - 1;
			}	else	{
				if (reference == 1)
					code = code + '<ul class="list-group">';
				code = code + '<li class="list-group-item small-text color-'+reference+' shift-'+reference+'">'+key+' : '+object[key]+' <em>('+typeof(object[key])+')</em></li>';
				if (reference == 1)
					code = code + '</ul>';
			}
		}
	}
});

app.controller('jokeCtrl', function($scope, $http){
	
	var decor = $(".bodyText").html(), query = "", counter = 1;
	$scope.firstName ="";
	$scope.lastName ="";
	$scope.jokeNumber = 1;

	function returnName(firstName, lastName){
		if (firstName && lastName)
			query = "?firstName="+firstName.toProperCase()+"&lastName="+lastName.toProperCase();
	}

	String.prototype.toProperCase = function() {
	  var words = this.split(' ');
	  var results = [];
	  for (var i=0; i < words.length; i++) {
	      var letter = words[i].charAt(0).toUpperCase();
	      results.push(letter + words[i].slice(1));
	  }
	  return results.join(' ');
	};

	$scope.clear = function() {
		$scope.firstName = "";
		$scope.lastName = "";
		$(".bodyText").html(decor);
		$(".clear").css("display", "none");
	}

	$scope.more = function() {
		if (counter == 0) {
			$(".less").html("More");
			$(".inputFields").css("display", "none");
			counter = 1;
		}	else	{
			$(".less").html("Less");
			$(".inputFields").css("display", "inline");
			counter = 0;
		}
	}

	$scope.getJoke = function(){
		returnName($scope.firstName, $scope.lastName);
		$http.get("https://api.icndb.com/jokes/random/"+$scope.jokeNumber +query)
		.then(function(response){
			$(".bodyText").html(response.data.value[0].joke);
		})
		$(".clear").css("display", "inline");
	}

})
