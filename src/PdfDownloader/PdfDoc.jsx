import React from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import clawImage from "../assets/icons/gptclaw.png";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
    // paddingTop: 50,
    position: "relative",
    border: "2px solid #008080",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 12,

    // marginBottom: 10,
  },
  imageContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.3,
  },
  watermark: {
    position: "absolute",
    opacity: 0.3,
    top: "40%",
    left: "10%",
    width: "80%",
    height: "30%",
    zIndex: -1,
  },
});

// const splitTextIntoPages = (text, linesPerPage) => {
//   const lines = text.split("  ");
//   //   console.log(lines);
//   const pages = [];

//   for (let i = 0; i < lines.length; i += linesPerPage) {
//     const pageLines = lines.slice(i, i + linesPerPage);
//     pages.push(pageLines.join("\n\n"));
//   }
//   //   console.log(pages);
//   return pages;
// };

// const LINES_PER_PAGE = 25;
const splitTextByNewline = (text) => {
  console.log(text.split("\\n"));
  return text.split("\\n"); // Split text by \n for rendering new lines
};

const splitTextIntoPages = (text, wordsPerPage) => {
  // Split the text into words
  const words = text.split(/\s+/); // Split by any whitespace
  const pages = [];

  // Iterate through words and split into pages
  for (let i = 0; i < words.length; i += wordsPerPage) {
    const pageWords = words.slice(i, i + wordsPerPage);
    pages.push(pageWords.join(" ")); // Join words into a single string
  }

  return pages;
};

// Example usage
const text = `Your long text goes here. It should be sufficiently long to demonstrate the splitting into pages with 160 words per page. Repeat this content or use a larger block of text to see the effect.`;
const wordsPerPage = 900;

const MyDocument = ({ pdfDownloadText }) => {
  //   console.log(pdfDownloadText);
  const pages = splitTextIntoPages(pdfDownloadText, wordsPerPage);

  return (
    <Document>
      {pages.map((pageContent, index) => (
        <Page key={index} size="A4" style={styles.page}>
          {/* <Text className="font-extrabold" style={styles.watermark}>
            CLAW
            </Text> */}
          <View style={styles.imageContainer}>
            <Image style={styles.watermark} src={clawImage} />
          </View>

          <View>
            {splitTextByNewline(pageContent).map((line, lineIndex) => {
              return (
                <Text key={lineIndex} style={styles.text}>
                  {line}
                </Text>
              );
            })}
          </View>
        </Page>
      ))}
    </Document>
  );
};

const PDFDownloadButton = ({ pdfDownloadText }) => {
  console.log(pdfDownloadText);
  return (
    <div>
      <PDFDownloadLink
        document={<MyDocument pdfDownloadText={pdfDownloadText} />}
        fileName="summary.pdf"
        style={{
          textDecoration: "none",
          color: "#fff",
          padding: "10px",
          backgroundColor: "transparent",
          border: "1px solid white",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {({ blob, url, loading, error }) =>
          loading ? "Preparing document..." : "Download PDF"
        }
      </PDFDownloadLink>
    </div>
  );
};

export default PDFDownloadButton;
