var axios = require("axios");
var yaml = require('js-yaml');
require('dotenv').config();

const healthcare_api = process.env.GCP_HEALTHCARE_API;
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// *************************************************************
// **   API Routines                                          **
// *************************************************************

// authenticate google service account to obtain bearer token
exports.getBearer = async (req, res) => {
    const {google} = require('googleapis');
    console.log("Reached getBearer");
    const auth = new google.auth.GoogleAuth({
        keyFile: '/tmp/healthcare-nlp.json',
        scopes: ['https://www.googleapis.com/auth/cloud-healthcare'],
    });
    const accessToken = await auth.getAccessToken();

    var data = { "document_content": JSON.stringify(req.body.document) };
    var req_data = {
        method: 'post',
        url: healthcare_api,
        proxy: false,
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + accessToken },
        data: data
    };
    axios(req_data)
        .then(function (response) {
            console.log("Finished zabbixAuthenticate API Call");
            console.log(response.data);
            console.log(JSON.stringify(response.data));
            if (response.data ) {
                res.send(response.data);
            } else {
                console.log("zabbixAuthenticate API Response is Empty");
                res.send({});
            }
            console.log("Returned Res data ");
        })
        .catch(function (error) {
            console.log(error);
        });
};

function xmlToJson(xml) {

    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    // If just one text node inside
    if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
        obj = xml.childNodes[0].nodeValue;
    }
    else if (xml.hasChildNodes()) {
        for(var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof(obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof(obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}