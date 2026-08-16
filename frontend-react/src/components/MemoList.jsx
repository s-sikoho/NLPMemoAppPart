import MemoCard from "./MemoCard";

function MemoList({ memos, onEdit, onDelete }) {
  return (
    <ul>
      {memos.map((memo) => (
        <MemoCard
          key={memo.id}
          memo={memo}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default MemoList;
