import { ProductType } from "@/types";
import { ArrowRightIcon, Trash2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import AdminActions from "./admin-actions";
import { cn } from "@/lib/utils";

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export default function AdminProductCard({ product }: { product: ProductType }) {
  const formattedDate = product.createdAt
    ? new Intl.DateTimeFormat("en-US", DATE_FORMAT_OPTIONS).format(
        new Date(product.createdAt.toISOString())
      )
    : null;

  return (
    <Card className="border rounded-lg p-6 bg-background hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1 min-w-0 space-y-4">
          <CardTitle className="text-xl font-semibold flex justify-between items-center">
            <div className="flex items-center gap-2">
            <ArrowRightIcon className="size-4" />
            {product.name}
            </div>
            <Badge
              className={cn(
                product.status === "pending" &&
                  "bg-yellow-600/10 text-yellow-600 border-yellow-600",
                product.status === "approved" &&
                  "bg-green-500/10 text-green-600 border-green-500",
                product.status === "rejected" &&
                  "bg-red-500/10 text-red-500 border-red-500"
              )}
            >
              {product.status}
            </Badge>
          </CardTitle>

          <CardDescription className="flex flex-col gap-4">
            {product.tagline}
            <div className="flex items-center gap-2">
              {product.tags?.map((tag) => (
                <Badge variant="secondary" key={tag}>
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-bold">By:</span> {product.submittedBy}
              </p>
              {formattedDate && <p>{formattedDate}</p>}
              {product.websiteUrl && (
                <p>
                  <a
                    href={product.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Visit Website
                  </a>
                </p>
              )}
            </div>
          </CardDescription>
          <div className="flex justify-between gap-2">
            <Button variant="outline">
              <Trash2Icon className="size-4" />
              Delete
            </Button> 
            <AdminActions status={product.status ?? ""} productId={product.id} />
             </div>
        </div>

        <div className="lg:shrink-0">
        </div>
      </div>
    </Card>
  );
}
