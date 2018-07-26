const Incident = require('../models').Incident;
const Issue = require('../models').Issue;
const Client = require('../models').Client;
const Solution = require('../models').Solution;
const Symptom = require('../models').Symptom;
const sequelize = require('sequelize');
const request = require('request');
require('dotenv').config();

function postToken(){
    return new Promise( (resolve, reject) => {
        request.post({
            url:'https://cmsv2.zebrix.net/login', 
            form: {
                clientname: process.env.CLIENT_NAME, 
                username: process.env.USER_NAME, 
                password: process.env.PSWD_USER
            }
        },(err,httpResponse,body)=>{
                let res = JSON.parse(body);
                let token = res.token;
                if(err){
                    return reject();
                }
                resolve(token);
            
        });
    })
};
function getClients(result){
    return new Promise( (resolve, reject)=>{
        let options = {
            url: 'https://cmsv2.zebrix.net/api/v2/client',
            headers: {
              'Authorization': 'Bearer '+result,
              'clienttype': 'cms',
            },
          };
        request(options, (error, response, body)=>{
            if(error){
                return reject();
            }
            let clientServer = [];
            let result = JSON.parse(body);
            result.forEach(client=>{
                clientServer.push({
                    name: client.name,
                    id: client.id,
                    createdAt: client.createdAt,
                    updatedAt: client.updatedAt
                });
            })
           
            resolve(clientServer);
           
        }); 
    })
}
async function asyncCall() {

    console.log('calling');
    let result = await postToken();
    return await getClients(result);

}
module.exports = {
    async home(req, res){
        
        const solutions = await Solution.findAll();
        const clients = await Client.findAll();
        const issues = await Issue.findAll();
        const symptoms = await Symptom.findAll();
        
        return res.render('index', {symptoms: symptoms, solutions: solutions, issues: issues, clients: clients, valid: res.locals.valid, refresh: res.locals.refresh});
    },
    create(req,res, next){
        let NclientId = parseInt(req.body.clientId);
        let NsymptomId = parseInt(req.body.symptomId);
        let NissueId = parseInt(req.body.issueId);
        let NsolutionId = parseInt(req.body.solutionId);
        let nTime = (req.body.timer);

        Incident.create({
            clientId: NclientId,
            symptomId: NsymptomId,
            issueId: NissueId,
            solutionId: NsolutionId,
            time: nTime,
        })
        .then(incident=> {
            res.locals.valid = true;
            
            next();
        })
        .catch(err => res.status(400).send(err));

    },
    async validatePost(req,res,next){
        
        req.checkBody('clientId', "Veuillez entrer un client correct (utilisez l'autocomplete)").notEmpty();
        req.checkBody('symptomId', "Veuillez entrer un symptôme correct (utilisez l'autocomplete)").notEmpty();
        req.checkBody('issueId', "Veuillez entrer une cause correcte (utilisez l'autocomplete)").notEmpty();
        req.checkBody('solutionId', "Veuillez entrer une solution correcte (utilisez l'autocomplete").notEmpty();
        req.checkBody('timer',"Temps non valide").notEmpty();
        
        let errors = await req.validationErrors();

        console.log(errors);

        if(errors){
            const clients = await Client.findAll();
            const solutions = await Solution.findAll();
            const issues = await Issue.findAll();
            const symptoms = await Symptom.findAll();
            res.render('index', {symptoms: symptoms, solutions: solutions, issues: issues, clients: clients,errors: errors});
        } else {
            next();
        }
    },
    async refreshDB(req,res,next){
        console.log("INFO FROM REQ: ",req.body);
        if(req.body.refresh){
            const clients = await Client.findAll();
            const solutions = await Solution.findAll();
            const issues = await Issue.findAll();
            const symptoms = await Symptom.findAll();
            res.locals.refresh = true;
            const zebrix = await asyncCall().then(result=>{
                return result;
            });
    
            let dbRefresh = zebrix.map(zeb=>{
                return Client.upsert(zeb,{returning: true});
            });
     
            try{
     
                await Promise.all(dbRefresh);
                res.locals.refresh = true;
     
            } catch (err){
                throw err
            }
            return res.render('index', {symptoms: symptoms, solutions: solutions, issues: issues, clients: clients, refresh: res.locals.refresh});
        } else {
            
            next();
        }
    },
    async list(req,res){
        const currentDate = new Date();
        let dateMonth;
        let dateYear;
        if(!req.body.month){
            dateMonth = ''+(currentDate.getMonth()+1);
            dateYear = ''+currentDate.getFullYear();            
        } else {
            req.sanitizeBody();
            
            const splitted = req.body.month.split('-');
            dateYear = splitted[0];
            dateMonth = splitted[1];
        }
        const incidents = await Incident.findAll({
            where: {
                $and: [
                  sequelize.where(sequelize.fn('YEAR', sequelize.col('Incident.createdAt')), dateYear),
                  sequelize.where(sequelize.fn('MONTH', sequelize.col('Incident.createdAt')), dateMonth),
                ]
            },
            include: [{
                model: Client,
                as: 'clients',
            },{
                model: Issue,
                as: 'issues',
            },{
                model: Symptom,
                as: 'symptoms',
            },{
                model: Solution,
                as: 'solutions',
            }],
        });

        const clientOcc = await Incident.findAll({
            attributes: { include: [[sequelize.fn('COUNT', sequelize.col('*')), 'count']] },
            where: {
                $and: [
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('Incident.createdAt')), dateYear),
                    sequelize.where(sequelize.fn('MONTH', sequelize.col('Incident.createdAt')), dateMonth),
                ]
            },
             include: [{
                model: Client,
                as: 'clients',
             },{
                model: Issue,
                as: 'issues',
            },{
                model: Symptom,
                as: 'symptoms',
            },{
                model: Solution,
                as: 'solutions'
            }],
            order: [[sequelize.fn('count', sequelize.col('Incident.clientId')), 'DESC']],	
            group: ['Incident.clientId']
        });

        const issueOcc = await Incident.findAll({
            attributes: { include: [[sequelize.fn('COUNT', sequelize.col('*')), 'count']] },
            where: {
                $and: [
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('Incident.createdAt')), dateYear),
                    sequelize.where(sequelize.fn('MONTH', sequelize.col('Incident.createdAt')), dateMonth),
                ]
            },
             include: [{
                model: Client,
                as: 'clients',
             },{
                model: Issue,
                as: 'issues',
            },{
                model: Symptom,
                as: 'symptoms',
            },{
                model: Solution,
                as: 'solutions'
            }],
            order: [[sequelize.fn('count', sequelize.col('Incident.issueId')), 'DESC']],	
            group: ['Incident.issueId']
        });

        const symptomOcc = await Incident.findAll({
            attributes: { include: [[sequelize.fn('COUNT', sequelize.col('*')), 'count']] },
            where: {
                $and: [
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('Incident.createdAt')), dateYear),
                    sequelize.where(sequelize.fn('MONTH', sequelize.col('Incident.createdAt')), dateMonth),
                ]
            },
             include: [{
                model: Client,
                as: 'clients',
            },{
                model: Issue,
                as: 'issues',
            },{
                model: Symptom,
                as: 'symptoms',
            },{
                model: Solution,
                as: 'solutions'
            }],
            order: [[sequelize.fn('count', sequelize.col('Incident.symptomId')), 'DESC']],	
            group: ['Incident.symptomId']
        });

        res.render('list', {incidents : incidents, clientOccurence: clientOcc, issueOccurence: issueOcc, symptomOccurence: symptomOcc, layout: 'list.hbs'});
    }
};