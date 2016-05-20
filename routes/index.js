var mongoose=require('mongoose');
var models=require('./models');
var User=models.User;
var Message=models.Message;
var cookieParser = require('cookie-parser');
mongoose.connect('mongodb://localhost/tyrion');


module.exports=function(app){

	
	app.get('/', function(req, res, next) {
		res.render('index', { title: '首页' }
		
		);
	});
	app.post('/', function(req, res, next) {
		var bto={userid:req.body.userid,password:req.body.password};
        User.count(bto,function(err,doc){
            if(doc){
				User.find({userid:'bto.userid'},function(err,doc){});
				if(doc.isAdmin){
					res.cookie('user',req.body.userid,{maxAge:60*60*1000});
            		return res.redirect('/board');	
				}else{
					res.cookie('user',req.body.userid,{maxAge:60*60*1000});
                    return res.redirect('/private' );
				}
			}		
            else{
				res.render('wrong',{title:'帐户或密码错误'})                   
            }
        });
    });
	
	
	app.get('/login', function(req, res, next) {
		res.render('login', { title: '登录' });
		 
	});
	//注销操作
	app.get("/logout", checkLogin);
	app.get("/logout",function(req,res) {
		res.cookie('user',null,{maxAge:0});
		console.log(req.cookies.user);
		return res.redirect('/');
	});

	//判断登录操作是否成功，成功的话记录到cookie中,同时有登录后台操作的功能
	app.post('/login', function(req, res, next) {
		var bto={userid:req.body.userid,password:req.body.password};
        User.count(bto,function(err,doc){
            if(doc){
				User.find({userid:'bto.userid'},function(err,doc){});
				if(doc.isAdmin){
					res.cookie('admin',req.body.userid,{maxAge:60*60*1000});
            		return res.redirect('/map');	
				}else{
					res.cookie('user',req.body.userid,{maxAge:60*60*1000});
                    return res.redirect('/private' );
				}
			}		
            else{
				res.render('wrong',{title:'帐户或密码错误'})                   
            }
        });
    });
    
    
	//注册操作
	app.get('/reg', function(req, res, next) {
		res.render('reg', { title: '注册' });
	});
    app.post('/reg',function(req,res,next){
      //var bto={username:req.body.username,userid:reg.body.userid,password:reg.body.password};
      //User.insert(bto);
	  res.render('wrong',{
		  title:'本系统暂不开放注册'
		});
    });
	
    //个人主页
    app.get('/private',checkLogin);
	app.get('/private', function(req, res, next) {
		var bto=new User();
		var mes=new Message();
        User.findOne({userid:req.cookies.user},function(err,bto){
			Message.findOne({to:req.cookies.user},function(err,mes){ 
	        console.log(bto);
			console.log(mes);
		if(mes==null){
			res.render('private', {
            title: '个人主页',
            username:bto.username,
            userid:bto.userid,
            bhour:bto.bhour,
            bmin:bto.bmin,
            ehour:bto.ehour,
            emin:bto.emin,
			mesnum:0,
			message:null,
			come:null,
			date:null			
		});}
			else{
     
	        res.render('private', {
            title: '个人主页',
            username:bto.username,
            userid:bto.userid,
            bhour:bto.bhour,
            bmin:bto.bmin,
            ehour:bto.ehour,
            emin:bto.emin,
			mesnum:1,
			message:mes.message,
			come:mes.come,
			date:mes.date
		});
        }
		});
        });
	});
	//外出人员发送信息
	app.post('/private', function(req, res, next) {
		var bto=new Message();
		var date=new Date();
		bto.come=req.cookies.user;
		bto.date=date.toLocaleString();
        bto.message=req.body.message;
        bto.to=req.body.to;
		User.count({userid:bto.to},function(err,doc){
		if(doc==0)
			res.render('wrong',{
				title:'不存在该用户'
			});
		else{
			console.log(bto.come);
			bto.save(function(err){
            if(err)
               res.render('wrong',{
					title:'储存出现错误'
			});
            else
                res.redirect('/success');    
		})
	
}
		})		
	});    
    
    
	//地图页
	app.get('/map',checkLogin);
	app.get('/map', function(req, res, next) {
		res.render('map', { title: '地图' });
	});
    
	
	//后台控制页面
    
	app.get('/board', function(req, res, next) {
		res.render('board', { title: 'board' });
	});
	
    //发送成功
	app.get('/success', function(req, res, next) {
		res.render('success', { title: '发送成功' });
	}); 
		app.get('/test', function(req, res, next) {
		res.render('test', { title: 'board' });
	});

	   
	function checkNotLogin(req, res, next) {
		if (req.cookies.user) {
		return res.redirect('/private');
		}
	next();
	}
	function checkLogin(req, res, next) {
		if (req.cookies.user==null) {
		res.redirect('/login');
		}
	next();
		
	}
	
};
    
