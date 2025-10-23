import React from "react";
import { Card, CardContent } from "../components/ui/card";

type Cat = { key: string; label: string; icon?: string };

interface Props {
  categories: Cat[];
  onSelect: (categoryKey: string) => void;
}

const CategorySelection: React.FC<Props> = ({ categories, onSelect }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Select a category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {categories.map((c) => (
          <Card
            key={c.key}
            onClick={() => onSelect(c.key)}
            className="cursor-pointer hover:scale-105 transform transition p-4"
          >
            <CardContent className="flex flex-col items-start gap-2">
              <div className="text-4xl">{c.icon || "📦"}</div>
              <div className="text-lg font-medium">{c.label}</div>
              <div className="text-xs text-gray-400">Add {c.label} items</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategorySelection;
