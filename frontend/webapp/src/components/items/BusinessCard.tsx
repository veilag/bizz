import ReactTimeAgo from "react-time-ago";
import {BusinessQuery} from "@/types/business.ts";
import {memo} from "react";

interface BusinessCardProps {
  query: BusinessQuery
  onClick: (query: BusinessQuery) => void
}

const BusinessCard = memo(({query, onClick}: BusinessCardProps) => {
  return (
    <button
      onClick={() => onClick(query)}
      className={`group-[.active]:bg-accent w-full relative flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent`}>

      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="font-semibold">
              {query.name}
            </div>
          </div>
          <div className="ml-auto text-xs text-foreground">
            <ReactTimeAgo date={new Date(query.createdAt)}/>
          </div>
        </div>

        <div className="line-clamp-1 break-words text-xs text-muted-foreground">
          {query.description}
        </div>
      </div>

    </button>
)
})

export default BusinessCard
