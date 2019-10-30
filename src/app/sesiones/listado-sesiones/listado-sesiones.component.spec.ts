import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoSesionesComponent } from './listado-sesiones.component';

describe('ListadoSesionesComponent', () => {
  let component: ListadoSesionesComponent;
  let fixture: ComponentFixture<ListadoSesionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoSesionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoSesionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
