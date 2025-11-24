import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporizadorBannerComponent } from './temporizador-banner.component';

describe('TemporizadorBannerComponent', () => {
  let component: TemporizadorBannerComponent;
  let fixture: ComponentFixture<TemporizadorBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemporizadorBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemporizadorBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
