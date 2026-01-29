const head = document.head;



/* ---------- LINKS ---------- */
const links = [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: true },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" },
  { rel: "icon", href: "/assets/beth-circle.png", type: "image/x-icon" },
   { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Chewy&display=swap" },
];

links.forEach(attrs => {
  const link = document.createElement("link");
  Object.assign(link, attrs);
  head.appendChild(link);
});



// /* ---------- SCRIPTS ---------- */
// const scripts = [
//   "https://cdn.jsdelivr.net/npm/marked/marked.min.js",
//   "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js",
//   "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js",
//   "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js",
// "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-java.min.js",
// "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-cpp.min.js",
// "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-html.min.js",
// "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-css.min.js",
// "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js"
// ];

// scripts.forEach(src => {
//   const script = document.createElement("script");
//   script.src = src;
//   // script.defer = true; // safe & non-blocking
//   head.appendChild(script);
// });



