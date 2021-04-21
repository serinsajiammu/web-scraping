// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     if (request.todo == "showPageAction") {
//         chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//             chrome.pageAction.show(tabs[0].id);
//         });
//     }
// });


chrome.browserAction.onClicked.addListener(function (tab) {
    console.log('icon clicked');
    console.log(tab.url);  //return current url

    

});
 //pattern checking of the profile url
 
//  function is_url(str)
// {
//   regexp =  //
//         if (regexp.test(str))
//         {
//           return true;
//         }
//         else
//         {
//           return false;
//         }
// }

// is_url(tab.url);   //validation 

chrome.runtime.onMessage.addListener((msg, sender) => {
  // First, validate the message's structure.
  if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
    // Enable the page-action for the requesting tab.
    chrome.pageAction.show(sender.tab.id);
  }
});
