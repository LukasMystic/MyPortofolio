import fetch from 'node-fetch';

export const translateText = async (req, res) => {
  // Now expecting an object of texts to translate, and the target language
  const { content, targetLanguage } = req.body;

  if (!content || !targetLanguage) {
    return res.status(400).json({ message: 'Content object and target language are required.' });
  }

  // A more advanced prompt for batch translation. We send JSON and ask for JSON back.
  const prompt = `Translate the JSON object below into ${targetLanguage}. 
  Maintain the exact same JSON structure and keys. 
  Only translate the string values.
  Do not add any extra commentary or markdown formatting. 
  Return only the translated JSON object.

  ${JSON.stringify(content, null, 2)}`;
  
  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  try {
    const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { 
                temperature: 0.2,
                responseMimeType: "application/json", // We explicitly ask for a JSON response
            }
        })
    });

    if (!apiResponse.ok) {
        const errorBody = await apiResponse.text();
        throw new Error(`API call failed with status: ${apiResponse.status} - ${errorBody}`);
    }

    const result = await apiResponse.json();
    const translatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (translatedText) {
      // The API returns a stringified JSON, so we parse it before sending back
      const translatedContent = JSON.parse(translatedText);
      res.json({ translatedContent });
    } else {
      console.error("Batch translation failed or response malformed:", result);
      res.status(500).json({ message: 'Failed to get a valid batch translation.' });
    }
  } catch (error) {
    console.error('Error in batch translation controller:', error);
    res.status(500).json({ message: 'Translation service error' });
  }
};

