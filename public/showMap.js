mapboxgl.accessToken =mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center: campg.geometry.coordinates, // starting position [lng, lat]
zoom: 8 // starting zoom
});
new mapboxgl.Marker()
.setLngLat(campg.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(
        `<h3>${campg.title}</h3>`
    )
)
.addTo(map)