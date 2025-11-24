import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridOfertaComponent } from './grid-oferta.component';

describe('GridOfertaComponent', () => {
  let component: GridOfertaComponent;
  let fixture: ComponentFixture<GridOfertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridOfertaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridOfertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
