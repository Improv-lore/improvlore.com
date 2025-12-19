export async function transformCalendar(rawData) {

  function toIST(timestr) {
    if (!timestr) return null;
    const utc = new Date(timestr + " UTC");
    return utc.toLocaleString("en-CA", {
      timeZone: "Asia/Kolkata",
      hour12: false
    }).replace(",", "");
  }

  const data_improv = [];

  for (const topic of rawData.topic_list.topics) {
    if (!topic.title.toLowerCase().includes("improv")) continue;

    const topic_id = topic.id;
    const slug = topic.slug;
    const date = new Date (topic.event_starts_at);
    const now = new Date();
    if (date.getDate() < now.getDate()) continue;  // skip past events
    
    // fetch detailed topic JSON
    const detail_url = `https://underline.center/t/${slug}/${topic_id}.json`;
    const detail = await (await fetch(detail_url)).json();
    const first_post = detail.post_stream.posts[0];
   
    data_improv.push({
      title: topic.title,
      "fancy title": topic.fancy_title,
      excerpt: topic.excerpt,
      full_content: first_post.raw,
      image_url: topic.image_url,
      thumbnails: topic.thumbnails,
      event_starts_at: toIST(topic.event_starts_at),
      event_ends_at: toIST(topic.event_ends_at),
      featured_link: topic.featured_link,
      slug,
      url: first_post.event.url,
    });
  }

  return data_improv;
}
