import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ConvertPlaceService } from '../services/convert-place.service';
import { MapService } from '../services/map.service';
import { Search } from '../models/searchMap'
import { icon, latLng, Map, marker, point, polyline, tileLayer, featureGroup, LatLngBounds } from 'leaflet';

import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: L.Map;
  placeInput: String
  latitude: number = 16.047079
  longitude: number = 108.206230

  hotelIcon = L.icon({
    iconUrl: '../assets/hotel.png',
    iconSize: [80, 80],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
  });


  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  options = {
    layers: [this.streetMaps],
    zoom: 15,
    radius: 300,
    center: latLng(this.latitude, this.longitude),
  };


  searchForm: Search = {
    f: 'json',
    latitude: 0,
    longitude: 0,
    category: 'hotel',
    maxLocations: 10,
    outFields: 'Place_addr, PlaceName',
  }

  placeFound = []

  constructor(private convertPlaceService: ConvertPlaceService, private MapService: MapService) {

  }

  ParseDMS(input) {
    var parts = input.split(/[^\d\w]+/);
    return this.ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
  }


  ConvertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60);
    if (direction == "S" || direction == "W") {
      dd = dd * -1;
    }
    return dd;
  }


  convertPlace() {
    this.convertPlaceService.convertPlace(this.placeInput).subscribe(
      (doc) => {
        this.latitude = this.ParseDMS(doc.results[0].annotations.DMS.lat)
        this.longitude = this.ParseDMS(doc.results[0].annotations.DMS.lng)
        this.searchForm.latitude = this.latitude;
        this.searchForm.longitude = this.longitude
        return this.searchForm
      }
    )
  }


  onMapReady(map: L.Map) {
    this.map = map;
  }


  findPlace() {
    this.placeFound = []
    this.map.panTo(new L.LatLng(this.latitude, this.longitude));
    if (this.searchForm.latitude !== 0 || this.searchForm.longitude !== 0) {
      this.MapService.findMap(this.searchForm).subscribe(
        (doc) => {
          doc.candidates.forEach(e => {
            this.placeFound.push(marker([e.location.y, e.location.x])
              .bindPopup("<b>Name: </b>" + e.address + '.<br><b>Address: </b> ' + e.attributes.Place_addr)
              .openPopup()
              .setIcon(this.hotelIcon))
          });
          if (this.placeFound.length > 0) {
            const group = featureGroup(this.placeFound)
            group.addTo(this.map);
            this.map.fitBounds(group.getBounds());
          }
        }
      )
    }
  }











  
  ngOnInit() {

  }

}
