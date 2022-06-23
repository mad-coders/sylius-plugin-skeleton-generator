import { Component } from '@angular/core';
import {FormArray, FormBuilder, Validators} from "@angular/forms";

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

  pluginNameForm = this.fb.group({
    syliusVersion: ['', Validators.required],
    namespace: ['', ],
    pluginNameInput: [''],
    pluginNameInputCamel: [''],
    pluginNameInputSnake: [''],
    pluginComposePackageName: [''],
    pluginDescription: [''],
    authors: this.fb.array([])
  });

  constructor(private fb: FormBuilder) { }

  get authors() {
    return this.pluginNameForm.controls["authors"] as FormArray;
  }

  addAuthor() {
    const authorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required]
    });

    this.authors.push(authorForm);
  }

  deleteAuthor(i: number) {
    this.authors.removeAt(i);
  }

  async onSubmit() {
    console.log(this.pluginNameForm.value);
  }
}
