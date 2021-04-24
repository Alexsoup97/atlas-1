import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import {toLonLat} from 'ol/proj';
import {toStringHDMS} from 'ol/coordinate';
import {Icon, Style} from 'ol/style';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {fromLonLat} from 'ol/proj'

var london = new Feature({
  geometry: new Point(fromLonLat([-0.12755, 51.507222])),
});

london.setStyle(
  new Style({
    image: new Icon({
      crossOrigin: 'anonymous',
      src: 'marker.png',
      scale: 0.08,
    }),
  })
);

var toronto = new Feature({
  geometry: new Point(fromLonLat([-79.3832, 43.6532])),
  name: "toronto"
});

toronto.setStyle(
  new Style({
    image: new Icon({
      crossOrigin: 'anonymous',
      src: 'marker.png',
      scale: 0.08,
    }),
  })
);

var iconFeature = new Feature({
  geometry: new Point(fromLonLat([-123.1207, 49.2827])),

});

var iconStyle = new Style({
  image: new Icon({
    
    scale: 0.08,
    src: 'marker.png',
  }),
});

iconFeature.setStyle(iconStyle);


var vectorSource = new VectorSource({
  features: [iconFeature, london, toronto]
});

var vectorLayer = new VectorLayer({
  source: vectorSource,
});

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var overlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

var map = new Map({
  layers: [new TileLayer({
    source: new OSM()
  }),vectorLayer], 
  overlays: [overlay],
  target: document.getElementById('map'),
  view: new View({
    center: [0, 0],
    zoom: 2,
    controls: []
  }),
});

//map.addLayer(EUCountriesGeoJSON)

closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

map.on('click', function (evt) {
  var coordinate = evt.coordinate;
  var hdms = toStringHDMS(toLonLat(coordinate));
  var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });

  if(feature){

    content.innerHTML = '<p>ARTICLE</p><img src="download.jfif">';
    overlay.setPosition(coordinate);
    console.log(feature.get('name'));
  }else{

    overlay.setPosition(undefined);
    closer.blur(); 
  }
});