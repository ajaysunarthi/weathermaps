(function() {

    var checkGeoLocation = function() {
        if (navigator.geolocation) {
            return true;
        } else {
            return false;
        }
    };

    var success = function(position) {
        var mapcanvas = document.createElement('div');
        mapcanvas.id = 'mapcontainer';
        // mapcanvas.style.height = '400px';
        // mapcanvas.style.width = '600px';

        document.getElementById('map').appendChild(mapcanvas);

        var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var options = {
            zoom: 10,
            center: coords,
            mapTypeControl: false,
            navigationControlOptions: {
                style: google.maps.NavigationControlStyle.SMALL
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("mapcontainer"), options);

        var marker = new google.maps.Marker({
            position: coords,
            draggable: true,
            animation: google.maps.Animation.DROP,
            map: map,
            title: "You are here!"
        });

        getWeatherData(position.coords.latitude, position.coords.longitude).then(function(response) {
            domInsertion(response);

        }, function(error) {
            console.error("Failed!", error);
        });

        google.maps.event.addListener(marker, 'dragend', function(event) {
            getWeatherData(this.getPosition().lat(), this.getPosition().lng()).then(function(response) {
                domInsertion(response);
            }, function(error) {
                console.error("Failed!", error);
            });
        });

    }

    var getWeatherData = function(lat, lng) {
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open("GET", "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&appid=e2fc329e868fb6f7fa6ff16c676d61ef", true);
            req.onload = function() {
                if (req.status == 200) {
                    resolve(req.response);
                } else {
                    reject(Error(req.statusText));
                }
            };
            req.onerror = function() {
                reject(Error("Network Error"));
            };

            req.send();
        });
    };

    var domInsertion = function(data) {
        data = JSON.parse(data);
        // console.log(data);
        weatherDiv = document.getElementById('weather');
    	iconDiv = document.querySelector('#icon');
        headingDiv = document.querySelector('#heading');
        tempDiv = document.querySelector('#temperature');
        humidityDiv = document.querySelector('#humidity');
        windDiv = document.querySelector('#wind');
        mainDiv = document.querySelector('#main');
        countryDiv = document.querySelector('#country');
        headingDiv.innerHTML = data.name;
        //var farenheit = Number(data.main.temp);
        var degree = ((Number(data.main.temp) - 273.15)).toFixed(2);
        tempDiv.innerHTML = 'Temperature : '+ degree +'&deg; C';
        humidityDiv.innerHTML = 'Humidity : '+data.main.humidity+'%';
        windDiv.innerHTML = 'wind : '+data.wind.speed+'km/h';
        mainDiv.innerHTML = data.weather[0].description;
        countryDiv.innerHTML = ','+data.sys.country;

        switch (data.weather[0].main) {
            case 'Rain':
                weatherDiv.style.backgroundImage = "url('http://pexels.imgix.net/photos/1551/field-thunderstorm-rainy-meadow.jpg?fit=crop&w=800&h=800')"; 
                iconDiv.setAttribute('class', 'wi wi-rain-mix');
                break;
            case 'Drizzle':
                weatherDiv.style.backgroundImage = "url('https://images.unsplash.com/photo-1420496854436-ae64eb61e937?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=3e7679b73726a7728679d51fb73e0b10')";
                iconDiv.setAttribute('class', 'wi wi-rain-mix');
                break;
            case 'Clear':
                weatherDiv.style.backgroundImage = "url('http://pexels.imgix.net/photos/3032/summer-ray-of-sunshine-bikes-bicycles.jpg?fit=crop&w=800&h=800')";
                iconDiv.setAttribute('class', 'wi wi-day-sunny');
                break;
            case 'Clouds':
                weatherDiv.style.backgroundImage = "url('http://pexels.imgix.net/photos/2083/city-clouds-cloudy-ray-of-sunshine.jpg?fit=crop&w=800&h=800')";
                iconDiv.setAttribute('class', 'wi wi-day-cloudy');
                break;
            case 'Thunderstorm':
                weatherDiv.style.backgroundImage = "url('http://pexels.imgix.net/photos/2271/clouds-cloudy-field-meadow.jpg?fit=crop&w=800&h=800')";
                iconDiv.setAttribute('class', 'wi wi-day-storm-showers');
                break;
            case 'Snow':
                weatherDiv.style.backgroundImage = "url('http://pexels.imgix.net/photos/2377/snow-black-and-white-street-winter.jpg?fit=crop&w=800&h=800')";
                iconDiv.setAttribute('class', 'wi wi-day-snow');
                break;
            case 'Mist':
                weatherDiv.style.backgroundImage = "url('http://pexels.imgix.net/photos/5230/road-fog-foggy-mist.jpg?fit=crop&w=800&h=800')";
                iconDiv.setAttribute('class', 'wi wi-day-fog');
                break;
            case 'Fog':
                weatherDiv.style.backgroundImage = "url('http://pexels.imgix.net/photos/5230/road-fog-foggy-mist.jpg?fit=crop&w=800&h=800')";
                iconDiv.setAttribute('class', 'wi wi-day-fog');
                break;
            case 'Haze':
                weatherDiv.style.backgroundImage = "url('http://pexels.imgix.net/photos/5281/city-sky-skyline-australia.jpg?fit=crop&w=800&h=800')";
                iconDiv.setAttribute('class', 'wi wi-day-smoke');
                break;            
        }
    }

    if (checkGeoLocation()) {
        navigator.geolocation.getCurrentPosition(success);
    } else {}

})();
