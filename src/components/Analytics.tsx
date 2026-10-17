"use client";

import { useEffect } from "react";
import { initAnalytics } from "@/lib/analytics";

const Analytics = () => {
  useEffect(() => {
    initAnalytics();
  }, []);
  return null;
};

export default Analytics;
