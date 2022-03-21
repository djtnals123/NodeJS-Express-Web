class criteria {
    #page;
    #perPage;
    #option;
    #keyword;

    constructor(page, perPage, option, keyword){
        if(isNaN(page)) 
            this.#page = 1;
        else 
            this.#page = Number(page);

        if(isNaN(perPage)) 
            this.#perPage = 10;
        else 
            this.#perPage = Number(perPage);

        this.#option = option;
        this.#keyword = keyword;
    }

    getQueryString(page) {
        const criteria = {page, perPage:this.#perPage};
        if(this.#option && this.#keyword){
            criteria.option = this.#option;
            criteria.keyword = this.#keyword;
        }
        return Object.entries(criteria).map(e => e.join('=')).join('&');
    }

    get page(){
        return this.#page;
    }
    get perPage(){
        return this.#perPage;
    }
    get option(){
        return this.#option;
    }
    get keyword(){
        return this.#keyword;
    }
}

module.exports = criteria;