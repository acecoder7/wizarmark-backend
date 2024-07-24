import asyncHandler from 'express-async-handler';
import { pipeline } from '@xenova/transformers';

// Function to initialize summarizer
async function initializeSummarizer() {
  const summarizer = await pipeline('summarization', undefined, {
    cache: {
      backend: 'fs',
      directory: '/tmp/.cache', // Writable directory in Vercel
      limit: 1000, // Adjust the cache size limit as needed
    },
  });
  return summarizer;
}

// Initialize summarizer
let summarizer;
initializeSummarizer().then((s) => {
  summarizer = s;
});

const summarize = asyncHandler(async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!summarizer) {
      await initializeSummarizer().then((s) => {
        summarizer = s;
      });
    }

    const summary = await summarizer(text);
    res.json({ summary: summary[0].summary_text });
  } catch (error) {
    console.error('Error while summarizing:', error);
    res.status(500).json({ error: 'Failed to summarize the text' });
  }
});

export { summarize };




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
