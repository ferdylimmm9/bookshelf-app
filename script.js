document.addEventListener("DOMContentLoaded", function () {
  const inputBook = document.getElementById("inputBook");
  const searchBook = document.getElementById("searchBook");
  const overlay = document.getElementById("overlay");
  const overlayEdit = document.getElementById("overlay-edit");
  const inputBookEdit = document.getElementById("inputBookEdit");
  inputBook.addEventListener("submit", function (event) {
    event.preventDefault();
    onSubmit();
  });
  searchBook.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchBookTitle = document.getElementById("searchBookTitle").value;
    onSearch(searchBookTitle);
  });
  inputBookEdit.addEventListener("submit", function (event) {
    event.preventDefault();
    onSubmitEdit();
  });
  overlay.addEventListener("click", function (event) {
    closeOverlay();
  });
  overlayEdit.addEventListener("click", function (event) {
    event.stopPropagation();
  });
  onLoad();
});
function onSubmitEdit() {
  const inputBookid = document.getElementById("inputBookid").value;
  const inputBookTitleEdit =
    document.getElementById("inputBookTitleEdit").value;
  const inputBookAuthorEdit = document.getElementById(
    "inputBookAuthorEdit"
  ).value;
  const inputBookYearEdit = document.getElementById("inputBookYearEdit").value;
  const inputBookIsCompleteEdit = document.getElementById(
    "inputBookIsCompleteEdit"
  ).checked;
  const data = bookObject(
    inputBookid,
    inputBookTitleEdit,
    inputBookAuthorEdit,
    inputBookYearEdit,
    inputBookIsCompleteEdit
  );
  localStorage.setItem(inputBookid, JSON.stringify(data));
  document.getElementById(inputBookid).remove();
  buildElement(data);
  closeOverlay();
}
function bookObject(id, title, author, year, isComplete) {
  return { id, title, author, year, isComplete };
}
function onSearch(title) {
  const arrayData = [];
  for (let index = 0; index < localStorage.length; index++) {
    const id = localStorage.key(index); 
    const data = JSON.parse(localStorage.getItem(id)); 
    if (data.title.includes(title)) {
      arrayData.push(data);
    }
  }
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  incompleteBookshelfList.innerHTML = ""; 
  completeBookshelfList.innerHTML = ""; 
  arrayData.map((value) => buildElement(value)); 
}
function openOverlay(id) {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "flex";
  const data = JSON.parse(localStorage.getItem(id));
  console.log(data);
  const inputBookid = document.getElementById("inputBookid");
  const inputBookTitleEdit = document.getElementById("inputBookTitleEdit");
  const inputBookAuthorEdit = document.getElementById("inputBookAuthorEdit");
  const inputBookYearEdit = document.getElementById("inputBookYearEdit");
  const inputBookIsCompleteEdit = document.getElementById(
    "inputBookIsCompleteEdit"
  );
  inputBookid.value = id;
  inputBookTitleEdit.value = data.title;
  inputBookAuthorEdit.value = data.author;
  inputBookYearEdit.value = data.year;
  inputBookIsCompleteEdit.checked = data.isComplete;
}
function closeOverlay() {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "none";
}
function onSubmit() {
  const title = document.getElementById("inputBookTitle").value; 
  const author = document.getElementById("inputBookAuthor").value; 
  const year = document.getElementById("inputBookYear").value; 
  const isComplete = document.getElementById("inputBookIsComplete").checked; 
  const data = bookObject(
    +new Date(),
    title,
    author,
    parseInt(year),
    isComplete
  ); 
  localStorage.setItem(data.id, JSON.stringify(data)); 
  buildElement(data); 
}

function onDelete(id) {
  if (confirm("apakah anda ingin menghapus buku?")) {
    localStorage.removeItem(id); 
    document.getElementById(id).remove(); 
  }
}
function onChange(id) {
  const data = JSON.parse(localStorage.getItem(id)); 
  data.isComplete = !data.isComplete; 
  localStorage.setItem(id, JSON.stringify(data)); 
  document.getElementById(id).remove(); 
  buildElement(data); 
}

function onLoad() {
  for (let index = 0; index < localStorage.length; index++) {
    const id = localStorage.key(index); 
    const data = JSON.parse(localStorage.getItem(id)); 
    buildElement(data); 
  }
}

function buildElement(props) {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  const { id, title, author, year, isComplete } = props;
  const article = document.createElement("article");
  article.setAttribute("class", "book_item");
  article.setAttribute("id", id);
  const titleElement = document.createElement("h3");
  titleElement.innerText = title;
  const authorElement = document.createElement("p");
  authorElement.innerText = `Penulis : ${author}`;
  const yearElement = document.createElement("p");
  yearElement.innerText = `Tahun : ${year}`;
  const action = document.createElement("div");
  action.setAttribute("class", "action");
  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("class", "red");
  deleteButton.innerText = "Hapus buku";
  deleteButton.addEventListener("click", function (event) {
    onDelete(id);
  });
  const readButton = document.createElement("button");
  readButton.setAttribute("class", "green");
  readButton.addEventListener("click", function (event) {
    onChange(id);
  });
  const editButton = document.createElement("button");
  editButton.setAttribute("class", "yellow");
  editButton.addEventListener("click", function (event) {
    openOverlay(id);
  });
  editButton.innerText = "Edit";
  article.append(titleElement, authorElement, yearElement, action);
  action.append(readButton, editButton, deleteButton);
  if (isComplete) {
    readButton.innerText = "Belum selesai di Baca";
    completeBookshelfList.appendChild(article);
  } else {
    readButton.innerText = "Selesai dibaca";
    incompleteBookshelfList.appendChild(article);
  }
}
