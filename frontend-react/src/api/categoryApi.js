const CATEGORY_API = "http://localhost:8000/categories";

export async function getCategories() {
  const response = await fetch(CATEGORY_API + "/");

  if (!response.ok) {
    throw new Error("カテゴリ取得に失敗しました");
  }

  return await response.json();
}

export async function createCategory(name) {
  const response = await fetch(CATEGORY_API + "/", {
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
    throw new Error(result.detail ?? "カテゴリ作成に失敗しました");
  }

  return result;
}
