import ReactTimeAgo from "react-time-ago";
import {BusinessQuery} from "@/types/business.ts";
import {memo} from "react";
import AnimateIn from "@/components/ui/animate.ts";

interface BusinessCardProps {
  index: number
  query: BusinessQuery
  onClick: (query: BusinessQuery) => void
}

const BusinessCard = memo(({query, onClick, index}: BusinessCardProps) => {
  const emojiRegex = /\p{Emoji}/u;

  return (
    <AnimateIn
      from="opacity-0 scale-90 -translate-y-4"
      to="opacity-100 scale-100 translate-y-0 translate-x-0"
      delay={50 * index}
      duration={300}
    >
      <button
        onClick={() => onClick(query)}
        className="group-[.active]:bg-accent w-full relative flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent"
      >
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              {emojiRegex.test(query.name) && (
                <div className="font-semibold flex items-center gap-2">
                  <div className="w-6 h-6 p-1 flex items-center justify-center rounded border">
                    {query.name.at(0)}
                  </div>
                  {query.name.substring(1)}
                </div>
              )}
              {!emojiRegex.test(query.name) && (
                <div className="font-semibold">
                  {query.name}
                </div>
              )}
            </div>
            <div className="ml-auto text-xs text-foreground">
              <ReactTimeAgo date={new Date(query.createdAt)}/>
            </div>
          </div>
          {query.description && (
            <div className="line-clamp-1 break-words text-xs text-muted-foreground">
              {query.description}
            </div>
          )}
        </div>
      </button>
    </AnimateIn>
  )
})

export default BusinessCard
