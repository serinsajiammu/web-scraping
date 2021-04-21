const setDOMInfo = info => {
  document.getElementById('names').textContent = info.name;
  document.getElementById('company').textContent = info.company;
  document.getElementById("info").style.display = 'block';

};

const setDomError = () => {
  document.getElementById("error").style.display = 'block';
};

var expression = /(ftp|http|https):\/\/?((www|\w\w)\.)?linkedin.com\/in\/.+?/;
var regex = new RegExp(expression);

// function matchFun(){
// 		var res="";
// 		if(tabs[0].id.match(regex)){
// 			res="Valid URL";
// 		}else{
// 			res="Only linkedin profile urls supported";
// 		}
// 		document.getElementById("notif").innerHTML = res;
// 	}



// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', () => {
  // ...query for the active tab...
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    // ...and send a request for the DOM info...

    if (regex.test(tabs[0].url)) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { from: 'popup', subject: 'DOMInfo' },
        // ...also specifying a callback to be called 
        //    from the receiving end (content script).
        setDOMInfo);
    } else {
      setDomError();
    }
  });
});



