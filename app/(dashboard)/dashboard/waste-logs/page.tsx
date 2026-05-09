import { WasteLogsClient } from "./waste-logs-client"
import { getWasteLogs } from "@/lib/actions/waste"

export default async function WasteLogsPage() {
  const { logs, error } = await getWasteLogs()

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-destructive">
        {error}
      </div>
    )
  }

  return <WasteLogsClient wasteLogs={logs ?? []} />
}
