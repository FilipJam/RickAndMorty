import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import axios from "axios";

function mergeArrays(arr1, arr2) {
    var bigArr = arr1;
    var smallArr = arr2;
    if(arr1.length < arr2.length){
        bigArr = arr2;
        smallArr = arr1;
    }


    smallArr.forEach(x => bigArr.push(x));
    return bigArr;
}

function getPage(info) {
    let nextURL = info.next;
    let start = nextURL.indexOf('page');
    // console.log(nextURL[start]);
    // console.log(nextURL[start + 5]);
    // console.log(nextURL[nextURL.length-1]);
    let nextPage = nextURL.slice(start+5,nextURL.length);
    return nextPage-1;
}

const app = express();
const port = 3000;
const ejsMain = "index.ejs";

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
//app.use(morgan("dev"));

const apiURL = "https://rickandmortyapi.com/api/";


const endPoint = {
    character: apiURL + "character",
    location: apiURL + "location",
    episode: apiURL + "episode"
}

app.get("/", async (req,res) => {
    res.redirect("/character");
});

app.get("/character", async (req,res) => {
    try{
        var body = {
            params: {
                page: req.query.page || 1
            }
        }

        var response = await axios.get(endPoint.character, body);
        var results = response.data.results;
        var info = response.data.info;

        res.render(ejsMain, {
            charList: results, 
            info: info,
            page: parseInt(body.params.page)
        });
    }catch(error){
        console.log(error.message);
        res.render(ejsMain, {error: "Something went wrong on our end, please try again later!"});
    }
});


app.get("/location", async (req,res) => {
    try{
        const response = await axios.get(endPoint.location);
        const jsonText = JSON.stringify(response.data);
        res.render(ejsMain, {data: response.data.results});
    }catch(error){
        console.log(error.message);
        res.render(error.status(500));
    }
});

app.get("/episode", async (req,res) => {
    try{
        console.log(endPoint.episode + "/5");
        const response = await axios.get(endPoint.episode + "/5,2");
        const jsonText = JSON.stringify(response.data);
        res.render(ejsMain, {data: response.data});
    }catch(error){
        console.log(error.message);
        res.render(error.status(500));
    }
});




app.listen(port, () => console.log(`Server running on port ${port}`));

