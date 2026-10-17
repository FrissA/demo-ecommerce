// PostHog tracking. The event names and properties follow the FrictionSwarm
// tracking plan; the source of truth is build101_grupo16/shared/analytics.ts.
// Without NEXT_PUBLIC_POSTHOG_KEY every call is a no-op.
import posthog from "posthog-js";

export type StoreEventProperties = {
  product_viewed: { product_id: number; product_name: string; price: number };
  size_selected: { product_id: number; size: string };
  add_to_cart_clicked: { product_id: number; has_size: boolean };
  product_added: {
    product_id: number;
    size: string;
    color: string;
    quantity: number;
    price: number;
  };
  checkout_clicked: { cart_value: number; items: number };
  account_submitted: { success: boolean; error_fields: string[] };
  shipping_submitted: {
    success: boolean;
    error_fields: string[];
    promo_applied: boolean;
  };
  promo_applied: { code: string; success: boolean };
  payment_submitted: {
    success: boolean;
    failure_code?: string;
    delivery_fee: number;
    total: number;
  };
  order_completed: {
    order_id: string;
    total: number;
    delivery_fee: number;
    items: number;
  };
};

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
const SWARM_KEY = "frictionswarm-agent";

type SwarmTag = { swarm_run: string; swarm_agent?: string; swarm_persona?: string };

let initialized = false;

// Swarm agents arrive with ?swarm=<runId>&agent=<agentId>&persona=<id>; the
// tag is kept for the whole session since later URLs drop the params
const readSwarmTag = (): SwarmTag | null => {
  const params = new URLSearchParams(window.location.search);
  const run = params.get("swarm");
  try {
    if (run) {
      const tag: SwarmTag = {
        swarm_run: run,
        swarm_agent: params.get("agent") ?? undefined,
        swarm_persona: params.get("persona") ?? undefined,
      };
      sessionStorage.setItem(SWARM_KEY, JSON.stringify(tag));
      return tag;
    }
    const saved = sessionStorage.getItem(SWARM_KEY);
    return saved ? (JSON.parse(saved) as SwarmTag) : null;
  } catch {
    return run ? { swarm_run: run } : null;
  }
};

export const initAnalytics = () => {
  if (initialized || !KEY || typeof window === "undefined") return;
  initialized = true;

  const swarm = readSwarmTag();
  const rootFontPx = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  posthog.init(KEY, {
    api_host: HOST,
    capture_pageview: "history_change",
    capture_pageleave: true,
    autocapture: true,
    rageclick: true,
    person_profiles: "identified_only",
    // Agents run headless Chromium, which posthog-js drops as a bot
    opt_out_useragent_filter: !!swarm,
    // Runs before the initial pageview, so every event carries these
    loaded: (ph) => {
      ph.register({
        build_sha: process.env.BUILD_SHA ?? "dev",
        font_scale: Math.round(((rootFontPx || 16) / 16) * 100) / 100,
        prefers_contrast: window.matchMedia("(prefers-contrast: more)")
          .matches,
        ...swarm,
      });
      if (swarm?.swarm_agent) ph.identify(`swarm:${swarm.swarm_agent}`);
    },
  });

  // Swarm agents capture their notes through the page's instance
  (window as unknown as { posthog: typeof posthog }).posthog = posthog;
};

export const track = <E extends keyof StoreEventProperties>(
  event: E,
  properties: StoreEventProperties[E]
) => {
  // Child effects run before the provider's, so the first event may init
  initAnalytics();
  if (!initialized) return;
  posthog.capture(event, properties);
};
