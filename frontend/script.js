const MEMO_API =
    "http://localhost:8000/memo";

const CATEGORY_API =
    "http://localhost:8000/categories";


// -------------------------
// イベント登録
// -------------------------

document
    .getElementById("predictButton")
    .addEventListener(
        "click",
        predictCategory
    );


document
    .getElementById("saveButton")
    .addEventListener(
        "click",
        saveMemo
    );


document
    .getElementById("newCategoryButton")
    .addEventListener(
        "click",
        createCategory
    );


// -------------------------
// カテゴリ一覧取得
// -------------------------

async function loadCategories(
    selectedCategory = null
) {

    const response =
        await fetch(
            CATEGORY_API + "/"
        );

    const categories =
        await response.json();


    const select =
        document.getElementById(
            "categorySelect"
        );


    select.innerHTML = "";


    for (const category of categories) {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            category.name;

        option.textContent =
            category.name;


        if (
            category.name
            === selectedCategory
        ) {
            option.selected = true;
        }


        select.appendChild(option);
    }
}


// -------------------------
// 自動分類
// -------------------------

async function predictCategory() {

    const title =
        document
            .getElementById("memoTitle")
            .value;

    const content =
        document
            .getElementById("memoContent")
            .value;


    if (
        title.trim() === ""
        &&
        content.trim() === ""
    ) {
        return;
    }


    const response =
        await fetch(
            MEMO_API + "/predict",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    title: title,
                    content: content
                })
            }
        );


    const result =
        await response.json();


    // 予測結果を選択状態にする
    await loadCategories(
        result.category
    );
}


// -------------------------
// メモ保存
// -------------------------

async function saveMemo() {

    const title =
        document
            .getElementById("memoTitle")
            .value;

    const content =
        document
            .getElementById("memoContent")
            .value;

    const category =
        document
            .getElementById("categorySelect")
            .value;


    if (title.trim() === "") {
        return;
    }


    if (content.trim() === "") {
        return;
    }


    await fetch(
        MEMO_API + "/",
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                title: title,
                content: content,
                category: category
            })
        }
    );


    // 入力欄を空にする
    document
        .getElementById("memoTitle")
        .value = "";

    document
        .getElementById("memoContent")
        .value = "";


    await loadMemos();
}


// -------------------------
// 新しいカテゴリ作成
// -------------------------

async function createCategory() {

    const name =
        prompt(
            "新しいカテゴリ名を入力してください"
        );


    if (name === null) {
        return;
    }


    if (name.trim() === "") {
        return;
    }


    const response =
        await fetch(
            CATEGORY_API + "/",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    name: name
                })
            }
        );


    if (!response.ok) {

        const error =
            await response.json();

        alert(error.detail);

        return;
    }


    // 作成したカテゴリを
    // そのまま選択状態にする
    await loadCategories(name);
}


// -------------------------
// メモ一覧取得
// -------------------------

async function loadMemos() {

    const response =
        await fetch(
            MEMO_API + "/"
        );


    const memos =
        await response.json();


    const list =
        document.getElementById(
            "memoList"
        );


    list.innerHTML = "";


    for (const memo of memos) {

        const li =
            document.createElement(
                "li"
            );


        const title =
            document.createElement(
                "h3"
            );

        title.textContent =
            memo.title;


        const content =
            document.createElement(
                "p"
            );

        content.textContent =
            memo.content;


        const category =
            document.createElement(
                "span"
            );

        category.textContent =
            `カテゴリ: ${memo.category}`;


        li.appendChild(title);
        li.appendChild(content);
        li.appendChild(category);

        list.appendChild(li);
    }
}


// -------------------------
// 初期読み込み
// -------------------------

async function initialize() {

    await loadCategories();

    await loadMemos();
}


initialize();