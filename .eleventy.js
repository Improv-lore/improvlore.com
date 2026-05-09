export default function(eleventyConfig) {
    const buildTime = process.env.BUILD_TIME
      || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });
    eleventyConfig.addGlobalData("buildTime", buildTime);
    eleventyConfig.addPassthroughCopy({"src/assets": "assets"});
    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "layouts"
        }
    };
}
