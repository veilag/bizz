import ReactTimeAgo from "react-time-ago";
import {Loader} from "react-feather";
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
      disabled={!(query?.status === "GENERATED")}
      className={`group-[.active]:bg-accent w-full relative flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent`}>

      {!(query.status === "GENERATED") && (
        <>
          <div
            className="absolute flex items-center text justify-center w-full bg-muted opacity-80 top-0 left-0 h-full rounded-lg">
          </div>
          <div className="absolute group flex items-center justify-center w-full h-full top-0 left-0">
            <div className="flex animate-pulse px-2 py-1 bg-white dark:bg-neutral-700 rounded-full gap-1 items-center">
              <Loader className="animate-spin" size={15}/>
              {query.status === "GENERATION" && <span>Генерируется</span>}
              {query.status === "QUEUED" && <span>В ожидании</span>}
            </div>
          </div>
        </>
      )}

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
      </div>
      <div className="line-clamp-1 break-words text-xs text-muted-foreground">
        {query.query}
      </div>
    </button>
  )
})

export default BusinessCard
