import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { WhyPluginSkeletonComponent } from './why-plugin-skeleton/why-plugin-skeleton.component';
import { PluginSkeletonGeneratorComponent } from './plugin-skeleton-generator/plugin-skeleton-generator.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    WhyPluginSkeletonComponent,
    PluginSkeletonGeneratorComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class MainModule { }
