import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorConsentComponent } from './author-consent.component';
import { AuthorStore } from '../author.store';
import { CommonModule } from '@angular/common';
import { AUTHOR_CONSENT_KEY } from '../../../core/models/constants';

fdescribe('AuthorConsentComponent', () => {
  let component: AuthorConsentComponent;
  let fixture: ComponentFixture<AuthorConsentComponent>;
  let mockAuthorStore: { authorCreate: jasmine.Spy; setConsent: jasmine.Spy };

  const mockStorage: Record<string, string> = {};

  beforeEach(async () => {
    mockAuthorStore = {
      authorCreate: jasmine.createSpy('authorCreate'), //authorStateToLocalStorage
      setConsent: jasmine.createSpy('setConsent'),
    };

    await TestBed.configureTestingModule({
      imports: [
        AuthorConsentComponent, // Import the standalone component
        CommonModule, // Import CommonModule if your component uses ngIf, ngFor, etc.
        // Add other necessary modules here
      ],

      providers: [{ provide: AuthorStore, useValue: mockAuthorStore }],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(AuthorConsentComponent);
    component = fixture.componentInstance;
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return key === AUTHOR_CONSENT_KEY ? null : null;
    });

    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      mockStorage[key] = value;
    });
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set AUTHOR_CONSENT_KEY in localStorage when consent is accepted', () => {
    const testKey = AUTHOR_CONSENT_KEY;
    const testValue = 'accepted';

    component.acceptCookies();

    expect(mockStorage[testKey]).toBe(testValue);
  });

  describe('ngOnInit', () => {
    it('should call checkAuthorConsent', () => {
      spyOn(component, 'checkAuthorConsent');
      component.ngOnInit();
      expect(component.checkAuthorConsent).toHaveBeenCalled();
    });
  });

  describe('checkAuthorConsent', () => {
    it('should set consentValue from localStorage', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue('accepted');
      component.checkAuthorConsent();
      expect(component.consentValue()).toBe('accepted');
    });

    it('should set consentValue to null if not present in localStorage', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);
      component.checkAuthorConsent();
      expect(component.consentValue()).toBeNull();
    });
  });

  describe('acceptCookies', () => {
    it('should call authorStore.authorCreate and setConsent with "accepted"', () => {
      spyOn(component, 'setConsent');
      component.acceptCookies();
      expect(mockAuthorStore.authorCreate).toHaveBeenCalledWith({ id: jasmine.any(String), name: 'Default' });
      expect(component.setConsent).toHaveBeenCalledWith('accepted');
    });
  });

  describe('declineCookies', () => {
    it('should call setConsent with "declined"', () => {
      spyOn(component, 'setConsent');
      component.declineCookies();
      expect(component.setConsent).toHaveBeenCalledWith('declined');
    });
  });

  describe('setConsent', () => {
    it('should set localStorage, call authorStore.setConsent, update consentValue, and emit closeComponent', () => {
      spyOn(component.closeComponent, 'emit');
      component['setConsent']('accepted');
      expect(localStorage.setItem).toHaveBeenCalledWith(AUTHOR_CONSENT_KEY, 'accepted');
      expect(mockAuthorStore.setConsent).toHaveBeenCalledWith('accepted');
      expect(component.consentValue()).toBe('accepted');
      expect(component.closeComponent.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('showConsentPopup', () => {
    it('should return true if consentValue is null', () => {
      component.consentValue.set(null);
      expect(component.showConsentPopup()).toBeTrue();
    });

    it('should return true if forcePopup is true', () => {
      fixture.componentRef.setInput('forcePopup', true);
      component.consentValue.set('declined');
      expect(component.showConsentPopup()).toBeTrue();
    });

    it('should return false if consentValue is not null and forcePopup is false', () => {
      fixture.componentRef.setInput('forcePopup', false);
      //component.forcePopup = false;
      component.consentValue.set('accepted');
      expect(component.showConsentPopup()).toBeFalse();
    });
  });

  describe('Event Emission', () => {
    it('should emit closeComponent event with false when consent is set', () => {
      spyOn(component.closeComponent, 'emit');
      component['setConsent']('declined');
      expect(component.closeComponent.emit).toHaveBeenCalledWith(false);
    });
  });
});
