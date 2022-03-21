pageMaker = function(curPage, perPage, count){
    const displayPageNum = 5;
    
    endPage = parseInt(Math.ceil(curPage / displayPageNum) * displayPageNum);
    startPage = (endPage - displayPageNum) + 1;

    tempEndPage = parseInt(Math.ceil(count / perPage));    
    if(endPage > tempEndPage) {
        endPage = tempEndPage;
    }

    prev = startPage == 1 ? false : true;
    next = endPage * perPage >= count ? false : true;
    no = count - (curPage - 1) * perPage;

    return {curPage, startPage, endPage, prev, next, no};
}

module.exports = pageMaker;