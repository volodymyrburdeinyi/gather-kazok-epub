import jsdom from "jsdom";
import axios from "axios";

export default class L1Page {
    #url;

    constructor($url) {
        this.#url = $url;
    }

    async *parse() {
        let dom;
        do {
            console.log('getHtml', this.#url);
            const html = await this.#getHtml(this.#url);
            dom = await this.#buildDom(html);

            const items = await this.#getPagesListItems(dom);
            for (const item of items) {
                const link = await this.#getPagesListItemLink(item);
                console.log(this.#url);
                yield link;
            }

        } while (this.#url = await this.#getNextPage(dom));
    }

    async #getHtml(url) {
        const resp = await axios.get(url);
        return resp.data;
    }

    async #buildDom(html) {
        return new jsdom.JSDOM(html);
    }

    async #getPagesListItems(dom) {
        return dom.window.document.querySelector('.mso-pages-list').querySelectorAll('li');
    }

    async #getNextPage(dom) {
        console.log('getNextPage');
        const elPagination = dom.window.document.querySelector('.pagination-next');
        const nextPage = elPagination.getAttribute('href');
        console.log(nextPage);
        return nextPage;
    }

    async #getPagesListItemLink(liDom) {
        return liDom.querySelector('a').getAttribute('href');
    }
}