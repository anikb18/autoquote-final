export const translateMessage = async (text: string, targetLang: string) => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Translate the following text to ${targetLang}:\n\n${text}`
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Unexpected Gemini API response:', data);
      return text;
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

export const translateBlogPost = async (post: { title: string; content: string; excerpt: string }, targetLang: string) => {
  try {
    const [translatedTitle, translatedContent, translatedExcerpt] = await Promise.all([
      translateMessage(post.title, targetLang),
      translateMessage(post.content, targetLang),
      translateMessage(post.excerpt, targetLang)
    ]);

    return {
      title: translatedTitle,
      content: translatedContent,
      excerpt: translatedExcerpt
    };
  } catch (error) {
    console.error('Blog post translation error:', error);
    return post;
  }
};