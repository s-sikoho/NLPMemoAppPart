import type { Memo, MemoInput, PredictInput, PredictResult } from "@/types";

const MEMO_API = "http://localhost:8000/memo";

export async function getMemos(category = "", keyword = ""): Promise<Memo[]> {
  const params = new URLSearchParams();

  if (category !== "") {
    params.append("category", category);
  }

  if (keyword !== "") {
    params.append("keyword", keyword);
  }

  let url = `${MEMO_API}/`;

  if (params.toString() !== "") {
    url += `?${params.toString()}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("メモの取得に失敗しました");
  }

  return response.json();
}

export async function createMemo(memo: MemoInput): Promise<Memo> {
  const response = await fetch(`${MEMO_API}/`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(memo),
  });

  if (!response.ok) {
    throw new Error("メモの保存に失敗しました");
  }

  return response.json();
}

export async function updateMemo(id: number, memo: MemoInput): Promise<Memo> {
  const response = await fetch(`${MEMO_API}/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(memo),
  });

  if (!response.ok) {
    throw new Error("メモの更新に失敗しました");
  }

  return response.json();
}

export async function deleteMemo(id: number): Promise<void> {
  const response = await fetch(`${MEMO_API}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("メモの削除に失敗しました");
  }
}

export async function predictMemo(input: PredictInput): Promise<PredictResult> {
  const response = await fetch(`${MEMO_API}/predict`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("自動分類に失敗しました");
  }

  return response.json();
}
