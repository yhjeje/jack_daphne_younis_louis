"use client";
 
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { useEffect } from "react";
import { logout } from "@/utils/sessions";

 
export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
 
  useEffect(() => {
    console.log(searchParams.get("v"));
  }, [searchParams]);
 
  const Logout = () => {
    logout();
    return router.push("/login");
  };

  return (
    <nav>
      <Link
        href="/mon-compte?v=2"
        className={clsx("", {
          active: pathname === "/mon-compte",
        })}
      >
        Mon compte
      </Link>
      <Link
        href="/mon-compte/profil"
        className={clsx("", {
          active: pathname === "/mon-compte/profil",
        })}
      >
        Mon profil
      </Link>
      <button onClick={Logout}>Logout</button>
    </nav>
  );
}