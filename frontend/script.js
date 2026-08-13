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

document
    .getElementById("filterCategory")
    .addEventListener(
        "change",
        loadMemos
    );

document
    .getElementById("cancelEditButton")
    .addEventListener(
        "click",
        clearForm
    );

document
    .getElementById("searchButton")
    .addEventListener(
        "click",
        loadMemos
    );

document
    .getElementById("trainButton")
    .addEventListener(
        "click",
        trainClassifier
    );

// -------------------------
// Category
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

    // -------------------------
    // メモ保存用select
    // -------------------------

    const categorySelect =
        document.getElementById(
            "categorySelect"
        );

    categorySelect.innerHTML = "";

    // -------------------------
    // 絞り込み用select
    // -------------------------

    const filterSelect =
        document.getElementById(
            "filterCategory"
        );

    filterSelect.innerHTML =
        '<option value="">すべて</option>';


    for (const category of categories) {

        // 保存用
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

        categorySelect.appendChild(
            option
        );

        // 絞り込み用
        const filterOption =
            document.createElement(
                "option"
            );

        filterOption.value =
            category.name;

        filterOption.textContent =
            category.name;

        filterSelect.appendChild(
            filterOption
        );
    }
}

// -------------------------
// Category
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

    const trimmedName =
        name.trim();

    if (trimmedName === "") {
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
                    name: trimmedName
                })
            }
        );


    if (!response.ok) {

        const error =
            await response.json();

        alert(error.detail);

        return;
    }


    // カテゴリ一覧を再取得し、
    // 新しく作ったカテゴリを選択
    await loadCategories(
        trimmedName
    );
}


// -------------------------
// Predict
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


    if (!response.ok) {
        alert("分類に失敗しました");
        return;
    }


    const result =
        await response.json();


    await loadCategories(
        result.category
    );
}


// -------------------------
// Create / Update
// 保存
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

    const editingMemoId =
        document
            .getElementById("editingMemoId")
            .value;


    if (
        title.trim() === ""
        ||
        content.trim() === ""
    ) {
        return;
    }


    // -------------------------
    // 新規作成
    // -------------------------

    if (editingMemoId === "") {

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

    }

    // -------------------------
    // 編集
    // -------------------------

    else {

        await fetch(
            `${MEMO_API}/${editingMemoId}`,
            {
                method: "PUT",

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
    }


    clearForm();

    await loadMemos();
}


// -------------------------
// Read
// メモ一覧
// -------------------------

async function loadMemos() {

    const selectedCategory =
        document
            .getElementById("filterCategory")
            .value;

    const keyword =
    document
        .getElementById("searchKeyword")
        .value.trim();

    let url =
        MEMO_API + "/";

    const params =
        new URLSearchParams();

    if (selectedCategory !== "") {
        params.append(
            "category",
            selectedCategory
        );
    }


    if (keyword !== "") {
        params.append(
            "keyword",
            keyword
        );
    }

    if (params.toString() !== "") {
        url += "?" + params.toString();
    }

    const response =
        await fetch(url);

    const memos =
        await response.json();

    const list =
        document.getElementById(
            "memoList"
        );

    list.innerHTML = "";

    for (const memo of memos) {
        const li =
            document.createElement("li");

        // タイトル
        const title =
            document.createElement("h3");

        title.textContent =
            memo.title;

        // 本文
        const content =
            document.createElement("p");

        content.textContent =
            memo.content;

        // カテゴリ
        const category =
            document.createElement("p");

        category.textContent =
            `カテゴリ: ${memo.category}`;

        // 編集
        const editButton =
            document.createElement(
                "button"
            );

        editButton.textContent =
            "編集";

        editButton.addEventListener(
            "click",
            function () {
                startEdit(memo);
            }
        );

        // 削除
        const deleteButton =
            document.createElement(
                "button"
            );

        deleteButton.textContent =
            "削除";

        deleteButton.addEventListener(
            "click",
            function () {
                deleteMemo(memo.id);
            }
        );

        li.appendChild(title);
        li.appendChild(content);
        li.appendChild(category);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        list.appendChild(li);
    }
}


// -------------------------
// Update
// 編集開始
// -------------------------

async function startEdit(memo) {

    document
        .getElementById("editingMemoId")
        .value = memo.id;

    document
        .getElementById("memoTitle")
        .value = memo.title;

    document
        .getElementById("memoContent")
        .value = memo.content;

    await loadCategories(
        memo.category
    );

    document
        .getElementById("saveButton")
        .textContent = "更新";
}


// -------------------------
// Delete
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
        `${MEMO_API}/${id}`,
        {
            method: "DELETE"
        }
    );

    await loadMemos();
}

async function trainClassifier() {

    const response =
        await fetch(
            "http://localhost:8000/classifier/train",
            {
                method: "POST"
            }
        );

    const result =
        await response.json();

    const message =
        document.getElementById(
            "trainResult"
        );

    if (response.ok) {
        message.textContent =
            `再学習完了: ${result.training_samples}件`;
        console.log(result);
    } else {
        message.textContent =
            `エラー: ${result.detail}`;
    }
}


// -------------------------
// フォーム初期化
// -------------------------

async function clearForm() {

    document
        .getElementById("editingMemoId")
        .value = "";

    document
        .getElementById("memoTitle")
        .value = "";

    document
        .getElementById("memoContent")
        .value = "";

    document
        .getElementById("saveButton")
        .textContent = "保存";


    await loadCategories();
}

// -------------------------
// フィルター
// -------------------------

// -------------------------
// 初期化
// -------------------------

async function initialize() {

    await loadCategories();

    await loadMemos();
}


initialize();