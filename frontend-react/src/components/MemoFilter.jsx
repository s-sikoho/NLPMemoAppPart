function MemoFilter({
  categories,
  filterCategory,
  setFilterCategory,
  keyword,
  setKeyword,
  onSearch,
}) {
  return (
    <div>
      <select
        value={filterCategory}
        onChange={(event) => setFilterCategory(event.target.value)}
      >
        <option value="">すべて</option>

        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="メモを検索"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />

      <button onClick={onSearch}>検索</button>
    </div>
  );
}

export default MemoFilter;
