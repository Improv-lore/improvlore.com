export default function(eleventyConfig) {
    eleventyConfig.addGlobalData("buildTime", process.env.BUILD_TIME || new Date().toISOString());
    eleventyConfig.addPassthroughCopy({"src/assets": "assets"});
    eleventyConfig.addPassthroughCopy("output.json");


    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "layouts"
        }
    };
}
