using MigraDoc.DocumentObjectModel;
using MigraDoc.DocumentObjectModel.Shapes;
using MigraDoc.DocumentObjectModel.Tables;
using MigraDoc.Rendering;
using MigraDoc.RtfRendering;
using PdfSharp.Pdf;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.XPath;

namespace WMpp
{
    public class zaPDF
    {


        Color tableBorder  = new Color(81, 125, 192);
        Color tableBlue  = new Color(235, 240, 249);
        Color tableGray = new Color(242, 242, 242);
        static List<WMpp.SEClasses.rezultati> sReza = new List<SEClasses.rezultati>();
        public class kolumne 
        {
            public string ime { get; set; }
            public string sirina { get; set; }
            public ParagraphAlignment PA { get; set; }
        }


        public void MakePdf(string imeDatoteke, List<WMpp.SEClasses.rezultati> reza)
        {
            
            sReza = reza;
              // Create a MigraDoc document
              Document document = CreateDocument();
              document.UseCmykColor = true;
              

              

              // ===== Unicode encoding and font program embedding in MigraDoc is demonstrated here =====

              // A flag indicating whether to create a Unicode PDF or a WinAnsi PDF file.
              // This setting applies to all fonts used in the PDF document.
              // This setting has no effect on the RTF renderer.
              const bool unicode = false;

              // An enum indicating whether to embed fonts or not.
              // This setting applies to all font programs used in the document.
              // This setting has no effect on the RTF renderer.
              // (The term 'font program' is used by Adobe for a file containing a font. Technically a 'font file'
              // is a collection of small programs and each program renders the glyph of a character when executed.
              // Using a font in PDFsharp may lead to the embedding of one or more font programms, because each outline
              // (regular, bold, italic, bold+italic, ...) has its own fontprogram)
              const PdfFontEmbedding embedding = PdfFontEmbedding.Always;

              // ========================================================================================

              // Create a renderer for the MigraDoc document.
              PdfDocumentRenderer pdfRenderer = new PdfDocumentRenderer(unicode, embedding);
            
                /// <summary>

              //RtfDocumentRenderer rtf = new RtfDocumentRenderer();
              //var rPath = System.Web.HttpContext.Current.Server.MapPath("~/Content/" + imeDatoteke);
              //rtf.Render(document, rPath, null);



              // Associate the MigraDoc document with a renderer
              pdfRenderer.Document = document;

              // Layout and render document to PDF
              pdfRenderer.RenderDocument();

              // Save the document...
              string filename = imeDatoteke;// "HelloWorld.pdf";
              var path = System.Web.HttpContext.Current.Server.MapPath("~/Content/" + imeDatoteke);
              pdfRenderer.PdfDocument.Save(path);
              // ...and start a viewer.
            //  Process.Start(filename);

}

       


        public Document CreateDocument()
        {
            // Create a new MigraDoc document
            var document = new Document();
            document.Info.Title = "A sample invoice";
            document.Info.Subject = "Demonstrates how to create an invoice.";
            document.Info.Author = "Stefan Lange";
 

           // pageSetup.PageFormat = PageFormat.A5;

            DefineStyles(document);
           
            CreatePage(document);
            
            FillContent(document);
            
            return document;
        }

        void DefineStyles(Document document)
        {
            // Get the predefined style Normal.
            Style style = document.Styles["Normal"];
            // Because all styles are derived from Normal, the next line changes the 
            // font of the whole document. Or, more exactly, it changes the font of
            // all styles and paragraphs that do not redefine the font.
            style.Font.Name = "Verdana";
            
            style = document.Styles[StyleNames.Header];
            style.ParagraphFormat.AddTabStop("16cm", TabAlignment.Right);
            
            style = document.Styles[StyleNames.Footer];
            style.ParagraphFormat.AddTabStop("8cm", TabAlignment.Center);
            
            // Create a new style called Table based on style Normal
            style = document.Styles.AddStyle("Table", "Normal");
            style.Font.Name = "Verdana";
            style.Font.Name = "Times New Roman";
            style.Font.Size = 9;
            
            // Create a new style called Reference based on style Normal
            style = document.Styles.AddStyle("Reference", "Normal");
            style.ParagraphFormat.SpaceBefore = "5mm";
            style.ParagraphFormat.SpaceAfter = "5mm";
            style.ParagraphFormat.TabStops.AddTabStop("16cm", TabAlignment.Right);
        }


        void CreatePage(Document document)
        {

            PageSetup pageSetup = document.DefaultPageSetup.Clone();
            pageSetup.Orientation = Orientation.Landscape;
            // Each MigraDoc document needs at least one section.
            Section section = document.AddSection();
            section.PageSetup = pageSetup;
            // Put a logo in the header
            //var logoPath = System.Web.HttpContext.Current.Server.MapPath("~/Content/images/logo.png"); 
            //Image image = section.Headers.Primary.AddImage(logoPath);
            //image.Height = "2.5cm";
            //image.LockAspectRatio = true;
            //image.RelativeVertical = RelativeVertical.Line;
            //image.RelativeHorizontal = RelativeHorizontal.Margin;
            //image.Top = ShapePosition.Top;
            //image.Left = ShapePosition.Right;
            //image.WrapFormat.Style = WrapStyle.Through;
           
            // Create footer
            //Paragraph paragraph = section.Footers.Primary.AddParagraph();
            //paragraph.AddText("Link2· Sample Street 42 · 56789 Cologne · Germany");
            //paragraph.Format.Font.Size = 9;
            //paragraph.Format.Alignment = ParagraphAlignment.Center;
           
            // Create the text frame for the address
            //TextFrame addressFrame = section.AddTextFrame();
            //addressFrame.Height = "3.0cm";
            //addressFrame.Width = "7.0cm";
            //addressFrame.Left = ShapePosition.Left;
            //addressFrame.RelativeHorizontal = RelativeHorizontal.Margin;
            //addressFrame.Top = "5.0cm";
            //addressFrame.RelativeVertical = RelativeVertical.Page;
            
            // Put sender in address frame
            //paragraph = addressFrame.AddParagraph("Link2 doo · Sample Street 42 · 56789 Cologne");
            //paragraph.Format.Font.Name = "Times New Roman";
            //paragraph.Format.Font.Size = 7;
            //paragraph.Format.SpaceAfter = 3;
            
            // Add the print date field
            //paragraph = section.AddParagraph();
            //paragraph.Format.SpaceBefore = "8cm";
            //paragraph.Style = "Reference";
            //paragraph.AddFormattedText("INVOICE", TextFormat.Bold);
           // paragraph.AddTab();
            //paragraph.AddText("Zagreb, ");
            //paragraph.AddDateField("dd.MM.yyyy");
            
            // Create the item table
            Table table = section.AddTable();
            table.Style = "Table";
            table.Borders.Color = tableBorder;
            table.Borders.Width = 0.25;
            table.Borders.Left.Width = 0.5;
            table.Borders.Right.Width = 0.5;
            table.Rows.LeftIndent = 0;


            var  stupci = new List<kolumne>();
            var stupac = new kolumne();
            stupac.ime = "b.r.";
            stupac.sirina = "0.5cm";
            stupac.PA = ParagraphAlignment.Center;
            stupci.Add(stupac);

            stupac = new kolumne();
            stupac.ime = "Inv. oznaka";
            stupac.sirina = "4cm";
            stupac.PA = ParagraphAlignment.Center;
            stupci.Add(stupac);

            stupac = new kolumne();
            stupac.ime = "Vrsta / Naziv";
            stupac.sirina = "2.5cm";
            stupac.PA = ParagraphAlignment.Center;
            stupci.Add(stupac);

            stupac = new kolumne();
            stupac.ime = "Naslov";
            stupac.sirina = "3cm";
            stupac.PA = ParagraphAlignment.Center;
            stupci.Add(stupac);

            stupac = new kolumne();
            stupac.ime = "Autor";
            stupac.sirina = "3.5cm";
            stupac.PA = ParagraphAlignment.Center;
            stupci.Add(stupac);

            stupac = new kolumne();
            stupac.ime = "Datacija";
            stupac.sirina = "3.5cm";
            stupac.PA = ParagraphAlignment.Center;
            stupci.Add(stupac);

            stupac = new kolumne();
            stupac.ime = "Mjere";
            stupac.sirina = "3.5cm";
            stupac.PA = ParagraphAlignment.Center;
            stupci.Add(stupac);

            stupac = new kolumne();
            stupac.ime = "Mat. teh.";
            stupac.sirina = "3.5cm";
            stupac.PA = ParagraphAlignment.Center;
            stupci.Add(stupac);

            stupac = new kolumne();
            stupac.ime = "Zbirka";
            stupac.sirina = "3.5cm";
            stupac.PA = ParagraphAlignment.Center;
            stupci.Add(stupac);


            Column column;


            foreach (var kol in stupci)
            {
                column = table.AddColumn(kol.sirina);
                column.Format.Alignment = kol.PA;
            }

            Row row = table.AddRow();
            row.HeadingFormat = true;
            row.Format.Alignment = ParagraphAlignment.Center;
            row.Format.Font.Bold = true;
            row.Shading.Color = tableGray;

            int i = 0;    
            foreach (var kol in stupci)
            {
                row.Cells[i].AddParagraph(kol.ime);
                
                i++;
            }


  


            // Create the header of the table
            //Row row = table.AddRow();
            //row.Cells[0].AddParagraph("r.b.");
            //row.Cells[0].Format.Font.Bold = false;
            //row.Cells[0].Format.Alignment = ParagraphAlignment.Center;
            ////row.Cells[0].VerticalAlignment = VerticalAlignment.Bottom;
            ////row.Cells[0].MergeDown = 1;
            //row.Cells[1].AddParagraph("Inv. oznaka");
            //row.Cells[1].Format.Alignment = ParagraphAlignment.Left;
            ////row.Cells[1].MergeRight = 3;
            //row.Cells[2].AddParagraph("Vrsta/naziv");
            //row.Cells[2].Format.Alignment = ParagraphAlignment.Left;
            //row.Cells[2].VerticalAlignment = VerticalAlignment.Bottom;




            //row.Cells[5].MergeDown = 1;
            
 
            
            table.SetEdge(0, 0, stupci.Count, 1, Edge.Box, BorderStyle.Single, 0.75, Color.Empty);
        }

        void FillContent(Document document)
        {


            Table thisTable=document.Sections[0].LastTable;
            Row row;
            Image image;
            string logoPath="";
            //logoPath = System.Web.HttpContext.Current.Server.MapPath("~/Content/images/logo.png"); 
            int i=1;
            foreach (var rez in sReza)
            {
                row = thisTable.AddRow();
                row.Cells[0].AddParagraph(i.ToString());
                row.Cells[1].AddParagraph(rez.KRT_Inventarni_broj);
                if (rez.MC_Staza_slike != null)
                {
                    logoPath = System.Web.HttpContext.Current.Server.MapPath("../media/" + rez.MC_Staza_slike.Replace("m:\\muzej\\", "").Replace("\\", "/"));
                }
                else
                {
                    logoPath = System.Web.HttpContext.Current.Server.MapPath("../Content/images/fotonijepridruzen.png");
                }
                image = row.Cells[1].AddImage(logoPath);
                image.Height = "2.5cm";
                image.LockAspectRatio = true;
                image.RelativeVertical = RelativeVertical.Line;
                image.RelativeHorizontal = RelativeHorizontal.Margin;
                image.Top = ShapePosition.Center;
                image.Left = ShapePosition.Right;
                image.WrapFormat.Style = WrapStyle.Through;
              
                row.Cells[2].AddParagraph(rez.nazivi);
                row.Cells[3].AddParagraph(rez.naslovi);
                row.Cells[4].AddParagraph(rez.kataloskaJedinica);
                row.Cells[5].AddParagraph(rez.Datacija);
                row.Cells[6].AddParagraph(rez.Mjere);
                row.Cells[7].AddParagraph(rez.Mit);
                row.Cells[8].AddParagraph(rez.zbirka);
                thisTable.SetEdge(0, i, thisTable.Columns.Count-1, 1, Edge.Box, BorderStyle.Single, 0.75);
                i++;
            }

        //    // Fill address in address text frame
        //    XPathNavigator item = SelectItem("/invoice/to");
        //    Paragraph paragraph = this.addressFrame.AddParagraph();
        //    paragraph.AddText(GetValue(item, "name/singleName"));
        //    paragraph.AddLineBreak();
        //    paragraph.AddText(GetValue(item, "address/line1"));
        //    paragraph.AddLineBreak();
        //    paragraph.AddText(GetValue(item, "address/postalCode") + " " + GetValue(item, "address/city"));
            
        //    // Iterate the invoice items
        //    double totalExtendedPrice = 0;
        //    XPathNodeIterator iter = navigator.Select("/invoice/items/*");
        //    while (iter.MoveNext())
        //    {
        //        item = iter.Current;
        //        double quantity = GetValueAsDouble(item, "quantity");
        //        double price = GetValueAsDouble(item, "price");
        //        double discount = GetValueAsDouble(item, "discount");
                
        //        // Each item fills two rows
        //        Row row1 = this.table.AddRow();
        //        Row row2 = this.table.AddRow();
        //        row1.TopPadding = 1.5;
        //        row1.Cells[0].Shading.Color = tableGray;
        //        row1.Cells[0].VerticalAlignment = VerticalAlignment.Center;
        //        row1.Cells[0].MergeDown = 1;
        //        row1.Cells[1].Format.Alignment = ParagraphAlignment.Left;
        //        row1.Cells[1].MergeRight = 3;
        //        row1.Cells[5].Shading.Color = tableGray;
        //        row1.Cells[5].MergeDown = 1;
                
        //        row1.Cells[0].AddParagraph(GetValue(item, "itemNumber"));
        //        paragraph = row1.Cells[1].AddParagraph();
        //        paragraph.AddFormattedText(GetValue(item, "title"), TextFormat.Bold);
        //        paragraph.AddFormattedText(" by ", TextFormat.Italic);
        //        paragraph.AddText(GetValue(item, "author"));
        //        row2.Cells[1].AddParagraph(GetValue(item, "quantity"));
        //        row2.Cells[2].AddParagraph(price.ToString("0.00") + " €");
        //        row2.Cells[3].AddParagraph(discount.ToString("0.0"));
        //        row2.Cells[4].AddParagraph();
        //        row2.Cells[5].AddParagraph(price.ToString("0.00"));
        //        double extendedPrice = quantity * price;
        //        extendedPrice = extendedPrice * (100 - discount) / 100;
        //        row1.Cells[5].AddParagraph(extendedPrice.ToString("0.00") + " €");
        //        row1.Cells[5].VerticalAlignment = VerticalAlignment.Bottom;
        //        totalExtendedPrice += extendedPrice;
                
        //        this.table.SetEdge(0, this.table.Rows.Count - 2, 6, 2, Edge.Box, BorderStyle.Single, 0.75);
        //    }
            
        //    // Add an invisible row as a space line to the table
        //    Row row = this.table.AddRow();
        //    row.Borders.Visible = false;
            
        //    // Add the total price row
        //    row = this.table.AddRow();
        //    row.Cells[0].Borders.Visible = false;
        //    row.Cells[0].AddParagraph("Total Price");
        //    row.Cells[0].Format.Font.Bold = true;
        //    row.Cells[0].Format.Alignment = ParagraphAlignment.Right;
        //    row.Cells[0].MergeRight = 4;
        //    row.Cells[5].AddParagraph(totalExtendedPrice.ToString("0.00") + " €");
            
        //    // Add the VAT row
        //    row = this.table.AddRow();
        //    row.Cells[0].Borders.Visible = false;
        //    row.Cells[0].AddParagraph("VAT (19%)");
        //    row.Cells[0].Format.Font.Bold = true;
        //    row.Cells[0].Format.Alignment = ParagraphAlignment.Right;
        //    row.Cells[0].MergeRight = 4;
        //    row.Cells[5].AddParagraph((0.19 * totalExtendedPrice).ToString("0.00") + " €");
            
        //    // Add the additional fee row
        //    row = this.table.AddRow();
        //    row.Cells[0].Borders.Visible = false;
        //    row.Cells[0].AddParagraph("Shipping and Handling");
        //    row.Cells[5].AddParagraph(0.ToString("0.00") + " €");
        //    row.Cells[0].Format.Font.Bold = true;
        //    row.Cells[0].Format.Alignment = ParagraphAlignment.Right;
        //    row.Cells[0].MergeRight = 4;
            
        //    // Add the total due row
        //    row = this.table.AddRow();
        //    row.Cells[0].AddParagraph("Total Due");
        //    row.Cells[0].Borders.Visible = false;
        //    row.Cells[0].Format.Font.Bold = true;
        //    row.Cells[0].Format.Alignment = ParagraphAlignment.Right;
        //    row.Cells[0].MergeRight = 4;
        //    totalExtendedPrice += 0.19 * totalExtendedPrice;
        //    row.Cells[5].AddParagraph(totalExtendedPrice.ToString("0.00") + " €");
            
        //    // Set the borders of the specified cell range
        //    this.table.SetEdge(5, this.table.Rows.Count - 4, 1, 4, Edge.Box, BorderStyle.Single, 0.75);
            
        //    // Add the notes paragraph
        //    paragraph = this.document.LastSection.AddParagraph();
        //    paragraph.Format.SpaceBefore = "1cm";
        //    paragraph.Format.Borders.Width = 0.75;
        //    paragraph.Format.Borders.Distance = 3;
        //    paragraph.Format.Borders.Color = TableBorder;
        //    paragraph.Format.Shading.Color = TableGray;
        //    item = SelectItem("/invoice");
        //    paragraph.AddText(GetValue(item, "notes"));
        }
    }
}