document.addEventListener("DOMContentLoaded", () => {
  // === Highlight current nav tab ===
  const currentPage = document.body.dataset.page; // "home", "leaderboard", "videos", or "generator"

  const links = document.querySelectorAll("[data-page-link]");
  links.forEach((link) => {
    if (link.dataset.pageLink === currentPage) {
      link.classList.add("nav-link--active");
    }
  });

    // === Mobile navbar toggle ===
  const navToggle = document.querySelector(".nav-toggle");
  const navLinksContainer = document.querySelector(".nav-links");

  if (navToggle && navLinksContainer) {
    navToggle.addEventListener("click", () => {
      navLinksContainer.classList.toggle("nav-links--open");
    });
  }

  // === Home page: random quote + challenge (Presentacy vibe) ===
  const quoteEl = document.getElementById("presentacy-quote");
  const challengeEl = document.getElementById("presentacy-challenge");

  if (quoteEl && challengeEl) {
    const quotes = [
      "Every time you speak, you get 1% better.",
      "Your voice matters more than your mistakes.",
      "Confidence is just practice wearing a costume.",
      "The audience wants you to win, not fail.",
      "A strong start is good, but a clear ending is magic.",
      "If you’re nervous, that means you care. Use it.",
      "Fluency grows when you keep talking, not when you’re perfect."
    ];

    const challenges = [
      "In your next presentation, try to look at three different people in the room.",
      "Choose one key word and say it a little slower and stronger than the others.",
      "Start your next talk with a question instead of “Today I will talk about…”.",
      "Use one new word from your vocabulary notebook in your next presentation.",
      "Try not to read for 10 seconds: just look up and speak from your head.",
      "Add one short personal story to your next presentation.",
      "End your next talk with one clear sentence that starts with “So in the end…”."
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const randomChallenge =
      challenges[Math.floor(Math.random() * challenges.length)];

    quoteEl.textContent = randomQuote;
    challengeEl.textContent = randomChallenge;
  }

  // === Generator page: random topic generator ===
  const topicButton = document.getElementById("topic-button");
  const topicOutput = document.getElementById("topic-output");

  if (topicButton && topicOutput) {
    const topics = [
      "My dream school day",
      "A superpower I would love to have",
      "The best trip I have ever taken",
      "If I could meet any famous person",
      "A hobby that makes me feel calm",
      "The most interesting animal in the world",
      "One invention that changed our lives",
      "If I could design my own bedroom",
      "A book or story that stayed with me",
      "The perfect weekend for me",
      "A time when I helped someone",
      "If I could live in any country",
      "Why we should be kind online",
      "One rule I would add to our school",
      "A job I might like in the future",
      "Why teamwork is important",
      "A place in nature I would like to visit",
      "Something I learned from a mistake",
      "My favorite memory with friends",
      "If I could travel to the future",
      "A food everyone should try at least once",
      "Why sleep is more powerful than we think",
      "The most impressive building or place I have seen",
      "What makes a good friend",
      "One small change that could improve our classroom"
    ];

    topicButton.addEventListener("click", () => {
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      topicOutput.textContent = randomTopic;
    });
  }

  // === Leaderboard page: student search by name ===
   // === Leaderboard page: student search by name + class ===
  const searchInput = document.getElementById("student-search-input");
  const searchButton = document.getElementById("student-search-button");
  const resultBox = document.getElementById("student-result");
  const classSelect = document.getElementById("class-filter");

  // Only run this if we are on the page that has the search elements
  if (searchInput && searchButton && resultBox && classSelect) {
    // You will put ALL 185 students here.
    // Each student: name, class, and scores by week.
    const students = [
      {
        name: "Asya Hassan",
        class: "1A",
        scores: {
          week1: 0
          // later: week2: ..., week3: ...
        }
      },
      {
        name: "Asel Ismail",
        class: "1A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Aylan Talal",
        class: "1A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Tala Mohamed",
        class: "1A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Zeina Samer ",
        class: "1A",
        scores: {
          week1: 25
        }
      },
      {
        name: "Fatma Mohamed",
        class: "1A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Layan Khaled",
        class: "1A",
        scores: {
          week1: 10
        }
      },
      {
        name: "Yasmin Ehab",
        class: "1A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Ahmed Talal",
        class: "1A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Khaled Waleed",
        class: "1A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Fayad Raed",
        class: "1A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Malek Mohamed",
        class: "1A",
        scores: {
          week1: 10
        }
      },
      {
        name: "Mobasher Megahed",
        class: "1A",
        scores: {
          week1: 9
        }
      },
      {
        name: "Yahia Ahmed",
        class: "1A",
        scores: {
          week1: 19
        }
      },
      {
        name: "Gamila Ahmed",
        class: "1B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Ganna Mohamed",
        class: "1B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Dana Ahmed",
        class: "1B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Dima Mohamed",
        class: "1B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Zat Elmuiz",
        class: "1B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Rana Youssef",
        class: "1B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Fayrouz Mohamed",
        class: "1B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Carla Hossam",
        class: "1B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Adam ahmed",
        class: "1B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Adam Amr",
        class: "1B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Adham Nasr",
        class: "1B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Rahim Amr",
        class: "1B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Abdelrahman Sherif",
        class: "1B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Mohamed Hasanien",
        class: "1B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Younis Yasser",
        class: "1B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Farida Mohamed",
        class: "2A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Hala Abdelmoiem",
        class: "2A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Karma Mohamed",
        class: "2A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Karma Mohamed Mostafa",
        class: "2A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Karma Mostafa",
        class: "2A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Maria Mahmoud",
        class: "2A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Rawnag Hussien",
        class: "2A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Syan Marwan",
        class: "2A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Malika Mahmoud",
        class: "2A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Abdelrahman Seif",
        class: "2A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Ahmed Hussien",
        class: "2A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Ahmed Shehab",
        class: "2A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Malek Alaa",
        class: "2A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Nael Adam",
        class: "2A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Omar Mohamed",
        class: "2A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Zain Aldin",
        class: "2A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Amira Montser",
        class: "2B",
        scores: {
          week1: 0
        }
      },
       {
        name: "Hayat Walid ",
        class: "2B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Makka Mostafa",
        class: "2B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Tala Yousry",
        class: "2B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Reman Ashraf",
        class: "2B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Fahd Abdelrahman",
        class: "2B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Hamza Seody",
        class: "2B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Malek Amr",
        class: "2B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Mohamed Ahmed ",
        class: "2B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Mohamed Ali ",
        class: "2B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Mohamed Karim ",
        class: "2B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Mohamed Mostafa",
        class: "2B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Mohamed  Moataz",
        class: "2B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Rayan Islam",
        class: "2B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Sajed Hossain",
        class: "2B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Selim Gamal",
        class: "2B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Aseel Tamer ",
        class: "3",
        scores: {
          week1: 0
        }
      },
      {
        name: "Ayla Ahmed",
        class: "3",
        scores: {
          week1: 0
        }
      },
      {
        name: "Berla Mohamed Ahmed ",
        class: "3",
        scores: {
          week1: 0
        }
      },
      {
        name: "Berla Mohamed Adel",
        class: "3",
        scores: {
          week1: 14
        }
      },
      {
        name: "Gowan Ali ",
        class: "3",
        scores: {
          week1: 0
        }
      },
      {
        name: "Hoor Othman ",
        class: "3",
        scores: {
          week1: 0
        }
      },
      {
        name: "Rovan Ahmed",
        class: "3",
        scores: {
          week1: 0
        }
      },
      {
        name: "Karma Ramy ",
        class: "3",
        scores: {
          week1: 0
        }
      },
      {
        name: "Asser Mostafa",
        class: "3",
        scores: {
          week1: 0
        }
      },
      {
        name: "Ibrahim Abdelmaboud",
        class: "3",
        scores: {
          week1: 0
        }
      },
      {
        name: "Eyad Islam",
        class: "3",
        scores: {
          week1: 20
        }
      },
      {
        name: "Taim Allah",
        class: "3",
        scores: {
          week1: 0
        }
      },
      {
        name: "Tamim Sherif",
        class: "3",
        scores: {
          week1: 20
        }
      },
      {
        name: "Hamza Mohamed",
        class: "3",
        scores: {
          week1: 0
        }
      },
      {
        name: "Abdallah Mina ",
        class: "3",
        scores: {
          week1: 0
        }
      },
      {
        name: "Amr Ahmed",
        class: "3",
        scores: {
          week1: 0
        }
      },
      {
        name: "Mohamed Reda",
        class: "3",
        scores: {
          week1: 0
        }
      },
      {
        name: "Asia Ahmed",
        class: "4",
        scores: {
          week1: 0
        }
      },
      {
        name: "Alma Amer",
        class: "4",
        scores: {
          week1: 0
        }
      },
      {
        name: "Hanin Montser",
        class: "4",
        scores: {
          week1: 0
        }
      },
      {
        name: "Jana Hassan",
        class: "4",
        scores: {
          week1: 0
        }
      },
      {
        name: "Hayat Mohamed",
        class: "4",
        scores: {
          week1: 0
        }
      },
      {
        name: "Farah Abdelrahman",
        class: "4",
        scores: {
          week1: 0
        }
      },
      {
        name: "Karma Shehab",
        class: "4",
        scores: {
          week1: 0
        }
      },
      {
        name: "Malka Reda",
        class: "4",
        scores: {
          week1: 0
        }
      },
      {
        name: "Ahmed Mahmoud",
        class: "4",
        scores: {
          week1: 0
        }
      },
      {
        name: "Adam Mostafa",
        class: "4",
        scores: {
          week1: 0
        }
      },
      {
        name: "Hamza Ahmed",
        class: "4",
        scores: {
          week1: 0
        }
      },
      {
        name: "Abdallah Mohsen",
        class: "4",
        scores: {
          week1: 0
        }
      },
      {
        name: "Omar hossain",
        class: "4",
        scores: {
          week1: 0
        }
      },
      {
        name: "Slim Mostafa",
        class: "4",
        scores: {
          week1: 0
        }
      },
      {
        name: "Mohamed Ahmed",
        class: "4",
        scores: {
          week1: 0
        }
      },
      {
        name: "Mohamed Ahmed Ali",
        class: "4",
        scores: {
          week1: 0
        }
      },
      {
        name: "Megdam Osama",
        class: "4",
        scores: {
          week1: 0
        }
      },
      {
        name: "Yassin Mohamed",
        class: "4",
        scores: {
          week1: 0
        }
      },
      {
        name: "Judy Abdelraziq",
        class: "5A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Dan Marwan",
        class: "5A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Rahma Abdelrahman",
        class: "5A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Retag Sherif",
        class: "5A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Celia Hamdy",
        class: "5A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Farha Yasser",
        class: "5A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Farida Ahmed",
        class: "5A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Kinda Ahmed",
        class: "5A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Yasmin Maher",
        class: "5A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Khaled Ayman",
        class: "5A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Shehab Islam",
        class: "5A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Malek Mohamed",
        class: "5A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Mohamed Hany ",
        class: "5A",
        scores: {
          week1: 0
        }
      },
      {
        name: "Ayten Hossain",
        class: "5B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Brihan Moaaz",
        class: "5B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Talia Mohamed",
        class: "5B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Mariam Ahmed",
        class: "5B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Ahmed Hany",
        class: "5B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Ahmed Yousry",
        class: "5B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Abdallah Barakat",
        class: "5B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Omar Ahmed",
        class: "5B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Omar Mahmoud",
        class: "5B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Saif Mohamed",
        class: "5B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Moaaz Osama",
        class: "5B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Youssef Mosaab",
        class: "5B",
        scores: {
          week1: 0
        }
      },
      {
        name: "Alma Ahmed",
        class: "6",
        scores: {
          week1: 16
        }
      },
      {
        name: "Jana Mostafa",
        class: "6",
        scores: {
          week1: 0
        }
      },
      {
        name: "Rafeef Ahmed",
        class: "6",
        scores: {
          week1: 19
        }
      },
      {
        name: "Zeina Mohamed",
        class: "6",
        scores: {
          week1: 19
        }
      },
      {
        name: "Malak Hassan",
        class: "6",
        scores: {
          week1: 0
        }
      },
      {
        name: "Mennat Allah",
        class: "6",
        scores: {
          week1: 0
        }
      },
      {
        name: "Ibrahim mahmoud",
        class: "6",
        scores: {
          week1: 0
        }
      },
      {
        name: "Abdallah Amin",
        class: "6",
        scores: {
          week1: 0
        }
      },
      {
        name: "Mohamed Abelrahman",
        class: "6",
        scores: {
          week1: 22
        }
      },
      {
        name: "Mostafa Abdelrahman",
        class: "6",
        scores: {
          week1: 16
        }
      },
      {
        name: "Moyasser Osman",
        class: "6",
        scores: {
          week1: 0
        }
      },
      {
        name: "Yassin Ahmed",
        class: "6",
        scores: {
          week1: 25
        }
      },
      {
        name: "Youssef Mohamed",
        class: "6",
        scores: {
          week1: 17
        }
      },
      {
        name: "Aya Abdallah",
        class: "6",
        scores: {
          week1: 0
        }
      },
      {
        name: "Aysel Hatem",
        class: "7",
        scores: {
          week1: 0
        }
      },
      {
        name: "Jana Ahmed",
        class: "7",
        scores: {
          week1: 20
        }
      },
      {
        name: "Rawan Ahmed",
        class: "7",
        scores: {
          week1: 0
        }
      },
      {
        name: "Sila Tamer",
        class: "7",
        scores: {
          week1: 0
        }
      },
      {
        name: "Mariam Ahmed",
        class: "7",
        scores: {
          week1: 0
        }
      },
      {
        name: "Mariam Hassan",
        class: "7",
        scores: {
          week1: 0
        }
      },
      {
        name: "Nada Abdelfatah",
        class: "7",
        scores: {
          week1: 0
        }
      },
      {
        name: "Wajen mahmoud",
        class: "7",
        scores: {
          week1: 0
        }
      },
      {
        name: "ahmed Amin",
        class: "7",
        scores: {
          week1: 0
        }
      },
      {
        name: "Asser Ahmed",
        class: "7",
        scores: {
          week1: 0
        }
      },
      {
        name: "Amir Hisham",
        class: "7",
        scores: {
          week1: 0
        }
      },
      {
        name: "Badr Mohamed",
        class: "7",
        scores: {
          week1: 0
        }
      },
      {
        name: "Braa Moaaz",
        class: "7",
        scores: {
          week1: 18
        }
      },
      {
        name: "Hamza Tarek",
        class: "7",
        scores: {
          week1: 25
        }
      },
      {
        name: "Mazen Yousry",
        class: "7",
        scores: {
          week1: 0
        }
      },
      {
        name: "Mostafa Maher",
        class: "7",
        scores: {
          week1: 0
        }
      },
      {
        name: "Ammar Yasser",
        class: "7",
        scores: {
          week1: 0
        }
      },
      {
        name: "Omar Lotfy",
        class: "7",
        scores: {
          week1: 0
        }
      },
      {
        name: "Yassien Osama",
        class: "7",
        scores: {
          week1: 0
        }
      },
      {
        name: "Youssef Mohamed",
        class: "7",
        scores: {
          week1: 0
        }
      },
      {
        name: "Youssef Mostafa",
        class: "7",
        scores: {
          week1: 0
        }
      },
      {
        name: "Arwa Ahmed",
        class: "8",
        scores: {
          week1: 0
        }
      },
      {
        name: "Aseel Ehab",
        class: "8",
        scores: {
          week1: 0
        }
      },
      {
        name: "Esraa Hossain",
        class: "8",
        scores: {
          week1: 0
        }
      },
      {
        name: "Roaa Alaa",
        class: "8",
        scores: {
          week1: 0
        }
      },
      {
        name: "Roqaia Ahmed",
        class: "8",
        scores: {
          week1: 20
        }
      },
      {
        name: "Salma Hany",
        class: "8",
        scores: {
          week1: 0
        }
      },
      {
        name: "Safia Abdallah",
        class: "8",
        scores: {
          week1: 0
        }
      },
      {
        name: "Lamar Mohamed",
        class: "8",
        scores: {
          week1: 20
        }
      },
      {
        name: "Logeen Osama",
        class: "8",
        scores: {
          week1: 0
        }
      },
      {
        name: "Maya Zaher",
        class: "8",
        scores: {
          week1: 0
        }
      },
      {
        name: "Nadeen Ahmed",
        class: "8",
        scores: {
          week1: 0
        }
      },
      {
        name: "Adam Ahmed",
        class: "8",
        scores: {
          week1: 0
        }
      },
      {
        name: "Anas Mohamed",
        class: "8",
        scores: {
          week1: 23
        }
      },
      {
        name: "Hamza Ahmed",
        class: "8",
        scores: {
          week1: 0
        }
      },
      {
        name: "Hamza Osama",
        class: "8",
        scores: {
          week1: 0
        }
      },
      {
        name: "Abdelrahman Barakat",
        class: "8",
        scores: {
          week1: 0
        }
      },
      {
        name: "Omar Montaser",
        class: "8",
        scores: {
          week1: 0
        }
      },
      {
        name: "Mahmoud Abdelmaboud",
        class: "8",
        scores: {
          week1: 0
        }
      },
      {
        name: "Mohsen Ahmed",
        class: "8",
        scores: {
          week1: 0
        }
      },
      {
        name: "Nabil Abdelrahman",
        class: "8",
        scores: {
          week1: 0
        }
      },
      {
        name: "Youssef Hisham",
        class: "8",
        scores: {
          week1: 0
        }
      },
      {
        name: "Hala Amin",
        class: "9",
        scores: {
          week1: 0
        }
      },
      {
        name: "Rodaina Youssef",
        class: "9",
        scores: {
          week1: 20
        }
      },
      {
        name: "Raghad Youssef",
        class: "9",
        scores: {
          week1: 26
        }
      },
      {
        name: "Rital Ahmed",
        class: "9",
        scores: {
          week1: 24
        }
      },
      {
        name: "Farah Othman",
        class: "9",
        scores: {
          week1: 25
        }
      },
      {
        name: "Menna Mohamed",
        class: "9",
        scores: {
          week1: 0
        }
      },
      {
        name: "Asser Hatem",
        class: "9",
        scores: {
          week1: 0
        }
      },

      
      

      // TODO: add all your other students here in the same format
      // {
      //   name: "Khaled Walid",
      //   class: "7",
      //   scores: { week1: 20 }
      // },
      // {
      //   name: "Layan Khaled",
      //   class: "4",
      //   scores: { week1: 25 }
      // }
    ];

    const getMotivationText = (scoreWeek1) => {
      const score = typeof scoreWeek1 === "number" ? scoreWeek1 : 0;

      if (score >= 28) {
        return "Amazing start! Keep this level and try to challenge yourself with harder topics.";
      } else if (score >= 20) {
        return "Great work. You have a solid base—focus on one skill (like eye contact or voice) to level up.";
      } else if (score > 0) {
        return "You’ve started the journey. Every presentation is practice—keep going and you will feel the difference.";
      } else {
        return "Your first score will appear here after your first presentation. Get ready to show us what you can do!";
      }
    };

        // === LEADERBOARD (whole school or by class) ===
    const leaderboardClassFilter = document.getElementById("leaderboard-class-filter");
    const leaderboardBody = document.getElementById("leaderboard-table-body");

    // Helper: compute total points (sum of all weeks)
    const getTotalPoints = (student) => {
      const scores = student.scores || {};
      return Object.values(scores).reduce((sum, value) => sum + (value || 0), 0);
    };

    const getBadgeForPoints = (points) => {
      if (points >= 65) return "Presentacy Star";
      if (points >= 55) return "Shining Star";
      if (points >= 30) return "Bright Star";
      return "Rising Star";
    };

    const renderLeaderboard = (classFilter) => {
      if (!leaderboardBody) return;

      // 1) Filter by class if classFilter is given
      let pool =
        classFilter && classFilter !== ""
          ? students.filter((s) => s.class === classFilter)
          : students.slice(); // copy whole array

      // 2) Compute total points for each student
      const withTotals = pool.map((s) => ({
        ...s,
        totalPoints: getTotalPoints(s)
      }));

      // 3) Remove students with 0 points if you want (optional)
      const nonZero = withTotals.filter((s) => s.totalPoints > 0);

      // 4) Sort by total points desc
      nonZero.sort((a, b) => b.totalPoints - a.totalPoints);

      // 5) Take top 5 (or top 10)
      const top = nonZero.slice(0, 5);

      // 6) Build table rows
      leaderboardBody.innerHTML = top
        .map((student, index) => {
          const rank = index + 1;
          const rankClass =
            rank === 1 ? "rank rank-1" : rank === 2 ? "rank rank-2" : rank === 3 ? "rank rank-3" : "rank";
          const badge = getBadgeForPoints(student.totalPoints);

          return `
            <tr>
              <td class="${rankClass}">${rank}</td>
              <td>${student.name}</td>
              <td>${student.class}</td>
              <td>${student.totalPoints}</td>
              <td><span class="badge">${badge}</span></td>
            </tr>
          `;
        })
        .join("");

      // If there are no students yet (e.g. no points), show a friendly message
      if (top.length === 0) {
        leaderboardBody.innerHTML = `
          <tr>
            <td colspan="5" style="font-size:0.85rem; color:var(--text-muted); padding:0.75rem;">
              No scores yet for this class. The leaderboard will appear after the first presentations.
            </td>
          </tr>
        `;
      }
    };

    // Initial render: whole school leaderboard
    if (leaderboardBody) {
      renderLeaderboard("");
    }

    // Re-render when user changes the class filter
    if (leaderboardClassFilter) {
      leaderboardClassFilter.addEventListener("change", () => {
        renderLeaderboard(leaderboardClassFilter.value);
      });
    }

    const renderStudentResult = (student) => {
      const weekEntries = Object.entries(student.scores || {});

      // Sort by week number (week1, week2, ...)
      weekEntries.sort((a, b) => {
        const numA = parseInt(a[0].replace("week", ""), 10) || 0;
        const numB = parseInt(b[0].replace("week", ""), 10) || 0;
        return numA - numB;
      });

      let weeksHtml = "";

      if (weekEntries.length === 0) {
        weeksHtml = "<p>No scores recorded yet.</p>";
      } else {
        weeksHtml = weekEntries
          .map(([weekKey, score]) => {
            const weekNumber = weekKey.replace("week", "");
            return `<p>Week ${weekNumber}: <strong>${score}</strong> points</p>`;
          })
          .join("");
      }

      const week1Score = student.scores ? student.scores.week1 : 0;
      const motivation = getMotivationText(week1Score);

      resultBox.innerHTML = `
        <div class="student-result-card">
          <h3>${student.name}</h3>
          <div class="student-meta">
            Class: ${student.class}
          </div>
          <div class="student-weeks">
            ${weeksHtml}
          </div>
          <p class="motivation">${motivation}</p>
        </div>
      `;
    };

    const renderMultipleResults = (list, term, selectedClassLabel) => {
      const cards = list
        .map(
          (student) => `
          <div class="student-result-card">
            <h3>${student.name}</h3>
            <div class="student-meta">
              Class: ${student.class}
            </div>
            <div class="student-weeks">
              ${
                student.scores && typeof student.scores.week1 === "number"
                  ? `<p>Week 1: <strong>${student.scores.week1}</strong> points</p>`
                  : "<p>No scores recorded yet.</p>"
              }
            </div>
          </div>
        `
        )
        .join("");

      const classInfo =
        selectedClassLabel && selectedClassLabel !== ""
          ? ` in class <strong>${selectedClassLabel}</strong>`
          : "";

      resultBox.innerHTML = `
        <div style="margin-bottom:0.4rem; font-size:0.85rem; color:var(--text-muted);">
          We found ${list.length} students matching "<strong>${term}</strong>"${classInfo}. 
          Add more letters (for example last name) if this is not you.
        </div>
        <div class="student-multi-results">
          ${cards}
        </div>
      `;
    };

    const renderNotFound = (term, selectedClassLabel) => {
      const classInfo =
        selectedClassLabel && selectedClassLabel !== ""
          ? ` in class "<strong>${selectedClassLabel}</strong>"`
          : "";

      resultBox.innerHTML = `
        <div class="error-message">
          No student found with the name "<strong>${term}</strong>"${classInfo}. 
          Check your spelling or try your full name.
        </div>
      `;
    };

    const handleSearch = () => {
      const term = searchInput.value.trim();
      const selectedClass = classSelect.value; // e.g. "1A", "7", "5B" or ""
      if (!term) {
        resultBox.innerHTML = "";
        return;
      }

      const lowerTerm = term.toLowerCase();

      // Filter by class first (if selected)
      const pool =
        selectedClass && selectedClass !== ""
          ? students.filter((s) => s.class === selectedClass)
          : students;

      // If class is selected but there are no students assigned to that class, short-circuit
      if (pool.length === 0) {
        renderNotFound(term, selectedClass);
        return;
      }

      // 1) Try exact full-name match within this class (or all classes if none selected)
      const exactMatch = pool.find(
        (s) => s.name.toLowerCase() === lowerTerm
      );
      if (exactMatch) {
        renderStudentResult(exactMatch);
        return;
      }

      // 2) Try names that START with the term (so "Khaled" matches "Khaled Walid", not "Layan Khaled")
      const startsWithMatches = pool.filter((s) => {
        const n = s.name.toLowerCase();
        return n === lowerTerm || n.startsWith(lowerTerm + " ");
      });

      if (startsWithMatches.length === 1) {
        renderStudentResult(startsWithMatches[0]);
        return;
      } else if (startsWithMatches.length > 1) {
        renderMultipleResults(startsWithMatches, term, selectedClass);
        return;
      }

      // 3) Fall back to "includes" search for partial terms
      const broadMatches = pool.filter((s) =>
        s.name.toLowerCase().includes(lowerTerm)
      );

      if (broadMatches.length === 1) {
        renderStudentResult(broadMatches[0]);
      } else if (broadMatches.length > 1) {
        renderMultipleResults(broadMatches, term, selectedClass);
      } else {
        renderNotFound(term, selectedClass);
      }
    };

    searchButton.addEventListener("click", handleSearch);

    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        handleSearch();
      }
    });

      // === Presenty Wall: tab switching ===
  const wallTabButtons = document.querySelectorAll(".wall-tab-button");
  const wallPanels = document.querySelectorAll(".wall-tab-panel");

  if (wallTabButtons.length && wallPanels.length) {
    wallTabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.wallTab;

        wallTabButtons.forEach((b) =>
          b.classList.remove("wall-tab-button--active")
        );
        btn.classList.add("wall-tab-button--active");

        wallPanels.forEach((panel) => {
          const isActive = panel.dataset.wallPanel === target;
          panel.classList.toggle("wall-tab-panel--active", isActive);
        });
      });
    });
  }
  }
}
)
