const MEMO_API = "http://localhost:8000/memo";

export async function getMemos(category = "", keyword = "") {
  const params = new URLSearchParams();

  if (category !== "") {
    params.append("category", category);
  }

  if (keyword !== "") {
    params.append("keyword", keyword);
  }

  let url = MEMO_API + "/";

  if (params.toString() !== "") {
    url += "?" + params.toString();
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("メモの取得に失敗しました");
  }

  return await response.json();
}

export async function createMemo(memo) {
  const response = await fetch(MEMO_API + "/", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(memo),
  });

  if (!response.ok) {
    throw new Error("メモの保存に失敗しました");
  }

  return await response.json();
}

export async function updateMemo(id, memo) {
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

  return await response.json();
}

export async function deleteMemo(id) {
  const response = await fetch(`${MEMO_API}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("メモの削除に失敗しました");
  }

  return await response.json();
}

export async function predictMemo(title, content) {
  const response = await fetch(MEMO_API + "/predict", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      title,
      content,
    }),
  });

  if (!response.ok) {
    throw new Error("自動分類に失敗しました");
  }

  return await response.json();
}
