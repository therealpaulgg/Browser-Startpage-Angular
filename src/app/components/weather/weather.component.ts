import { Component, OnInit, OnDestroy } from '@angular/core'
import { WeatherService } from '../../services/weather.service'
import { DatetimeService } from '../../services/datetime.service'
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-weather-display',
    templateUrl: './weather.component.html',
    styleUrls: ['./weather.component.sass']
})

export class WeatherComponent implements OnInit, OnDestroy {
    weatherSubscription: Subscription
    displayString: string // this is the string that is displayed on screen.
    signalSubscription: Subscription

    constructor(private weatherService: WeatherService, private datetimeService: DatetimeService) { }

    ngOnInit() {
        this.weatherSubscription = this.weatherService.getWeatherObservable().subscribe(update => {
            this.displayString = `${update.celsius} °C / ${update.fahrenheit} °F in ${update.location} - ${update.description} `
        })
    }

    ngOnDestroy() {
        // cleaning up
        this.signalSubscription.unsubscribe()
        this.weatherSubscription.unsubscribe()
    }
}
