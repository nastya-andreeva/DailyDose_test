import React from 'react';
import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { useOnboardingStore } from "@/store/onboarding-store";
import { LoadData } from "@/hooks/useLoadData";

export default function Index() {
  const { isAuthenticated } = useAuthStore();
  const { hasCompletedOnboarding } = useOnboardingStore();

  LoadData();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)/calendar" />;
}
