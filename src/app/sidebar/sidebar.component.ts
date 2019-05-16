import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit {

  isClosed: boolean

  celsiusRadio: boolean
  fahrenheitRadio: boolean

  lightRadio: boolean
  darkRadio: boolean
  draculaRadio: boolean

  constructor() { 
    this.isClosed = true
    this.celsiusRadio = true
    this.fahrenheitRadio = false
    this.lightRadio = false
    this.darkRadio = true
    this.draculaRadio = false
  }

  ngOnInit() {
  }

  toggleSidebar() {
    this.isClosed = !this.isClosed
  }

}
