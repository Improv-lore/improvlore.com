# ILxUC Calendar

*A Lightweight Eleventy Site with Automated Discourse Integration*

## Overview

ILxUC Calendar is a minimal static website for improvlore that blends manually authored content with automatically retrieved data from a Discourse forum(underline.center). It was built to support a specific workflow: maintaining a simple, public-facing calendar and topic index without using a CMS, database, or server‑side application. The system compiles all content with Eleventy and deploys to Vercel, while a scheduled GitHub Actions workflow fetches updated Discourse data and stores it as JSON for the next build.

## Features

* Automated daily ingestion of Discourse topics and posts
* File-based content model (Markdown + JSON only)
* Static site generation with Eleventy (11ty)
* Scheduled GitHub Actions build and deployment pipeline
* No client-side dependencies
* Hosted on Vercel with Web Analytics and Speed Insights

## Technology Stack

* **Eleventy (11ty)** for static site generation
* **Node.js** scripts for data retrieval
* **GitHub Actions** for automation
* **Vercel** for hosting and analytics
* **Markdown / JSON** as primary data formats


## Development

Install dependencies:

```bash
npm install
```

Run a local build:

```bash
npm run build
```

Start a local server:

```bash
npm run start
```

## Purpose

This project was created for a highly specific personal use case: merging forum activity and event information into a single static site that can be deployed and updated automatically. It highlights a compact architecture combining automated data ingestion, static generation, and cloud deployment without additional infrastructure or dependencies.
