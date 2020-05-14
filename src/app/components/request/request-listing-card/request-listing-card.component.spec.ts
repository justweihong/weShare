import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestListingCardComponent } from './request-listing-card.component';

describe('RequestListingCardComponent', () => {
  let component: RequestListingCardComponent;
  let fixture: ComponentFixture<RequestListingCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestListingCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestListingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
