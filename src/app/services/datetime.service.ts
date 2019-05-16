import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'
import { Subject } from 'rxjs'
import { WeatherService } from './weather.service'

@Injectable({
  providedIn: 'root'
})

export class DatetimeService {
  private dateTimeSubject = new Subject<any>()

  sunsetSwitch = false
  sunriseSwitch = false
  sunrise: number
  sunset: number

  dateTime: string

  constructor(private weatherService: WeatherService) { 
    // Starts recording the time.
    this.time()
    this.weatherService.getWeatherObservable().subscribe(info => {
      this.sunrise = info.sunrise
      this.sunset = info.sunset 
    })
    // Must update every 10 minutes.
    this.tenMinuteWeatherUpdate()
  }

  tenMinuteWeatherUpdate() {
    let tenMinutesInMillis = 1000 * 10 * 60
    setTimeout(() => {
      this.weatherService.newWeather()
      this.tenMinuteWeatherUpdate()
    }, tenMinutesInMillis)
  }
  
  sendTime() {
    this.dateTimeSubject.next({time: this.dateTime})
  }
  
  getTime(): Observable<any> {
    return this.dateTimeSubject.asObservable()
  }

  time() {
    let dateTime = new Date()
    let hrs = dateTime.getHours() < 10 ? `0${dateTime.getHours()}` : dateTime.getHours()
    let mins = dateTime.getMinutes() < 10 ? `0${dateTime.getMinutes()}` : dateTime.getMinutes()
    let secs = dateTime.getSeconds() < 10 ? `0${dateTime.getSeconds()}` : dateTime.getSeconds()
    this.dateTime = `${dateTime.toLocaleDateString()} - ${hrs}:${mins}:${secs}`
    this.sendTime()
    // for some reason, instead of using a normal callback, it must be done 
    // in an anonymous function. Supposedly it has to do with 'this' referring
    // to an object it is not supposed to.
    this.checkWeatherSwitch()
    setTimeout(() => {
        this.time()
    }, 1000 - (new Date()).getMilliseconds())
  }
  
  // If the sun sets, the service should signal to update weather.
  // If the sun rises, the service should signal to update weather.
  // If it has been 10 minutes since the last update, the service should signal to update weather. 
  // Tell weather service to update itself. this.weatherService.newWeather()

  checkWeatherSwitch() {
    if (!this.midnightCheck()) {
      let date = new Date()
      if (!this.sunsetSwitch || !this.sunriseSwitch) {
        if (date.getTime() / 1000 > this.sunrise && date.getTime() / 1000 < this.sunset && !this.sunriseSwitch) {
          this.weatherService.newWeather()
          this.sunriseSwitch = true
        } else if (date.getTime() / 1000 > this.sunset && !this.sunsetSwitch) {
          this.weatherService.newWeather()
          this.sunsetSwitch = true
        }
      }
    }
  }
  
  // does not call async functions, so removed async keyword
  midnightCheck() {
    let newDate = new Date()
    let newDateStr = newDate.toLocaleDateString()
    let newDateDay = newDateStr.split("/")[1]
    let oldDate = new Date()
    let oldDateStr = oldDate.toLocaleDateString()
    let oldDateDay = oldDateStr.split("/")[1]
    oldDate.setUTCMilliseconds(newDate.getTime() - 1000)
    if (newDateDay != oldDateDay) {
      this.weatherService.newWeather()
      this.sunriseSwitch = false
      this.sunsetSwitch = false
      return true
    }
    return false
  }


}
