import Link from "next/link";

export default function Logo({
  light = false,
  href = "/",
}: {
  light?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={`font-black tracking-tight ${
        light ? "text-white" : "text-slate-950"
      }`}
    >
      <span
        className={`mr-2 inline-flex h-9 w-9 items-center justify-center rounded-xl ${
          light ? "bg-white text-slate-950" : "bg-slate-950 text-white"
        }`}
      >
        U
      </span>
      ULTD TRANS
    </Link>
  );
}
