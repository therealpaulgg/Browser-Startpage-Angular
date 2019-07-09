import { Injectable } from '@angular/core'
import { Observable, of, BehaviorSubject } from 'rxjs'
import { WeatherInfo } from '../models/weatherinfo'
import { LocationInfo } from '../models/locationinfo'
import { HttpClient } from "@angular/common/http"
import { mergeMap, map } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { SettingsService } from './settings.service';

@Injectable({
    providedIn: 'root'
})

export class WeatherService {
    private subject = new Subject<any>()

    locationUrl = "https://www.geoip-db.com/json/"
    celsius: number
    fahrenheit: string
    location: string
    description: string
    sunrise: number
    sunset: number
    id: number

    constructor(private http: HttpClient, private settingsService: SettingsService) {
        this.subject = new BehaviorSubject<any>({})
        this.newWeather()
    }

    test() {
        const source = of('Hello');
        //mergeMap also emits result of promise
        const myPromise = val =>
            new Promise(resolve => resolve(`${val} World From Promise!`));
        const example = source.pipe(
            mergeMap(
                val => myPromise(val),
                (valueFromSource, valueFromPromise) => {
                    return `Source: ${valueFromSource}, Promise: ${valueFromPromise}`;
                }
            )
        );

    }

    private getAPIObservable(): Observable<WeatherInfo> {
        // This is code for taking output of one API call and using its data in a second API call.
        // Code from: https://coryrylan.com/blog/angular-multiple-http-requests-with-rxjs

        // I ... edited it a bit. This is terrible.

        // Need to get location info first, pipe that to the next
        return this.http.get<LocationInfo>(this.locationUrl).pipe(
            mergeMap(
                // this is needed to get the configuration api key from the json file.
                locationStuff => this.settingsService.getSettings().pipe(
                    mergeMap(settings => {
                        // finally, we can make the call to the weather API.
                        return this.http.get<WeatherInfo>(`https://api.openweathermap.org/data/2.5/weather?lat=${locationStuff.latitude}&lon=${locationStuff.longitude}&units=metric&APPID=${settings.weatherAPIKey}`)
                    }
                    )
                )
            )
        )
    }

    next() {
        this.subject.next(
            {
                celsius: this.celsius,
                fahrenheit: this.fahrenheit,
                location: this.location,
                description: this.description,
                sunrise: this.sunrise,
                sunset: this.sunset,
                id: this.id
            }
        )
    }

    public newWeather() {
        // Ask me how much I care about nested observables right now. Zip. Nada. Zero.
        this.getAPIObservable().subscribe(info => {
            this.celsius = info.main.temp
            this.fahrenheit = (this.celsius * (9 / 5) + 32).toFixed(2)
            this.location = info.name
            this.description = info.weather[0].description
            this.sunrise = info.sys.sunrise
            this.sunset = info.sys.sunset
            this.id = info.weather[0].id
            this.next()
        })
    }

    public getWeatherObservable() {
        return this.subject.asObservable()
    }
}
