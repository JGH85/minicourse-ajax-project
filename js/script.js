
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    //text variables
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address;
    $body.append('<img class="bgimg" src="'+ streetviewUrl + '">');

    //NTTImes Ajax request
    //NTTimes Api request key: 076f26928897451f889a601d213f8d7a
    var nytimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=076f26928897451f889a601d213f8d7a'
    $.getJSON(nytimesUrl, function (data) {
        console.log(data);
        $nytHeaderElem.text('New York Times Articles About ' + cityStr);
        articles = data.response.docs;
        for (var i = 0; i <articles.length; i++) {
          var article = articles[i];
          $nytElem.append('<li class = "article">'+ '<a href="' + article.web_url+'">'+ article.headline.main+'</a>' + '<p>' + article.snippet + '</p>'+ '</li>');
        };

    }).fail(function(e){
      $nytHeaderElem.text('Articles could not be loaded.');
    });

    //Wikipedia request with JSONP to fix CORS problem

    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
      }, 8000);
    $.ajax({
      url:wikiUrl,
      dataType: "jsonp",
      //jsonp:"callback",
    }).done(function(response) {
        var articleList = response[1];
        for (var i = 0; i <articleList.length; i++) {
          articleStr = articleList[i];
          var url = 'http://en.wikipedia.org/wiki/' + articleStr;
          $wikiElem.append('<li><a href="' + url + '">'+ articleStr+'</a></li>');
          };
          clearTimeout(wikiRequestTimeout);
      });



    return false;
};

$('#form-container').submit(loadData);
