window.addEventListener("load", () => {
    // (A) TEST FETCH HEADER REQUEST TO GOOGLE ADSENSE
    let test = new Request(
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
      // "https://static.ads-twitter.com/uwt.js",
      { method: "HEAD", mode: "no-cors" }
    );
   
    // (B) FIRE THE REQEST
    fetch(test)
    .then(res => $('#ADS-block-detect').hide())
    .catch(err => $('#ADS-block-detect').show());
});