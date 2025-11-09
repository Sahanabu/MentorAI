import { Badge } from "@/components/layout/ui/badge";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high';
  className?: string;
}

const RiskBadge = ({ level, className }: RiskBadgeProps) => {
  const configs = {
    low: {
      icon: CheckCircle,
      label: "Low Risk",
      className: "bg-success/10 text-success hover:bg-success/20 border-success/20",
    },
    medium: {
      icon: AlertTriangle,
      label: "Medium Risk",
      className: "bg-warning/10 text-warning hover:bg-warning/20 border-warning/20",
    },
    high: {
      icon: AlertCircle,
      label: "High Risk",
      className: "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20",
    },
  };

  const config = configs[level];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn(config.className, "gap-1.5", className)}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </Badge>
  );
};

export default RiskBadge;
