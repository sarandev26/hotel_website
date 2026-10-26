import dynamic from "next/dynamic";

const Journey = dynamic(() => import("@/components/Journey"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[#100D0B] flex items-center justify-center">
      <div className="text-center animate-pulse">
        <span
          className="text-[#EFE6DA] text-[18px] uppercase tracking-[0.38em]"
          style={{ fontFamily: "var(--font-bodoni), serif" }}
        >
          SAPTARISHI
        </span>
      </div>
    </div>
  ),
});

export default function Home() {
  return <Journey />;
}
