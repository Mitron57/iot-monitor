import { useEffect } from "react"
import { animate } from "animejs"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"

export function DeviceCardSkeleton() {
  // Animate skeleton on mount
  useEffect(() => {
    animate(".skeleton-pulse", {
      opacity: [0.5, 0.8],
      ease: "inOutSine",
      duration: 1200,
      loop: true,
      alternate: true,
    })
  }, [])

  return (
    <Card className="device-card-skeleton">
      <CardHeader className="pb-2">
        <div className="h-6 w-3/4 bg-muted rounded skeleton-pulse"></div>
        <div className="flex gap-2 mt-2">
          <div className="h-5 w-20 bg-muted rounded skeleton-pulse"></div>
          <div className="h-5 w-16 bg-muted rounded skeleton-pulse"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-10 bg-muted rounded skeleton-pulse"></div>
          <div className="h-10 bg-muted rounded skeleton-pulse"></div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <div className="h-4 w-32 bg-muted rounded skeleton-pulse"></div>
        <div className="h-4 w-12 bg-muted rounded skeleton-pulse"></div>
      </CardFooter>
    </Card>
  )
}
