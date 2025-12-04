import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoComunComponent } from './catalogo-comun.component';

describe('CatalogoComunComponent', () => {
  let component: CatalogoComunComponent;
  let fixture: ComponentFixture<CatalogoComunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoComunComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoComunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
