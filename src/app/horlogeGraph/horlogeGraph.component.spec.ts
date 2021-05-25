import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HorlogeGraphComponent} from './horlogeGraph.component';

describe('HorlogeComponent', () => {
	let component: HorlogeGraphComponent;
	let fixture: ComponentFixture<HorlogeGraphComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [HorlogeGraphComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(HorlogeGraphComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
