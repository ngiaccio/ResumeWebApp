var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.getAll = function(callback) {
    var query = 'SELECT * FROM resume;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(resume_id, callback) {
    var query = 'SELECT * FROM resume_view WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    // FIRST INSERT THE resume
    var query = 'INSERT INTO resume (account_id, resume_name) VALUES (?, ?)';
    var queryData = [params.account_id, params.resume_name];
    connection.query(query, queryData, function(err, result) {

        // THEN USE THE resume_ID RETURNED AS insertId AND THE SELECTED account_IDs INTO resume_account
        var resume_id = result.insertId;

        // Each JOINING TABLE gets its own query...
        var query1 = 'INSERT INTO resume_school (resume_id, school_id) VALUES ?';
        var query2 = 'INSERT INTO resume_company (resume_id, company_id) VALUES ?';
        var query3 = 'INSERT INTO resume_skill (resume_id, skill_id) VALUES ?';

        // table: RESUME_SCHOOL
        var resume_school_Data = [];
        for(var i=0; i < params.school_id.length; i++) {
            resume_school_Data.push([resume_id, params.school_id[i]]);
        }
        connection.query(query1, [resume_school_Data], function(err, result){
        });

        // table: RESUME_COMPANY
        var resume_company_Data = [];
        for(var i=0; i < params.company_id.length; i++) {
            resume_company_Data.push([resume_id, params.company_id[i]]);
        }
        connection.query(query2, [resume_company_Data], function(err, result){
        });

        // table: RESUME_SKILL
        var resume_skill_Data = [];
        for(var i=0; i < params.skill_id.length; i++) {
            resume_skill_Data.push([resume_id, params.skill_id[i]]);
        }
        connection.query(query3, [resume_skill_Data], function(err, result){
            callback(err, result);
        });
    });
};

exports.delete = function(resume_id, callback) {
    var query = 'DELETE FROM resume WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};


// FUNCTIONS FOR  resume_school
    // INSERT
var resume_school_Insert = function(resume_id, school_id_Array, callback){
    var query = 'INSERT INTO resume_school (resume_id, school_id) VALUES ?';
    var resume_school_Data = [];
    for(var i=0; i < school_id_Array.length; i++) {
        resume_school_Data.push([resume_id, school_id_Array[i]]);
    }
    connection.query(query, [resume_school_Data], function(err, result){
        callback(err, result);
    });
};
module.exports.resume_school_Insert = resume_school_Insert;
    // DELETE
var resume_school_DeleteAll = function(resume_id, school_id, callback){
    var query = 'DELETE FROM resume_school WHERE resume_id = (?) AND school_id = (?)';
    var queryData = [resume_id, school_id];
    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
module.exports.resume_school_DeleteAll = resume_school_DeleteAll;

// FUNCTIONS FOR  resume_company
    // INSERT
var resume_company_Insert = function(resume_id, company_id_Array, callback){
    var query = 'INSERT INTO resume_company (resume_id, company_id) VALUES ?';
    var resume_company_Data = [];
    for(var i=0; i < company_id_Array.length; i++) {
        resume_company_Data.push([resume_id, company_id_Array[i]]);
    }
    connection.query(query, [resume_company_Data], function(err, result){
        callback(err, result);
    });
};
module.exports.resume_company_Insert = resume_company_Insert;
    // DELETE
var resume_company_DeleteAll = function(resume_id, company_id, callback){
    var query = 'DELETE FROM resume_company WHERE resume_id = (?) AND company_id = (?)';
    var queryData = [resume_id, company_id];
    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
module.exports.resume_company_DeleteAll = resume_company_DeleteAll;

// FUNCTIONS FOR  resume_skill
    // INSERT
var resume_skill_Insert = function(resume_id, skill_id_Array, callback){
    var query = 'INSERT INTO resume_skill (resume_id, skill_id) VALUES ?';
    var resume_skill_Data = [];
    for(var i=0; i < skill_id_Array.length; i++) {
        resume_skill_Data.push([resume_id, skill_id_Array[i]]);
    }
    connection.query(query, [resume_skill_Data], function(err, result){
        callback(err, result);
    });
};
module.exports.resume_skill_Insert = resume_skill_Insert;
    // DELETE
var resume_skill_DeleteAll = function(resume_id, skill_id, callback){
    var query = 'DELETE FROM resume_skill WHERE resume_id = (?) AND skill_id = (?)';
    var queryData = [resume_id, skill_id];
    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
module.exports.resume_skill_DeleteAll = resume_skill_DeleteAll;



exports.update = function(params, callback) {
    var query = 'UPDATE resume SET resume_name = ? WHERE resume_id = ?';
    var queryData = [params.resume_name, params.resume_id];

    var query1 = 'UPDATE resume_school SET school_id = ? WHERE resume_id = ?';
    var queryData1 = [params.school_id, params.resume_id];

    var query2 = 'UPDATE resume_company SET company_id = ? WHERE resume_id = ?';
    var queryData2 = [params.company_id, params.resume_id];

    var query3 = 'UPDATE resume_skill SET skill_id = ? WHERE resume_id = ?';
    var queryData3 = [params.skill_id, params.resume_id];

    connection.query(query, queryData, function(err, result) {
        connection.query(query1, queryData1, function (err, result) {

            //delete resume_school entries for this resume
            resume_school_DeleteAll(params.resume_id, params.school_id, function (err, result) {
                if (params.school_id != null) {
                    //insert resume_school ids
                    resume_school_Insert(params.resume_id, params.school_id, function (err, result) {


                        connection.query(query2, queryData2, function (err, result) {
                            //delete resume_company entries for this resume
                            resume_company_DeleteAll(params.resume_id, params.company_id, function (err, result) {
                                console.log(params.company_id);
                                if (params.company_id != null) {
                                    //insert resume_company ids
                                    resume_company_Insert(params.resume_id, params.company_id, function (err, result) {

                                        connection.query(query3, queryData3, function (err, result) {
                                            //delete resume_skill entries for this resume
                                            resume_skill_DeleteAll(params.resume_id, params.skill_id, function (err, result) {
                                                if (params.skill_id != null) {
                                                    //insert resume_company ids
                                                    resume_skill_Insert(params.resume_id, params.skill_id, function (err, result) {
                                                        callback(err, result);
                                                    });
                                                }
                                            });
                                        });
                                    });
                                }
                            });
                        });
                    });
                }
            });
        });
    });
};

exports.edit = function(resume_id, callback) {
    var query = 'CALL resume_getinfo(?)';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};