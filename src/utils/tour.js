// steps.js
export const steps = [
  {
    element: "#docText",
    popover: {
      title: "Document Area",
      description:
        "Please fill in the essential requirement at side panel first . \n Then click on Save requriemenet button to generate document",
      side: "left",
      align: "start",
    },
  },
  {
    element: "#reqPanel",
    popover: {
      title: "Requirements Area",
      description:
        "These are the requirements that are needed to generate the document , Please fill in to generate your document.",
      side: "left",
      align: "start",
    },
  },
  {
    element: "#Generate",
    popover: {
      title: "Generate Document",
      description:
        "After you've fill in the details Generate document by clicking on Generate Document button",
      side: "left",
      align: "start",
    },
  },
];
