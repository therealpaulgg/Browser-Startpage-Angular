import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

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

  constructor(private settingsService: SettingsService, private http: HttpClient, private _eref: ElementRef) { }

  ngOnInit() {
    this.settingsService.getSettings().subscribe(obj => {
      this.themeSetting = obj.themeSetting
      this.newTab = obj.newTab
      this.searchEngine = obj.searchEngine
    })
  }

  autocomplete() {
    // Tried for hours to use the endpoint https://duckduckgo.com/ac but because of angular limitations with JSONP,
    // had no choice but to simply use Google suggest queries. Win/loss because google censors some controversial
    // queries, but has more accurate results.
    // All of this is because CORS is to blame.
    let input = encodeURIComponent(this.searchInput)
    let uri = `https://suggestqueries.google.com/complete/search?q=${input}&client=chrome&hl=fr`
    this.http.jsonp<Array<any>>(uri, "callback"
    ).subscribe(res => {
      this.dataService = []
      let items = []
      res[1].forEach(item => items.push(item))
      items.forEach(item => {
        let index = item.indexOf(this.searchInput.toLowerCase())
        if (index != -1) {
          let first = item.substring(0, index)
          let second = item.substring(index, index + this.searchInput.length)
          let third = item.substring(index + this.searchInput.length,
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
    this.searchInput = event.target.closest("p").innerText
    this.autocomplete()
  }
}

// array of arrays
  // each array contains: [{"nobold": "string"}, {"bold": "string"}], etc.
