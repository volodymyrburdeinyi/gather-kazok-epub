import { EPub } from "@lesjoursfr/html-to-epub";
import PagesStorage from "./modules/PagesStorage.js";
async function init() {
    // const category_l2 = 'Українські народні казки';
    // const category_l2 = 'Казки українських авторів';
    // const category_l2 = 'Казки народів світу';
    const category_l2 = 'Казки авторів світу';

    const storage = new PagesStorage();
    await storage.init();

    const pages = await storage.getAllPages(category_l2);

    let content = [];
    for await (const page of pages) {
        content.push({
            title: page.title,
            author: page.author,
            data: page.content,
        });
    }

    const options = {
        cover: 'https://derevo-kazok.org/uploads/tale-img/derevo-kazok.png',
        tocTitle: 'Зміст',
        lang: 'uk',
        title: category_l2,
        author: 'derevo-kazok.org',
        content: content,
        verbose: true,
    }

    // const epubObject = new epub(options, 'output.epub');
    const epub = new EPub(options, 'output.epub');
    epub.render()
        .then(() => {
            console.log("Ebook Generated Successfully!");
        })
        .catch((err) => {
            console.error("Failed to generate Ebook because of ", err);
        });
}

init();