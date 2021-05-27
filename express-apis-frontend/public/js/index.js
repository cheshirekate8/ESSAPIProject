console.log("Hello from index.js!");
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("http://localhost:8080/tweets");
        console.log(res.status);
        if (res.status === 401) {
            window.location.replace("http://localhost:4000/log-in");
            return;
        } else {
            const { allTweets } = await res.json();
            const tweetsContainer = document.querySelector("#tweet-container");
            const tweetsHtml = allTweets.map(
                ({ message }) => `
                <div class="card">
                  <div class="card-body">
                    <p class="card-text">${message}</p>
                  </div>
                </div>
              `
            );
            tweetsContainer.innerHTML = tweetsHtml.join("");
            // console.log(res);
            // console.log(allTweets);
        }
    } catch (e) {
        console.error(e);
    }
});