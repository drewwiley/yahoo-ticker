// change so that symbols are saved instead of JSON objects; want new data to be retreived every time watchlist is viewed

$(document).ready(function(){
    // empty array to store watchlist symbols

    // add a submit handler for our form
    $('.yahoo-form').submit(function(){
        // stop the form from submitting when the user clicks or pushes enter
        event.preventDefault();
        // get whater the user but it the input field
        var symbol = $('#symbol').val();

        var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20("' + symbol + '")%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';

        $.getJSON(url, function(theDataJsFoundIfAny){
            // console.log(theDataJsFoundIfAny);
            var stockInfo = theDataJsFoundIfAny.query.results.quote;
            var stockCount = theDataJsFoundIfAny.query.count;
            var newHTML = '';
            if(stockCount > 1){
                for(var i = 0; i < stockInfo.length; i++){
                    newHTML += buildNewTable(stockInfo[i]);
                }
            }else{
                newHTML += buildNewTable(stockInfo);
            }
            $('.yahoo-body').html(newHTML);
            $('.table').DataTable();
        });
    });

    $('.add-stock').click(function(){
        var newListItems = [];
        var existingList = JSON.parse(localStorage.getItem('watchList')); // extract ticker symbols from JSON objects
        var combinedList = [];
        var symbol = $('#symbol').val();
        var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20("' + symbol + '")%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';
        $.getJSON(url, function(theDataJsFoundIfAny){
            var stockInfo = theDataJsFoundIfAny.query.results.quote;
            var stockCount = theDataJsFoundIfAny.query.count;
            if(stockCount > 1){
                for (var i = 0; i < stockInfo.length; i++){
                    newListItems.push(stockInfo[i]);
                }
            }else{
                newListItems.push(stockInfo)
            }
            if (existingList === null){
                localStorage.setItem('watchList', JSON.stringify(newListItems));
            }else{
                combinedList = existingList.concat(newListItems)
                localStorage.setItem('watchList', JSON.stringify(combinedList));
            }
        });
    });

    $('.view-watch').click(function(){
        var newHTML = '';
        var existingList = JSON.parse(localStorage.getItem('watchList'));
        if(existingList !== null){
            for(var i = 0; i < existingList.length; i++){
                newHTML += buildNewTable(existingList[i]);
            }
        }
        $('.yahoo-body').html(newHTML);
        $('.table').DataTable();
    });

    $('.clear-watch').click(function(){
        localStorage.clear();
    });

});


function buildNewTable(stockInfo){

    if(stockInfo.Change){
        if(stockInfo.Change[0] == '+'){
            var upDown = "success";
        }else if(stockInfo.Change[0] == '-'){
            var upDown = "danger";
        }    
    }else{
        var upDown = '';
        stockInfo.Change = 0;
    }

    

    var htmlString = '';
    htmlString = '<tr><td>' + stockInfo.Symbol + '</td>';
    htmlString += '<td>' + stockInfo.Name + '</td>';
    htmlString += '<td>' + stockInfo.Ask + '</td>';
    htmlString += '<td>' + stockInfo.Bid + '</td>';
    htmlString += '<td class="' + upDown + '">' + stockInfo.Change + '</td></tr>';
    return htmlString;
}