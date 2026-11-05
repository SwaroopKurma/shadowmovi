'use client';

import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

export default function WebAds() {
  const [isApp, setIsApp] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsApp(Capacitor.isNativePlatform());
    setIsMounted(true);
  }, []);

  // Prevent hydration mismatch and render nothing if on the native app
  if (!isMounted || isApp) return null;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `(function(s){s.dataset.zone='12188809',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` }} />
      <script dangerouslySetInnerHTML={{ __html: `(function(s){s.dataset.zone='12188543',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` }} />
      <script dangerouslySetInnerHTML={{ __html: `(function(s){s.dataset.zone='12188646',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` }} />
    </>
  );
}
