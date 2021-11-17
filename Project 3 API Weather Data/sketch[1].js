//Open Weather Map API: Weather in the Netherlands and Belgium
//Leaflet P5js reference: https://editor.p5js.org/austinjesusgonzalez/sketches/LdW4tmcJ7

//ref from prof base map
//https://editor.p5js.org/tnorton5829/sketches/GD6Bxd3Ht

var weather_nl;
var weather_be;

var dropdown;

var cloud_url = "cloud_icon.png";
var partly_cloudy = "partly_cloudy.png";
var scattered_clouds = "few-clouds.png";
var mist_url = "mist_icon.png";
var clear_url = "sunny_icon.png";
var drizzle_url = "cloud.drizzle.png";

var marker;

var temp_list = [];

function preload() {
  var url =
    "https://api.openweathermap.org/data/2.5/box/city?bbox=3.311798,51.432294,6.983069,53.335945,8&appid=6930d4399c7bd76a1d7a716c8b67dc54&units=metric";

  var url_be =
    "https://api.openweathermap.org/data/2.5/box/city?bbox=2.576837,51.280641,5.630197,50.686251,8&appid=6930d4399c7bd76a1d7a716c8b67dc54&units=metric";

  loadJSON(url, gotDataNL);
  loadJSON(url_be, gotDataBE);

  Nl_Font = loadFont("rijksoverheidsansheading-regular-webfont.ttf");
}

function setup() {
  createCanvas(680, 130);

  var map = L.map("mapid").setView([52.3676, 4.9041], 7);

  //Leaflet layer
  L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  //Destinct Icons that show up on the map: Netherlands and Belgium have different icons
  var myIconNL = L.icon({
    iconUrl: "nl_windmill.png",
    iconSize: [60], // size of the icon
    iconAnchor: [20, 59], // point of the icon which will correspond to marker's location
    popupAnchor: [-2, -5], // point from which the popup should open relative to the iconAnchor
  });

  var myIconBE = L.icon({
    iconUrl: "flanders.jpg",
    iconSize: [25], // size of the icon
    iconAnchor: [20, 59], // point of the icon which will correspond to marker's location
    popupAnchor: [-2, -5], // point from which the popup should open relative to the iconAnchor
  });

  if (weather_nl) {
    var weatherList = weather_nl.list;

    var weatherListName = weatherList[0].name; //returns a city name

    console.log(weatherList, weatherListName);

    for (i = 0; i < weatherList.length; i++) {
      var cities_NL = weatherList[i].name;
      var lat_NL = weatherList[i].coord.Lat;
      var lon_NL = weatherList[i].coord.Lon;
      var temp_NL = weatherList[i].main.temp;

      temp_list.push(temp_NL);
      console.log(temp_list[0]);

      for (k = 0; k < temp_list[k].length; k++) {
        var temp_number = L.marker([lat_NL, lon_NL], {
          icon: temp_number,
        }).addto(map);
      }

      //https://leafletjs.com/examples/geojson/

      var weatherDescriptionNL = weatherList[i].weather;

      for (j = 0; j < weatherDescriptionNL.length; j++) {
        weatherDescNL = weatherDescriptionNL[j].main;
        weatherDetailNL = weatherDescriptionNL[j].description; //in main, Clouds has more descriptive features so we visualize those

        //Mouseover reference: https://embed.plnkr.co/393lgE49Ndqsj7O6dg19/

        //Popups will have different icons depending on the weather, and a user just has to hover over with a mouse to get the info
        if (weatherDetailNL == "overcast clouds") {
          var marker = L.marker([lat_NL, lon_NL], { icon: myIconNL })
            .addTo(map)
            .bindPopup(
              "<strong>" +
                cities_NL +
                "</strong>" +
                "<br>" +
                "<br>" +
                "<img src=" +
                cloud_url +
                " width=100%>" +
                "<br>" +
                "<strong>" +
                temp_NL +
                " C" +
                "</strong>"
            );
          marker.on("mouseover", function (e) {
            this.openPopup();
          });
          marker.on("mouseout", function (e) {
            this.closePopup();
          });
        } else if (
          weatherDetailNL == "scattered clouds" ||
          weatherDetailNL == "few clouds"
        ) {
          var marker_b = L.marker([lat_NL, lon_NL], { icon: myIconNL })
            .addTo(map)
            .bindPopup(
              "<strong>" +
                cities_NL +
                "</strong>" +
                "<br>" +
                "<br>" +
                "<img src=" +
                partly_cloudy +
                " width=100%>" +
                "<br>" +
                "<strong>" +
                temp_NL +
                " C" +
                "</strong>"
            );
          marker_b.on("mouseover", function (e) {
            this.openPopup();
          });
          marker_b.on("mouseout", function (e) {
            this.closePopup();
          });
        } else if (weatherDetailNL == "broken clouds") {
          var marker_c = L.marker([lat_NL, lon_NL], { icon: myIconNL })
            .addTo(map)
            .bindPopup(
              "<strong>" +
                cities_NL +
                "</strong>" +
                "<br>" +
                "<br>" +
                "<img src=" +
                scattered_clouds +
                " width=100%>" +
                "<br>" +
                "<strong>" +
                temp_NL +
                " C" +
                "</strong>"
            );
          marker_c.on("mouseover", function (e) {
            this.openPopup();
          });
          marker_c.on("mouseout", function (e) {
            this.closePopup();
          });
        } else if (weatherDescNL == "Mist") {
          var marker_d = L.marker([lat_NL, lon_NL], { icon: myIconNL })
            .addTo(map)
            .bindPopup(
              "<strong>" +
                cities_NL +
                "</strong>" +
                "<br>" +
                "<br>" +
                "<img src=" +
                mist_url +
                " width=100%>" +
                "<br>" +
                "<strong>" +
                temp_NL +
                " C" +
                "</strong>"
            );
          marker_d.on("mouseover", function (e) {
            this.openPopup();
          });
          marker_d.on("mouseout", function (e) {
            this.closePopup();
          });
        } else if (weatherDescNL == "Clear") {
          var marker_e = L.marker([lat_NL, lon_NL], { icon: myIconNL })
            .addTo(map)
            .bindPopup(
              "<strong>" +
                cities_NL +
                "</strong>" +
                "<br>" +
                "<br>" +
                "<img src=" +
                clear_url +
                " width=120%>" +
                "<br>" +
                "<strong>" +
                temp_NL +
                " C" +
                "</strong>"
            );
          marker_e.on("mouseover", function (e) {
            this.openPopup();
          });
          marker_e.on("mouseout", function (e) {
            this.closePopup();
          });
        } else if (weatherDescNL == "Drizzle") {
          var marker_f = L.marker([lat_NL, lon_NL], { icon: myIconNL })
            .addTo(map)
            .bindPopup(
              "<strong>" +
                cities_NL +
                "</strong>" +
                "<br>" +
                "<br>" +
                "<img src=" +
                drizzle_url +
                " width=100%>" +
                "<br>" +
                "<strong>" +
                temp_NL +
                " C" +
                "</strong>"
            );
          marker_f.on("mouseover", function (e) {
            this.openPopup();
          });
          marker_f.on("mouseout", function (e) {
            this.closePopup();
          });
        }
      }
    }
  }

  if (weather_be) {
    var weatherListBE = weather_be.list;

    var weatherListNameBE = weatherListBE[0].name;

    console.log(weatherListBE, weatherListNameBE);

    for (i = 0; i < weatherListBE.length; i++) {
      var cities_BE = weatherListBE[i].name;
      var lat_BE = weatherListBE[i].coord.Lat;
      var lon_BE = weatherListBE[i].coord.Lon; //push these to a list
      var temp_BE = weatherListBE[i].main.temp;

      var weatherDescriptionBE = weatherListBE[i].weather;

      for (j = 0; j < weatherDescriptionBE.length; j++) {
        weatherDescBE = weatherDescriptionBE[j].main;
        weatherDetailBE = weatherDescriptionBE[j].description; //in main, Clouds has more descriptive features so we visualize those

        // if weather is clouds, the pop up should have a cloud icon, mist, then mist icon
        if (weatherDetailBE == "overcast clouds") {
          var marker_ba = L.marker([lat_BE, lon_BE], { icon: myIconBE })
            .addTo(map)
            .bindPopup(
              "<strong>" +
                cities_BE +
                "</strong>" +
                "<br>" +
                "<br>" +
                "<img src=" +
                cloud_url +
                " width=100%>" +
                "<br>" +
                "<strong>" +
                temp_BE +
                " C" +
                "</strong>"
            );
          marker_ba.on("mouseover", function (e) {
            this.openPopup();
          });
          marker_ba.on("mouseout", function (e) {
            this.closePopup();
          });
        } else if (
          weatherDetailBE == "scattered clouds" ||
          weatherDetailBE == "few clouds"
        ) {
          var marker_bb = L.marker([lat_BE, lon_BE], { icon: myIconBE })
            .addTo(map)
            .bindPopup(
              "<strong>" +
                cities_BE +
                "</strong>" +
                "<br>" +
                "<br>" +
                "<img src=" +
                partly_cloudy +
                " width=100%>" +
                "<br>" +
                "<strong>" +
                temp_BE +
                " C" +
                "</strong>"
            );
          marker_bb.on("mouseover", function (e) {
            this.openPopup();
          });
          marker_bb.on("mouseout", function (e) {
            this.closePopup();
          });
        } else if (weatherDetailBE == "broken clouds") {
          var marker_bc = L.marker([lat_BE, lon_BE], { icon: myIconBE })
            .addTo(map)
            .bindPopup(
              "<strong>" +
                cities_BE +
                "</strong>" +
                "<br>" +
                "<br>" +
                "<img src=" +
                scattered_clouds +
                " width=100%>" +
                "<br>" +
                "<strong>" +
                temp_BE +
                " C" +
                "</strong>"
            );
          marker_bc.on("mouseover", function (e) {
            this.openPopup();
          });
          marker_bc.on("mouseout", function (e) {
            this.closePopup();
          });
        } else if (weatherDescBE == "Mist") {
          var marker_bd = L.marker([lat_BE, lon_BE], { icon: myIconBE })
            .addTo(map)
            .bindPopup(
              "<strong>" +
                cities_BE +
                "</strong>" +
                "<br>" +
                "<br>" +
                "<img src=" +
                mist_url +
                " width=100%>" +
                "<br>" +
                "<strong>" +
                temp_BE +
                " C" +
                "</strong>"
            );
          marker_bd.on("mouseover", function (e) {
            this.openPopup();
          });
          marker_bd.on("mouseout", function (e) {
            this.closePopup();
          });
        } else if (weatherDescBE == "Clear") {
          var marker_be = L.marker([lat_BE, lon_BE], { icon: myIconBE })
            .addTo(map)
            .bindPopup(
              "<strong>" +
                cities_BE +
                "</strong>" +
                "<br>" +
                "<br>" +
                "<img src=" +
                clear_url +
                " width=120%>" +
                "<br>" +
                "<strong>" +
                temp_BE +
                " C" +
                "</strong>"
            );
          marker_be.on("mouseover", function (e) {
            this.openPopup();
          });
          marker_be.on("mouseout", function (e) {
            this.closePopup();
          });
        } else if (weatherDescBE == "Drizzle") {
          var marker_bf = L.marker([lat_BE, lon_BE], { icon: myIconBE })
            .addTo(map)
            .bindPopup(
              "<strong>" +
                cities_BE +
                "</strong>" +
                "<br>" +
                "<br>" +
                "<img src=" +
                drizzle_url +
                " width=100%>" +
                "<br>" +
                "<strong>" +
                temp_BE +
                " C" +
                "</strong>"
            );
          marker_bf.on("mouseover", function (e) {
            this.openPopup();
          });
          marker_bf.on("mouseout", function (e) {
            this.closePopup();
          });
        }
      }
    }
  }
}

function gotDataNL(data) {
  weather_nl = data;
}

function gotDataBE(data) {
  weather_be = data;
}

function draw() {
  //rect(0, 680, 680, 680, 680, 880, 0, 880);
  background(29, 55, 89);
  fill(255);

  fill(237, 211, 139);
  textFont(Nl_Font, 50);
  text("Live Weather API", 15, 55);
  textFont(Nl_Font, 25);
  text(
    "Netherlands and Belgium, Hover over any icon for the weather.",
    15,
    100
  );
}
