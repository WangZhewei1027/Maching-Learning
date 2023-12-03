// Machine Learning for Artists and Designers
// NYUSH F23 - gohai

// Note: this sketch consists of additional JavaScript
// files. Make sure to duplicate it, rather than copying
// and pasting code :)

let openai_api_proxy = "https://sordid-hexagonal-bunny.glitch.me/";
let local_sd_api = "https://gpu.gohai.xyz:3000/";
let img;
let report = 0;
let className = [];
let className2 = [];

// The main input is the messages parameter (i.e. the entire conversation
// up to this point). Typically, a conversation is formatted with a system
// message first, followed by alternating user and assistant messages.
// The system message helps set the behavior of the assistant. For example,
// you can modify the personality of the assistant or provide specific
// instructions about how it should behave throughout the conversation.

let messages = [
  {
    role: "system",
    content:
      "You are a journalist, your role is to generate a news article imitating The New York Times style, describing absurd, abstract, and novel stories set in a futuristic background. Ensure the stories have a negative twist, involving protagonists who have done something bad. The length of each news article should be similar to a standard newspaper article. You should generate a headline, a short paragraph of content, and the description of the image. Please provide the content in JSON format for easy use. Formatting should strictly follow: { 'Headline': ...; 'Content': ...; 'Image Description': ...; } in json format",
  },
];

function setup() {
  console.log("1");

  sendMessage("Please generate a report");
}

function sendMessage(mes) {
  console.log("Starting generate report");
  // get the text from the text field
  let content = mes;

  // don't send empty messages to the API
  if (content == "") {
    return;
  }

  // add the text to the array of messages
  messages.push({
    role: "user", // this comes from the user
    content: mes,
  });

  // send the request
  let params = {
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: 0.7,
  };
  requestOAI("POST", "/v1/chat/completions", params, gotResults);

  // Note: there are additional parameters available, see
  // https://platform.openai.com/docs/api-reference/chat
}

function gotResults(results) {
  // add the first response-choice to the messages array
  messages.push(results.choices[0].message);

  let t = JSON.parse(results.choices[0].message.content);
  console.log(t);

  switch (report) {
    case 1:
      $('.title--large').fadeOut(2000, function () {
        var div = $("<h2 class='title--large main-title'>" + t["Headline"] + "</h2 >").hide();
        $(this).replaceWith(div);
        $('.title--large').fadeIn(2000);
      });
      $('.main-text').fadeOut(2000, function () {
        var div = $("<div class='main-text multi-column'><p>" + t["Content"] + "</p></div>").hide();
        $(this).replaceWith(div);
        $('.main-text').fadeIn(2000);
      });
      break;
    case 2:
      $('.side').fadeOut(2000, function () {
        var div = $("<h4 class='side'>" + t["Headline"] + "</h4>").hide();
        $(this).replaceWith(div);
        $('.side').fadeIn(2000);
      });
      $('.side_content').fadeOut(2000, function () {
        var div = $("<p class='side_content'>" + t["Content"] + "</p>").hide();
        $(this).replaceWith(div);
        $('.side_content').fadeIn(2000);
      });
      break;
    case 3:
      $('.bottom').fadeOut(2000, function () {
        var div = $("<h4 class='bottom'>" + t["Headline"] + "</h4>").hide();
        $(this).replaceWith(div);
        $('.bottom').fadeIn(2000);
      });
      $('.bottom_content').fadeOut(2000, function () {
        var div = $("<p class='bottom_content'>" + t["Content"] + "</p>").hide();
        $(this).replaceWith(div);
        $('.bottom_content').fadeIn(2000);
      });
      break;
  }

  generatePic(t);
}
function generatePic(description) {

  requestLSD("GET", "sdapi/v1/options", gotOptions);

  let modelInput = {
    prompt: description["Image Description"] + "in realistic style",
    // for more parameters, see the WebUI and results.parameters
  };

  requestLSD("POST", "sdapi/v1/txt2img", modelInput, donePredicting);

  console.log("Starting prediction, this might take a bit");
}

function gotOptions(results) {
  // console.log(results);
  //console.log("Using model " + results.sd_model_checkpoint);
  // use WebUI to change settings
}

function donePredicting(results) {
  if (results && results.images.length > 0) {
    switch (report) {
      case 1:
        $('.a').fadeOut(2000, function () {
          var div = $("<img class='a' src='" + 'data:image/png;base64,' + results.images[0] + "' />").hide();
          $(this).replaceWith(div);
          $('.a').fadeIn(2000);
        });
        window.print();
        break;
      case 2:
        $('.pie__image').fadeOut(2000, function () {
          var div = $("<img class='pie__image' src='" + 'data:image/png;base64,' + results.images[0] + "' />").hide();
          $(this).replaceWith(div);
          $('.pie__image').fadeIn(2000);
        });
        break;
      case 3:
        $('.bottom_pic').fadeOut(2000, function () {
          var div = $("<img class='bottom_pic' src='" + 'data:image/png;base64,' + results.images[0] + "' />").hide();
          $(this).replaceWith(div);
          $('.bottom_pic').fadeIn(2000);
        });
        break;
    }
    if (report < 3) {
      report++;
    } else {
      report = 1;
    }
  }
  console.log("Image is generated");
  sendMessage("Please generate a report");
}
