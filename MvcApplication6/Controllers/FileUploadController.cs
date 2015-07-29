using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Drawing.Imaging;
using System.Drawing;
using System.Drawing.Drawing2D;

namespace WMpp.Controllers
{
    public class FileUploadController : ApiController
    {

        private static void CreateDir(string location)
        {
            if (!Directory.Exists(location))
            {
                try
                {
                    Directory.CreateDirectory(location);
                }
                catch (IOException e)
                {
                    System.Diagnostics.Debug.WriteLine(e);
                }
            }
        }

        static Size GetThumbnailSize(Image original)
        {
            // Maximum size of any dimension.
            const int maxPixels = 300;

            // Width and height.
            int originalWidth = original.Width;
            int originalHeight = original.Height;

            // Compute best factor to scale entire image based on larger dimension.
            double factor;
            if (originalWidth > originalHeight)
            {
                factor = (double)maxPixels / originalWidth;
            }
            else
            {
                factor = (double)maxPixels / originalHeight;
            }

            // Return thumbnail size.
            return new Size((int)(originalWidth * factor), (int)(originalHeight * factor));
        }

        private static void ThumbByResize(string path)
        {

            Image oldImage = Image.FromFile(path);
            Size newSize = GetThumbnailSize(oldImage);

            Bitmap newImage = new Bitmap(newSize.Width, newSize.Height);
            using (Graphics gr = Graphics.FromImage(newImage))
            {
                gr.SmoothingMode = SmoothingMode.HighQuality;
                gr.InterpolationMode = InterpolationMode.HighQualityBicubic;
                gr.PixelOffsetMode = PixelOffsetMode.HighQuality;
                gr.DrawImage(oldImage, new Rectangle(0, 0, newSize.Width, newSize.Height));

            }


            string sysPath = path.Replace("Mmedia", "sysmmedia\\300");
            string location = sysPath.Substring(0, sysPath.LastIndexOf('\\'));

            CreateDir(location);

            try
            {
                newImage.Save(sysPath, ImageFormat.Jpeg);
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine(e);
            }

            newImage.Dispose();
            oldImage.Dispose();

        }


        public HttpResponseMessage Post()
        {
            HttpResponseMessage result = null;
            var httpRequest = HttpContext.Current.Request;


            string zbirka = httpRequest.Params["pather"].ToString();
            string location = HttpContext.Current.Server.MapPath("/Mmedia/" + zbirka + "/");
            if (httpRequest.Files.Count > 0)
            {
                foreach (string file in httpRequest.Files)
                {

                    var postedFile = httpRequest.Files[file];
                    string fileName = Path.GetFileName(postedFile.FileName);
                    var filePath = HttpContext.Current.Server.MapPath("~/" + fileName);
                    


                    CreateDir(location);

                    try
                    {
                        postedFile.SaveAs(location + fileName);
                        //GenerateThumbnail(location + fileName);
                        ThumbByResize(location + fileName);

                    }
                    catch (Exception e)
                    {
                        System.Diagnostics.Debug.WriteLine(e);
                    }



                    postedFile.SaveAs(filePath);
                }
                result = Request.CreateResponse(HttpStatusCode.Created);
            }
            else
            {
                result = Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            return result;
        }


    }
}
