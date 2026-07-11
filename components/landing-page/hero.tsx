import {Button} from '@/components/ui/button'
import { Badge } from "../ui/badge"

function hero() {
  return (
    <div>
        <Badge>Join thousands of creators sharing their work</Badge>
        <h1>Share What You've &apos;Built, Discover What's &apos;Launching</h1>
        <p>
            A community platform for creators to showcase their apps, AI tools, SaaS products,
             and creative projects. Authentic launches, real builders, genuine feedback.
        </p>
        <Button>Share Your Projects</Button>
        <Button>Explore Projects</Button>
    </div>
  )
}

export default hero