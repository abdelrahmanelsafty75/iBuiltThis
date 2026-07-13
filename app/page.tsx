import FeaturedProducts from '@/components/landing-page/featured-products';
import Hero from '@/components/landing-page/hero';
import RecentlyLaunchedProducts from '@/components/landing-page/recently-lanched';
export default function Home() {
  return (
   <div>
    <Hero/>
    <FeaturedProducts/>
    <RecentlyLaunchedProducts/>
   </div>
  );  
}