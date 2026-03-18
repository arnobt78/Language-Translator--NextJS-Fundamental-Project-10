import HomePage from "@/components/pages/HomePage";

/**
 * Home route: SSR shell only. All client state and interactivity
 * live in the HomePage component for better performance.
 */
export default function Page() {
  return <HomePage />;
}
