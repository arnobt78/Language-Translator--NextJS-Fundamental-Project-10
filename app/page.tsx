import ClientToggle from "@/components/ClientToggle";

/**
 * Home route (single page of the app). Server Component: no "use client".
 *
 * WALKTHROUGH:
 * - The outer wrapper and card div are server-rendered. Inline styles for
 *   background, backdrop-blur, and border ensure the glass effect is in the
 *   initial HTML (no flash when client hydrates).
 * - Only ClientToggle is a client component; it switches between start screen
 *   and translator. This keeps the client boundary small for better performance.
 */
export default function Page() {
  return (
    <div className="w-full max-w-9xl mx-auto h-screen flex justify-center items-center px-0 sm:px-4">
      {/* card-shell class: critical styles also in layout <head> for first paint */}
      <div
        className="card-shell w-full sm:w-[90%] max-[392px]:h-[90%] sm:h-auto rounded-3xl shadow-2xl shadow-gray-800 flex flex-col overflow-visible"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.1)",
          transform: "translateZ(0)",
        }}
      >
        <ClientToggle />
      </div>
    </div>
  );
}
