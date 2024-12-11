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

const splitTextIntoPages = (text, linesPerPage) => {
  const lines = text.split("  ");
  //   console.log(lines);
  const pages = [];

  for (let i = 0; i < lines.length; i += linesPerPage) {
    const pageLines = lines.slice(i, i + linesPerPage);
    pages.push(pageLines.join("\n\n"));
  }
  //   console.log(pages);
  return pages;
};

const LINES_PER_PAGE = 25;

const MyDocument = ({ pdfDownloadText }) => {
  //   console.log(pdfDownloadText);
  const pages = splitTextIntoPages(pdfDownloadText, LINES_PER_PAGE);

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
            <Text style={styles.text}>{pageContent}</Text>
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
