/*
{
    name: '',
    address: '',
    coords: null,
    description:
},
*/

var casinoData = [
    {
        name: 'Wynn',
        address: 'Rua Cidade de Sintra, Macau, China',
        coords: {J: 22.1903203, M: 113.54408030000002},
        description: 'bah'
    },
    {
        name: 'Grand Lisboa',
        address: 'Avenida De Lisboa, Macau, China',
        coords: {J: 22.18961, M: 113.54734869999993},
        description: 'blah'
    },
    {
        name: 'The Venetian',
        address: 'Estrada da Baia de Nossa Senhora da Esperanca, Macau, China',
        coords: {J: 22.1498394, M: 113.5576006},
        description: 'blah'
    },
    {
        name: 'MGM Casino',
        address: 'Avenida Dr. Sun Yat Sen, NAPE, Macau, China',
        coords: {J: 22.198745, M: 113.54387300000008},
        description: 'blah'
    },
    {
        name: 'Lisboa Casino',
        address: '2-4 Avenida de Lisboa, Macau, China',
        coords: {J: 22.1898943, M: 113.54436859999998},
        description: 'blah'
    },
    {
        name: 'Yat Yuen',
        address: 'Avenida do General Castelo Branco, Macau, China',
        coords: {J: 22.2114697, M: 113.54429149999999},
        description: 'blah'
    },
    {
        name: 'Floating Casino',
        address: 'Avenida de Amizade, Outer Harbour, Macau, China',
        coords: {J: 22.196974, M:113.556198},
        description: 'blah'
    },
    {
        name: 'Rio Casino',
        address: 'Rua Luis Gonzaga Gomes, Macau, China',
        coords: {J: 22.193661, M: 113.55232539999997},
        description: 'blah'
    },
    {
        name: 'Grand Waldo',
        address: 'Avenida Marginal Flor De Lotus, Macau',
        coords: {J: 22.198745, M: 113.54387300000008},
        description: 'blah'
    },
    {
        name: 'Babylon Casino',
        address: 'Macau Fisherman\'s Wharf, Macau, China',
        coords: {J: 22.191272, M: 113.556880},
        description: 'blah'
    }
];

var geocoder = new google.maps.Geocoder();
casinoData.forEach(function(casino) {
    if (! casino.coords) {
        geocoder.geocode({address: casino.address}, function (results, status) {
            console.log(results[0].geometry.location)
        });
    }
});
