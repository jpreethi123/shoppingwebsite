const express=require("express");
const app=express();
const mongoose=require("mongoose");
//const md5=require("md5");

const bodyparser=require("body-parser");
const ejs=require("ejs");
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");

app.use(session({
  secret:"Our little secret.",
  resave:false,
  saveUninitialized:false
}));

app.use(passport.initialize());

app.use(passport.session());
// passport.use(new LocalStrategy({

//     usernameField: 'email',

//   },User.authenticate()));



mongoose.connect('mongodb+srv://admin-preethi:saipreethi829@cluster0-1q8y9.mongodb.net/MyntraDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex",true);

let total_bag=0;
let total_order=0;
let bag_discount=0;

// var total_bag1;
// var total_order1;
// var bag_discount1;

// console.log(total_bag1);



const MyntraSchema=new mongoose.Schema({
    id:Number,
    title:String,
    cost:Number,
    discount:Number,
    discountper:Number,
    pic:String

});

const Myntra=new mongoose.model("Myntra",MyntraSchema);

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});


userSchema.plugin(passportLocalMongoose);

const User=new mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());







app.get("/",function(req,res){

    // Myntra.deleteMany(function(err){
    //     if(!err)
    //     console.log("Successfully deleted");
    //     else
    //    console.log(err);
    // });
  res.render("main");
 
});

app.get("/kurtas",function(req,res){
    res.render("kurtas");
})

app.get("/jumpsuits",function(req,res){
    res.render("jumpsuits");
});


app.get("/whishlist",function(req,res){
    Myntra.find({},function(err,foundItems){
     

        res.render("whishlist",{whish:foundItems,totalorder:total_order,totalbag:total_bag,bagdiscount:bag_discount});
       
       
    });

  
});
app.post("/",function(req,res){

    const add=req.body.cart1;
    let total=0;
   
    Myntra.findOne({id:add},function(err,founditem){
        if(!err)
        {
            if(!founditem){
                const item=new Myntra({
                    id:req.body.cart1,
                     title:req.body.cart2,
                     cost:req.body.cart3,
                     discount:req.body.cart4,
                     discountper:req.body.cart5,
                     pic:req.body.cart6 
                 });
                item.save();
                total_bag=parseInt(total_bag);
                total_order=parseInt(total_order);
                bag_discount=parseInt(bag_discount);
                total=parseInt(total);
                total_order=total_order+parseInt(req.body.cart3);
                total_bag=total_bag+parseInt(req.body.cart4);
                bag_discount=bag_discount+(parseInt(req.body.cart3)-parseInt(req.body.cart4));
                total_bag1=total_bag;
                total_order1=total_order;
                bag_discount1=bag_discount;

                    
            }
            
        }
           
    });
    console.log(req.body.cart1+" "+req.body.cart2);
    
     
});

app.post("/delete",function(req,res){
    Myntra.deleteOne({id:req.body.del},function(err){
        if(!err){
            total_order=total_order-parseInt(req.body.del1);
            total_bag=total_bag-parseInt(req.body.del2);
            bag_discount=bag_discount+(parseInt(req.body.del2)-parseInt(req.body.del1));
            total_bag1=total_bag;
            total_order1=total_order;
            bag_discount1=bag_discount;
            res.redirect("/whishlist");
        console.log("Successfully deleted"+req.body.del);

      
    }
        else
       console.log(err);
        
    });
   
     // console.log("deleted item id:" +req.body.del);
      
});

app.get("/register",function(req,res){
    res.render("register");
})

app.get("/login",function(req,res){
    res.render("login");
});


// app.post("/register",function(req,res){
//     const newUser=new Reg({
//         email:req.body.email,
//         password:md5(req.body.password)
//     });
//     newUser.save(function(err){
//         if(err)
//         console.log(err);
//         else
//        res.redirect("/");
//     });
//  });
 
//  app.post("/login",function(req,res){
//      const username=req.body.email;
//      const password=md5(req.body.password);
 
//      Reg.findOne({email:username},function(err,founduser){
//              if(!founduser)
//              res.render("warning");
//              else
//              {
                 
//                      if(founduser.password===password)
//                      {
//                          res.redirect("/");
//                      }
             
//                  else
//                  res.render("warning1");
//              }
//      });
//  });

app.get("/success",function(req,res){
    if(req.isAuthenticated()){
        res.render("success");
    }
});

app.get("/placeorder",function(req,res){

    if(req.isAuthenticated()){
        res.render("placeorder");
    }else{
        res.redirect("/register");
    }
   
})


app.post("/register",function(req,res){
    User.register({username:req.body.username},req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/success");
            });
        }
    });
});


app.post("/login",function(req,res){
   const user=new User({
       username:req.body.username,
       password:req.body.password
   });
   req.login(user,function(err){
       if(err){
           console.log(err);
       }
       else{
        passport.authenticate("local")(req,res,function(){
            res.redirect("/success");
        }); 
       }
   })

});


app.post("/placeorder",function(req,res){
    const a1=req.body.fname;
    const a2=req.body.lname;
    const a3=req.body.address;
    res.render("final",{firstname:a1,lastname:a2,add:a3});
    
});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
  });


  let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port,function(){
    console.log("server is running");
    
})