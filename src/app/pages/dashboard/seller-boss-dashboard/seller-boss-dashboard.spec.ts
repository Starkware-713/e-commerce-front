import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerBossDashboard } from './seller-boss-dashboard';

describe('SellerBossDashboard', () => {
  let component: SellerBossDashboard;
  let fixture: ComponentFixture<SellerBossDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerBossDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerBossDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
