/* eslint-disable lines-around-comment */
// "pdf-img-convert" needs canvas
// brew install pkg-config cairo pango libpng jpeg giflib librsvg
// https://github.com/Automattic/node-canvas/issues/1733
// import { convert } from "pdf-img-convert"
import My from "./../Flows/My"; // Not sure why require("./My")['default'] will give undefined but if use import, it works OK
const fs = require('fs');

// https://medium.com/bosphorusiss/verify-pdf-contents-using-playwright-and-node-js-dd3cf6749f70
// https://www.reddit.com/r/AskProgramming/comments/10sy9l9/converting_pdf_into_html_is_it_possble/
// https://www.npmjs.com/package/pdf2html
// https://docs.apryse.com/documentation/core/guides/features/conversion/convert-pdf/
// https://github.com/mozilla/pdf.js
// https://stackoverflow.com/questions/17586524/convert-pdf-to-a-single-page-editable-html
// https://screenshotone.com/blog/a-complete-guide-on-how-to-take-full-page-screenshots-with-puppeteer-playwright-or-selenium/
// https://stackoverflow.com/questions/15341010/render-pdf-to-single-canvas-using-pdf-js-and-imagedata
// PDF.js built web files: https://youtu.be/TstpR_gGb-4
class PdfHelper {

  static async downloadAndGetFilePath(page: any, clickLocator: any, options?): Promise<string> {
    if (!options) { options = {} }
    if (options.verifyPdfExtension === undefined) { options.verifyPdfExtension == false }

    // Navigate to a URL that serves a PDF file
    // Wait for the download event and click on a link to download the PDF file
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      clickLocator.click()
    ]);

    // Use the suggested filename from the download event to save the file
    const suggestedFileName = `${new Date().toISOString()}-${download.suggestedFilename()}`;
    const filePath = 'ExportData/' + suggestedFileName;
    await download.saveAs(filePath);
    // return 'ExportData/2024-03-07T18:27:09.709Z-65e7de1f7abe7db8468a140c.pdf'
    return filePath
  }

  // The following needs npm install global serve: Screenshot doesn't take the full page...
  /*
  PDFJS is great and it rendered things correctly.
  However, the radios, checkboxes, etc. and structure cannot be used to query well (find which answer belongs to which question),
  and the screenshots doesn't get the full page...
  it's just easier to use the pdf-img-convert library and do testing on the PDF's extracted content for now I think.

  Observations: Saw paragraphs being broken up into phrases in <span>
  Questions are consective spans next to each other and Answers are consecutive spans next to each other
  instead of grouped together for xpath querying...
  */
  static async downloadPdfAndOpen(context: any, page: any, clickLocator: any): Promise<string> {
    const tcs = My.TestInfo.data.tcs
    const filePath = await PdfHelper.downloadAndGetFilePath(page, clickLocator)

    const newPage = await context.newPage()
    await newPage.goto(`http://localhost:3000/shared-libs/pdfjs-dist/modern/web/viewer?rFile=playwright/${filePath}`)
    return newPage
  }

  static async downloadPdfAndGetContent(context: any, page: any, clickLocator: any, options?): Promise<string> {
    const tcs = My.TestInfo.data.tcs
    if (!options) { options = {} }
    // Saw that some eConsent have many pages... don't want to generate a bunch of OEs, etc. if not needed
    if (!options.stopAtPage) { options.stopAtPage = 3 }
    if (!options.maxStringLength) { options.maxStringLength = 5000 * 5 }
    if (options.verifyPdfExtension === undefined) { options.verifyPdfExtension == false }

    const filePath = await PdfHelper.downloadAndGetFilePath(page, clickLocator, options)

    /*
    // Use the 'pdf-parse' module to extract the text from the PDF file
    var pdf = require('pdf-parse');
    const outputImages = await convert(filePath);
    await Promise.all(outputImages.map(async (image, i) => {
      const uniquePath = My.OE.generatePath(tcs)
      if (i >= options.stopAtPage) { return uniquePath }
      fs.writeFileSync(uniquePath, image);
      return uniquePath
    }));
    */

    var dataBuffer = fs.readFileSync(filePath);
    let pdfContent = ''
    await pdf(dataBuffer).then(function (data) {
      pdfContent += data.text
    });

    // Can open pdfContent but the text are 1 paragraph
    const newPage = await My.CommonFlows.renderContent(context, My.Constants.URL_PDF, pdfContent)
    await newPage.close()

    return pdfContent
  }

}

export { PdfHelper }
