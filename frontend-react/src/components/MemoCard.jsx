function MemoCard({ memo, onEdit, onDelete }) {
  return (
    <li>
      <h3>{memo.title}</h3>

      <p>{memo.content}</p>

      <p>カテゴリ: {memo.category}</p>

      <button onClick={() => onEdit(memo)}>編集</button>

      <button onClick={() => onDelete(memo.id)}>削除</button>
    </li>
  );
}

export default MemoCard;
