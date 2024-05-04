mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v11',
  center: place.geometry.coordinates,
  zoom: 10
})

map.addControl(new mapboxgl.NavigationControl())


new mapboxgl.Marker({color: '#f078aa'})
.setLngLat(place.geometry.coordinates)
.setPopup(
  new mapboxgl.Popup({ offset: 25 })
      .setHTML(
        `<h3>${place.title}</h3><p>${place.location}</p>`
      )
)
.addTo(map)