const API_URL = "http://localhost:8000/memo";


// 保存ボタン
document
    .getElementById("saveButton")
    .addEventListener("click", saveMemo);


// -------------------------
// Create
// メモ作成
// -------------------------
async function saveMemo() {

    const text =
        document.getElementById("memoText").value;

    if (text.trim() === "") {
        return;
    }

    await fetch(
        API_URL + "/",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                text: text
            })
        }
    );


    document.getElementById("memoText").value = "";

    loadMemos();
}


// -------------------------
// Read
// メモ一覧取得
// -------------------------
async function loadMemos() {

    const response =
        await fetch(API_URL + "/");

    const memos =
        await response.json();

    const list =
        document.getElementById("memoList");

    list.innerHTML = "";


    for (const memo of memos) {

        const li =
            document.createElement("li");


        // メモ本文
        const textSpan =
            document.createElement("span");

        textSpan.textContent =
            `${memo.text} (${memo.category}) `;


        // 編集ボタン
        const editButton =
            document.createElement("button");

        editButton.textContent = "編集";

        editButton.addEventListener(
            "click",
            function () {
                editMemo(
                    memo.id,
                    memo.text
                );
            }
        );


        // 削除ボタン
        const deleteButton =
            document.createElement("button");

        deleteButton.textContent = "削除";

        deleteButton.addEventListener(
            "click",
            function () {
                deleteMemo(memo.id);
            }
        );


        li.appendChild(textSpan);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        list.appendChild(li);
    }
}


// -------------------------
// Update
// メモ編集
// -------------------------
async function editMemo(
    id,
    currentText
) {

    const newText =
        prompt(
            "メモを編集してください",
            currentText
        );


    // キャンセル
    if (newText === null) {
        return;
    }


    // 空文字を防ぐ
    if (newText.trim() === "") {
        return;
    }


    await fetch(
        `${API_URL}/${id}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                text: newText
            })
        }
    );


    loadMemos();
}


// -------------------------
// Delete
// メモ削除
// -------------------------
async function deleteMemo(id) {

    const result =
        confirm(
            "このメモを削除しますか？"
        );


    if (!result) {
        return;
    }


    await fetch(
        `${API_URL}/${id}`,
        {
            method: "DELETE"
        }
    );


    loadMemos();
}


// ページ読み込み時
loadMemos();