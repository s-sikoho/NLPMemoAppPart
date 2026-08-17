import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Category, Memo } from "@/types";
import { trainClassifier } from "./api/classifier";
import {
  createMemo,
  deleteMemo,
  getMemos,
  predictMemo,
  updateMemo,
} from "@/api/memo";

import { createCategory, getCategories } from "@/api/category";
import { MemoForm } from "@/components/memo/MemoForm";
import { MemoFilter } from "@/components/memo/MemoFilter";
import { MemoList } from "@/components/memo/MemoList";
import { TrainButton } from "@/components/classifier/TrainButton";
import { CategoryManager } from "./components/category/CategoryManager";

function App() {
  // -------------------------
  // Form
  // -------------------------
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);

  // -------------------------
  // Data
  // -------------------------
  const [memos, setMemos] = useState<Memo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // -------------------------
  // Filter
  // -------------------------
  const [filterCategory, setFilterCategory] = useState("");
  const [keyword, setKeyword] = useState("");

  // -------------------------
  // Edit
  // -------------------------
  const [editingMemoId, setEditingMemoId] = useState<number | null>(null);

  // -------------------------
  // Initial load
  // -------------------------
  useEffect(() => {
    async function initialize() {
      try {
        const [categoryData, memoData] = await Promise.all([
          getCategories(),
          getMemos(),
        ]);

        setCategories(categoryData);
        setMemos(memoData);

        if (categoryData.length > 0) {
          setSelectedCategory(categoryData[0].name);
        }
      } catch (error) {
        console.error(error);

        toast.error("初期データの取得に失敗しました");
      }
    }

    initialize();
  }, []);

  // -------------------------
  // reload
  // -------------------------

  async function loadMemos() {
    const data = await getMemos(filterCategory, keyword);

    setMemos(data);
  }

  async function loadCategories() {
    const data = await getCategories();

    setCategories(data);
  }

  // -------------------------
  // Predict
  // -------------------------

  async function handlePredict() {
    if (title.trim() === "" && content.trim() === "") {
      toast.error("タイトルか本文を入力してください");

      return;
    }

    try {
      const result = await predictMemo({
        title,
        content,
      });

      setSelectedCategory(result.category);
      setConfidence(result.confidence ?? null);

      toast.success(`${result.category} と予測しました`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "分類に失敗しました";

      toast.error(message);
    }
  }

  // -------------------------
  // Save
  // -------------------------
  async function handleSave() {
    if (title.trim() === "" || content.trim() === "") {
      toast.error("タイトルと本文を入力してください");

      return;
    }

    if (selectedCategory === "") {
      toast.error("カテゴリを選択してください");

      return;
    }

    const exists =categories.some((category) =>category.name === selectedCategory);

    if (!exists) {
      toast.error("そのカテゴリは存在しません");
      return;
    }

    const memo = {
      title,
      content,
      category: selectedCategory,
    };

    try {
      if (editingMemoId === null) {
        await createMemo(memo);

        toast.success("メモを保存しました");
      } else {
        await updateMemo(editingMemoId, memo);

        toast.success("メモを更新しました");
      }

      clearForm();

      await loadMemos();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "保存に失敗しました";

      toast.error(message);
    }
  }

  // -------------------------
  // Edit
  // -------------------------
  function handleEdit(memo: Memo) {
    setEditingMemoId(memo.id);
    setTitle(memo.title);
    setContent(memo.content);
    setSelectedCategory(memo.category);
    setConfidence(null);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // -------------------------
  // Delete
  // -------------------------
  async function handleDelete(id: number) {
    if (!window.confirm("このメモを削除しますか？")) {
      return;
    }

    try {
      await deleteMemo(id);

      toast.success("メモを削除しました");

      await loadMemos();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "削除に失敗しました";

      toast.error(message);
    }
  }

  // -------------------------
  // Category
  // -------------------------
  async function handleCreateCategory(name: string) {
    try {
      await createCategory(name);
      await loadCategories();

      setSelectedCategory(name);

      toast.success(`${name} を追加しました`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "カテゴリ追加に失敗しました";

      toast.error(message);

      throw error;
    }
  }

  // -------------------------
  // Clear form
  // -------------------------
  function clearForm() {
    setEditingMemoId(null);
    setTitle("");
    setContent("");
    setConfidence(null);

    if (categories.length > 0) {
      setSelectedCategory(categories[0].name);
    }
  }
  // -------------------------
  // Category Deleted
  // -------------------------
  async function handleCategoryDeleted() {
    await loadCategories();
    await loadMemos();
  }
  // -------------------------
  // Train Manager
  // -------------------------
  async function handleTrain() {
    const result = await trainClassifier();
    toast.success(
    ` 再学習完了: ${result.training_samples}件`
    );
  }

  return (
    <main
      className="
        min-h-screen
        bg-muted/30
      "
    >
      <div
        className="
          mx-auto
          max-w-5xl
          space-y-8
          px-4
          py-10
          sm:px-6
        "
      >
        <header
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
              "
            >
              自動分類機能付きメモ
            </h1>

            <p
              className="
                mt-1
                text-muted-foreground
              "
            >
              メモを機械学習で自動分類して整理
            </p>
          </div>

          <TrainButton OnTrain={handleTrain}/>
        </header>

        <MemoForm
          title={title}
          content={content}
          categories={categories}
          selectedCategory={selectedCategory}
          editingMemoId={editingMemoId}
          confidence={confidence}
          onTitleChange={setTitle}
          onContentChange={setContent}
          onCategoryChange={setSelectedCategory}
          onCreateCategory={handleCreateCategory}
          onPredict={handlePredict}
          onSave={handleSave}
          onCancel={clearForm}
        />
        <CategoryManager categories={categories} onDeleted={handleCategoryDeleted} />

        <section className="space-y-5">
          <div>
            <h2
              className="
                text-2xl
                font-semibold
              "
            >
              メモ一覧
            </h2>

            <p
              className="
                text-sm
                text-muted-foreground
              "
            >
              {memos.length}件のメモ
            </p>
          </div>

          <MemoFilter
            categories={categories}
            category={filterCategory}
            keyword={keyword}
            onCategoryChange={setFilterCategory}
            onKeywordChange={setKeyword}
            onSearch={loadMemos}
          />

          <MemoList memos={memos} onEdit={handleEdit} onDelete={handleDelete} />
        </section>
      </div>
    </main>
  );
}

export default App;
