var express = require('express');
var router = express.Router();
var resume_dal = require('../model/resume_dal');
var account_dal = require('../model/account_dal');
var company_dal = require('../model/company_dal');
var skill_dal = require('../model/skill_dal');
var school_dal = require('../model/school_dal');

// View All resumes
router.get('/all', function(req, res) {
    resume_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('resume/resumeViewAll', { 'result':result });
        }
    });

});

// View the resume for the given id
router.get('/', function(req, res){
    if(req.query.resume_id == null) {
        res.send('resume_id is null');
    }
    else {
        resume_dal.getById(req.query.resume_id, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('resume/resumeViewById', {'result': result});
            }
        });
    }
});

// Return the add a new resume form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    account_dal.getAll(function(err,account) {
        skill_dal.getAll(function(err,skill) {
            company_dal.getAll(function(err,company) {
                school_dal.getAll(function(err,school) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.render('resume/resumeAdd', {'account': account, 'skill': skill, 'company': company, 'school': school});
                    }
                });
            });
        });
    });
});

// View the resume for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.resume_name == null) {
        res.send('A Resume Name must be provided.');
    }
    else if(req.query.company_id == null) {
        res.send('At least one Company must be selected.');
    }
    else if(req.query.school_id == null) {
        res.send('At least one School must be selected.');
    }
    else if(req.query.account_id == null) {
        res.send('An Account must be selected.');
    }
    else if(req.query.skill_id == null) {
        res.send('At least one Skill must be selected.');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        resume_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                res.redirect(302, '/resume/all');
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.resume_id == null) {
        res.send('A resume id is required');
    }
    else {
        resume_dal.edit(req.query.resume_id, function(err, result){
            res.render('resume/resumeUpdate', {resume: result[0][0], account: result[1]});
        });
    }

});

router.get('/edit2', function(req, res){
    if(req.query.resume_id == null) {
        res.send('A resume id is required');
    }
    else {
        resume_dal.getById(req.query.resume_id, function(err, resume){
            account_dal.getAll(function(err, account) {
                skill_dal.getAll(function(err, skill) {
                    company_dal.getAll(function(err, company) {
                        school_dal.getAll(function(err, school) {
                            if (err) {
                                res.send(err);
                            }
                            else {
                                res.render('resume/resumeUpdate', {resume: resume[0], account: account, skill: skill, company: company, school: school});
                            }
                        });
                    });
                });
            });
        });
    }

});

router.get('/update', function(req, res) {
    resume_dal.update(req.query, function(err, result){
        res.redirect(302, '/resume/all');
    });
});

// Delete a resume for the given resume_id
router.get('/delete', function(req, res){
    if(req.query.resume_id == null) {
        res.send('resume_id is null');
    }
    else {
        resume_dal.delete(req.query.resume_id, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                res.redirect(302, '/resume/all');
            }
        });
    }
});

module.exports = router;
