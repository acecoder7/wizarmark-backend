import asyncHandler from 'express-async-handler';
import { LanguageServiceClient } from '@google-cloud/language';
import { pipeline } from '@xenova/transformers';

let summarizer;

async function initializeSummarizer() {
  summarizer = await pipeline('summarization', undefined, {
    cache: {
      backend: 'fs',
      directory: '/tmp/.cache', // Vercel's writable path
      limit: 1000,
    },
  });
}

// Middleware to ensure summarizer is initialized
const ensureSummarizerInitialized = asyncHandler(async (req, res, next) => {
  if (!summarizer) {
    await initializeSummarizer();
  }
  next();
});

const summarize = asyncHandler(async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const summary = await summarizer(text);
    res.json({ summary: summary[0].summary_text });
  } catch (error) {
    console.error('Error while summarizing:', error);
    res.status(500).json({ error: 'Failed to summarize the text' });
  }
});

export { summarize, ensureSummarizerInitialized };



// // Set the environment variable to the path of your service account key file
// process.env.GOOGLE_APPLICATION_CREDENTIALS = './clever-spirit-428116-t2-b8f1de5e7362.json';

// const client = new LanguageServiceClient();

// const classify = asyncHandler(async (req, res) => {
//     try {
//         const { text } = req.body;

//         const document = {
//             content: text,
//             type: 'PLAIN_TEXT',
//         };

//         const classificationModelOptions = {
//             v2Model: {
//               contentCategoriesVersion: 'V2',
//             },
//         };

//         const [classification] = await client.classifyText({
//             document,
//             classificationModelOptions,
//         });

//         const categories = classification.categories.map(category => ({
//             name: category.name,
//             confidence: category.confidence,
//         }));

//         console.log('Categories:', categories);
//         res.json({ categories });

//     } catch (error) {
//         console.error('Error classifying text:', error);
//         res.status(500).json({ error: 'Error classifying text' });
//     }
// });


// const summarizer = await pipeline('summarization');

// const summarize = asyncHandler(async (req, res) => { 
//         try {
//           const { text } = req.body;
//           if (!text) {
//             return res.status(400).json({ error: 'Text is required' });
//           }
      
//           const summary = await summarizer(text);
          
//           res.json({ summary: summary[0].summary_text });
//         } catch (error) {
//           console.error('Error while summarizing:', error);
//           res.status(500).json({ error: 'Failed to summarize the text' });
//         }
// });

// export { summarize };
