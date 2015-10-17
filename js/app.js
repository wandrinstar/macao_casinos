var map;

// Create a map object and specify the DOM element for display.
function initMap() {
    try {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 22.18, lng: 113.545},
            zoom: 14
        });
    } catch (e) {
        alert('Sorry, the map cannot load.');
        console.log(e);
    }
    ko.applyBindings(new ViewModel());
}

function handleClientLoad() {
    gapi.client.setApiKey('AIzaSyD9Ag7cAt-71fN77RKqSS6Zq9hgJed8RBA');
    gapi.client.load('youtube', 'v3');
}

function Casino (obj){
    var self = this;

    self.name = ko.observable(obj.name);
    self.address = ko.observable(obj.address);
    self.lat = ko.observable(obj.coords.J);
    self.lng = ko.observable(obj.coords.M);

    self.marker = new google.maps.Marker({
        position: {lat: self.lat(), lng: self.lng()},
        animation: google.maps.Animation.DROP,
        icon: 'images/greenMarker.png'
    });
    self.infoWindow = new google.maps.InfoWindow({
        content: '<div class="info-window">' + '<h5>' + self.name() + '</h5>' + '</div>',
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
    self.ytOpen = ko.observable('https://www.youtube.com/v/');
    self.ytVideoID = ko.observable('lkwVDitqTmk');
    self.ytClose = ko.observable('?autoplay=1');
    self.youtubeLink = ko.computed(function() {
        return (self.ytOpen() + self.ytVideoID() + self.ytClose());
    });
    init();

    self.init = function(){
        init();
    };
    self.activateCasino = function(casino){
        activateCasino(casino);
    };

    // Check if the first 3 characters of the user's search phrase matches any 3 characters in one of our casinos.
    self.search = function () {
        self.keyPhrase(self.keyPhrase().toUpperCase().substring(0, 3));
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
        setMarkers(self.listed);
    }

    // When a casino is activated, its marker bounces and turns red and its info window is opened.
    function activateCasino(casino){
        videoRequest(casino.name() + 'macao');

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
        map.panTo(new google.maps.LatLng(casino.lat(), casino.lng()));
    }

    function setHighlightedIcons (casinos) {
        self.allCasinos().forEach(function(c) {
            c.marker.icon = 'images/greenMarker.png';
        });
        casinos().forEach(function(c) {
            c.marker.icon = 'images/redMarker.png';
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

    function videoRequest(keyphrase) {
        var request = gapi.client.youtube.search.list({
                            part: 'snippet',
                            q: keyphrase,
                            type: 'video',
                            videoEmbeddable: true,
                            maxResults: 3
                        });
        request.execute(getVideo);
    }

    // Only creating this function cause can't seem to retrieve data unless I call execute on request and pass a function.
    // Response is parameter but we do not actually pass it. I guess it takes the value of request somehow.
    function getVideo(response) {
        var numVids = response.items.length;
        if (numVids === 0) {
            self.ytVideoID('8AAKbvLIbVw');
            return;
        }
        var randVid = Math.floor(Math.random() * numVids); // So that we don't show the same video every time.
        var videoId = response.items[randVid].id.videoId;
        self.ytVideoID(videoId);
    }
};
