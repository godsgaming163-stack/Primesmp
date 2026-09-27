// ===============================
// PRIME SMP WEBSITE SCRIPT
// ===============================

// INTRO ANIMATION
document.body.style.overflow = "hidden";

const intro = document.getElementById("intro");

if (intro) {
  setTimeout(() => {
    intro.classList.add("hide");
    document.body.style.overflow = "";
  }, 1500);
}


// ===============================
// AMBIENT BACKGROUND ANIMATION
// ===============================

const driftLayer = document.getElementById("drift");

if (
  driftLayer &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  for (let i = 0; i < 6; i++) {
    const block = document.createElement("div");

    block.className = "drift-block";
    block.style.left = Math.random() * 100 + "vw";
    block.style.animationDuration =
      18 + Math.random() * 10 + "s";
    block.style.animationDelay =
      -Math.random() * 20 + "s";

    driftLayer.appendChild(block);
  }
}


// ===============================
// SCROLL REVEAL
// ===============================

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.08
  }
);

document
  .querySelectorAll(".feature-row, .step")
  .forEach(element => observer.observe(element));


// ===============================
// SCROLL PROGRESS BAR
// ===============================

const progress = document.createElement("div");

progress.id = "progress";

document.body.appendChild(progress);

let ticking = false;

function updateProgress() {

  const max =
    document.documentElement.scrollHeight -
    window.innerHeight;

  progress.style.width =
    (max > 0
      ? (window.scrollY / max) * 100
      : 0) + "%";

  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {

    if (!ticking) {

      requestAnimationFrame(updateProgress);

      ticking = true;
    }

  },
  { passive: true }
);

updateProgress();


// ===============================
// COPY SERVER IP
// ===============================

function copyIP(text) {

  navigator.clipboard
    ?.writeText(text)
    .catch(() => {});

  document.querySelectorAll(".btn").forEach(button => {

    if (
      button.innerText.includes(
        text.split(":")[0]
      )
    ) {

      const oldHTML = button.innerHTML;

      button.innerHTML =
        "<strong>Copied ✓</strong>";

      setTimeout(() => {

        button.innerHTML = oldHTML;

      }, 1100);
    }

  });
}


// ==================================================
// PRIME SMP LIVE PLAYER COUNT
// ==================================================

const SERVER_IP = "play.primesmp.live";

const API_URL =
  `https://api.mcsrvstat.us/3/${SERVER_IP}`;


// Function that checks the Minecraft server
async function updatePlayerCount() {

  try {

    const response =
      await fetch(API_URL, {
        cache: "no-store"
      });

    if (!response.ok) {

      throw new Error(
        "Server status request failed"
      );
    }

    const data =
      await response.json();


    // If server is offline
    if (data.online === false) {

      console.log(
        "Prime SMP is currently offline."
      );

      return;
    }


    // Get player numbers
    const online =
      Number(data?.players?.online ?? 0);

    const max =
      Number(data?.players?.max ?? 500);


    // ===============================
    // UPDATE PLAYER STAT CARD
    // ===============================

    const stats =
      document.querySelectorAll(".stat");

    stats.forEach(stat => {

      const label =
        stat.querySelector("span");

      if (
        label &&
        label.textContent
          .trim()
          .toLowerCase() ===
          "players online"
      ) {

        const number =
          stat.querySelector("b");

        if (number) {

          number.textContent =
            `${online}/${max}`;
        }
      }

    });


    // ===============================
    // UPDATE HERO STATUS
    // ===============================

    const status =
      document.querySelector(".status-pill");

    if (status) {

      status.innerHTML =
        status.innerHTML.replace(
          /\d+\s*\/\s*\d+\s*online/i,
          `${online}/${max} online`
        );

    }


    console.log(
      `Prime SMP: ${online}/${max} players online`
    );

  }

  catch (error) {

    console.warn(
      "Could not get Prime SMP status:",
      error
    );

  }

}


// Run immediately
updatePlayerCount();


// Check again every 60 seconds
setInterval(
  updatePlayerCount,
  60 * 1000
);