import { Component, OnInit } from '@angular/core';
import { SettingsService } from './services/settings.service';
import { WeatherService } from './services/weather.service';
import { DatetimeService } from './services/datetime.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
    title = 'Startpage';
    themeSetting: string
    weatherLoaded: boolean
    timeLoaded: boolean
    headerMessage: string
    isNavbarCollapsed: boolean = true

    constructor(
        private settingsService: SettingsService,
        private weatherService: WeatherService,
        private datetimeService: DatetimeService
        ) { }

    ngOnInit() {
        this.settingsService.getSettings().subscribe(obj => {
            this.themeSetting = obj.themeSetting
            this.headerMessage = obj.headerMessage
        })

        // This is for telling the app that it is loaded.

        this.weatherService.getWeatherObservable().subscribe(obj => this.weatherLoaded = obj.location != null ? true : false)
        this.datetimeService.getTime().subscribe(obj => this.timeLoaded = obj.time != null ? true : false)
    }

}
