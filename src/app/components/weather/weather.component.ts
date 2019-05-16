import { Component, OnInit, OnDestroy } from '@angular/core'
import { WeatherService } from '../../services/weather.service'
import { Subscription } from 'rxjs';
import { Links } from 'src/app/links';

@Component({
    selector: 'app-weather-display',
    templateUrl: './weather.component.html',
    styleUrls: ['./weather.component.sass']
})

export class WeatherComponent implements OnInit, OnDestroy {
    weatherSubscription: Subscription
    //displayString: string // this is the string that is displayed on screen.
    private links = new Links()
    celsius: string
    fahrenheit: string
    location: string
    description: string
    iconClass: string

    constructor(private weatherService: WeatherService) { }

    ngOnInit() {
        this.weatherSubscription = this.weatherService.getWeatherObservable().subscribe(update => {
            //this.displayString = `${update.celsius} °C / ${update.fahrenheit} °F in ${update.location} - ${update.description} `
            this.celsius = update.celsius
            this.fahrenheit = update.fahrenheit
            this.location = update.location
            this.description = update.description
            this.iconClass = this.getWeatherIconClass(update.id, update.sunrise, update.sunset)
        })
    }

    private getWeatherIconClass(id, sunrise, sunset) {
        let icon = this.links.weatherIconDict[id].icon
        console.log(id)
        if (!(id > 699 && id < 800) && !(id > 899 && id < 1000)) {
            let date = new Date()
            if (date.getTime() / 1000 > sunset || date.getDate() / 1000 < sunrise) {
                icon = "night-" + icon
            } else {
                icon = "day-" + icon
            }
        }
        return icon
    }

    ngOnDestroy() {
        // cleaning up
        this.weatherSubscription.unsubscribe()
    }
}
