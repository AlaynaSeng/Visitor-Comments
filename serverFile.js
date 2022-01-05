var http = require('http');
var fs = require('fs');
var qs = require('querystring');


http.createServer((req, res) => {
    const path = `.${req.url}`;

    route(path, req, res);
}).listen(3000);

console.log("server sterted in port 3000");

const route = (path, req, res) => {
    console.log(path);
    switch (path) {
        case "./":
            serveFile("./Home.html", res);
            break;
        case "./Save":
            postComment(req, res);
            break;
        case "./Comments":
            showComment(res);
            break;
            case "./Form":
            serveFile("./Form.html", res);
            break;
        default:
            serveFile(path, res);
            break;
    }
};

const serveFile = (path, res) => {
    fs.readFile(path, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.write("404 not found");
            return;
        }
        res.writeHead(200);
        res.write(data);
        res.end();
    });
};

const postComment = (req, res) => {
    if (req.method == "POST") {
        var body = "";
        req.on("data", (data) => {
            body += data;
        });

        req.on('end', () => {
            var data = qs.parse(body);
            res.writeHead(200)

            fs.access("Comments.txt", fs.F_OK, err => {
                if (err) {
                    fs.writeFile("Comments.txt", "", err => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    });
                }

                fs.appendFile("Comments.txt", `${data["txtname"]} "${data["txtcomment"]}"\n`, err => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                });
            });
            let divi = `<div>Name - ${data["txtname"]} <br> Comment - ${data["txtcomment"]}</div>`;
            res.writeHead(200, {'content-type' : 'text/html'});
            res.write(divi + `<br> <a href="/">Return</a>`);
            res.end();
        });
    }
};



const showComment = (res) => {
    fs.readFile("./Comments.txt", (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        let comments = data.toString().split("\n").filter(comment => comment);
        let divs = "";

        comments.forEach(comment => {
           
            let [person, quote] = comment.split(' "');
            quote = quote.slice(0, -1)
       
            divs += `<div>
                        <div>Name: ${person}</div>
                        <br>
                        <div>Comment: ${quote}</div>
                    </div>`;
        });
        res.writeHead(200, {'content-type' : 'text/html'});
        res.write(divs + `<br><br> <a href="/">Return</a>`);
        res.end();
    });
}

