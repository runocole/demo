import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onClick?: () => void; 
  clickable?: boolean; 
  actionIcon?: React.ElementType;
  onActionClick?: () => void;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  onClick,
  clickable = false,
  actionIcon: ActionIcon, 
  onActionClick 
}: StatsCardProps) {
  
  const cardContent = (
    <Card className={`hover:shadow-lg transition-shadow bg-blue-950 ${clickable ? 'cursor-pointer' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          {ActionIcon && onActionClick && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the card's onClick
                onActionClick();
              }}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <ActionIcon className="h-4 w-4" />
            </button>
          )}
          <Icon className="h-4 w-4 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  );

  // If clickable and onClick is provided, wrap with click handler
  if (clickable && onClick) {
    return (
      <div 
        onClick={onClick}
        className="cursor-pointer transform transition-transform hover:scale-105"
      >
        {cardContent}
      </div>
    );
  }

  return cardContent;
}