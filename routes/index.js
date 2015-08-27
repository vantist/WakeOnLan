var express = require('express');
var router = express.Router();
var model = require('../model/wol');

// 認證
router.use(function(req, res, next) {
    var islogin = req.session.islogin;

    if (!islogin && req.path === '/') {
        res.redirect('/login');
    } else {
    	next();
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
    model.getMacAddress(req.session.account_id, function(data) {
    	console.log(data);
        res.render('index', {
            account: 'Vantist',
            mac: data
        });
    });
});

router.post('/wake', function(req, res, next) {
    model.getMacAddress(req.session.account_id, function(data) {
        for (var i = data.length - 1; i >= 0; i--) {
            var mac_address = data[i].mac_address;
            if (req.body.mac_address === mac_address) {
                var exec = require('child_process').exec;
                exec('echo \"\" | sudo -s etherwake -i eth0 ' + mac_address, function(error, stdout, stderr) {
                    console.log('stdout:' + stdout);
                    console.log('stderr:' + stderr);
                    if (error !== null)
                        console.log('exec error:' + error);
                });
            }
        };
    });
});

router.get('/login', function(req, res, next) {
    res.render('login', {
        account: req.session.account | ''
    });
});

router.post('/login', function(req, res, next) {
	model.checkLogin(req.body.account, req.body.password, function(user) {
		if (user) {
			req.session.islogin = true;
			req.session.account = user.account;
			req.session.account_id = user.id;
			res.redirect('/');
		} else {
			res.redirect('/login');
		}
	});
});

router.get('/logout', function(req, res, next) {
    req.session.islogin = false;
    res.redirect('/login');
});

router.post('/mac/delete', function(req, res, next) {
	var mac_address = req.body.mac_address;
	var account_id = req.session.account_id;

	model.deleteMacAddress(account_id, mac_address, function() {
		res.redirect('/');
	});
});

router.post('/mac/new', function(req, res, next) {
	var mac_address = req.body.mac_address;
	var name = req.body.name;
	var account_id = req.session.account_id;

	model.addMacAddress(account_id, mac_address, name, function() {
		res.redirect('/');
	});
});

module.exports = router;
