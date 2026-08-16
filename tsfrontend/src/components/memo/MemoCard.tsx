import type { Memo } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  memo: Memo;

  onEdit: (memo: Memo) => void;

  onDelete: (id: number) => Promise<void>;
};

export function MemoCard({ memo, onEdit, onDelete }: Props) {
  return (
    <Card>
      <CardHeader
        className="
          flex
          flex-row
          items-start
          justify-between
          gap-4
        "
      >
        <CardTitle
          className="
            text-lg
            leading-snug
          "
        >
          {memo.title}
        </CardTitle>

        <Badge variant="secondary">{memo.category}</Badge>
      </CardHeader>

      <CardContent>
        <p
          className="
            whitespace-pre-wrap
            text-sm
            leading-6
            text-muted-foreground
          "
        >
          {memo.content}
        </p>
      </CardContent>

      <CardFooter
        className="
          justify-end
          gap-2
        "
      >
        <Button variant="outline" size="sm" onClick={() => onEdit(memo)}>
          編集
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(memo.id)}
        >
          削除
        </Button>
      </CardFooter>
    </Card>
  );
}
