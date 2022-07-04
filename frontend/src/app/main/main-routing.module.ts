import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WhyPluginSkeletonComponent} from "./why-plugin-skeleton/why-plugin-skeleton.component";
import {PluginSkeletonGeneratorComponent} from "./plugin-skeleton-generator/plugin-skeleton-generator.component";

const routes: Routes = [
  { path: "", component: PluginSkeletonGeneratorComponent },
  { path: "why-sylius-plugin-skeleton", component: WhyPluginSkeletonComponent },
  { path: "sylius-plugin-skeleton-generator", component: PluginSkeletonGeneratorComponent }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
