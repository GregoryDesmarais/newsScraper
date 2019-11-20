$(function() {
    $("#getNews").click(function() {
        $.get("/scrape").then(function() {
            location.reload();
        })
    })
})