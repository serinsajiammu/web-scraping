
$(document).ready(function () {

  var domInfo = localStorage.getItem('domInfo');
  if (!domInfo)
    return;

  domInfo = JSON.parse(domInfo);

  var index = -1;
  for (var i = 0; i < domInfo.length; i++) {
    if (window.location.href.startsWith(domInfo[i].companyProfileUrl)) {
      index = i;
    }
  }

  if (index >= 0) {
    var el = $('a[data-control-name="top_card_view_website_custom_cta_btn"]')[0];
    if (el) {
      domInfo[index].companyDomain = el.href;
      console.log(domInfo[index]);

      // TODO: show info in popup

      localStorage.setItem('domInfo', JSON.stringify(domInfo));

       $.ajax({
         url: "https://emailverify-api.herokuapp.com/api/v0.1/email-finder/",
         type: "POST",
         data: {
           name: domInfo.name,
           domain: domInfo.companyDomain
         },
         dataType: 'jsonp',
         success: function (result) {
           console.log(result);

         },
         error: function (error) {
           console.log(error);

         }
       });

    }
  }

});

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  // First, validate the message's structure.
  if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
    // Collect the necessary data. 
    // (For your specific requirements `document.querySelectorAll(...)`
    //  should be equivalent to jquery's `$(...)`.)
    var nameEl = getElementByXpath('/html/body/div[7]/div[3]/div/div/div/div/div[2]/main/div[1]/section/div[2]/div[2]/div[1]/ul[1]/li[1]');
    var name = "Not found";
    if (nameEl) {
      name = nameEl.textContent.trim();
    }

    var companyEl = getElementByXpath('/html/body/div[7]/div[3]/div/div/div/div/div[2]/main/div[1]/section/div[2]/div[2]/div[2]/ul/li[1]/a/span');
    var company = "Not found";
    if (companyEl) {
      company = companyEl.textContent.trim();
    }
    //get experience tab link

    var exphref = $('a[data-control-name="background_details_company"]')[0];

    // /html/body/div[7]/div[3]/div/div/div/div/div[2]/main/div[6]/div[2]/span/div/section/div[1]/section/ul/li[1]/section/div/div[1]/a
    // /html/body/div[7]/div[3]/div/div/div/div/div[2]/main/div[2]/div[5]/span/div/section/div[1]/section/ul/li[1]/section/div/div/a

    if (exphref) {
      var obj = {
        name: name,
        company: company,
        companyProfileUrl: exphref.href
      };

      var domInfo = localStorage.getItem('domInfo') || [];
      if (typeof domInfo == 'string') {
        domInfo = JSON.parse(domInfo);
      }

      domInfo.push(obj);

      localStorage.setItem('domInfo', JSON.stringify(domInfo));

      // chrome.storage.sync.set({ 'value': domInfo });
      response(obj);

      //find domain name
      window.location = exphref.href;
    } else {
      response({
        name: name,
        company: 'Not available'
      });
    }
  }

  return Promise.resolve("Dummy response to keep the console quiet");
});

