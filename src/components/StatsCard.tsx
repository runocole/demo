import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow bg-blue-950">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600"> {/* Changed from text-muted-foreground */}
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-gray-500" /> {/* Changed from text-muted-foreground */}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs mt-1 text-green-600"> {/* Changed to always be green */}
            {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}