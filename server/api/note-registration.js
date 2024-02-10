import path from 'path';
import fs from 'fs';

function buildPath() {
    return path.join(process.cwd(), 'data', 'data.json');
}

function extractData(filePath) {
    const jsonData = fs.readFileSync(filePath);
    const data = JSON.parse(jsonData);
    return data;
}

function writeData(filePath, newData) {

    fs.writeFileSync(filePath, JSON.stringify(newData));
}

export default function (req, res){
    console.log('*** Making request ***')
    if(req.method === 'POST'){
        console.log('Into post Condition')
        
    }
}
    // const { method } = req;
    // const filePath = buildPath();

    // if (method === 'POST') {
    //     console.log('U in the post')
    //     console.log(extractData(filePath));
    //     let body = '';
    //     req.on('data', chunk => {
    //         body += chunk.toString();
    //     });

    //     req.on('end', () => {
    //         // Parse the JSON string to an object
    //         const parsedBody = JSON.parse(body);
    //         console.log(parsedBody);
    //         // Now `parsedBody` should contain your request body
    //     });
        
    // } 

