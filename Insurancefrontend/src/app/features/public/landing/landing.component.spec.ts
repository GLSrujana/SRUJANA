import { TestBed } from '@angular/core/testing';
import { LandingComponent } from './landing.component';
import { provideRouter } from '@angular/router';

describe('LandingComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LandingComponent],
            providers: [provideRouter([])]
        }).compileComponents();
    });

    it('should create the landing component', () => {
        const fixture = TestBed.createComponent(LandingComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    it('should initialize with dark mode true', () => {
        const fixture = TestBed.createComponent(LandingComponent);
        const component = fixture.componentInstance;
        expect(component.isDarkMode).toBe(true);
    });

    it('should toggle theme when toggleTheme is called', () => {
        const fixture = TestBed.createComponent(LandingComponent);
        const component = fixture.componentInstance;

        expect(component.isDarkMode).toBe(true); // initially true

        component.toggleTheme();

        expect(component.isDarkMode).toBe(false);
    });

    it('should have initial activity "Wedding policy approved • Hyderabad"', () => {
        const fixture = TestBed.createComponent(LandingComponent);
        const component = fixture.componentInstance;

        expect(component.currentActivity).toEqual('Wedding policy approved • Hyderabad');
    });
});
