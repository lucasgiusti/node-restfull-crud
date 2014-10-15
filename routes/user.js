
//************************************************************
var
    path = require("path"),
    mime = require('mime'),
    http = require('http'),
    express = require("express"),
    fs = require('fs'),
    mongoose = require('mongoose'),
    iz = require('iz'),
    ObjectID = require('mongodb').ObjectID,
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    passportLocalMongoose = require('passport-local-mongoose'),
    accountRoute = require("./account"),
    utilRoute = require("./util"),
    jstoxml = require('./jstoxml');
//************************************************************


var AccountModel = accountRoute.AccountModel;
var validaCpf = utilRoute.validaCpf;


//************************************************************
var Schema = mongoose.Schema;

// User Model
var User = new Schema({
    name: { type: String, required: true },
    mail: { type: String, index: { unique: true} },
    address: { type: String, required: true },
    number: { type: String, required: true },
    complement: { type: String, required: false },
    district: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    cep: { type: String, required: false },
    registration: { type: String, required: true },
    phone1: { type: String, required: true },
    active: { type: Boolean, required: true },
    rg: { type: String, required: false },
    phone2: { type: String, required: false },
    phone3: { type: String, required: false },
    cpf: { type: String, index: { unique: true} },
    type: { type: String, required: true },
    dateInclusion: { type: Date, required: true },
    dateUpdate: { type: Date, required: false }
});

var UserModel = mongoose.model('users', User);

var getRelUsersAll = function (req, res) {
    if (!accountRoute.isAuthorized(req.user.type, 'RELATORIO')) {
        res.status('401').send({ status: 401, error: 'Access Denied' });
    }
    else {
        UserModel = mongoose.model('users', User);
        return UserModel.find({}).sort({ type: 1, name: 1 }).exec(function (err, users) {
            if (!err) {
                return res.send(users);
            } else {
                return console.log(err);
            }
        });
    }
};

var getXmlCompleteUsersAll = function (req, res) {
    if (!accountRoute.isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.status('401').send({ status: 401, error: 'Access Denied' });
    }
    else {
        UserModel = mongoose.model('users', User);
        return UserModel.find({}).sort({ name: 1 }).exec(function (err, users) {
            if (!err) {
                var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';

                xml += '<users>';
                for (var i = 0; i < users.length; i++) {

                    var str = JSON.stringify(users[i]);

                    while (str.indexOf('"complement":null,') != -1) {
                        str = str.replace('"complement":null,', '');
                    }
                    while (str.indexOf('"dateUpdate":null,') != -1) {
                        str = str.replace('"dateUpdate":null,', '');
                    }
                    while (str.indexOf('"cep":null,') != -1) {
                        str = str.replace('"cep":null,', '');
                    }
                    while (str.indexOf('"phone2":null,') != -1) {
                        str = str.replace('"phone2":null,', '');
                    }
                    while (str.indexOf('"phone3":null,') != -1) {
                        str = str.replace('"phone3":null,', '');
                    }
                    while (str.indexOf('"rg":null,') != -1) {
                        str = str.replace('"rg":null,', '');
                    }

                    var obj = JSON.parse(str);

                    xml += '<user>';
                    xml += jstoxml.toXML(obj);
                    xml += '</user>';
                }
                xml += '</users>';





                var codigo = new ObjectID();
                var file = __dirname.replace('routes', '') + 'public/downloads/exportUsers-' + codigo + '.xml';

                fs.writeFile(file, xml, function (err, data) {

                    if (err) {
                        return console.log(err);
                    }
                    else {
                        var filename = path.basename(file);
                        var mimetype = mime.lookup(file);



                        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                        res.setHeader('Content-type', mimetype);

                        var filestream = fs.createReadStream(file);
                        filestream.pipe(res);
                    }
                });


            } else {
                return console.log(err);
            }
        });
    }
};

var validateUser = function (res, user) {

    if (!(iz(user.type).required().equal('STUDENT').valid
        || iz(user.type).required().equal('MANAGER').valid)) {
        console.log('Error adding user: invalid type user');
        res.status('500').send({ status: 500, error: 'invalid type user' });
        return false;
    }

    if ((user.name == null) || (user.name != null && !iz.between(user.name.trim().length, 1, 100))) {
        console.log('Error adding user: name between 1 and 100 characters');
        res.status('500').send({ status: 500, error: 'name between 1 and 100 characters' });
        return false;
    }
    user.name = user.name.trim();
    
    if ((user.address == null) || (user.address != null && !iz.between(user.address.trim().length, 1, 100))) {
        console.log('Error adding user: address between 1 and 100 characters');
        res.status('500').send({ status: 500, error: 'address between 1 and 100 characters' });
        return false;
    }
    user.address = user.address.trim();

    if ((user.number == null) || (user.number != null && !iz.between(user.number.trim().length, 1, 10))) {
        console.log('Error adding user: address number between 1 and 10 characters');
        res.status('500').send({ status: 500, error: 'address number between 1 and 10 characters' });
        return false;
    }
    user.number = user.number.trim();

    if (!iz.maxLength(user.complement, 20)) {
        console.log('Error adding user: complement address most 20 characters');
        res.status('500').send({ status: 500, error: 'complement address most 20 characters' });
        return false;
    }
    if ((user.complement == null)) { delete user.complement; } else { user.complement = user.complement.trim();}


    if ((user.district == null) || (user.district != null && !iz.between(user.district.trim().length, 1, 50))) {
        console.log('Error adding user: district between 1 and 50 characters');
        res.status('500').send({ status: 500, error: 'district between 1 and 50 characters' });
        return false;
    }
    user.district = user.district.trim();

    if ((user.state == null) || (user.state != null && !iz.between(user.state.trim().length, 1, 50))) {
        console.log('Error adding user: invalid state');
        res.status('500').send({ status: 500, error: 'invalid state' });
        return false;
    }
    user.state = user.state.trim();

    if ((user.city == null) || (user.city != null && !iz.between(user.city.trim().length, 1, 50))) {
        console.log('Error adding user: invalid city');
        res.status('500').send({ status: 500, error: 'invalid city' });
        return false;
    }
    user.city = user.city.trim();

    if (!iz.maxLength(user.cep, 9)) {
        console.log('Error adding user: CEP number most 9 characters');
        res.status('500').send({ status: 500, error: 'CEP number most 9 characters' });
        return false;
    }
    if ((user.cep == null)) { delete user.cep; } else { user.cep = user.cep.trim();}

    if ((user.registration == null) || (user.registration != null && !iz.between(user.registration.trim().length, 1, 30))) {
        console.log('Error adding user: registration number between 1 and 30 characters');
        res.status('500').send({ status: 500, error: 'registration number between 1 and 30 characters' });
        return false;
    }
    user.registration = user.registration.trim();

    if ((user.phone1 == null) || (user.phone1 != null && !iz.between(user.phone1.trim().length, 1, 20))) {
        console.log('Error adding user: phone number 2 between 1 and 20 characters');
        res.status('500').send({ status: 500, error: 'phone number 2 between 1 and 20 characters' });
        return false;
    }
    user.phone1 = user.phone1.trim();

    if (!(user.active == 'true' || user.active == true)) {
        user.active = false;
    }

    if (!iz.maxLength(user.rg, 20)) {
        console.log('Error adding user: RG number most 20 characters');
        res.status('500').send({ status: 500, error: 'RG number most 20 characters' });
        return false;
    }
    if ((user.rg == null)) { delete user.rg; } else { user.rg = user.rg.trim();}

    if (!iz.maxLength(user.phone2, 20)) {
        console.log('Error adding user: phone 2 number most 20 characters');
        res.status('500').send({ status: 500, error: 'phone 2 number most 20 characters' });
        return false;
    }
    if ((user.phone2 == null)) { delete user.phone2; } else { user.phone2 = user.phone2.trim();}

    if (user.cpf == null || !validaCpf(user.cpf)) {
        console.log('Error adding user: invalid CPF');
        res.status('500').send({ status: 500, error: 'invalid CPF' });
        return false;
    }
    user.cpf = user.cpf.trim();

    if (!iz.maxLength(user.phone3, 20)) {
        console.log('Error adding user: phone 3 number most 20 characters');
        res.status('500').send({ status: 500, error: 'phone 3 number most 20 characters' });
        return false;
    }
    if ((user.phone3 == null)) { delete user.phone3; } else { user.phone3 = user.phone3.trim();}

    if (!iz(user.mail).required().email().valid) {
        console.log('Error adding user: invalid e-mail');
        res.status('500').send({ status: 500, error: 'invalid e-mail' });
        return false;
    }
    user.mail = user.mail.trim();

    if (!iz(user.dateInclusion).required().date().valid) {
        console.log('Error adding user: invalid inclusion date');
        res.status('500').send({ status: 500, error: 'invalid inclusion date' });
        return false;
    }

    return true;

}

var putUser = function (res, user, id) {
    var objectID = new ObjectID(id);
    UserModel = mongoose.model('users', User);

    UserModel.findOne({ 'registration': user.registration, 'type': user.type, '_id': { $nin: [objectID]} }, function (err, u) {
        if (!err) {
            if (u) {
                console.log('Error updating user: existing registration number');
                res.status('500').send({ status: 500, error: 'existing registration number' });
            }
            else {
                UserModel.findOne({ 'cpf': user.cpf, '_id': { $nin: [objectID]} }, function (err, u) {
                    if (!err) {
                        if (u) {
                            console.log('Error updating user: existing CPF');
                            res.status('500').send({ status: 500, error: 'existing CPF' });
                        }
                        else {
                            UserModel.findOne({ 'mail': user.mail, '_id': { $nin: [objectID]} }, function (err, u) {
                                if (!err) {
                                    if (u) {
                                        console.log('Error updating user: existing e-mail');
                                        res.status('500').send({ status: 500, error: 'existing e-mail' });
                                    }
                                    else {
                                        //UPDATE USER



                                        UserModel.findOne({ '_id': objectID }, { _id: 1, mail: 1, active: 1 }, function (err, u) {
                                            if (!err) {
                                                if ((u && u.mail != user.mail) || (user.active == false && u.active == true)) {

                                                    AccountModel.findOne({ 'username': u.mail }, { _id: 1, username: 1 }, function (err, account) {
                                                        if (!err) {
                                                            if (account) {
                                                                account.remove();
                                                            }
                                                        } else {
                                                            console.log(err);
                                                        }
                                                    });
                                                }
                                            } else {
                                                console.log(err);
                                            }
                                        });







                                        UserModel.update({ '_id': id }, user, { safe: true }, function (err, result) {
                                            if (err) {
                                                console.log('Error updating user: ' + err);
                                                res.status('500').send({ status: 500, error: err });
                                            } else {
                                                console.log('' + result + ' document(s) updated');

                                                res.send(user);
                                            }
                                        });
                                    }
                                } else {
                                    console.log(err);
                                    res.status('500').send({ status: 500, error: err });
                                }
                            });
                        }
                    } else {
                        console.log(err);
                        res.status('500').send({ status: 500, error: err });
                    }
                });
            }
        } else {
            console.log(err);
            res.status('500').send({ status: 500, error: err });
        }
    });

}

var postUser = function (res, user) {
    UserModel = mongoose.model('users', User);
    UserModel.findOne({ 'registration': user.registration, 'type': user.type }, function (err, u) {
        if (!err) {
            if (u) {
                console.log('Error adding user: existing registration number');
                res.status('500').send({ status: 500, error: 'existing registration number' });
                return;
            }
            else {
                UserModel.findOne({ 'cpf': user.cpf }, function (err, u) {
                    if (!err) {
                        if (u) {
                            console.log('Error adding user: existing CPF');
                            res.status('500').send({ status: 500, error: 'existing CPF' });
                            return;
                        }
                        else {
                            UserModel.findOne({ 'mail': user.mail }, function (err, u) {
                                if (!err) {
                                    if (u) {
                                        console.log('Error adding user: existing e-mail');
                                        res.status('500').send({ status: 500, error: 'existing e-mail' });
                                        return;
                                    }
                                    else {
                                        //INSERT
                                        delete user._id;
                                        delete user.dateUpdate;
                                        UserModel = new UserModel(user);
                                        UserModel.save(function (err, user, result) {
                                            if (err) {
                                                console.log('Error inserting user: ' + err);
                                                res.status('500').send({ status: 500, error: err });
                                            } else {
                                                console.log('' + result + ' document(s) inserted');
                                                res.send(user);
                                            }
                                        });
                                    }
                                } else {
                                    console.log(err);
                                    res.status('500').send({ status: 500, error: err });
                                }
                            });
                        }
                    } else {
                        console.log(err);
                        res.status('500').send({ status: 500, error: err });
                    }
                });
            }
        } else {
            console.log(err);
            res.status('500').send({ status: 500, error: err });
            return;
        }
    });
}

var delUser = function (res, req, id) {

    UserModel = mongoose.model('users', User);
    UserModel.findOne({ '_id': id }, { _id: 1, mail: 1 }, function (err, user) {
        if (!err) {
            if (user) {
                if ((user.mail != req.user.username)) {

                    AccountModel.findOne({ 'username': user.mail }, { _id: 1 }, function (err, account) {
                        if (!err) {
                            if (account) {
                                account.remove(function () { user.remove(function () { res.send(user); }); });
                            }
                            else {
                                user.remove(function () { res.send(user); });
                            }

                        } else {
                            console.log('Error updating account: ' + err);
                            res.status('500').send({ status: 500, error: err });
                        }
                    });


                }
                else {
                    res.status('500').send({ status: 500, error: 'can not delete you' });
                }
            }
            else {
                res.status('500').send({ status: 500, error: 'user not found' });
            }

        } else {
            console.log('Error deleting user: ' + err);
            res.status('500').send({ status: 500, error: err });
        }
    });
}

module.exports.UserModel = UserModel;
module.exports.validateUser = validateUser;
module.exports.getRelUsersAll = getRelUsersAll;
module.exports.getXmlCompleteUsersAll = getXmlCompleteUsersAll;
module.exports.putUser = putUser;
module.exports.postUser = postUser;
module.exports.delUser = delUser;