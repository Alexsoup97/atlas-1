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
import Circle from 'ol/geom/Circle';
import {Fill, Stroke} from 'ol/style';
const {derekchauvin, riots, vaccine,genocide} = require('./article.json');

let london = new Feature ({
  geometry: new Point(fromLonLat([-0.12755, 51.507222])),
  name: "london",
  imgsrc: "images/vaccine.png",
  articleTitle: "Covid vaccine landmark as more than half UK receives initial jab",
  description: vaccine,
  avatar:"images/bbc.png",
  authorName:"John Smith",
  date:"April 24, 2020"
  
});

let minneapolis = new Feature ({
  geometry: new Point(fromLonLat([-93.2650, 44.9778])),
  name: "minneapolis",
  imgsrc: "images/derekchauvin.jfif",
  articleTitle: "Derek Chauvin Verdict Brings a Rare Rebuke of Police Misconduct",
  description: derekchauvin,
  avatar:"images/nyt.png",
  authorName:"John Smith",
  date:"April 24, 2020"
});

let washington = new Feature ({
  
  geometry: new Point(fromLonLat([-77.0369, 38.9072])),
  name: "washington",
  imgsrc: "images/vancouver.jpg",
  articleTitle: "Capitol riot: the terror attack that wasn’t",
  description: riots,
  avatar:"images/CNN.jpg",
  authorName:"John Smith",
  date:"April 24, 2020"

});

let china = new Feature ({
  geometry: new Point(fromLonLat([90.3413, 35.2827])),
  name: "china",
  imgsrc: "images/uyghurschina.jfif",
  articleTitle: "China’s Vanishing Muslims: Undercover In The Most Dystopian Place In The World",
  description: genocide,
  avatar:"https://yt3.ggpht.com/ytc/AAUvwngVplYvhKizY6Gee3ea3eSaqOMO3xvu3BY37DK4TQ=s48-c-k-c0x00ffffff-no-rj",
  authorName:"John Smith",
  date:"April 24, 2020"
});

const countries = [china, washington, london, minneapolis]

for (let i = 0; i < countries.length; i++) {
  countries[i].setStyle (
    new Style ({
      image: new Icon ({
        src: 'images/marker.png',
        anchor:[0.5, 640],
        anchorXUnits:'fraction',
        anchorYUnits:'pixels',
        scale: 0.07,
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


//RED BUBBLES
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
};


let styleFunction = function (feature) {
  return styles[feature.getGeometry().getType()];
};

let shapeSource = new VectorSource();

shapeSource.addFeature(new Feature(new Circle(fromLonLat([30.8025, 26.8206]), 1000000)));
shapeSource.addFeature(new Feature(new Circle(fromLonLat([-60.0217, -3.1190]), 1000000)));
shapeSource.addFeature(new Feature(new Circle(fromLonLat([116.4074,39.9042]), 1000000)));




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
    content.innerHTML = `<div class=left-preview id =${feature.get('name')}></div><div class = right-preview><h4>${hdms}</h4><h2>${feature.get('articleTitle')}</h2>
    <h6>${feature.get('description')}</h6><div class=author><img src= ${feature.get('avatar')} width =40 height = 40><div class = name><h4>  ${feature.get('authorName')}</h4><p>  ${feature.get('date')}</div></div></div>`;

    overlay.setPosition(coordinate);
  } else {
    overlay.setPosition(undefined);
    closer.blur(); 
  }
});
