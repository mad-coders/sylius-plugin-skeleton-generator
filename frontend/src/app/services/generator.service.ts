import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {IPluginNameRequestData} from "../ interfaces/plugin-name-request-data.interface";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class GeneratorService {
  constructor(private _httpClient: HttpClient) { }

  startPluginGenerate(body: IPluginNameRequestData): Observable<IPluginNameRequestData> {
    return this._httpClient.post<IPluginNameRequestData>(`${environment.apiUrl}/superApi`, body);
  }
}

