var map;

function initMap() {
    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 22.18, lng: 113.545},
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        zoom: 14
    });
    map.setTilt(45);
}

function Casino (obj){
    var self = this;

    self.name = ko.observable(obj.name);
    self.address = ko.observable(obj.address);
    self.lat = ko.observable(obj.coords.J);
    self.lng = ko.observable(obj.coords.M);
    self.description = ko.observable(obj.description);

    self.marker = new google.maps.Marker({
        position: {lat: self.lat(), lng: self.lng()},
        animation: google.maps.Animation.DROP,
        icon: 'images/green_markerC.png'
    });
    self.infoWindow = new google.maps.InfoWindow({
        content: '<div class="info-window">' + '<h5>' + self.name() + '</h5>' + self.description() + '</div>',
        maxWidth: 200
    });
}

var ViewModel = function(){
    var self = this;
    self.keyPhrase = ko.observable();
    self.allCasinos = ko.observableArray([]);
    self.listed = ko.observableArray([]);
    self.highlighted = ko.observableArray([]);
    self.previousInfoWindow = ko.observable();

    init();

    self.init = function(){
        init();
    };

    self.activateCasino = function(casino){
        activateCasino(casino);
    };

    self.search = function () {
        self.keyPhrase(self.keyPhrase().toUpperCase().substring(0, 3)); // Only looks at first 3 characters so that we don't have to find exact match.
        var matches = [];
        self.allCasinos().forEach(function(c) {
           if (c.name().toUpperCase().indexOf(self.keyPhrase()) !== -1) {
               matches.push(c);
           }
        });
        removeMarkers(self.listed);
        self.listed(matches);
        setMarkers(self.listed);
    };

    function init() {
        // When we reset the map, we don't want duplicates.
        self.allCasinos.removeAll();

        // Create casinos from data.
        casinoData.forEach(function(obj) {
            self.allCasinos.push(new Casino(obj));
        });

        // Adds event listener for each marker. Couldn't figure out how to data-bind the marker.
        self.allCasinos().forEach(function(c){
            c.marker.addListener('click', function() {
                activateCasino(c);
            });
        });

        // Set current markers to all casinos at start.

        self.listed(self.allCasinos());
        initMap();
        setMarkers(self.listed);
    }

    function activateCasino(casino){
        self.highlighted.removeAll();
        self.highlighted.push(casino);
        setHighlightedIcons(self.highlighted);
        removeMarkers(self.listed);
        setMarkers(self.listed);
        if (self.previousInfoWindow()) {
            self.previousInfoWindow().close();
        }
        casino.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ casino.marker.setAnimation(null); }, 750);
        casino.infoWindow.open(map, casino.marker);
        self.previousInfoWindow(casino.infoWindow);
        map.panTo(casino.marker.getPosition());
        map.setZoom(16);
    }

    function setHighlightedIcons (casinos) {
        self.allCasinos().forEach(function(c) {
            c.marker.icon = 'images/green_markerC.png';
        });
        casinos().forEach(function(c) {
            c.marker.icon = 'images/red_markerC.png';
        });
    }

    function setMarkers(casinos){
        casinos().forEach(function(c) {
            c.marker.setMap(map);
        });
    }

    function removeMarkers(casinos) {
        casinos().forEach(function(c) {
            c.marker.setMap(null);
        });
    }
};

ko.applyBindings(new ViewModel());

