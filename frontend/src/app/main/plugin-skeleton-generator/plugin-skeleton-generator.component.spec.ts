import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginSkeletonGeneratorComponent } from './plugin-skeleton-generator.component';

describe('PluginSkeletonGeneratorComponent', () => {
  let component: PluginSkeletonGeneratorComponent;
  let fixture: ComponentFixture<PluginSkeletonGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PluginSkeletonGeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PluginSkeletonGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
