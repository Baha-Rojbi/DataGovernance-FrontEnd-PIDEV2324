import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagStatsComponent } from './tag-stats.component';

describe('TagStatsComponent', () => {
  let component: TagStatsComponent;
  let fixture: ComponentFixture<TagStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TagStatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TagStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
