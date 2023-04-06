const express = require("express");
const fs = require("fs");
const info = require("./info.json");

const app = express();
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const pdfs = fs.readdirSync("pdfs/");
  res.render("index.ejs", { pdfs });
});

app.get("/pdf/:name", (req, res) => {
  const pdf = req.params.name;

  if (!pdf) return res.redirect("/");
  if (fs.existsSync(`pdfs/${pdf}`) == false) return res.redirect("/");

  var desc = info[pdf.slice(0, -4)];

  res.render("pdf.ejs", { pdf, desc });
});

app.use("/pdfs", express.static("pdfs"));
app.use("/static", express.static("static"));

app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.sendFile(__dirname + "/robots.txt");
});

app.get("/sitemap.xml", (req, res) => {
  var text = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://www.spectral.host/</loc>
      <lastmod>2023-27-03</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
  `;
  const pdfs = fs.readdirSync("pdfs/");
  pdfs.forEach((pdf) => {
    text += `
    <url>
      <loc>https://www.spectral.host/pdfs/${pdf}</loc>
      <lastmod>2023-27-03</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
    `;
  });

  text += `</urlset>`;

  res.header("Content-Type", "application/xml");

  res.send(text);
});

const port = 8888;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
