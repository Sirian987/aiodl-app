document.addEventListener("DOMContentLoaded", () => {
  const spinner = document.getElementById("spinner");
  const themeToggle = document.getElementById("theme-toggle");
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const resultsContainer = document.getElementById("results-container");
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("close-btn");
  const videoPlayer = document.getElementById("video-player");
  const audioPlayer = document.getElementById("audio-player");
  let isDarkMode = false;

  // Show spinner on page load
  spinner.style.display = "block";
  setTimeout(() => (spinner.style.display = "none"), 1000);

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    isDarkMode = !isDarkMode;
    themeToggle.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
  });

  // Fetch search results
  searchBtn.addEventListener("click", async () => {
    const query = searchInput.value;
    if (!query) {
      alert("Please enter a search term.");
      return;
    }

    spinner.style.display = "block";
    resultsContainer.innerHTML = "";

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=AIzaSyDjPFsAMyrb_aqHKtmiJr1HCI7Eig4cbEc`
      );
      const data = await response.json();

      if (data.items) {
        data.items.forEach((item) => {
          const video = document.createElement("div");
          video.className = "video-item";
          video.innerHTML = `
            <h3>${item.snippet.title}</h3>
            <img src="${item.snippet.thumbnails.default.url}" alt="${item.snippet.title}">
            <div>
              <button onclick="openPlayer('video', '${item.id.videoId}')">Play Video</button>
              <button onclick="openPlayer('audio', '${item.id.videoId}')">Play Audio</button>
            </div>
          `;
          resultsContainer.appendChild(video);
        });
      } else {
        resultsContainer.innerHTML = "<p>No results found.</p>";
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      spinner.style.display = "none";
    }
  });

  // Close modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    videoPlayer.style.display = "none";
    audioPlayer.style.display = "none";
    videoPlayer.pause();
    audioPlayer.pause();
  });

  window.onclick = (event) => {
    if (event.target === modal) {
      closeModal.click();
    }
  };
});

// Open modal and play media
// Open modal and play media using Zumfree API
async function openPlayer(type, videoId) {
  const modal = document.getElementById("modal");
  const videoPlayer = document.getElementById("video-player");
  const audioPlayer = document.getElementById("audio-player");

  try {
    // Request the Zumfree API
    const response = await fetch(
      `https://zumfree-3-a1362be38cc2.herokuapp.com/api/get?url=https://www.youtube.com/watch?v=${videoId}`
    );
    const data = await response.json();
console.log(data);
    if (type === "video") {
      const videoUrl = data.result.download_url; // Adjusted for Zumfree API
      modal.style.display = "flex";
      videoPlayer.src = videoUrl;
      videoPlayer.style.display = "block";
      audioPlayer.style.display = "none";
    } else if (type === "audio") {
      const audioUrl = `https://carla11.oceansaver.in/pacific/?8LO4SPqLCQ2Myb6Ya1HJgB3`; // Adjusted for Zumfree API
      modal.style.display = "flex";
      audioPlayer.src = audioUrl;
      audioPlayer.style.display = "block";
      videoPlayer.style.display = "none";
    }
  } catch (error) {
    alert("Error loading media.", error);
    console.error(error);
  }
}

// Download media using Zumfree API
async function downloadMedia(type, videoId) {
  try {
    // Request the Zumfree API
    const response = await fetch(
      `https://zumfree-3-a1362be38cc2.herokuapp.com/api/get?url=https://www.youtube.com/watch?v=${videoId}`
    );
    const data = await response.json();

    // Determine download URL
    const downloadUrl = data.result.download_url;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `${videoId}.${type === "video" ? "mp4" : "mp3"}`;
    a.click();
  } catch (error) {
    alert("Error downloading media.");
    console.error(error);
  }
}
