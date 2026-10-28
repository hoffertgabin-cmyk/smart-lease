"use client";

import { useCallback, useSyncExternalStore } from "react";
import { CONSENT_KEY as KEY } from "@/lib/consent";

export type Consent = { thirdParty: boolean; decidedAt: string };
const EVENT = "sl-consent-change";

function flag(decided: boolean) {
  document.documentElement.toggleAttribute("data-consent", decided);
}

function read(): Consent | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

let cache: { raw: string | null; value: Consent | null } = { raw: null, value: null };
function snapshot(): Consent | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {}
  if (raw !== cache.raw) cache = { raw, value: read() };
  return cache.value;
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useConsent() {
  const consent = useSyncExternalStore(subscribe, snapshot, () => null);
  const save = useCallback((thirdParty: boolean) => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ thirdParty, decidedAt: new Date().toISOString() }));
    } catch {}
    flag(true);
    window.dispatchEvent(new Event(EVENT));
  }, []);
  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(KEY);
    } catch {}
    flag(false);
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return { consent, save, reset };
}
