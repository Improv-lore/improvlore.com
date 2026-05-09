export async function transformCalendar(rawData) {
  const now = new Date();

  const upcomingImprov = rawData.topic_list.topics.filter(topic =>
    topic.title.toLowerCase().includes("improv") &&
    topic.event_starts_at &&
    new Date(topic.event_starts_at) > now
  );

  const results = await Promise.all(
    upcomingImprov.map(async (topic) => {
      try {
        const res = await fetch(`https://underline.center/t/${topic.slug}/${topic.id}.json`);
        const json = await res.json();
        const first_post = json.post_stream.posts[0];

        return {
          title: topic.title,
          excerpt: topic.excerpt,
          full_content: first_post.raw,
          image_url: topic.image_url,
          thumbnails: topic.thumbnails,
          event_starts_at: topic.event_starts_at,
          event_ends_at: topic.event_ends_at,
          featured_link: topic.featured_link,
          slug: topic.slug,
          url: first_post.event?.url,
          learn_more: `https://underline.center/t/${topic.slug}/${topic.id}`,
          venue: "Underline Center, Indiranagar",
          tags: ["UC"]
        };
      } catch {
        return null;
      }
    })
  );

  return results.filter(Boolean);
}
