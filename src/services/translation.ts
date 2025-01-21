export const translateMessage = async (text: string, targetLang: string) => {
  try {
    const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a translator. Translate the following text to ${targetLang}:`
          },
          {
            role: "user",
            content: text
          }
        ]
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
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