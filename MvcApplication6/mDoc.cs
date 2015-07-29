using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System.IO.Packaging;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using A = DocumentFormat.OpenXml.Drawing;
using DocumentFormat.OpenXml.Drawing.Wordprocessing;

namespace WMpp
{
    public class mDoc
    {
        //static List<MvcApplication6.SEClasses.rezultati> sReza = new List<SEClasses.rezultati>();





        private static string GetRealPath(string inPath)
        {
            string outPath = System.Web.HttpContext.Current.Server.MapPath("../Content/images/fotonijepridruzen.jpg");

            if (inPath!=null &&  !inPath.Equals(""))
            {
                outPath = System.Web.HttpContext.Current.Server.MapPath("../Mmedia/" + inPath.Substring(15).Replace("\\", "/"));
                if (!File.Exists(outPath))
                {
                    outPath = System.Web.HttpContext.Current.Server.MapPath("../Content/images/fotonijepronadjen.jpg");
                }
            }
            return outPath;

        }



        public void openWordUno(List<WMpp.SEClasses.rezultati> sReza)
        {
            string imeDatoteke = @"slikTest.docx";
            string imeDatoteke2 = @"slikTest2.docx";
            string filepath = System.Web.HttpContext.Current.Server.MapPath("~/Content/" + imeDatoteke);
            string filepath2 = System.Web.HttpContext.Current.Server.MapPath("~/Content/" + imeDatoteke2);

            File.Copy(filepath, filepath2, true);

            using (WordprocessingDocument doc = WordprocessingDocument.Open(filepath2, true))
            {


                //ImagePart img = new ImagePart();
                //img.
                MainDocumentPart docPart = doc.MainDocumentPart;

                SdtRun controlBlock = null;

                foreach (var cB in docPart.Document.Body.Descendants<SdtRun>())
                {
                    foreach (var propR in cB.Descendants<Tag>())
                    {
                        Console.WriteLine(propR.Val);
                        if (propR.Val == "zaPic")
                        {
                            //sReza[0].MC_Staza_slike;
                            controlBlock = cB;
                            ChangePicture(docPart, cB, GetRealPath(sReza[0].MC_Staza_slike));
                        }
                        if (propR.Val == "zaInvOz")
                        {
                            ChangeText(docPart, cB, sReza[0].KRT_Inventarni_broj);
                        }
                        if (propR.Val == "zaZbirku")
                        {
                            ChangeText(docPart, cB, sReza[0].zbirka);
                        }
                        if (propR.Val == "zaNaziv")
                        {
                            ChangeText(docPart, cB, sReza[0].nazivi);
                        }

                    }
                }



                var b = controlBlock.Ancestors<SdtBlock>().Last();



                for (var i = 1; i < sReza.Count; i++)
                {
                    SdtBlock b1 = (SdtBlock)b.CloneNode(true);

                    foreach (var cB in b1.Descendants<SdtRun>())
                    {

                        foreach (var propR in cB.Descendants<Tag>())
                        {

                            if (propR.Val == "zaPic")
                            {
                                //sReza[0].MC_Staza_slike;
                                //controlBlock = cB;

                                DocProperties dP = cB.Descendants<DocProperties>().First();
                                //dP.Id = (DocumentFormat.OpenXml.UInt32)sReza[i].ID_Broj;
                                dP.Id = (UInt32)sReza[i].ID_Broj;
                                ChangePicture(docPart, cB, GetRealPath(sReza[i].MC_Staza_slike));
                            }
                            if (propR.Val == "zaInvOz")
                            {
                                ChangeText(docPart, cB, sReza[i].KRT_Inventarni_broj);
                                propR.Val = "zaInvOz" + i;
                            }
                            if (propR.Val == "zaZbirku")
                            {
                                ChangeText(docPart, cB, sReza[i].zbirka);
                            }
                            if (propR.Val == "zaNaziv")
                            {
                                ChangeText(docPart, cB, sReza[i].nazivi);
                            }
                        }


                    }

                    //docPart.Document.Body.In 
                    b.InsertAfterSelf<SdtBlock>(b1);
                }





                docPart.Document.Save();


                // Insert other code here. 
            }
        }



        public void openWord(List<WMpp.SEClasses.rezultati> sReza)
        {
            string imeDatoteke = @"slikTestTab.docx";
            string imeDatoteke2 = @"slikTestTab2.docx";
            string filepath = System.Web.HttpContext.Current.Server.MapPath("~/Content/" + imeDatoteke);
            string filepath2 = System.Web.HttpContext.Current.Server.MapPath("~/Content/" + imeDatoteke2);

            File.Copy(filepath, filepath2, true);

            using (WordprocessingDocument doc = WordprocessingDocument.Open(filepath2, true))
            {


                //ImagePart img = new ImagePart();
                //img.
                MainDocumentPart docPart = doc.MainDocumentPart;

                TableRow controlBlock = null;

                foreach (var cB in docPart.Document.Body.Descendants<TableRow>())
                {
                    foreach (var propR in cB.Descendants<Tag>())
                    {
                        Console.WriteLine(propR.Val);
                        if (propR.Val == "zaPic")
                        {
                            //sReza[0].MC_Staza_slike;
                            controlBlock = cB;
                            ChangePictureTable(docPart, cB, GetRealPath(sReza[0].MC_Staza_slike));
                        }
                            if (propR.Val == "katAloska")
                            {
                                ChangeTextTable(docPart, cB, sReza[0].kataloskaJedinica);
                                propR.Val = "katAloska";
                            }

                    }
                }



                var b = controlBlock;//.Ancestors<TableRow>().Last();
                var bLast = b;


                for (var i = 1; i <sReza.Count; i++)
                {
                    TableRow b1 = (TableRow)b.CloneNode(true);

                    //foreach (var cB in b1.Descendants<TableRow>())
                    //{

                        foreach (var propR in b1.Descendants<Tag>())
                        {

                            if (propR.Val == "zaPic")
                            {
                                //sReza[0].MC_Staza_slike;
                                //controlBlock = cB;

                                DocProperties dP = b1.Descendants<DocProperties>().First();
                                //dP.Id = (DocumentFormat.OpenXml.UInt32)sReza[i].ID_Broj;
                                dP.Id = (UInt32)sReza[i].ID_Broj;
                                ChangePictureTable(docPart, b1, GetRealPath(sReza[i].MC_Staza_slike));
                            }
                            if (propR.Val == "katAloska")
                            {
                                ChangeTextTable(docPart, b1, sReza[i].kataloskaJedinica);
                                propR.Val = "katAloska" + i;
                            }
                        }


                    //}


                    //docPart.Document.Body.In 
                    bLast.InsertAfterSelf<TableRow>(b1);

                    bLast = b1;
                }





                docPart.Document.Save();
                

                // Insert other code here. 
            }
        }



        public static void ChangeTextTable(MainDocumentPart mdp, TableRow controlBlock, string path)
        {
            Text txt = controlBlock.Descendants<Text>().FirstOrDefault();

            txt.Text = path;


        }

        public static void ChangePictureTable(MainDocumentPart mdp, TableRow controlBlock, string path)
        {
            Bitmap image = new Bitmap(path);


           
            A.Blip blip = controlBlock.Descendants<A.Blip>().FirstOrDefault();

            

            ImagePart imagePart = mdp.AddImagePart(ImagePartType.Jpeg);
            using (MemoryStream stream = new MemoryStream())
            {
                image.Save(stream, ImageFormat.Jpeg);
                stream.Position = 0;
                imagePart.FeedData(stream);
            }
            blip.Embed = mdp.GetIdOfPart(imagePart);

        }
   


        public static void ChangeText(MainDocumentPart mdp, SdtRun controlBlock, string path)
        {
            Text txt = controlBlock.Descendants<Text>().FirstOrDefault();

            txt.Text = path;


        }

        public static void ChangePicture(MainDocumentPart mdp, SdtRun controlBlock, string path)
        {
            Bitmap image = new Bitmap(path);


            A.Blip blip = controlBlock.Descendants<A.Blip>().FirstOrDefault();



            ImagePart imagePart = mdp.AddImagePart(ImagePartType.Jpeg);
            using (MemoryStream stream = new MemoryStream())
            {
                image.Save(stream, ImageFormat.Jpeg);
                stream.Position = 0;
                imagePart.FeedData(stream);
            }
            blip.Embed = mdp.GetIdOfPart(imagePart);

        }
    }
}