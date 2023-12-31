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

      // -- Amazon URLs have an extra "/ref=" parameter to be removed
      if (clean_url.startsWith("https://www.amazon")) {
        clean_url = clean_url.split("/ref=")[0];
        // ---- URLs can be minimized removing everything before "/dp/"
        if (clean_url.includes("/dp/")) {
          var url_parts = clean_url.split("/");
          url_parts.splice(3, url_parts.indexOf("dp") - 3);
          clean_url = url_parts.join("/");
        }
      }

      // -- Google Maps URLs have an extra "/data=" parameter to be removed
      else if (clean_url.startsWith("https://www.google") && clean_url.includes("/maps")) {
        clean_url = clean_url.split("/data=")[0];
      }

      // -- Etsy URLs have extra parameters after the listing ID to be removed
      else if (clean_url.startsWith("https://www.etsy") && clean_url.includes("/listing/")) {
        var url_parts = clean_url.split("/");
        var listing_index = url_parts.indexOf("listing");
        if (url_parts.length > listing_index + 1) {
          url_parts.splice(listing_index + 2, url_parts.length - listing_index - 2);
        }
        clean_url = url_parts.join("/");
      }

      // -- Wish URLs can be minimized removing everything before "/product/"
      else if (clean_url.startsWith("https://www.wish") && clean_url.includes("/product/")) {
        var url_parts = clean_url.split("/");
        url_parts.splice(3, url_parts.indexOf("product") - 3);
        clean_url = url_parts.join("/");
      }

      // Final removal of the trailing slash
      if (clean_url.endsWith("/")) {
        clean_url = clean_url.slice(0, -1);
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
