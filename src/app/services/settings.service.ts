import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs'
import { SettingsInfo } from '../models/settingsinfo'

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private subject: BehaviorSubject<any>

  tempSetting: string
  bothDegrees: boolean
  themeSetting: string

  constructor() { 
    this.tempSetting = "celsius"
    this.themeSetting = "dark"
    this.bothDegrees = false
    
    this.subject = new BehaviorSubject<any>({
      tempSetting: this.tempSetting,
      bothDegrees: this.bothDegrees,
      themeSetting: this.themeSetting
    })
  }
  // Settings are loaded from user's cookies (worry about this later)
  // Default settings are: celsius, both degrees off, and dark mode

  /* 
  * This service will communicate with the sidebar, initially setting
  * its boolean variables for radio buttons and switches.
  *  
  * The service may then communicate with the weather component, so that only certain
  * things are displayed to the user.
  */

  // assume settings are default

  getSettings() {
    return this.subject.asObservable()
  }

  keepGettingNext() {
    this.next()
    setTimeout(() => {
      this.keepGettingNext()
    }, 
    2000
    )
  }

  next() {
    this.subject.next({
      tempSetting: this.tempSetting,
      bothDegrees: this.bothDegrees,
      themeSetting: this.themeSetting
    })
  }

  updateSettings(tempSetting, bothDegrees, themeSetting) {
    this.tempSetting = tempSetting
    this.bothDegrees = bothDegrees
    this.themeSetting = themeSetting
    this.next()
  }
}