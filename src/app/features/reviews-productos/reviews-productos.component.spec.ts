import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsProductosComponent } from './reviews-productos.component';

describe('ReviewsProductosComponent', () => {
  let component: ReviewsProductosComponent;
  let fixture: ComponentFixture<ReviewsProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewsProductosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewsProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
