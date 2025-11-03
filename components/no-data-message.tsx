import { Info } from "lucide-react";

export const NoDataMessage = ({
  text,
  icon: Icon = Info,
}: {
  text: string;
  icon?: React.ElementType;
}) => (
  <div className="flex items-center gap-3 text-sm text-muted-foreground p-4 bg-muted rounded-lg border border-border">
    <Icon className="size-4 text-muted-foreground/60" />
    <span>{text}</span>
  </div>
);
