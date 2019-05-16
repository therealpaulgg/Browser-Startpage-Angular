import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { WeatherInfo } from './models/weatherinfo'
import { LocationInfo } from './models/locationinfo'
import { HttpClient } from "@angular/common/http"
import { mergeMap } from 'rxjs/operators'
import { Subject } from 'rxjs'

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

    constructor(private http: HttpClient) {
        this.newWeather()
    }
    
    private getAPIObservable() : Observable<WeatherInfo> {
        // This is code for taking output of one API call and using its data in a second API call.
        // Code from: https://coryrylan.com/blog/angular-multiple-http-requests-with-rxjs
        return this.http.get<LocationInfo>(this.locationUrl).pipe(
            mergeMap(locationStuff => this.http.get<WeatherInfo>(`https://api.openweathermap.org/data/2.5/weather?zip=${locationStuff.postal},${locationStuff.country_code}&units=metric&APPID=9ec985f43b7fc537d4ab3d4953fb50ed`))
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
                sunset: this.sunset
            }
        )
    }

    public newWeather() {
        console.log("updating")
        this.getAPIObservable().subscribe(info => {
            this.celsius = info.main.temp
            this.fahrenheit = (this.celsius * (9 / 5) + 32).toFixed(2)
            this.location = info.name
            this.description = info.weather[0].description
            this.sunrise = info.sys.sunrise
            this.sunset = info.sys.sunset
            this.next()
        })
    }

    public getWeatherObservable() {
        return this.subject.asObservable()
    }
}
