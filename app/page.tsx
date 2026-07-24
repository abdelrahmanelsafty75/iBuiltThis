import FeaturedProducts from '@/components/landing-page/featured-products';
import Hero from '@/components/landing-page/hero';
import RecentlyLaunchedProducts from '@/components/landing-page/recently-lanched';
import ProductSkeleton from '@/components/products/product-skeleton';
import { Suspense } from 'react';

export default function Home() {
  return (
   <div>
    <Hero/>
    <FeaturedProducts/>
    <Suspense fallback={<ProductSkeleton />}>
      <RecentlyLaunchedProducts/>
    </Suspense>
   </div>
  );  
}