import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private subject: BehaviorSubject<any>

  tempSetting: string
  bothDegrees: boolean
  themeSetting: string
  newTab: boolean
  weatherAPIKey: string
  bingAPIKey: string
  yelpAPIKey: string
  searchEngine: string
  headerMessage: string

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService, private http: HttpClient) {
    this.tempSetting = this.storage.get("tempSetting") ? this.storage.get("tempSetting") : "celsius"
    this.themeSetting = this.storage.get("themeSetting") ? this.storage.get("themeSetting") : "dark"
    this.bothDegrees = this.storage.get("bothDegrees") ? this.storage.get("bothDegrees") : false
    this.newTab = this.storage.get("newTab") ? this.storage.get("newTab") : false
    this.searchEngine = this.storage.get("searchEngine") ? this.storage.get("searchEngine") : "https://duckduckgo.com"

    this.http.get<any>("assets/config/config.json").subscribe(obj => {
        this.headerMessage = obj.headerMessage
        this.weatherAPIKey = obj.weatherAPIKey
        this.bingAPIKey = obj.bingAPIKey
        this.yelpAPIKey = obj.yelpAPIKey
        this.next()
    })

    this.subject = new BehaviorSubject<any>({
      tempSetting: this.tempSetting,
      bothDegrees: this.bothDegrees,
      newTab: this.newTab,
      themeSetting: this.themeSetting,
      headerMessage: this.headerMessage,
      weatherAPIKey: this.weatherAPIKey,
      bingAPIKey: this.bingAPIKey,
      yelpAPIKey: this.yelpAPIKey,
      searchEngine: this.searchEngine
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

  next() {
    this.subject.next({
      tempSetting: this.tempSetting,
      bothDegrees: this.bothDegrees,
      themeSetting: this.themeSetting,
      newTab: this.newTab,
      headerMessage: this.headerMessage,
      weatherAPIKey: this.weatherAPIKey,
      bingAPIKey: this.bingAPIKey,
      yelpAPIKey: this.yelpAPIKey,
      searchEngine: this.searchEngine
    })
  }

  updateSettings(tempSetting, bothDegrees, themeSetting, newTab, searchEngine) {
    this.tempSetting = tempSetting
    this.bothDegrees = bothDegrees
    this.newTab = newTab
    this.themeSetting = themeSetting
    this.searchEngine = searchEngine
    this.storage.set("tempSetting", tempSetting)
    this.storage.set("bothDegrees", bothDegrees)
    this.storage.set("themeSetting", themeSetting)
    this.storage.set("newTab", newTab)
    this.storage.set("searchEngine", searchEngine)
    this.next()
  }
}
