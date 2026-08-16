function CategorySelect({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div>
      <label>カテゴリ</label>

      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategorySelect;
