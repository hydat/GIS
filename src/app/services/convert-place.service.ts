import { Injectable } from '@angular/core';
import { Observable, observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class ConvertPlaceService {
  private key = "b21922a6b74048bb85900cb333f77924";
  private url = "https://api.opencagedata.com/geocode/v1/json"

  constructor(private http: HttpClient) { }

  convertPlace(place: String): any {
    return this.http.get<any>(this.url + "?key=" + this.key + "&q=" + place + "&pretty=1")
  }
}
