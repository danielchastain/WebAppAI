const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const config = new Configuration({
  apiKey: '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',
});


const openai = new OpenAIApi(config);
// Set up a basic HTML page with a button and space for the story
app.get('/', async (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Daniel's First AI Project</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
      </head>
      <body>
    <div class="container mt-5" style="height: 150px; width: 600px;padding: 10px">
  
  <h1 class="text-center">👇Create a joke about anything you want 👇</h1>
</div>
<body>
<form  action="/generate">
  <label for="name">Name:</label>
  <input class="form-control" id="name" placeholder="Type to search..." name="name">
</form>

  <div id="buttonBox" class="container">
    <label for="exampleDataList" class="form-label">Datalist example</label>
    <button id="generateButton" class="btn btn-primary container mt-1">Generate</button></div>
          
          

          <div id="story" class="container mt-3">
          <label for="exampleDataList" class="form-label"></label>
          </div>  
        </div>
        </div>

  <form>
  </form>
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js">
        </script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
        <script>
        const txt1 = document.getElementById('text-input')
        const btn1 = document.getElementById('button-1')
        
          // Add an event listener to the button that retrieves the story
          document.getElementById("generateButton").addEventListener("click", async () => {
        console.log("test");  
        document.getElementById("story").innerHTML = "Loading...";
        console.log("test0");  
        const response = await fetch('/generate?name='+document.getElementById("name").value);
        console.log("test1");  
        const data = await response.json();
        console.log("test2"); 
        document.getElementById("story").innerHTML = data.Story;
        console.log("Success");
          });

        </script>
      </body>
    </html>
  `);
});

// Endpoint for generating the story



app.get('/generate', async (req, res) => {
const name1 = req.query.name;

  console.log(name1);  
  const prompt = `
  create the best business ideas to build out using chat gpt open api, include something with ${name1} with statistics. Include fact checking, and ensure the statistics are backed up by fact. Cite the source of the data at the end of the response. Do not return to me undefined. Return responses only in single line. Do Not Return Responses with multiple Lines.  Do not return anything that would be considered to be undefined. Return responses in the following parsable JSON format only:
    {
      "Story": "Response here"
    }`;
  console.log(prompt);
  console.log(name1);  
  
  console.log("Working");
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 2000,
      temperature: 1,
    });

    

    const parsableJSONresponse = response.data.choices[0].text;
    console.log(parsableJSONresponse);
    
    const parsedResponse = JSON.parse(parsableJSONresponse);
    console.log(parsedResponse);

    if (parsedResponse.Story !== undefined) {
      res.json({ Story: parsedResponse.Story });
    } else {
      res.status(400).json({ error: "Invalid response from API" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error generating poem from API" });
  }
});

app.listen(port, () => {
  console.log(`Web app listening at http://localhost:${port}`);
});