document.addEventListener('DOMContentLoaded', function () {
  var copyButton = document.getElementById('copyButton');

  copyButton.addEventListener('click', function () {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var url = new URL(tabs[0].url);

      // Default cleaning
      // -- Google Search URLs have an extra "q" parameter that should be kept
      if (url.href.startsWith("https://www.google") && url.href.includes("/search")) {
        if (url.searchParams.has("q")) {
          url.search = '?q=' + url.searchParams.get("q");
        } else {
          url.search = '';
        }
      }

      // -- Google Play URLs may have an "id" parameter that should be kept
      else if (url.href.startsWith("https://play.google")) {
        if (url.searchParams.has("id")) {
          url.search = '?id=' + url.searchParams.get("id");
        } else {
          url.search = '';
        }
      }

      // -- YouTube URLs may have a "v" parameter that should be kept
      else if (url.href.startsWith("https://www.youtube.com/watch")) {
        if (url.searchParams.has("v")) {
          url.search = '?v=' + url.searchParams.get("v");
        } else {
          url.search = '';
        }
      }

      // -- Other URLs are cleaned by removing the search parameters
      else {
        url.search = '';
      }

      // Extra cleaning
      clean_url = url.href.split("#")[0];

      // -- Remove http(s) and www from the beginning of the URL
      if (clean_url.startsWith("https://")) {
        clean_url = clean_url.slice("https://".length);
      } else if (clean_url.startsWith("http://")) {
        clean_url = clean_url.slice("http://".length);
      }
      if (clean_url.startsWith("www.")) {
        clean_url = clean_url.slice("www.".length);
      }

      // -- Amazon URLs have an extra "/ref=" parameter to be removed
      if (clean_url.startsWith("https://www.amazon")) {
        clean_url = clean_url.split("/ref=")[0];
      }

      // -- Google Maps URLs have an extra "/data=" parameter to be removed
      else if (clean_url.startsWith("https://www.google") && clean_url.includes("/maps")) {
        clean_url = clean_url.split("/data=")[0];
      }

      navigator.clipboard.writeText(clean_url).then(function () {
        copyButton.innerText = 'Copied!';

        setTimeout(function () {
          copyButton.innerText = 'Copy clean URL';
        }, 750);

      });

    });

  });

});

/*
Working sites (15/07/2023):
- Amazon
- AliExpress
- eBay
- Shein
- Etsy
- Temu
- Wish
- Google Play
- Google Maps
- YouTube
*/
