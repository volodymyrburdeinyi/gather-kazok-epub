import ItemPage from './modules/ItemPage.js';
import L1Page from './modules/L1Page.js';
import PagesStorage from './modules/PagesStorage.js';

async function init() {
    const pagesStorage = new PagesStorage();
    await pagesStorage.init();

    const l1Url = process.env.L1_URL;
    const urlGenerator = (new L1Page(l1Url)).parse();

    const limit = 2000;
    let counter = 0;

    for await (const itemPageUrl of urlGenerator) {
        console.log(itemPageUrl);
        const pageAlreadyExists = await pagesStorage.getPageByUrl(itemPageUrl);

        if (!pageAlreadyExists) {
            try {
                const pipData = await (new ItemPage(itemPageUrl)).parse();


                await pagesStorage.createPage(
                    itemPageUrl,
                    pipData.title,
                    pipData.author,
                    pipData.dateAdded,
                    pipData.data,
                    pipData.categories[0],
                    pipData.categories[1],
                    pipData.categories[2],
                    pipData.categories[3] ?? pipData.categories[2]
                );

                await waitRandom();
            } catch (e) {
                console.log(e, itemPageUrl);
            }
        }

        counter++;
        if (limit <= counter) {
            break;
        }
    }
}

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitRandom() {
    const ms = Math.random() * 1000;
    return wait(ms);
}

init();