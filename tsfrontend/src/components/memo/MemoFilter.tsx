import type { Category } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  categories: Category[];

  category: string;

  keyword: string;

  onCategoryChange: (value: string) => void;

  onKeywordChange: (value: string) => void;

  onSearch: () => Promise<void>;
};

export function MemoFilter({
  categories,
  category,
  keyword,
  onCategoryChange,
  onKeywordChange,
  onSearch,
}: Props) {
  return (
    <div
      className="
        flex
        flex-col
        gap-3
        sm:flex-row
      "
    >
      <Input
        value={keyword}
        placeholder="メモを検索..."
        className="flex-1"
        onChange={(event) => onKeywordChange(event.target.value)}
      />

      <Select
        value={category === "" ? "all" : category}
        onValueChange={(value) => {
          if (value === null) {
            return;
          }

          onCategoryChange(value === "all" ? "" : value);
        }}
      >
        <SelectTrigger className="sm:w-48">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">すべて</SelectItem>

          {categories.map((item) => (
            <SelectItem key={item.id} value={item.name}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={onSearch}>検索</Button>
    </div>
  );
}
