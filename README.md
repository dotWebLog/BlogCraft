# BlogCraft

A beautiful, modern, and fully-featured blogging system built with React, TypeScript, and Tailwind CSS. BlogCraft lets you write, manage, and export your blog as static HTML files—perfect for hosting on GitHub Pages or any static site host.

## Features

- ✍️ **Rich Post Editor**: Create, edit, and manage blog posts with markdown support.
- 🗂 **Post Management**: Organize posts by published/draft status, category, and tags.
- 🏷 **Categories & Tags**: Easily categorize and tag your posts for better organization.
- 📰 **Sidebar Archive**: Automatic archive by year/month, showing the 15 most recent posts.
- 🎨 **Customizable Blog Settings**: Set your blog’s title, description, author, URL, and theme.
- 💡 **Advertisement Management**: Add, edit, and preview ads—including support for custom HTML/JavaScript (e.g., Google AdSense).
- 📦 **One-Click Export**: Export your entire blog (index, posts, README) as a zip file for easy deployment.
- 👀 **Visitor Tracking**: Built-in script to log visitor IP, browser, and page URL to a custom endpoint.
- ⚡ **No Backend Required**: All data is stored in your browser and exported as static files.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```bash
git clone <your-repo-url>
cd <your-repo-directory>
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

- **Write Posts**: Use the editor to create and manage posts.
- **Configure Blog**: Go to Settings to update blog info and manage ads.
- **Add Ads**: Paste custom ad code (e.g., Google AdSense) in the “Custom Script/HTML” field for any ad.
- **Export Blog**: Click “Download HTML Files” to export your blog as static HTML (ready for GitHub Pages).

## Export & Deployment

1. Click “Download HTML Files” in the app.
2. Unzip the downloaded file.
3. Upload all files to your GitHub repository (or any static host).
4. Enable GitHub Pages in your repo settings.
5. Your blog will be live at your configured URL!

## File Structure

```
├── index.html          # Main blog homepage
├── [post-slug].html    # Individual blog posts
├── README.md           # This file
└── ...                 # Source code
```

## Security Notes

- **Custom Ad Scripts**: Only use trusted code in the “Custom Script/HTML” field for ads. This is injected as raw HTML/JS.
- **Visitor Tracking**: The default tracking script logs visitor info to a custom endpoint. You can change or remove this in `src/utils/export.ts`.

## License

MIT

---

Generated with **BlogCraft** – A modern blogging system for GitHub Pages. 