import { Component, OnInit } from '@angular/core';
import { Links } from "../links"

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.sass']
})
export class LinksComponent implements OnInit {
  links = new Links()
  constructor() { }

  ngOnInit() {
    
  }

}
