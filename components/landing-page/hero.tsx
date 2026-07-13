import {Button} from '@/components/ui/button'
import { Badge } from "../ui/badge"
import {
  ArrowRightIcon,
  EyeIcon,
  RocketIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import StatsCard from './stats-card';
const LiveBadge = () => {
  return (
    <Badge
      variant="outline"
      className="px-4 py-4 mb-8 text-sm backdrop-blur-sm"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
      </span>
      <span className="text-muted-foreground">
        Join thousands of creators sharing their work
      </span>
    </Badge>
  );
};

const statsData = [
  {
    icon: RocketIcon,
    value: "2.5K+",
    label: "Projects Shared",
  },
  {
    icon: UsersIcon,
    value: "10K+",
    label: "Active Creators",
    hasBorder: true,
  },
  {
    icon: EyeIcon,
    value: "50K+",
    label: "Monthly Visitors",
  },
];

function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-background via-background to-muted/40">
      <div className="wrapper">
        <div className='flex flex-col items-center justify-center lg:py-24 py-12 text-center'>
          <LiveBadge/>
          <h1 className="mx-auto mb-6 max-w-4xl text-balance text-center text-5xl font-extrabold tracking-tighter sm:text-6xl lg:text-7xl">
             Share What You&apos;ve Built, <br className="hidden md:inline" />
               Discover What&apos;s Launching
          </h1> 
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
            A community platform for creators to showcase their apps, AI tools,
            SaaS products, and creative projects. Authentic launches, real
            builders, genuine feedback.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button
             size="lg"
             className="text-base px-8 shadow-lg" render={<Link href="/submit"/>}
             nativeButton={false}>
                <SparklesIcon className="size-5" />
                Share Your Project
            </Button>

            <Button
               size="lg"
              className="text-base px-8 shadow-lg"
              variant="secondary" render={<Link href="/explore"/>}
              nativeButton={false}>
                Explore Projects <ArrowRightIcon className="size-5" />
            </Button>


          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 max-w-2xl w-full">
            {statsData.map((stat) => (
              <StatsCard key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero