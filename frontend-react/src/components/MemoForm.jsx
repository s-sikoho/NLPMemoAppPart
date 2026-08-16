function MemoForm({
  title,
  setTitle,
  content,
  setContent,
  categories,
  selectedCategory,
  setSelectedCategory,
  editingMemoId,
  onSave,
  onPredict,
  onCreateCategory,
  onCancelEdit,
}) {
  async function handleCreateCategory() {
    const name = prompt("新しいカテゴリ名を入力してください");

    if (name === null || name.trim() === "") {
      return;
    }

    await onCreateCategory(name.trim());
  }

  return (
    <div className="memo-form">
      <input
        type="text"
        placeholder="タイトル"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <textarea
        placeholder="本文を入力してください"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />

      <div>
        <label>カテゴリ</label>

        <select
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <button onClick={handleCreateCategory}>新しいカテゴリ</button>
      </div>

      <button onClick={onPredict}>自動分類</button>

      <button onClick={onSave}>
        {editingMemoId === null ? "保存" : "更新"}
      </button>

      {editingMemoId !== null && (
        <button onClick={onCancelEdit}>編集キャンセル</button>
      )}
    </div>
  );
}

export default MemoForm;
