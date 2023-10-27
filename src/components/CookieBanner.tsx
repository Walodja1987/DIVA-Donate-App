import React from 'react';
import { useState, useEffect } from 'react';

const CookieBanner = () => {
  const [accepted, setAccepted] = useState(false);

  const acceptCookies = () => {
    setAccepted(true);
    localStorage.setItem('cookieConsent', 'true');
  };

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'true') {
      setAccepted(true);
    }
  }, []);

  if (accepted) {
    return null; // Don't show the banner if cookies are accepted.
  }

  return (
    <div className="bg-blue-500 p-4 fixed bottom-0 w-full text-white">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          We use cookies to improve your experience.{' '}
          <button
            onClick={acceptCookies}
            className="bg-yellow-500 text-blue-500 py-1 px-2 rounded hover:bg-yellow-400"
          >
            Accept
          </button>
        </p>
      </div>
    </div>
  );
};

export default CookieBanner;
