export const NODE_API_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://enterprises-adira-backend.onrender.com/api/v1"
    : "http://localhost:8000/api/v1";
export const LEGAL_GPT_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://clawlaw-dev.netlify.app"
    : "http://localhost:4000";

export function formatAgreementText(text) {
  return (
    text
      // Convert newlines to <br />
      .replace(/\n/g, "<br />")

      // Convert tabs to four non-breaking spaces
      .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")

      // Convert multiple spaces to non-breaking spaces
      .replace(/ {2,}/g, (match) => "&nbsp;".repeat(match.length))

      // Convert greater-than, less-than, and ampersand to HTML entities
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")

      // Convert double quotes to HTML entities to prevent issues with attributes
      .replace(/"/g, "&quot;")

      // Convert single quotes to HTML entities to prevent issues with attributes
      .replace(/'/g, "&#39;")
  );
}

export function trimQuotes(text) {
  if (text.startsWith('"') && text.endsWith('"')) {
    return text.slice(1, -1).replace(/"/g, "'");
  }
  return text.replace(/"/g, "'");
}

export const formatText = (text) => {
  return text
    .replace(/\\n\\n/g, "<br/><br/>") // Ensure two \n result in a new paragraph
    .replace(/\\n/g, "  <br/>")

    .replace(/\u20b9/g, "₹")
    .replace(/\\u20b9/g, "₹"); // Ensure single \n is treated as a line break
};

export const formatPdfText = (text) => {
  return (
    text
      // .replace(/\\n\\n/g, "  ") // Ensure two \n result in a new paragraph
      // .replace(/\\n/g, " ")
      .replace(/\u20B9/g, "₹")
  ); // Ensure single \n is treated as a line break
};
