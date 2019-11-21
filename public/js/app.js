$(function() {
    $("#getNews").click(function() {
        $.get("/scrape").then(function() {
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
    })
})