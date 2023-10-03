import axios from 'axios';
import jsdom from 'jsdom';

export default class ItemPage {
    #url;

    constructor($url) {
        this.#url = $url;
    }

    async parse() {
        const html = await this.#getHtml(this.#url);
        const dom = await this.#buildDom(html);
        const titleRaw = await this.#getTitleRaw(dom);
        const title = await this.#getTitleText(titleRaw);
        const author = await this.#getAuthorText(titleRaw);
        const dateAdded = await this.#getDateAddedDate(dom);
        const content = await this.#getContent(dom);
        const categories = await this.#getCategories(dom);

        return {
            title: title,
            author: author,
            data: content.innerHTML,
            dateAdded: dateAdded,
            categories: categories,
        }
    }

    async #getHtml(url) {
        const resp = await axios.get(url);
        return resp.data;
    }

    async #buildDom(html) {
        return new jsdom.JSDOM(html);
    }

    async #getTitleRaw(dom) {
        return dom.window.document.querySelector('article > header > h1');
    }

    async #getTitleText(titleDom) {
        return titleDom.textContent.replace(/\s\(([^()]+)\)/, '');
    }

    async #getAuthorText(titleDom) {
        const author = titleDom.textContent.match(/\(([^()]+)\)/);
        return author[1] ?? null;
    }

    async #getDateAddedDate(dom) {
        const elDateAdded = dom.window.document.querySelector('article .im-calendar');
        const dateAddedString = elDateAdded.getAttribute('datetime');
        return new Date(dateAddedString);
    }

    async #getContent(dom) {
        const elContent = dom.window.document.querySelector('article .mso-page-content').cloneNode(true);
        let documentElement = dom.window.document.createElement('div');
        const children = Array.from(elContent.childNodes);
        let captureFlag = false;
        for (const el of children) {
            if (el.nodeName === 'BR') {
                captureFlag = !captureFlag;
            }
            if (true === captureFlag) {
                documentElement.appendChild(el);
            }
        }
        return documentElement;
    }

    async #getCategories(dom) {
        const elCategories = dom.window.document.querySelectorAll('.breadcrumbs > a');
        let categories = [];
        for (const elCategory of elCategories) {
            console.log(elCategory.textContent);
            categories.push(elCategory.textContent);
        }
        console.log(categories);
        return categories;
    }
}