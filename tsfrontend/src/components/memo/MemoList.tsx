import type { Memo } from "@/types";

import { MemoCard } from "./MemoCard";

type Props = {
  memos: Memo[];

  onEdit: (memo: Memo) => void;

  onDelete: (id: number) => Promise<void>;
};

export function MemoList({ memos, onEdit, onDelete }: Props) {
  if (memos.length === 0) {
    return (
      <div
        className="
          py-16
          text-center
          text-muted-foreground
        "
      >
        メモがありません
      </div>
    );
  }

  return (
    <div
      className="
        grid
        gap-4
        md:grid-cols-2
      "
    >
      {memos.map((memo) => (
        <MemoCard
          key={memo.id}
          memo={memo}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
