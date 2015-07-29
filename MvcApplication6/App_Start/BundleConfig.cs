using System;
using System.Web.Optimization;

namespace WMpp
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.IgnoreList.Clear();
            AddDefaultIgnorePatterns(bundles.IgnoreList);

            bundles.Add(
              new ScriptBundle("~/scripts/vendor")
                .Include("~/scripts/jquery-{version}.js")
                .Include("~/scripts/knockout-{version}.debug.js")
                .Include("~/scripts/toastr.js")
                .Include("~/scripts/jquery-ui-{version}.js")
                .Include("~/scripts/Q.js")
                .Include("~/scripts/breeze.debug.js")
                .Include("~/scripts/bootstrap.js")
                .Include("~/scripts/moment.js")
                .Include("~/scripts/knockout-sortable.js")
                .Include("~/scripts/knockout-jqAutocomplete.js")
                .Include("~/scripts/jquery.slimscroll.js")

           );

            bundles.Add(
              new StyleBundle("~/Content/css")
                .Include("~/Content/ie10mobile.css")
                .Include("~/Content/bootstrap.css")
                .Include("~/Content/themes/base/all.css")
                .Include("~/Content/themes/base/autocomplete.css")
                .Include("~/Content/bootstrap-responsive.css")
                .Include("~/Content/durandal.css")
                .Include("~/Content/toastr.css")
                //.Include("~/Content/app.css")
                .Include("~/Content/font-awesome.min.css")
                //.Include("~/Content/bootstrapCustom.css")
                //.Include("~/Content/custom.css")
                //.Include("~/Content/black.css")
                //.Include("~/Content/new.css")
                .Include("~/Content/applicationStyle.css")
              );
        }

        public static void AddDefaultIgnorePatterns(IgnoreList ignoreList)
        {
            if (ignoreList == null)
            {
                throw new ArgumentNullException("ignoreList");
            }

            ignoreList.Ignore("*.intellisense.js");
            ignoreList.Ignore("*-vsdoc.js");

            //ignoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);
            //ignoreList.Ignore("*.min.js", OptimizationMode.WhenDisabled);
            //ignoreList.Ignore("*.min.css", OptimizationMode.WhenDisabled);
        }
    }
}