const API_URL = "http://localhost:8000/memo";


// 保存ボタン
document
    .getElementById("saveButton")
    .addEventListener(
        "click",
        saveMemo
    );


// メモ保存
async function saveMemo() {

    const text =
        document
            .getElementById("memoText")
            .value;


    await fetch(
        API_URL,
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


    // 入力欄を空にする
    document
        .getElementById("memoText")
        .value = "";


    loadMemos();

}



// メモ一覧取得
async function loadMemos() {

    const response =
        await fetch(API_URL);


    const memos =
        await response.json();


    const list =
        document.getElementById("memoList");


    list.innerHTML = "";


    for (const memo of memos) {

        const li =
            document.createElement("li");


        li.textContent =
            `${memo.text} (${memo.category})`;


        list.appendChild(li);

    }

}


// ページ読み込み時
loadMemos();