const express = require('express');
const app = new express();

const dotenv = require('dotenv')
dotenv.config()


function getNLUInstance() {

    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1')
    const { IamAuthenticator } = require('ibm-watson/auth')

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({

        version: '2021-03-25',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl : api_url,
    })
    return naturalLanguageUnderstanding
}


getNLU = getNLUInstance() 

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {

    console.log(`${req.query.url}`)
    const analyzeParams = {
        //'url': 'www.wsj.com/news/markets',
        'url': `${req.query.url}`,
        'features': {
          'emotion': {
          }
        }
      };
    
     
    getNLU.analyze(analyzeParams)
    .then(analysisResults => {
        if (analysisResults.result.emotion.document.emotion) {
            res.send(analysisResults.result.emotion.document.emotion);
        }
        else {
            res.send('No url');
        }
    })
    .catch(err => {
        let errmsg = {'Error': err.toString()}
        res.send(errmsg)
        console.log(err.toString())
    });    

});

app.get("/url/sentiment", (req,res) => {

    console.log(`${req.query.url}`)
    const analyzeParams = {
        //'url': 'www.wsj.com/news/markets',
        'url': `${req.query.url}`,
        'features': {
          'sentiment': {
          }
        }
      };
      
    getNLU.analyze(analyzeParams)
    .then(analysisResults => {
        if (analysisResults.result.sentiment.document.label) {
            res.send(analysisResults.result.sentiment.document.label);
        }
        else {
            res.send('No url');
        }
    })
    .catch(err => {
        res.send(err.toString())
        console.log(err.toString())
    });

});

app.get("/text/emotion", (req,res) => {

    console.log(`${req.query.text}`)
    const analyzeParams = {
        'text': `${req.query.text}`,
        'features': {
          'emotion': {
          }
        }
      };
    
     
    getNLU.analyze(analyzeParams)
    .then(analysisResults => {
        if (analysisResults.result.emotion.document.emotion) {
            res.send(analysisResults.result.emotion.document.emotion);
        }
        else {
            res.send('No url');
        }
    })
    .catch(err => {
        let errmsg = {'Error': err.toString()}
        res.send(errmsg)
        console.log(err.toString())
    }); 

});

app.get("/text/sentiment", (req,res) => {


    console.log(`${req.query.text}`)
    const analyzeParams = {
        // 'text': 'I hate JavaScript!',
        'text': `${req.query.text}`,
        'features': {
          'sentiment': {
          }
        }
      };
      
    getNLU.analyze(analyzeParams)
    .then(analysisResults => {
        if (analysisResults.result.sentiment.document.label) {
            res.send(analysisResults.result.sentiment.document.label);
        }
        else {
            res.send('No url');
        }
    })
    .catch(err => {
        res.send(err.toString())
        console.log(err.toString())

    });


});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

