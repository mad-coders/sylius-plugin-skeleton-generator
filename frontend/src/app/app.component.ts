import {Component} from '@angular/core';
import {FormArray, FormBuilder, Validators} from "@angular/forms";
import {camelCase, kebabCase, snakeCase} from "literal-case";
import {GeneratorService} from "./services/generator.service";
import {IPluginNameRequestData} from "./ interfaces/plugin-name-request-data.interface";
import {IPluginAuthors} from "./ interfaces/plugin-authors.interface";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  // Variables Block
  imageMadcodersSrc = '/assets/img/madcoders-logo-slogan.png';
  imageMacopediaSrc = '/assets/img/logo_macopedia_rgb.png';
  imageMadcodersAlt = 'Madcoders Logo';
  imageMacopediaAlt = 'Macopedia Logo';
  title = 'Generator Sylius Plugin';

}
