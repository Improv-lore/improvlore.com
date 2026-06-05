// Computed meta for catalog.njk. Set as plain strings (not Nunjucks
// templated values) so the base layout's meta tags escape them exactly
// once. Templating these in front matter double-escapes apostrophes.

export default {
  eleventyComputed: {
    title: (data) => (data.fmt ? `${data.fmt.title} – Improvlore` : data.title),
    pageDescription: (data) => (data.fmt ? data.fmt.blurb : data.pageDescription),
    pageImage: (data) => (data.fmt ? data.fmt.image : data.pageImage),
  },
};
