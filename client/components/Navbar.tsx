import Link from "next/link";

export default function Header() {
  return (
    <div className="border-black/10 border-b h-10 flex items-center justify-center px-5">
      <ul className="flex items-center gap-3">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/discover">Match</Link>
        </li>
        <li>
          <Link href="/discover">Message</Link>
        </li>
        <li>
          <Link href="/discover">Profile</Link>
        </li>
        <li>
          <Link href="/auth/login">Login</Link>
        </li>
        <li>
          <Link href="/auth/register">Register</Link>
        </li>
        <li>
          <Link href="/logout">Logout</Link>
        </li>
      </ul>
    </div>
  );
}
