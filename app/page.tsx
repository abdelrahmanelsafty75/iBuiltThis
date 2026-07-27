import FeaturedProducts from '@/components/landing-page/featured-products';
import Hero from '@/components/landing-page/hero';
import RecentlyLaunchedProducts from '@/components/landing-page/recently-launched';
import ProductSkeleton from '@/components/products/product-skeleton';
import { Suspense } from 'react';

export default function Home() {
  return (
   <div>
    <Hero/>
    {/* Suspense is required here: updateTag("products") immediately expires
        this cache after approve/reject/submit. Without the boundary, the next
        page request blocks synchronously while FeaturedProducts re-fetches. */}
    <Suspense fallback={<ProductSkeleton />}>
      <FeaturedProducts/>
    </Suspense>
    <Suspense fallback={<ProductSkeleton />}>
      <RecentlyLaunchedProducts/>
    </Suspense>
   </div>
  );  
}