$(document).ready(function () {
  const resultsPerPage = 10;
  let currentView = "list";
  let currentPage = 1;
  let currentQuery = "";

function loadTemplate(name) {
  return Promise.resolve($("#template-" + name).html());
}

  function renderBooks(data, containerId, templateName) {
    const container = $(containerId);
    container.empty();

    data.forEach(book => {
      const info = {
        id: book.id,
        title: book.volumeInfo?.title || "No Title",
        thumbnail: book.volumeInfo?.imageLinks?.thumbnail || ""
      };

      loadTemplate(templateName).then(template => {
        const html = Mustache.render(template, info);
        container.append(html);
      });
    });
  }

  function showBookDetails(bookId) {
    const url = `https://www.googleapis.com/books/v1/volumes/${bookId}`;

    $.getJSON(url, function (data) {
      const info = {
        title: data.volumeInfo.title,
        authors: data.volumeInfo.authors?.join(", ") || "N/A",
        publisher: data.volumeInfo.publisher || "N/A",
        thumbnail: data.volumeInfo.imageLinks?.thumbnail || "",
        description: data.volumeInfo.description || "No description available."
      };

      loadTemplate("book-detail").then(template => {
        const html = Mustache.render(template, info);
        $("#bookDetailContainer").html(html);
      });
    });
  }

  function searchBooks(query, page = 1) {
    const startIndex = (page - 1) * resultsPerPage;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${resultsPerPage}`;

    $.getJSON(url, function (data) {
      renderBooks(data.items || [], "#searchResults", "book-item");
      renderPagination(data.totalItems || 0);
    });
  }

  function renderPagination(totalItems) {
    const totalPages = Math.min(Math.ceil(totalItems / resultsPerPage), 5);
    const pagination = $("#searchPagination").empty();

    for (let i = 1; i <= totalPages; i++) {
      const btn = $("<button>").text(i).on("click", function () {
        currentPage = i;
        searchBooks(currentQuery, currentPage);
      });
      if (i === currentPage) btn.css("font-weight", "bold");
      pagination.append(btn);
    }
  }

  function loadBookshelf() {
    $.getJSON("favorites.json", function (books) {
      renderBooks(books, "#bookshelfResults", "bookshelf-item");
    }).fail(function (jqxhr, textStatus, error) {
      $("#bookshelfResults").html(`<p>Error loading your bookshelf: ${textStatus} - ${error}</p>`);
    });
  }

  $("#tab-search").on("click", function () {
    $("#search-section").show();
    $("#bookshelf-section").hide();
    $("#tab-search").addClass("active");
    $("#tab-bookshelf").removeClass("active");
  });

  $("#tab-bookshelf").on("click", function () {
    $("#search-section").hide();
    $("#bookshelf-section").show();
    $("#tab-bookshelf").addClass("active");
    $("#tab-search").removeClass("active");
    loadBookshelf();
  });

  $("#toggleGrid").on("click", function () {
    $("#searchResults").removeClass("list").addClass("grid");
    currentView = "grid";
  });

  $("#toggleList").on("click", function () {
    $("#searchResults").removeClass("grid").addClass("list");
    currentView = "list";
  });

  $("#toggleGridBookshelf").on("click", function () {
    $("#bookshelfResults").removeClass("list").addClass("grid");
  });

  $("#toggleListBookshelf").on("click", function () {
    $("#bookshelfResults").removeClass("grid").addClass("list");
  });

  $("#searchBtn").on("click", function () {
    const query = $("#searchInput").val().trim();
    if (query) {
      currentQuery = query;
      currentPage = 1;
      searchBooks(query, currentPage);
    }
  });

  $(document).on("click", ".book", function () {
    const bookId = $(this).data("id");
    if (bookId) {
      showBookDetails(bookId);
    }
  });

  searchBooks("JavaScript");
});
