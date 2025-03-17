import { cn } from "@/lib/utils";

export function DescriptionList({
  items,
  bordered = false,
}: {
  items: { term: string; description: string }[];
  bordered?: boolean;
}) {
  return (
    <dl className={cn("space-y-4", bordered && "border rounded-lg p-4")}>
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "flex flex-col pb-2",
            bordered ? "border-b last:border-none" : "last:pb-0"
          )}
        >
          <dt className="text-sm font-medium text-muted-foreground">{item.term}</dt>
          <dd className="text-base text-foreground">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}
