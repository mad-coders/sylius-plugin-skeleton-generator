import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IPluginNameRequestData} from "../ interfaces/plugin-name-request-data.interface";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class GeneratorService {
  constructor(private _httpClient: HttpClient) {
  }

  startPluginGenerate(body: IPluginNameRequestData) {
    return this._httpClient.post<any>(`${environment.apiUrl}/request-new`, body).subscribe(
      (val) => {
        console.log("POST call successful value returned in body", val);
      },
      response => {
        console.log("POST call in error", response);
      },
      () => {
        console.log("The POST observable is now completed.");
      });
  }
}

