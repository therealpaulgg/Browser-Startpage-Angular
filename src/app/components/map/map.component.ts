import { Component, ViewChild, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { HttpClient } from '@angular/common/http';
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
  places: Array<any>
  map: any

  ngOnInit() {
    this.settingsService.getSettings().subscribe(obj => {
      this.themeSetting = obj.themeSetting
    })
  }

  ngAfterViewInit() {
    this.map = new Microsoft.Maps.Map(this.myMap.nativeElement, {
      credentials: "AmPeldhwmA9rt7hVuJZAb5eSnJmiU-YJxxw8QDoyhyVZBghurkl6NOHHcfrPT0y0",
      showCopyright: false,
      showLogo: false
    })
    let pushpin = new Microsoft.Maps.Pushpin(this.map.getCenter(), {
      title: "Your Location"
    })
    let layer = new Microsoft.Maps.Layer()
    layer.add(pushpin)
    this.map.layers.insert(layer)
  }

  onSubmit() {
    let bnds: Array<number> = this.map.getBounds().bounds
    this.http.get<any>(`https://dev.virtualearth.net/REST/v1/LocalSearch/?query=${this.searchInput}&userMapView=${bnds[2]},${bnds[3]},${bnds[0]},${bnds[1]}&key=AmPeldhwmA9rt7hVuJZAb5eSnJmiU-YJxxw8QDoyhyVZBghurkl6NOHHcfrPT0y0`)
      .subscribe(res => {
        this.places = []
        let layer = new Microsoft.Maps.Layer()
        res.resourceSets[0].resources.forEach(place => {
          if (place.geocodePoints) {
            let coords = place.geocodePoints[0].coordinates
            let location = new Microsoft.Maps.Location(coords[0], coords[1])
            let pin = new Microsoft.Maps.Pushpin(location, {
              title: place.name
            })
            layer.add(pin)
          } else {
            place.Address.addressLine = place.Address.addressLine.replace(/\./g, '')
            this.http.get<any>(`http://dev.virtualearth.net/REST/v1/Locations/US/${place.Address.adminDistrict}/${place.Address.postalCode}/${place.Address.locality}/${encodeURIComponent(place.Address.addressLine)}?maxResults=1&key=AmPeldhwmA9rt7hVuJZAb5eSnJmiU-YJxxw8QDoyhyVZBghurkl6NOHHcfrPT0y0`)
              .subscribe(res => {
                let coords = res.resourceSets[0].resources[0].geocodePoints[0].coordinates
                let location = new Microsoft.Maps.Location(coords[0], coords[1])
                let pin = new Microsoft.Maps.Pushpin(location, {
                  title: place.name
                })
                layer.add(pin)
              })
          }

          this.places.push({
            name: place.name,
            address: place.Address,
            phone: place.PhoneNumber,
            website: place.Website
          })
        })
        this.map.layers.insert(layer)
      })
  }

}
