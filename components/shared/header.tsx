import {
  CompassIcon,
  HomeIcon,
  LoaderIcon,
  SparkleIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

import { 
  SignInButton,
  SignUpButton,
  Show 
} from "@clerk/nextjs";
import CustomUserButton from "./custom-user-button";
import ThemeToggle from "./theme-toggle";
import { Suspense } from "react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
        <SparkleIcon className="size-4 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold">
        i<span className="text-primary">Built</span>This
      </span>
    </Link>
  );
};

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      {/* wrapper already provides responsive padding (px-4 → sm:px-6 → lg:px-8).
          No extra px-* override so mobile screens get the full available width. */}
      <div className="wrapper">
        <div className="flex h-16 items-center justify-between gap-2">
          <Logo />

          {/* Nav: always visible; text labels hidden below md to save space. */}
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/50 rounded-md"
            >
              <HomeIcon className="size-4 shrink-0" />
              <span className="hidden md:inline">Home</span>
            </Link>
            <Link
              href="/explore"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/50 rounded-md"
            >
              <CompassIcon className="size-4 shrink-0" />
              <span className="hidden md:inline">Explore</span>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Suspense fallback={<LoaderIcon className="size-4 animate-spin text-muted-foreground" />}>
              <Show when="signed-out">
                {/* Sign In hidden on xs; Sign Up always visible as primary CTA. */}
                <SignInButton>
                  <Button variant="ghost" size="sm" className="hidden sm:flex cursor-pointer">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button size="sm" className="cursor-pointer">Sign Up</Button>
                </SignUpButton>
              </Show>

              <Show when="signed-in">
                {/* Label hidden on mobile — icon conveys enough meaning. */}
                <Button
                  render={<Link href="/submit" />}
                  nativeButton={false}
                  size="sm"
                >
                  <SparklesIcon className="size-4 shrink-0" />
                  <span className="hidden sm:inline">Submit Project</span>
                </Button>
                <CustomUserButton />
              </Show>
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}