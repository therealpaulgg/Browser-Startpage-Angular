import { Component, ViewChild, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { HttpClient } from '@angular/common/http';
import { MapModule, MapAPILoader, BingMapAPILoaderConfig, BingMapAPILoader, WindowRef, DocumentRef, MarkerTypeId, IMapOptions, IBox, IMarkerIconInfo, ILatLong, MapTypeId, BingMapService, MapService, IInfoWindowOptions } from "angular-maps";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass']
})

export class MapComponent implements OnInit {

  @ViewChild("myMap", { static: false }) myMap

  constructor(private settingsService: SettingsService, private http: HttpClient) { }

  themeSetting: string
  searchInput: string
  places: Array<any>
  map: any
  userLocation: any

  _markerTypeId = MarkerTypeId

  _promise: Promise<any>
  _map: any



  async _processMapPromise(promise: Promise<any>) {
    this._promise = promise;
    this._promise.then(x => {
      this._map = x;
      navigator.geolocation.getCurrentPosition(position => {
        this._map.setView({
          center: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        })
        this.userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      },
        () => {
          // Function for handling user location rejection.
          this.http.get<any>("https://www.geoip-db.com/json/").subscribe(res => {
            console.log("ip: " + res.latitude + " " + res.longitude)
            this._map.setView({
              center: {
                latitude: res.latitude,
                longitude: res.longitude
              }
            })
            this.userLocation = {
              latitude: res.latitude,
              longitude: res.longitude
            }
          })
        }
      )
    });
  }

  _options: IMapOptions = {
    disableBirdseye: false,
    disableStreetside: false,
    navigationBarMode: 1,
    showBreadcrumb: true,
    mapTypeId: MapTypeId.road,
    zoom: 12
  }

  ngOnInit() {
    this.settingsService.getSettings().subscribe(obj => {
      this.themeSetting = obj.themeSetting
    })
  }

  onSubmit() {
    console.dir(this._map)
    let bnds: Array<number> = this._map.getBounds().bounds
    this.http.get<any>(`https://dev.virtualearth.net/REST/v1/LocalSearch/?query=${this.searchInput}&userMapView=${bnds[2]},${bnds[3]},${bnds[0]},${bnds[1]}&key=AmPeldhwmA9rt7hVuJZAb5eSnJmiU-YJxxw8QDoyhyVZBghurkl6NOHHcfrPT0y0`)
      .subscribe(res => {
        this.places = []
        res.resourceSets[0].resources.forEach(place => {
          if (place.geocodePoints) {
            let coords = place.geocodePoints[0].coordinates
            this.places.push({
              name: place.name,
              address: place.Address,
              phone: place.PhoneNumber,
              website: place.Website,
              latitude: coords[0],
              longitude: coords[1],
              description: "Sample description"
            })
          } else {
            place.Address.addressLine = place.Address.addressLine.replace(/\./g, '')
            this.http.get<any>(`http://dev.virtualearth.net/REST/v1/Locations/US/${place.Address.adminDistrict}/${place.Address.postalCode}/${place.Address.locality}/${encodeURIComponent(place.Address.addressLine)}?maxResults=1&key=AmPeldhwmA9rt7hVuJZAb5eSnJmiU-YJxxw8QDoyhyVZBghurkl6NOHHcfrPT0y0`)
              .subscribe(res => {
                let coords = res.resourceSets[0].resources[0].geocodePoints[0].coordinates
                this.places.push({
                  name: place.name,
                  address: place.Address,
                  phone: place.PhoneNumber,
                  website: place.Website,
                  latitude: coords[0],
                  longitude: coords[1],
                  description: "Sample description"
                })
              })
          }
        })
      })
  }
}
