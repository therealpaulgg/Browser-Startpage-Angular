import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs'
import { SettingsService } from '../../services/settings.service'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit {
  private subscription: Subscription
  isClosed: boolean

  tempSetting: string
  tempSettings = [
    {
      name: "Celsius",
      value: "celsius"
    },
    {
      name: "Fahrenheit",
      value: "fahrenheit"
    }
  ] 

  bothDegrees: boolean
  
  
  themeSetting: string
  themeSettings = [
    {
      name: "Light Mode",
      value: "light"
    },
    {
      name: "Dark Mode",
      value: "dark"
    }, 
    {
      name: "Dracula Theme",
      value: "dracula"
    }
  ]

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.isClosed = true
    this.subscription = this.settingsService.getSettings().subscribe(settings => {
      this.tempSetting = settings.tempSetting
      this.bothDegrees = settings.bothDegrees
      this.themeSetting = settings.themeSetting
    })
  }

  toggleSidebar() {
    this.isClosed = !this.isClosed
  }

  settingsChange() {
    this.settingsService.updateSettings(this.tempSetting, this.bothDegrees, this.themeSetting)
    
  }

}
