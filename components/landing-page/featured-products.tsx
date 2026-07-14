import {Button} from '@/components/ui/button'
import Link from "next/link";
import { ArrowUpRightIcon, StarIcon } from "lucide-react";
import SectionHeader from '@/components/shared/section-header'
import ProductCard from '../products/product-card';


const featuredProducts = [
  {
    id: 1,
    name: "ParityKit",
    description: "A toolkit for creating parity products",
    tags: ["SaaS", "Pricing", "Global"],
    votes: 615,
    isFeatured: true,
  },
  {
    id: 2,
    name: "Modern Full Stack Next.js Course",
    description: "Learn to build production-ready full stack apps with Next.js",
    tags: ["Next.js", "Full-Stack", "Course"],
    votes: 124,
    isFeatured: false,
  },
  {
    id: 3,
    name: "Habit Tracker",
    description: "production-ready full stack apps with Next.js",
    tags: ["Next.js", "Full-Stack"],
    votes: 101,
    isFeatured: true,
  },
];

function FeaturedProducts(){ 
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
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        </div>
    </section>
    )
  }


export default FeaturedProducts