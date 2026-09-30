import Link from "next/link";

export default function OneCrewLogo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="onecrew-logo" aria-label="OneCrew home">
      <span className="crew-mark" aria-hidden="true">
        <i />
        <i />
        <i />
        <b />
      </span>
      <span className="onecrew-wordmark">OneCrew</span>
    </Link>
  );
}
