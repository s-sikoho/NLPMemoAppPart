import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  onCreate: (name: string) => Promise<void>;
};

export function CreateCategoryDialog({ onCreate }: Props) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    const trimmed = name.trim();

    if (trimmed === "") {
      return;
    }

    try {
      setLoading(true);

      await onCreate(trimmed);

      setName("");

      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" type="button" />}>
        ＋ 新しいカテゴリ
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>新しいカテゴリ</DialogTitle>

          <DialogDescription>
            メモを分類するカテゴリを追加します。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="category-name">カテゴリ名</Label>

          <Input
            id="category-name"
            value={name}
            placeholder="例: shopping"
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handleCreate}
            disabled={loading || name.trim() === ""}
          >
            {loading ? "追加中..." : "追加"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
