import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Pinecone, PineconeClient } from "@pinecone-database/pinecone";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { CharacterTextSplitter } from "langchain/text_splitter";

// Example: https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/pdf
export default async function handler(req, res) {
  if (req.method === "GET") {
    console.log("Inside the PDF handler");
    // Enter your code here
    /** STEP ONE: LOAD DOCUMENT */
    const loader = new PDFLoader("src/data/masud.pdf");
    const docs = await loader.load();
    if (docs.length === 0) {
      console.log("No documents found.");
      return;
    }
    // Chunk it
    const splitter = new CharacterTextSplitter({
      separator: " ",
      chunkSize: 250,
      chunkOverlap: 10,
    });
    const splitDocs = await splitter.splitDocuments(docs)
    // Reduce the size of the metadata
    const reducedDocs = splitDocs.map(doc=>{
      let metadata = {...doc.metadata}
      delete metadata.pdf
      doc.metadata = metadata
      return new Document({
        pageContent: doc.pageContent,
        metadata
      });
    })
    /** STEP TWO: UPLOAD TO DATABASE */
    const pinecone = new PineconeClient();

    await pinecone.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    });
   
    // const pineconeIndex = await pinecone.Index(process.env.PINECONE_INDEX)
    // const dbres = await PineconeStore.fromDocuments(reducedDocs, new OpenAIEmbeddings(), {
    //   pineconeIndex
    // })
    // console.log(dbres, 'dbres2');
    // upload documents to Pinecone
    return res.status(200).json({ result: reducedDocs });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
