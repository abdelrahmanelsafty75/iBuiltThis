import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeIcon, SearchIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="wrapper text-center space-y-6">
        <p className="text-8xl font-bold text-primary/20">404</p>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Page not found</h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            render={<Link href="/" />}
            nativeButton={false}
            variant="default"
          >
            <HomeIcon className="size-4" />
            Back to Home
          </Button>
          <Button
            render={<Link href="/explore" />}
            nativeButton={false}
            variant="outline"
          >
            <SearchIcon className="size-4" />
            Explore Products
          </Button>
        </div>
      </div>
    </div>
  );
}
