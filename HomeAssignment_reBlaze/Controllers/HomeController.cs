using HomeAssignment_reBlaze.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace HomeAssignment_reBlaze.Controllers
{
    public class HomeController : Controller
    {
        private reBlazeEntities db = new reBlazeEntities();

        public async Task<ActionResult> Index()
        {
            Users[] arr = await db.Users.ToArrayAsync();
            var list = arr.ToList();  // contains all the users objects
            if (list == null)
            {
                list = new List<Users>();
            }
            Session["users"] = list;
            return View();
        }

        public ActionResult MyShops()
        {
            var username = (string)Session["un"];
            var shops = (from s in db.PreferredShops
                         where s.username == username
                         select s).ToList();
            Session["MyShops"] = shops;
            return View();
        }

        public async Task<JsonResult> Register(Users data)
        {
            if (ModelState.IsValid)
            {
                var list = (List<Users>)Session["users"];
                foreach (var user in list)
                {
                    if (user.username.ToLower().Equals(data.username.ToLower()))
                    {
                        return await Task.Run(() => Json(1, JsonRequestBehavior.AllowGet));
                    }
                }
                data.salt = Users.GenerateRandomSalt();
                data.password = Users.doHash(data.password, data.salt);
                list.Add(data);
                Session["users"] = list;
                db.Users.Add(data);
                await db.SaveChangesAsync();
                return await Task.Run(() => Json(0, JsonRequestBehavior.AllowGet));
            }
            return await Task.Run(() => Json(1, JsonRequestBehavior.AllowGet));
        }

        public async Task<JsonResult> Login(Users data)
        {
            if (ModelState.IsValid)
            {
                var list = (List<Users>)Session["users"];
                foreach (var user in list)
                {
                    if (user.username.ToLower().Equals(data.username.ToLower()) && user.password.Equals(Users.doHash(data.password, user.salt)))
                    {
                        Session["un"] = data.username;
                        Session["username"] = user.firstname + " " + user.lastname;
                        string str = user.firstname + " " + user.lastname;
                        return await Task.Run(() => Json(str, JsonRequestBehavior.AllowGet));
                    }
                }
            }
            return await Task.Run(() => Json(1, JsonRequestBehavior.AllowGet));
        }

        public async Task<JsonResult> Logout()
        {
            Session["username"] = null;
            return await Task.Run(() => Json(0, JsonRequestBehavior.AllowGet));
        }

        public JsonResult checkLanLng(string temp_lat, string temp_lng)
        {
            string str = "";
            if (temp_lat != "" && temp_lng != "")
            {
                Session["lat"] = temp_lat;
                Session["lng"] = temp_lng;
            }
            if ((string)Session["lat"] != "" && (string)Session["lng"] != "")
            {
                str = (string)Session["lat"] + " " + (string)Session["lng"];
            }
            return Json(str, JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> addPreferredShop(string name, string icon)
        {
            string username = (string)Session["un"];

            var ps = db.PreferredShops.Where(p => p.name == name && p.username == username).FirstOrDefault();
            if (ps == null)
            {
                ps = new PreferredShops();
                ps.name = name; ps.icon = icon; ps.username = username;
                db.PreferredShops.Add(ps);
                await db.SaveChangesAsync();
                return await Task.Run(() => Json(1, JsonRequestBehavior.AllowGet));
            }
            return await Task.Run(() => Json(0, JsonRequestBehavior.AllowGet));
        }

        public async Task<JsonResult> removePreferredShop(string ShopName, string ShopIcon)
        {
            if (ShopName == "" || ShopIcon == "")
            {
                return await Task.Run(() => Json(0, JsonRequestBehavior.AllowGet));
            }
            var ps = new PreferredShops() { username = (string)Session["un"], name = ShopName, icon = ShopIcon };
            db.PreferredShops.Attach(ps);
            db.PreferredShops.Remove(ps);
            await db.SaveChangesAsync();
            return await Task.Run(() => Json(1, JsonRequestBehavior.AllowGet));
        }

    }
}