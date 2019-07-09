import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.sass']
})

export class SearchbarComponent implements OnInit {
  themeSetting: string
  newTab: boolean
  searchEngine: string
  searchInput: string
  dataService: Array<any>

  constructor(private settingsService: SettingsService, private http: HttpClient) { }

  ngOnInit() {
    this.settingsService.getSettings().subscribe(obj => {
      this.themeSetting = obj.themeSetting
      this.newTab = obj.newTab
      this.searchEngine = obj.searchEngine
    })
    this.dataService = Array<any>()
  }

  autocomplete() {
    const params = new HttpParams().set("q", this.searchInput)
    this.http.get<Array<any>>("https://duckduckgo.com/ac", {
      params
    }).subscribe(res => {
      this.dataService = []
      let items = []
      res.forEach(item => items.push(item.phrase))
      items.forEach(item => {
        let match = item.match(this.searchInput)
        if (match != null) {
          let index = match.index
          let first = item.substring(0, index)
          let second = item.substring(index, index + match[0].length)
          let third = item.substring(index + match[0].length,
            item.length)
          let part = []
          part.push(first)
          part.push(second)
          part.push(third)
          this.dataService.push(part)
        } else {
          let part = []
          part.push(item)
          this.dataService.push(part)
        }
      })
    }
    )
  }

  suggestClicked(event) {
    this.searchInput = event.target.innerText
    this.autocomplete()
  }
}

// array of arrays
  // each array contains: [{"nobold": "string"}, {"bold": "string"}], etc.
