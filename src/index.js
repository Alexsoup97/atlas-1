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
      color: 'rgba(255, 0, 0, .5)',
      crossOrigin: 'anonymous',
      src: 'marker.png',
      scale: 0.2,
    }),
  })
);

var iconFeature = new Feature({
  geometry: new Point([0, 0]),
  name: 'Null Island',
  population: 4000,
  rainfall: 500,
});

var iconStyle = new Style({
  image: new Icon({
    anchor: [0, 0],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: 'marker.png',
  }),
});


iconFeature.setStyle(iconStyle);

console.log(iconFeature);

var vectorSource = new VectorSource({
  features: [london]
});

var vectorLayer = new VectorLayer({
  source: vectorSource,
});


console.log(vectorLayer);



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
  })], 
  overlays: [overlay],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

map.on('singleclick', function (evt) {
  var coordinate = evt.coordinate;
  var hdms = toStringHDMS(toLonLat(coordinate));

  content.innerHTML = '<p>ARTICLE</p><code>' + hdms + '</code>';
  console.log(hdms);
  overlay.setPosition(coordinate);
});