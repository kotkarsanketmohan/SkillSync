export const MOCK_COLLEGE_MATCHES = [
  { id: 1, name: "Pune Institute of Computer Technology", location: "Pune", match_score: 91.2 },
  { id: 2, name: "College of Engineering Pune", location: "Pune", match_score: 88.5 },
  { id: 3, name: "VJTI", location: "Mumbai", match_score: 85.0 },
  { id: 4, name: "Thadomal Shahani Engineering College", location: "Mumbai", match_score: 76.8 },
];

export const industryDemoAdapter = {
  matchColleges: async (jobDescription, requiredSkills) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = MOCK_COLLEGE_MATCHES.map((c, i) => ({
          sr_no: i + 1,
          college_name: c.name,
          location: c.location,
          match_score: c.match_score,
          campus_recommendation: "This institution produces graduates whose academic foundations strongly overlap with your current hiring needs. Engaging with their placement cell is highly recommended.",
          why_this_campus: `The algorithm identified that ${c.name}'s recent syllabus revisions included direct integrations of modern tech stacks. While some advanced tooling may not be explicitly covered, the theoretical foundation maps perfectly to your requirements, significantly reducing onboarding training time.`
        }));
        resolve({ results });
      }, 3500); // 3.5s delay to show NLP skill extraction animation
    });
  }
};
