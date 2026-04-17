import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCookie, saveConsent, declineConsent, getConsentPreferences, hasConsent, hasDeclined } from '../utils/cookieManager';

const CookieConsentContext = createContext(null);

export function CookieConsentProvider({ children }) {
  const [consentStatus, setConsentStatus] = useState('pending'); // 'pending', 'accepted', 'declined'
  const [preferences, setPreferences] = useState({ necessary: true, functional: false, analytics: false });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check existing decision
    if (hasConsent()) {
      setConsentStatus('accepted');
      setPreferences(getConsentPreferences());
    } else if (hasDeclined()) {
      setConsentStatus('declined');
      setPreferences({ necessary: true, functional: false, analytics: false });
    } else {
      // No decision yet, show banner with delay
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    const allPrefs = { necessary: true, functional: true, analytics: true };
    saveConsent(allPrefs);
    setConsentStatus('accepted');
    setPreferences(allPrefs);
    setIsVisible(false);
  };

  const acceptSelected = (customPrefs) => {
    const finalPrefs = { ...customPrefs, necessary: true };
    saveConsent(finalPrefs);
    setConsentStatus('accepted');
    setPreferences(finalPrefs);
    setIsVisible(false);
  };

  const decline = () => {
    declineConsent();
    setConsentStatus('declined');
    setPreferences({ necessary: true, functional: false, analytics: false });
    setIsVisible(false);
  };

  const reopenBanner = () => {
    setIsVisible(true);
  };

  const value = {
    consentStatus,
    preferences,
    showBanner: isVisible,
    acceptAll,
    acceptSelected,
    decline,
    reopenBanner,
    isFunctionalAllowed: preferences.functional,
    isAnalyticsAllowed: preferences.analytics,
    setIsVisible
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) throw new Error('useCookieConsent must be used within CookieConsentProvider');
  return context;
}
