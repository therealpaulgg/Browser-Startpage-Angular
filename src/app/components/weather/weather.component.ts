import { Component, OnInit, OnDestroy } from '@angular/core'
import { WeatherService } from '../../services/weather.service'
import { Subscription } from 'rxjs';
import { Links } from 'src/app/links';
import { SettingsService } from 'src/app/services/settings.service';
import { SettingsInfo } from 'src/app/models/settingsinfo';

@Component({
    selector: 'app-weather-display',
    templateUrl: './weather.component.html',
    styleUrls: ['./weather.component.sass']
})

export class WeatherComponent implements OnInit, OnDestroy {
    weatherSubscription: Subscription
    settingsSubscription: Subscription
    private links = new Links()
    celsius: string
    fahrenheit: string
    location: string
    description: string
    iconClass: string
    settings: SettingsInfo

    constructor(private weatherService: WeatherService, private settingsService: SettingsService) { }

    ngOnInit() {
        this.weatherSubscription = this.weatherService.getWeatherObservable().subscribe(update => {
            this.celsius = update.celsius
            this.fahrenheit = update.fahrenheit
            this.location = update.location
            this.description = update.description
            this.iconClass = this.getWeatherIconClass(update.id, update.sunrise, update.sunset)
        })
        this.settingsSubscription = this.settingsService.getSettings().subscribe(settings => {
            this.settings = new SettingsInfo(settings.tempSetting, settings.bothDegrees, settings.themeSetting)
        })
    }

    private getWeatherIconClass(id, sunrise, sunset) {
        let icon = this.links.weatherIconDict[id].icon
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
