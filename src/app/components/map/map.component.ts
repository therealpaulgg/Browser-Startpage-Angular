import { Component, ViewChild, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare let Microsoft: any

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
  bingAPIKey: string
  yelpAPIKey: string
  places: Array<any>
  map: any
  newTab: string

  async ngOnInit() {
    this.settingsService.getSettings().subscribe(obj => {
      this.themeSetting = obj.themeSetting
      this.bingAPIKey = obj.bingAPIKey
      this.yelpAPIKey = obj.yelpAPIKey
      this.newTab = obj.newTab
    })
  }

  ngAfterViewInit() {
    this.map = new Microsoft.Maps.Map(this.myMap.nativeElement, {
      credentials: this.bingAPIKey,
      showCopyright: false,
      showLogo: false,
      navigationBarMode: 1,
      showBreadcrumb: true,
      zoom: 12
    })

    let pushpin = new Microsoft.Maps.Pushpin(this.map.getCenter(), {
      title: "Your Location"
    })
    let layer = new Microsoft.Maps.Layer()
    layer.add(pushpin)
    this.map.layers.insert(layer)
    navigator.geolocation.getCurrentPosition(position => {
      this.map.setView({
        center: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      })
      layer.clear()
      layer.add(new Microsoft.Maps.Pushpin(this.map.getCenter(), { title: "Your Location" }))
    })
  }

  async onSubmit() {
    let bnds: Array<number> = this.map.getBounds().bounds
    let data = await fetch(`https://dev.virtualearth.net/REST/v1/LocalSearch/?query=${this.searchInput}&userMapView=${bnds[2]},${bnds[3]},${bnds[0]},${bnds[1]}&key=${this.bingAPIKey}`)
      .then(res => res.json())
    this.places = []
    let layer = new Microsoft.Maps.Layer()
    let coords: any
    data.resourceSets[0].resources.forEach(async place => {
      let location: any
      if (place.geocodePoints) {
        coords = place.geocodePoints[0].coordinates
        location = new Microsoft.Maps.Location(coords[0], coords[1])

      } else {
        place.Address.addressLine = place.Address.addressLine.replace(/\./g, '')
        let stuff = await fetch(`http://dev.virtualearth.net/REST/v1/Locations/US/${place.Address.adminDistrict}/${place.Address.postalCode}/${place.Address.locality}/${encodeURIComponent(place.Address.addressLine)}?maxResults=1&key=${this.bingAPIKey}`)
          .then(res => res.json())
        coords = stuff.resourceSets[0].resources[0].geocodePoints[0].coordinates
        location = new Microsoft.Maps.Location(coords[0], coords[1])
      }
      let pin = new Microsoft.Maps.Pushpin(location, {
        title: place.name
      })
      layer.add(pin)

      // yelp calls for additional information
      let yelpInit = await fetch(`https://browser-startpage-server.herokuapp.com/getBusinessInformation?name=${place.name}&address1=${place.Address.addressLine}&city=${place.Address.locality}&state=${place.Address.adminDistrict}&country=US&limit=1`, {
        headers: new Headers({
          "Authorization": `Bearer ${this.yelpAPIKey}`
        })
      })
        .then(res => res.json())

      if (!yelpInit.failure) {
        let rating = yelpInit.rating

        let rounded = Math.round(rating)
        let halfStar = rounded > rating
        let stars = []
        for (var i = 0; i < rounded - 1; i++) {
          stars.push({
            halfStar: false
          })
        }

        stars.push({
          halfStar: halfStar
        })
        this.places.push({
          name: place.name,
          address: place.Address,
          phone: place.PhoneNumber,
          website: place.Website,
          stars: stars,
          reviewCount: yelpInit.review_count,
          yelpsite: yelpInit.url,
          open: yelpInit.hours ? yelpInit.hours[0].is_open_now : null,
          hours: yelpInit.hours ? yelpInit.hours[0].open : null,
          days: ["S", "M", "T", "W", "TH", "F", "ST"],
          transactions: yelpInit.transactions,
          latitude: coords[0],
          longitude: coords[1]
        })
      } else {
        this.places.push({
          name: place.name,
          address: place.Address,
          phone: place.PhoneNumber,
          website: place.Website
        })
      }
    })
    this.map.layers.insert(layer)
  }
}
