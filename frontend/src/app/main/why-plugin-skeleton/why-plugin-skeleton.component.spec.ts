import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyPluginSkeletonComponent } from './why-plugin-skeleton.component';

describe('WhyPlyginSkeletonComponent', () => {
  let component: WhyPluginSkeletonComponent;
  let fixture: ComponentFixture<WhyPluginSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhyPluginSkeletonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyPluginSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
