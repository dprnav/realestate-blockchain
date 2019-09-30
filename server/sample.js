var express = require('express');
var async = require('async');
var bodyParser = require('body-parser');
var app     = express();
var http = require('http');
var fs = require('fs');
var sha256=require('sha256');
var child_process = require('child_process');
app.use(function(req, res, next)
{
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
   res.setHeader('Access-Control-Allow-Credentials', true);
   next();
})

// FOR LOGIN

app.use(bodyParser.urlencoded({ extended: true }));
app.post('/myaction', function(req, res)
{
                  var mysql = require('mysql');
                  var con = mysql.createConnection(
                    {
                          host: "mysql",
                          user: "root",
                          password: "",
                          database: "bitcoin"
                  });
                  con.connect();
                    //res.send('You sent the name "' + req.body.id + '".');
                  console.log(req.body.id+" is requested for login");
                  //console.log(typeof(req.body.id));
                  var b='select name from auth where userid="'+req.body.id+'"';
                  console.log(b+" query will run on database");

                  con.query(b, function(err, rows, fields)
                  {
                              console.log("These are the results after query ");
                              console.log("rows");
                              if (!err)
                              {
                                  if(rows.length>0)
                                    {
                                      console.log("As rows.length>0 therefore this id is already registered");
                                      Object.keys(rows).forEach(function(key)
                                      {
                                        var row = rows[key];
                                        console.log(row.name);
                                        res.send(row.name);
                                      });
                                    }
                                  else
                                   {
                                        res.send('False');
                                        console.log('false as this id is not registered');
                                   }
                            }
                            else
                            {
                                  res.send('False');
                                  console.log('Error while performing Query.');
                            }
                    });
                    con.end();
});
var name="";
var birthday="";
var contact="";
var gender="";
var email="";
var address="";
var userid="";
app.post('/register', function(req, res)
 {

              var mysql = require('mysql');
              //This connection is for select query as this is id is already registered or not.
              var con = mysql.createConnection(
              {
                    host: "mysql",
                    user: "root",
                    password: "",
                    database: "bitcoin"
              });
              con.connect();
              //res.send('You sent the name "' + req.body.id + '".');
              console.log(req.body.id+" is requested for register");
              //console.log(typeof(req.body.id));
              var b='select name from auth where userid="'+req.body.id+'"';
              console.log(b+" this query will run on database.");
             con.query(b, function(err, rows, fields)
              {
                  console.log("This is the result after query "+rows);
                  if (!err)
                  {
                    if(rows.length>0)
                    {
                        console.log("False As this id is already registered.");
                        res.send("False");

                    }
                  else
                  {
                    res.send('True');
                    console.log('True as this id is not registered. Now Registration will begin.');
                    name=req.body.username;
                    birthday=req.body.birth;
                    contact=req.body.con;
                    gender=req.body.gender;
                    email=req.body.email;
                    address=req.body.address;
                    userid=req.body.id;
                  }
                }
                  else
                  {
                    res.send('False');
                    console.log('Error while performing Query.');
                  }
              });
              con.end();
});

app.post('/register1',function(req,res)
{
  var mysql = require('mysql');
  var con = mysql.createConnection(
            {
                host: "mysql",
                user: "root",
                password: "",
                database: "bitcoin"
           });
  con.connect();
  console.log('This data is registered into the database',name,birthday,contact,gender,email,address,userid);
  con.query('INSERT INTO auth(name,birthday,contact,gender,email,address,userid) VALUES(?,?,?,?,?,?,?)', [name,birthday,contact,gender,email,address,userid]);
  res.send("True");
  con.end();
});


var add="";
var amount="";
var city="";
var state="";
var coun="";
var hsh="";
var id1="";
var area="";
var deed="";
app.post('/upload',function(req,res)
{
    var mysql = require('mysql');
    var con = mysql.createConnection(
      {
            host: "mysql",
            user: "root",
            password: "",
            database: "bitcoin"
      });
 con.connect();
 console.log(req.body.id+" requested for Add Property request");
 console.log(req.body.address,req.body.amount,req.body.city,req.body.state,req.body.country,req.body.area);
 // req.form.complete(function(err,fields,files){
 data=req.body.address+','+req.body.city+','+req.body.state+','+req.body.country+','+req.body.area;
 var hash=sha256(data)
 console.log(hash+" This is the result hash");
 var b='select * from propertydata where address ="'+hash+'"';
 console.log(b+" This query will run on database");
 con.query(b, function(err, rows, fields)
 {
   console.log(rows);
   console.log("Result After Query");
   if (!err)
   {
      if(rows.length>0)
      {
         res.send("False");
         console.log("False As this property is already registered");
      }
   else
     {
       console.log(req.body.id+'_'+hash);
       var x='python ./python/gen_cert.py "'+req.body.name+'" "'+req.body.id+'" "'+hash+'"';
       child_process.exec(x, function (err){
         if (err) {
         console.log("child processes failed with error code: " + err);
       }
       else{
         const nodeCmd = require('node-cmd');
       var cm='plink -batch -ssh root@192.168.43.105 -pw redhat ipfs add '+req.body.id+'_'+hash+'.png';
	   console.log(cm);
      //var cm='plink -ssh root@192.168.43.105 -pw redhat ifconfig';
         nodeCmd.get(cm, function(err, data, stderr)
         {
           console.log("inside"+data);
           d=data.split(' ');
           deed=d[1];
           console.log(deed);
           res.send(hash+'@'+data)});

             console.log('True Registration begins');

             add=req.body.address;
             amount=req.body.amount;
             city=req.body.city;
             state=req.body.state;
             coun=req.body.country;
             hsh=hash;
             id1=req.body.id;
             area=req.body.area;
       }
     });
   }
 }
   else
   {
      res.send('False');
      console.log('Error while performing Query.');
   }
 });


 con.end();
});
app.post('/addproperty1', function(req, res)
{
    console.log("Registration block");
    var mysql = require('mysql');
    var con = mysql.createConnection(
      {
          host: "mysql",
          user: "root",
          password: "",
          database: "bitcoin"
      });
    con.connect();
    console.log("Property Registered");

    con.query('INSERT INTO propertydata(homeadd,amount,city,state,country,address,owner,status,area,deed) VALUES(?,?,?,?,?,?,?,"For Bid",?,?)', [add,amount,city,state,coun,hsh,id1,area,deed]);
    con.end();
    res.send("True");


});


app.post('/myproperty', function(req, res)
{
  var mysql = require('mysql');
  var con = mysql.createConnection(
    {
        host: "mysql",
        user: "root",
        password: "",
        database: "bitcoin"
    });
  con.connect();
  //res.send('You sent the name "' + req.body.id + '".');
  console.log(req.body.id);
  console.log(typeof(req.body.id));
  var b='select * from propertydata where owner="'+req.body.id+'"';
  console.log(b);

//http.createServer(function (req, resp) {
  con.query(b, function(err, rows, fields)
  {
        console.log(rows);
        if (!err)
         {
            if(rows.length>0)
             {
                 var data="";
                Object.keys(rows).forEach(function(key)
                 {
                      var row = rows[key];
                      console.log(row);

                      data=data+'@'+row.homeadd+'#'+row.amount+'#'+row.city+'#'+row.state+'#'+row.country+'#'+row.image+'#'+row.address+'#'+row.owner+'#'+row.status+'#'+row.area+'#'+row.deed;
                 });
                 console.log(data);
                 console.log("True bh");
                 res.send(data);
              }
             else
                {
                  res.send('False');
                  console.log('false');
                }
          }
          else
            {
              res.send('False');
              console.log('Error while performing Query.');
            }
   });
   con.end();
});


app.post('/onsale', function(req, res)
{
  var mysql = require('mysql');
  var con = mysql.createConnection(
    {
        host: "mysql",
        user: "root",
        password: "",
        database: "bitcoin"
    });
  con.connect();
  //res.send('You sent the name "' + req.body.id + '".');
  console.log(req.body.id);
  console.log(typeof(req.body.id));
  var b='select * from propertydata where status="For Sale" and owner!="'+req.body.id+'"';
  console.log(b);

//http.createServer(function (req, resp) {
  con.query(b, function(err, rows, fields)
  {
        console.log(rows);
        if (!err)
         {
            if(rows.length>0)
             {
                 var data="";
                Object.keys(rows).forEach(function(key)
                 {
                      var row = rows[key];
                      console.log(row);
                      data=data+'@'+row.homeadd+'#'+row.amount+'#'+row.city+'#'+row.state+'#'+row.country+'#'+row.image+'#'+row.address+'#'+row.owner+'#'+row.status+'#'+row.area+'#'+row.deed;
                 });
                 console.log(data);
                 console.log("True bh");
                 res.send(data);
              }
             else
                {
                  res.send('False');
                  console.log('false');
                }
          }
          else
            {
              res.send('False');
              console.log('Error while performing Query.');
            }
   });
   con.end();
});

app.post('/addbid', function(req, res)
{
    console.log("Registration block");
    var mysql = require('mysql');
    var con = mysql.createConnection(
      {
          host: "mysql",
          user: "root",
          password: "",
          database: "bitcoin"
      });
    con.connect();
    console.log("Property Bid Registered");

    con.query('INSERT INTO bid(phash,uhash,amount) VALUES(?,?,?)', [req.body.hash,req.body.id,req.body.amount]);
    con.end();
    res.send("True");


});

app.post('/onbid', function(req, res)
{
  var mysql = require('mysql');
  var con = mysql.createConnection(
    {
        host: "mysql",
        user: "root",
        password: "",
        database: "bitcoin"
    });
  con.connect();
  //res.send('You sent the name "' + req.body.id + '".');
  console.log(req.body.id);
  console.log(typeof(req.body.id));
  var b='select * from propertydata where status="For Bid" and owner!="'+req.body.id+'"';

  console.log(b);

//http.createServer(function (req, resp) {
  con.query(b, function(err, rows, fields)
  {
        console.log(rows);
        if (!err)
         {
            if(rows.length>0)
             {
                 var data="";
                Object.keys(rows).forEach(function(key)
                 {
                      var row = rows[key];
                      console.log(row);
                      data=data+'@'+row.homeadd+'#'+row.amount+'#'+row.city+'#'+row.state+'#'+row.country+'#'+row.image+'#'+row.address+'#'+row.owner+'#'+row.status+'#'+row.area+'#'+row.deed;
                 });
                 console.log(data);
                 console.log("True bh");
                 res.send(data);
              }
             else
                {
                  res.send('False');
                  console.log('false');
                }
          }
          else
            {
              res.send('False');
              console.log('Error while performing Query.');
            }
   });
   con.end();
});

var deed="";
var userid1="";
var hash1="";
app.post('/buyproperty', function(req, res)
{
  console.log(req.body.id+"requested to buy property");
    var x='python ./python/gen_cert.py "'+req.body.name+'" "'+req.body.id+'" "'+req.body.hash+'"';
    child_process.exec(x, function (err){
      if (err) {
      console.log("child processes failed with error code: " + err);
    }
    else {
      const nodeCmd = require('node-cmd');
      var cm='plink -batch -ssh root@192.168.43.105 -pw redhat ipfs add '+req.body.id+'_'+req.body.hash+'.png';
      nodeCmd.get(cm, function(err, data, stderr)
      {
        console.log(data);
        d=data.split(' ');
        deed=d[1];
        console.log(deed);
        res.send(deed);
        userid1=req.body.id;
        hash1=req.body.hash;

    });
  };
    });

});
app.post('/buyproperty1', function(req, res)
{
  var mysql = require('mysql');
  var con = mysql.createConnection(
    {
        host: "mysql",
        user: "root",
        password: "",
        database: "bitcoin"
    });
  con.connect();
  console.log("updation phase");
  var b='update propertydata set owner="'+userid1+'", deed="'+deed+'", status="Not For Sale" where address="'+hash1+'"';
    console.log(b+"query will run");
    con.query(b,function(err, rows, fields)
  {
    if(!err)
    {
      console.log("Send true");
    res.send("True");
    }
    else {
      console.log("Send false");
    res.send("False");

    }

  });

    con.end();

});
app.post('/sellproperty', function(req, res)
{
  var mysql = require('mysql');
  var con = mysql.createConnection(
    {
        host: "mysql",
        user: "root",
        password: "",
        database: "bitcoin"
    });
  con.connect();
  console.log(req.body.hash+' property is on Sale');
  var b='update propertydata set status="For Sale" where address="'+req.body.hash+'"';
    console.log(b+"query will run");
    con.query(b,function(err, rows, fields)
    {
      if(!err)
      {
        console.log("Send true");
      res.send("True");
      }
      else {
        console.log("Send false");
      res.send("False");

      }
    });
    con.end();

});


app.post('/search', function(req, res)
{
  var mysql = require('mysql');
  var con = mysql.createConnection(
    {
        host: "mysql",
        user: "root",
        password: "",
        database: "bitcoin"
    });
  con.connect();
  //res.send('You sent the name "' + req.body.id + '".');
  console.log(req.body.id);

  var b='select * from propertydata where city="'+req.body.city+'" and state="'+req.body.state+'" and status ="For Sale" and owner!="'+req.body.id+'"';
  console.log(b);
//2808
//http.createServer(function (req, resp) {
  con.query(b, function(err, rows, fields)
  {
        console.log(rows);
        if (!err)
         {
            if(rows.length>0)
             {
                 var data="";
                Object.keys(rows).forEach(function(key)
                 {
                      var row = rows[key];
                      console.log(row);
                      data=data+'@'+row.homeadd+'#'+row.amount+'#'+row.city+'#'+row.state+'#'+row.country+'#'+row.image+'#'+row.address+'#'+row.owner+'#'+row.status+'#'+row.area+'#'+row.deed;
                 });
                 console.log(data);
                 console.log("True bh");
                 res.send(data);
              }
             else
                {
                  res.send('False');
                  console.log('false');
                }
          }
          else
            {
              res.send('False');
              console.log('Error while performing Query.');
            }
   });
   con.end();
});
app.post('/notsale', function(req, res)
{
  var mysql = require('mysql');
  var con = mysql.createConnection(
    {
        host: "mysql",
        user: "root",
        password: "",
        database: "bitcoin"
    });
  con.connect();
  console.log(req.body.hash+' property is on Sale');
  var b='update propertydata set status="Not For Sale" where address="'+req.body.hash+'"';
    console.log(b+"query will run");
    con.query(b,function(err, rows, fields)
    {
      if(!err)
      {
        console.log("Send true");
      res.send("True");
      }
      else {
        console.log("Send false");
      res.send("False");

      }
    });
    con.end();

});

app.post('/cbid', function(req, res)
{
  var mysql = require('mysql');
  var con = mysql.createConnection(
    {
        host: "mysql",
        user: "root",
        password: "",
        database: "bitcoin"
    });
  con.connect();
  console.log(req.body.hash+' property is on Sale');
  var b='update propertydata set amount="'+req.body.amount+'"'+'where address="'+req.body.hash+'"';
    console.log(b+"query will run");
    con.query(b,function(err, rows, fields)
    {
      if(!err)
      {
        console.log("Send true");
      res.send("True");
      }
      else {
        console.log("Send false");
      res.send("False");

      }
    });
    con.end();

});
app.post('/nobid', function(req, res)
{
  var mysql = require('mysql');
  var con = mysql.createConnection(
    {
        host: "mysql",
        user: "root",
        password: "",
        database: "bitcoin"
    });
  con.connect();
  console.log(req.body.hash+' property is on Sale');
  var b='update propertydata set status="For Sale" where address="'+req.body.hash+'"';
    console.log(b+"query will run");
    con.query(b,function(err, rows, fields)
    {
      if(!err)
      {
        console.log("Send true");
      res.send("True");
      }
      else {
        console.log("Send false");
      res.send("False");

      }
    });
    con.end();

});

app.post('/maxamount', function(req, res)
{
  var mysql = require('mysql');
  var con = mysql.createConnection(
    {
        host: "mysql",
        user: "root",
        password: "",
        database: "bitcoin"
    });
  con.connect();
  //res.send('You sent the name "' + req.body.id + '".');
  console.log(req.body.hash);

  var b='select max(amount) as amount from bid where phash="'+req.body.hash+'"';

  console.log(b);
//2808
//http.createServer(function (req, resp) {
  con.query(b, function(err, rows, fields)
  {
        console.log(rows);
        if (!err)
         {
            if(rows.length>0)
             {
               Object.keys(rows).forEach(function(key)
                {
                     var row = rows[key];
                     console.log(row);
                     data=row.amount;
                     if(data==null)
                     {
                       res.send('0');
                     }
                     else {
                       {
                         res.send(data);
                       }
                     }
                });
                 console.log("True bh");

                 console.log(data);

                                console.log("yup yup");

              }
             else
                {
                  res.send('False');
                  console.log('false');
                }
          }
          else
            {
              res.send('False');
              console.log('Error while performing Query.');
            }
   });
   con.end();
});

app.listen(5050);
console.log('Server Started listening on 5050');
