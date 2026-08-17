import type { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/api/category";

type Props = {
  categories: Category[];
  onDeleted: () => Promise<void>;
};

export function CategoryManager({ categories, onDeleted }: Props) {
  async function handleDelete(category: Category) {
    const ok = window.confirm(`${category.name}を削除しますか？`);

    if (!ok) {
      return;
    }

    try {
      await deleteCategory(category.id);
      await onDeleted();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div
      className="
        space-y-2
      "
    >
      {categories.map((category) => (
        <div
          key={category.id}
          className="
                flex
                items-center
                justify-between
                rounded-md
                border
                p-2
              "
        >
          <span>{category.name}</span>

          {!category.is_system && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(category)}
            >
              削除
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
