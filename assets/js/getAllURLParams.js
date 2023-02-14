/*
	Example
	getAllUrlParams().product; // 'shirt'
	getAllUrlParams().color; // 'blue'
	getAllUrlParams().newuser; // true
	getAllUrlParams().nonexistent; // undefined
	getAllUrlParams('http://test.com/?a=abc').a; // 'abc'
*/
function getAllUrlParams(url){
  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}

function ajaxCall(param) {
  $.ajax({
    url: "https://arthurwb.github.io/petAPIData/data.json",
    dataType: "json",
    success: function (response) {
      console.log(response.pets[0].name);
    }
  });
}

function parseURL() {
  if (getAllUrlParams().pet != undefined) {
    populatePage(getAllUrlParams().pet, false);
  } else {
    populatePage(getAllUrlParams().page, true);
  }
}

function populatePage(urlInput, homePage) {
  $.ajax({
    url: "https://arthurwb.github.io/petAPIData/data.json",
    dataType: "json",
    success: function (response) {
      if (homePage == false) {
        $("#petDetails").append(`
        <h1>${response.pets[urlInput].name}</h1>
        <p>Animal type: ${response.pets[urlInput].type}</p>
        <p>Breed: ${response.pets[urlInput].breed}</p>
        <p>Are they spayed/neutered?: ${response.pets[urlInput].spay}</p>
        <p>Age: ${response.pets[urlInput].age}</p>
        <p>Sex: ${response.pets[urlInput].sex}</p>
        <p>Are they vaxinated?: ${response.pets[urlInput].vax}</p>
        <p>Location: ${response.pets[urlInput].location}</p>
        <p>Are they available?: ${response.pets[urlInput].available}</p>
        <p>Details: ${response.pets[urlInput].details}</p>
        `);

        $("#image1").html(`<img src="${response.pets[urlInput].image1}" width="100%" height="225" alt="dog">`)
        $("#image2").html(`<img src="${response.pets[urlInput].image2}" width="100%" height="225" alt="dog">`)
        $("#image3").html(`<img src="${response.pets[urlInput].image3}" width="100%" height="225" alt="dog">`)
      } else if (homePage == true) {
        if (urlInput != undefined) {
          alert("on new page: " + urlInput);
          var dogStart = (urlInput * 6) - 6;
          for (let i = 0; i < 6; i++) {
            console.log(dogStart);
            dogStart++;
          }
        } else {
          for (let i = 0; i < 6; i++) {
            console.log(i);
          }
        }
      }
    }
  });
}

$(document).ready(function () {
  parseURL();
  $("#nextButton").click(function (e) { 
    console.log("click");
    location.href = "./index.html?page=" + 2;
  });
  $("[id^=dog]").click(function (e) {
    location.href = "./detail.html?dog=" + 0;
  });
});