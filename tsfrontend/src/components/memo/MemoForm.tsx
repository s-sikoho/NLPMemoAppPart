import type { Category } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { CreateCategoryDialog } from "@/components/category/CreateCategoryDialog";

type Props = {
  title: string;
  content: string;
  categories: Category[];
  selectedCategory: string;
  editingMemoId: number | null;
  confidence?: number | null;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCreateCategory: (name: string) => Promise<void>;
  onPredict: () => Promise<void>;
  onSave: () => Promise<void>;
  onCancel: () => void;
};

export function MemoForm({
  title,
  content,
  categories,
  selectedCategory,
  editingMemoId,
  confidence,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  onCreateCategory,
  onPredict,
  onSave,
  onCancel,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingMemoId === null ? "新しいメモ" : "メモを編集"}
        </CardTitle>

        <CardDescription>
          タイトルと本文を入力すると、 機械学習でカテゴリを予測できます。
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label>タイトル</Label>

          <Input
            value={title}
            placeholder="メモのタイトル"
            onChange={(event) => onTitleChange(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>本文</Label>

          <Textarea
            value={content}
            placeholder="内容を入力してください"
            className="min-h-36"
            onChange={(event) => onContentChange(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>カテゴリ</Label>

          <div
            className="
              flex
              flex-col
              gap-2
              sm:flex-row
            "
          >
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                if (value === null) {
                  return;
                }

                onCategoryChange(value);
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="カテゴリを選択" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateCategoryDialog onCreate={onCreateCategory} />
          </div>
        </div>

        {confidence !== null && confidence !== undefined && (
          <p
            className="
              text-sm
              text-muted-foreground
            "
          >
            確信度: {(confidence * 100).toFixed(1)}%
          </p>
        )}
      </CardContent>

      <CardFooter
        className="
          flex
          justify-between
          gap-2
        "
      >
        <Button type="button" variant="secondary" onClick={onPredict}>
          自動分類
        </Button>

        <div
          className="
            flex
            gap-2
          "
        >
          {editingMemoId !== null && (
            <Button type="button" variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
          )}

          <Button type="button" onClick={onSave}>
            {editingMemoId === null ? "保存" : "更新"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
