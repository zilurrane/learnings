import { Document } from "langchain/document";
import { crawlLangchainDocsUrls } from "./crawlDocuments";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import cliProgress from "cli-progress";

const progressBar = new cliProgress.SingleBar({});
export async function loadDocuments(): Promise<Document[]> {
    const langchainDocsUrls = await crawlLangchainDocsUrls();
    console.log(`Starting to load ${langchainDocsUrls.length} documents...`);
    const rawDocuments: Document[] = [];
    progressBar.start(langchainDocsUrls.length, 0);
    for (const url of langchainDocsUrls) {
        const loader = new CheerioWebBaseLoader(url);
        const docs = await loader.load();
        rawDocuments.push(...docs);
        progressBar.increment();
    }
    progressBar.stop();
    console.log(`Loaded ${rawDocuments.length} documents from Langchain documentation.`);
    return rawDocuments;
}

const rawDocuments = await loadDocuments();
