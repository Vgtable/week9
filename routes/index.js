var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.locals.user = req.session.user||"";
  res.render('index', { title: 'Express' });
});
//退出 / 将中间件内用户名密码清空
router.get("/logout",function(req,res){
  req.session.user = undefined;
  res.redirect("back");
})
// //登录 登录也form 的 name 就是 req.body 将其 赋值给声明 的两个量，判断 注册表里有无这个loginname 并且这个loginname的password是否等于当前取到的password
router.post("/login",function(req,res){
  const {loginname , password} = req.body;
  if(users[loginname]&&users[loginname].password === password){
    req.session.user = {loginname};
    res.redirect("/");//登录后返回到首页
  }
})
//跳转到登录页 并返回title名
router.get("/login",function(req,res){
  res.render("login",{title:"登录"})
})
//跳转到注册页 并返回title名
router.get("/reg",function(req,res){
  res.render("reg",{title:"注册"});
})
//注册页 form 表单 的3个input name 就是 req.body 判断有没有loginname he password 并且password是否等于enterAgain
var users = {};
router.post("/reg",function(req,res){
  const {loginname,password,enterAgain} = req.body;
  if(loginname&&password&&password===enterAgain){
    //将 loginname和password存入 users 注册表中。
    users[loginname] = {loginname,password};
    res.redirect("/login");//注册完登录
  }
})



module.exports = router;
