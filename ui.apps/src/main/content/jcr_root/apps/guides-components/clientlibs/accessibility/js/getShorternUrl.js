let shortenedUrl;
const getShorternUrl = async (req, res) => {
    const  originalUrl  = window.location.href;
    // console.log(originalUrl, ":originalUrl");
    
    try {
      const response = await fetch(`https://api.tinyurl.com/create`, {
        body: JSON.stringify({
          "url": originalUrl,
          "domain": "tinyurl.com"
        }),
        method: "POST",
        headers: {
          "Authorization": "Bearer p6MooXvNbW1HheaGWroF5pKsbiRYthCtVBuHNGewgxahHkXlPs644LkqG0Kg", // Correct format for API key
          "Content-Type": "application/json",
        },
      });
  
      // Check if the response is ok (status 200-299)
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json(); // Get the response data
  
      // Log the full response to debug
      // console.log(data);
  
      // Adjust this based on TinyURL API's response structure
       shortenedUrl = data.data?.tiny_url || data.shortenedUrl || data;
      console.log(shortenedUrl);
    //   res.json({ shortenedUrl });
    } catch (error) {
      console.error("Error shortening URL:", error);
      res.status(500).json({ error: "Failed to shorten URL" });
    }
};

getShorternUrl();

// URL Shortening Function
document
.getElementById("log-shortened-url-btn")
.addEventListener("click", () => {
    if (shortenedUrl) {
    console.log("Shortened URL:", shortenedUrl);

    // Show modal and set URL in input field
    const modalParent = document.getElementById("main-short-url-div");
    const modal = document.getElementById("short-url-modal");
    const input = document.getElementById("shortened-url-input");

    // Make sure both elements are visible
    modalParent.classList.remove("hidden");
    modal.classList.remove("hidden"); // Add this line

    input.value = shortenedUrl;

    // Copy functionality
    document.getElementById("copy-url-btn").onclick = () => {
        input.select();
        document.execCommand("copy");
        alert("URL copied to clipboard!");
    };
    } else {
    alert("Failed to shorten URL.");
    }
});
document.getElementById("close-modal-btn").onclick = () => {
document.getElementById("main-short-url-div").classList.add("hidden"); // Hide modal
};