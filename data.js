// Demo seed content. Names and articles are representative placeholders, not real Buzz reporting.
window.BUZZ_SEED = {
  sections: ["School", "Current Events", "Sports", "Opinion", "Features"],
  issues: [
    {
      num: 145, date: "2026-10-07", published: false, featured: "passion-people-woodshop",
      intro: "Draft intro: this week we check in on the woodshop, break down the bracket, and ask what the 8th grade is really thinking.",
      uq: [{ text: "Can we please have more than one flavor of seed butter sandwich?", who: "6th grader" }]
    },
    {
      num: 144, date: "2026-09-30", published: true, featured: "outdoor-classroom",
      intro: "Welcome to Issue 144! This week we sat in the grass at the Outdoor Classroom, asked why your seat suddenly has a name on it, and argued about who is winning October. Pick a story, any story. Then check the UQ News Room, because you wrote some of it.",
      uq: [
        { text: "Why does the hallway clock run four minutes fast and nobody fixes it?", who: "7th grader" },
        { text: "The new water bottle filler is the best thing that has happened to this school.", who: "8th grader" },
        { text: "Please bring back the long recess on Fridays.", who: "5th grader" },
        { text: "Apple cider day was a 10 out of 10. No notes.", who: "9th grader" },
        { text: "Whoever is leaving rubber bands on the stairs: we see you.", who: "Anonymous" }
      ]
    },
    {
      num: 143, date: "2026-09-23", published: true, featured: "welcome-back-editors",
      intro: "Our first issue of the year! Meet the team, see what is new on campus, and tell us what you want to read.",
      uq: [
        { text: "Is it just me or is the new schedule confusing?", who: "6th grader" },
        { text: "Great first week, everyone.", who: "Anonymous" }
      ]
    }
  ],
  articles: [
    {
      slug: "outdoor-classroom", issue: 144, status: "published", section: "School",
      title: "The Outdoor Classroom Is Back, and It Has Grown",
      subtitle: "New logs, new benches, and a whole lot more class time outside.",
      author: "Maya Alvarez", year: "8th grade", credit: "Photo: Buzz staff",
      alt: "Students seated on log benches in a wooded clearing during class.",
      caption: "A class meets on the new log benches.", color: "#4c7a3d",
      docUrl: "",
      body: [
        "[Demo text] Walk past the field this fall and you may spot a class sitting in a circle under the trees. The Outdoor Classroom has been expanded, and teachers say they are using it more than ever.",
        "Several teachers described moving reading, science observation, and even some math lessons outside when the weather allows.",
        "\"It changes how people talk to each other,\" one teacher said. \"Nobody is hiding behind a laptop.\"",
        "Students had mixed but mostly positive opinions. The biggest complaint so far is the bugs. The biggest compliment is the quiet."
      ],
      sources: ["Interviews with teachers and students, September 2026"]
    },
    {
      slug: "current-events-week", issue: 144, status: "published", section: "Current Events",
      title: "Current Events: What You Missed This Week",
      subtitle: "A quick, kid-friendly look at the news people were talking about.",
      author: "Theo Brennan", year: "7th grade", credit: "Illustration: Buzz staff",
      alt: "Illustrated globe with headline cards around it.", caption: "", color: "#2b5d8a", docUrl: "",
      body: [
        "[Demo text] Each week Current Events rounds up a few stories from the wider world and explains why they matter to us.",
        "This week: a look at local weather, a science story about migrating birds, and why so many people are watching the baseball postseason."
      ],
      sources: ["Public news reports, week of September 21, 2026"]
    },
    {
      slug: "assigned-seats-interview", issue: 144, status: "published", section: "School",
      title: "Assigned Seats: An Interview",
      subtitle: "Why did teachers start choosing where you sit? We asked.",
      author: "Priya Nair", year: "8th grade", credit: "Photo: Buzz staff",
      alt: "A classroom with desks arranged in small groups.", caption: "Desks arranged in groups for the new term.",
      color: "#8a5a2b", docUrl: "",
      body: [
        "[Demo text] Many students noticed name cards on desks this fall. We sat down with a teacher to find out why.",
        "Q: Why assigned seats?",
        "A: \"It helps me learn names quickly and lets everyone work with different people.\"",
        "Q: Will they change?",
        "A: \"Yes. Probably every few weeks.\""
      ],
      sources: ["Interview with a Middle School teacher, September 2026"]
    },
    {
      slug: "mlb-playoff-predictions", issue: 144, status: "published", section: "Sports",
      title: "MLB Playoff Predictions",
      subtitle: "Sports Corner picks the winners, and braces to be wrong.",
      author: "Sam Okafor", year: "9th grade", credit: "Illustration: Buzz staff",
      alt: "A baseball on a field of grass.", caption: "", color: "#a33a2e", docUrl: "",
      body: [
        "[Demo text] October baseball is here, and so are our bold predictions.",
        "Our pick for the championship series: let's just say it involves a lot of home runs. Check back next week to see how wrong we were."
      ],
      sources: ["Official MLB standings"]
    },
    {
      slug: "passion-people-greenhouse", issue: 144, status: "published", section: "Features",
      title: "Passion People: The Student Who Runs the Greenhouse",
      subtitle: "Meet someone who really, really likes tomatoes.",
      author: "Lena Ford", year: "9th grade", credit: "Photo: Buzz staff",
      alt: "A student holding a tray of seedlings.", caption: "Seedlings ready to be moved outdoors.",
      color: "#6b8e23", docUrl: "",
      body: [
        "[Demo text] Passion People highlights someone at Shady Hill who is deeply into something. This week: the student behind the greenhouse.",
        "\"I just like watching things grow,\" they told us. \"It is the opposite of homework. It never feels like a deadline.\""
      ],
      sources: ["Interview, September 2026"]
    },
    {
      slug: "dispatch-hallway-clock", issue: 144, status: "published", section: "Opinion",
      title: "Dispatch: The Hallway Clock Problem",
      subtitle: "An opinion on four minutes that do not exist.",
      author: "Jonah Weiss", year: "8th grade", credit: "",
      alt: "", caption: "", color: "#555555", docUrl: "",
      body: [
        "[Demo text] Dispatch is where students share a personal take. This week: the clock outside the library is fast, and it is quietly ruining my life.",
        "Opinions in Dispatch belong to the writer."
      ],
      sources: []
    },
    {
      slug: "welcome-back-editors", issue: 143, status: "published", section: "Opinion",
      title: "Welcome Back from the Editors",
      subtitle: "A new year of The Buzz begins.",
      author: "The Buzz Editors", year: "", credit: "", alt: "", caption: "", color: "#c99700", docUrl: "",
      body: [
        "[Demo text] Welcome back, Shady Hill! We are excited for a new year of stories, jokes, and student voices.",
        "Want to write? Want to draw? Want to submit a shoutout? Find us. We would love to hear from you."
      ],
      sources: []
    },
    {
      slug: "new-schedule-explained", issue: 143, status: "published", section: "School",
      title: "The New Schedule, Explained",
      subtitle: "What changed, what did not, and where to be at 10:15.",
      author: "Priya Nair", year: "8th grade", credit: "Photo: Buzz staff",
      alt: "A printed class schedule on a clipboard.", caption: "", color: "#2b5d8a", docUrl: "",
      body: ["[Demo text] The schedule changed this year. Here is a simple guide to the new rhythm of the day."],
      sources: ["School schedule, 2026-2027"]
    },
    {
      slug: "passion-people-woodshop", issue: 145, status: "ready", section: "Features",
      title: "Passion People: Inside the Woodshop",
      subtitle: "Sawdust, safety glasses, and a very ambitious birdhouse.",
      author: "Lena Ford", year: "9th grade", credit: "Photo: Buzz staff", alt: "Student sanding a wooden birdhouse.",
      caption: "", color: "#8a5a2b", docUrl: "",
      body: ["[Demo draft text] Story approved by editors and ready for publication."], sources: []
    },
    {
      slug: "eighth-grade-poll", issue: 145, status: "needs-editing", section: "School",
      title: "What Is the 8th Grade Really Thinking?",
      subtitle: "", author: "Theo Brennan", year: "7th grade", credit: "", alt: "", caption: "", color: "#2b5d8a",
      docUrl: "", body: ["[Demo draft text] Still being edited in Google Docs."], sources: []
    },
    {
      slug: "bracket-breakdown", issue: 145, status: "draft", section: "Sports",
      title: "Bracket Breakdown", subtitle: "", author: "Sam Okafor", year: "9th grade", credit: "", alt: "",
      caption: "", color: "#a33a2e", docUrl: "", body: ["[Demo draft text] Writer is still drafting."], sources: []
    }
  ],
  shoutouts: [
    "Big shoutout to the 7th graders who stacked every chair after assembly without being asked.",
    "Big shoutout to the person who returned a lost sweater to the front desk.",
    "Big shoutout to the kitchen team for the apple cider."
  ],
  staff: [
    { name: "Jane", role: "Faculty Advisor", year: "Shady Hill faculty" },
    { name: "Maya Alvarez", role: "Editor-in-Chief", year: "8th grade" },
    { name: "Priya Nair", role: "Managing Editor", year: "8th grade" },
    { name: "Sam Okafor", role: "Sports Editor", year: "9th grade" },
    { name: "Lena Ford", role: "Features Editor", year: "9th grade" },
    { name: "Theo Brennan", role: "Current Events Writer", year: "7th grade" },
    { name: "Jonah Weiss", role: "Opinion Writer", year: "8th grade" }
  ]
};
