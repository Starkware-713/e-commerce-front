import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Client } from './client';

describe('Client', () => {
  let component: Client;
  let fixture: ComponentFixture<Client>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Client]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Client);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
