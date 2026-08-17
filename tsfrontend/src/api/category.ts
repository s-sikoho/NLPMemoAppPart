import type { Category } from "@/types";

const CATEGORY_API = "http://localhost:8000/categories";

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${CATEGORY_API}/`);

  if (!response.ok) {
    throw new Error("カテゴリの取得に失敗しました");
  }

  return response.json();
}

export async function createCategory(name: string): Promise<Category> {
  const response = await fetch(`${CATEGORY_API}/`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      name,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail ?? "カテゴリの作成に失敗しました");
  }

  return result;
}

export async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`${CATEGORY_API}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const result = await response.json();

    throw new Error(result.detail ?? "カテゴリ削除に失敗しました");
  }
}
