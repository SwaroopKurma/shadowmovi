'use client';

import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

export default function WebAds() {
  const [isApp, setIsApp] = useState(false);

  useEffect(() => {
    setIsApp(Capacitor.isNativePlatform());
  }, []);

  return (
    <>
      {/* 🟢 BANNER / IN-PAGE PUSH: Renders on BOTH Web and Mobile App (Zone 12188809) */}
      <script dangerouslySetInnerHTML={{ __html: `(function(s){s.dataset.zone='12188809',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` }} />

      {/* 🔴 INTRUSIVE ADS: Renders ONLY on Web */}
      {!isApp && (
        <>
          {/* Popunder Ad Zone (12188543) */}
          <script dangerouslySetInnerHTML={{ __html: `(function(s){s.dataset.zone='12188543',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` }} />

          {/* Vignette Banner Ad Zone (12188646) */}
          <script dangerouslySetInnerHTML={{ __html: `(function(s){s.dataset.zone='12188646',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` }} />
        </>
      )}
    </>
  );
}
