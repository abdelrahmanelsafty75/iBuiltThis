"use cache";

import {Button} from '@/components/ui/button'
import Link from "next/link";
import { ArrowUpRightIcon, StarIcon } from "lucide-react";
import SectionHeader from '@/components/shared/section-header'
import ProductCard from '../products/product-card';
import { getFeaturedProducts } from '@/lib/products/product-selection';

export default async function FeaturedProducts(){
  const featProducts = await getFeaturedProducts();
  return ( 
     <section className="py-20">
      <div className="wrapper">
        <div className="flex items-center justify-between mb-8">
          <SectionHeader
            title="Featured Today"
            icon={StarIcon}
            description="Top picks from our community this week"
          />
          <Button variant="outline" 
          className="hidden sm:flex"
          render={ <Link href="/explore"/>}
            nativeButton={false}
          >
               View All <ArrowUpRightIcon className="size-4" />
          </Button>
          </div>
          <div className="grid-wrapper">
          {featProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        </div>
    </section>
    )
  }


