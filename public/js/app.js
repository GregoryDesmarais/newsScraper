$(function() {
    $("#getNews").click(function() {
        $(this).text("Gathering new articles. Please Wait");
        $.get("/scrape").then(() => {
            location.reload();
        })
    });

    $('.addComment').click(function() {
        let articleId = $(this).data("articleid");
        let data = {
            body: $("#newComment" + articleId).val()
        }
        $.post("articles/" + articleId, data).then(data => {
            console.log(data);
            location.reload();
        })
    });

    $(".delete").click(function() {
        $.get("/remove/" + $(this).data("id")).then(data => {
            console.log(data);
            location.reload()
        })
    });

    $(".modal").on("shown.bs.modal", function() {
        $(this).find("textarea").focus();
    })
})