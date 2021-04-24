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
import Feature, { createStyleFunction } from 'ol/Feature';
import Point from 'ol/geom/Point';
import {fromLonLat} from 'ol/proj'

//Shape stuff
import Circle from 'ol/geom/Circle';
import {Circle as CircleStyle, Fill, Stroke} from 'ol/style';

let london = new Feature ({
  geometry: new Point(fromLonLat([-0.12755, 51.507222])),
  name: "london",
  imgsrc: "images/vaccine.png",
  articleTitle: "uk vaccines",
  description: "aasdlkjfhasdklfjhasldkfjhasldkfj\nas;dklfjas;dlkfja;\n"
});

let minneapolis = new Feature ({
  geometry: new Point(fromLonLat([-79.3832, 43.6532])),
  name: "minneapolis",
  imgsrc: "images/derekchauvin.jfif",
  articleTitle: "Derek Chauvin Guilty LOL",
  description: "aasdlkjfhasdklfjhasldkfjhasldkfj\nas;dklfjas;dlkfja;\n"
});

let vancouver = new Feature ({
  geometry: new Point(fromLonLat([-123.1207, 49.2827])),
  name: "vancouver",
  imgsrc: "images/vancouver.jpg",
  articleTitle: "something",
  description: "aasdlkjfhasdklfjhasldkfjhasldkfj\nas;dklfjas;dlkfja;\n"
});

let china = new Feature ({
  geometry: new Point(fromLonLat([90.3413, 35.2827])),
  name: "china",
  imgsrc: "images/uyghurschina.jfif",
  articleTitle: "uyghurschina",
  description: "aasdlkjfhasdklfjhasldkfjhasldkfj\nas;dklfjas;dlkfja;\n"
});

const countries = [china, vancouver, london, minneapolis]

for (let i = 0; i < countries.length; i++) {
  countries[i].setStyle (
    new Style ({
      image: new Icon ({
        src: 'images/marker.png',
        scale: 0.08,
      }),
    })
  );
}

let vectorSource = new VectorSource ({
  features: countries
});

let vectorLayer = new VectorLayer ({
  source: vectorSource,
});


//SHAPE STUFF
var image = new CircleStyle({
  radius: 5,
  fill: null,
  stroke: new Stroke({color: 'red', width: 1}),
});

let styles = {
  'Circle': new Style({
    stroke: new Stroke({
      color: 'red',
      width: 2,
    }),
    fill: new Fill({
      color: 'rgba(255,0,0,0.2)',
    }),
  }),
  'yellowCircle': new Style({
    image: new CircleStyle({
      radius: 10,
      fill: null,
      stroke: new Stroke({
        color: 'magenta',
      }),
    }),
  })
};


let styleFunction = function (feature) {
  return styles[feature.getGeometry().getType()];
};


let shapeSource = new VectorSource();

shapeSource.addFeature(new Feature(new Circle([4e6, 1e6], 1000000)));
shapeSource.addFeature(new Feature(new Circle([1e6, 3e6], 1000000)));
shapeSource.addFeature(new Feature(new Circle([2e6, 7e6], 1000000)));
shapeSource.addFeature(new Feature(new Circle([7e6, 8e6], 1000000)));
shapeSource.addFeature(new Feature(new Circle([-10e6, 5e6], 1000000)));

let shapeLayer = new VectorLayer ({
  source: shapeSource,
  style: styleFunction
})

//POPUP
let container = document.getElementById('popup');
let content = document.getElementById('popup-content');
let closer = document.getElementById('popup-closer');

let overlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

let map = new Map({
  layers: [new TileLayer({
    source: new OSM()
  }),
  vectorLayer,
  shapeLayer], 
  overlays: [overlay],
  target: document.getElementById('map'),
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});


closer.onclick = () => {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

map.on('click', (event) => {
  let coordinate = event.coordinate;
  let hdms = toStringHDMS(toLonLat(coordinate));
  let feature = map.forEachFeatureAtPixel(event.pixel, (feature) => {
    return feature;
  });

  if (feature) {
    content.innerHTML = ``
    content.innerHTML = `<h6>${hdms}</h6><h3>${feature.get('articleTitle')}</h3><img src="${feature.get('imgsrc')}"><h6>${feature.get('description')}</h6>`;
    overlay.setPosition(coordinate);
  } else {
    overlay.setPosition(undefined);
    closer.blur(); 
  }
});
