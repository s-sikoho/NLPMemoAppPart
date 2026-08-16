import { useEffect, useState } from "react";
import "./App.css";
import MemoForm from "./components/MemoForm";
import MemoFilter from "./components/MemoFilter";
import MemoList from "./components/MemoList";
import TrainButton from "./components/TrainButton";

import {
  getMemos,
  createMemo,
  updateMemo,
  deleteMemo,
  predictMemo,
} from "./api/memoApi";

import { getCategories, createCategory } from "./api/categoryApi";

function App() {
  // --------------------
  // メモ入力
  // --------------------
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // --------------------
  // メモ一覧
  // --------------------
  const [memos, setMemos] = useState([]);

  // --------------------
  // カテゴリ
  // --------------------
  const [categories, setCategories] = useState([]);

  // --------------------
  // 検索
  // --------------------
  const [filterCategory, setFilterCategory] = useState("");
  const [keyword, setKeyword] = useState("");

  // --------------------
  // 編集
  // --------------------
  const [editingMemoId, setEditingMemoId] = useState(null);

  // --------------------
  // カテゴリ取得
  // --------------------
  async function loadCategories() {
    const data = await getCategories();

    setCategories(data);

    if (data.length > 0 && selectedCategory === "") {
      setSelectedCategory(data[0].name);
    }
  }

  // --------------------
  // メモ取得
  // --------------------
  async function loadMemos() {
    const data = await getMemos(filterCategory, keyword);

    setMemos(data);
  }

  // --------------------
  // 初回読み込み
  // --------------------

  useEffect(() => {
    async function initialize() {
      const categoryData = await getCategories();

      setCategories(categoryData);

      if (categoryData.length > 0) {
        setSelectedCategory(categoryData[0].name);
      }

      const memoData = await getMemos();

      setMemos(memoData);
    }

    initialize();
  }, []);

  // --------------------
  // 自動分類
  // --------------------

  async function handlePredict() {
    if (title.trim() === "" && content.trim() === "") {
      return;
    }

    const result = await predictMemo(title, content);

    setSelectedCategory(result.category);
  }

  // --------------------
  // 保存 / 更新
  // --------------------

  async function handleSave() {
    if (title.trim() === "" || content.trim() === "") {
      return;
    }

    const memo = {
      title,
      content,
      category: selectedCategory,
    };

    if (editingMemoId === null) {
      await createMemo(memo);
    } else {
      await updateMemo(editingMemoId, memo);
    }

    clearForm();

    await loadMemos();
  }

  // --------------------
  // 編集開始
  // --------------------

  function handleEdit(memo) {
    setEditingMemoId(memo.id);

    setTitle(memo.title);

    setContent(memo.content);

    setSelectedCategory(memo.category);
  }

  // --------------------
  // 削除
  // --------------------

  async function handleDelete(id) {
    const confirmed = window.confirm("このメモを削除しますか？");

    if (!confirmed) {
      return;
    }

    await deleteMemo(id);

    await loadMemos();
  }

  // --------------------
  // 新規カテゴリ
  // --------------------

  async function handleCreateCategory(name) {
    await createCategory(name);

    await loadCategories();

    setSelectedCategory(name);
  }

  // --------------------
  // フォーム初期化
  // --------------------

  function clearForm() {
    setEditingMemoId(null);

    setTitle("");
    setContent("");

    if (categories.length > 0) {
      setSelectedCategory(categories[0].name);
    }
  }

  return (
    <div>
      <h1>Memo App</h1>

      <TrainButton />

      <MemoForm
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        editingMemoId={editingMemoId}
        onSave={handleSave}
        onPredict={handlePredict}
        onCreateCategory={handleCreateCategory}
        onCancelEdit={clearForm}
      />

      <h2>メモ一覧</h2>

      <MemoFilter
        categories={categories}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        keyword={keyword}
        setKeyword={setKeyword}
        onSearch={loadMemos}
      />

      <MemoList memos={memos} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}

export default App;
