export const MOCK_COLLEGES = [
  { id: 1, name: "Pune Institute of Computer Technology", university: "Savitribai Phule Pune University", city: "Pune", state: "Maharashtra", branch: "Computer Engineering", match_score: 87.5 },
  { id: 2, name: "College of Engineering Pune", university: "COEP Technological University", city: "Pune", state: "Maharashtra", branch: "Computer Engineering", match_score: 82.1 },
  { id: 3, name: "Vishwakarma Institute of Technology", university: "Savitribai Phule Pune University", city: "Pune", state: "Maharashtra", branch: "Computer Engineering", match_score: 79.4 },
  { id: 4, name: "MIT World Peace University", university: "MIT-WPU", city: "Pune", state: "Maharashtra", branch: "Computer Engineering", match_score: 75.0 },
  { id: 5, name: "Symbiosis Institute of Technology", university: "Symbiosis International University", city: "Pune", state: "Maharashtra", branch: "Computer Engineering", match_score: 71.2 },
];

export const studentDemoAdapter = {
  searchColleges: async (city, state, branch) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = MOCK_COLLEGES.map((c, i) => ({
          rank: i + 1,
          college_id: c.id,
          college_name: c.name,
          university: c.university,
          matching_score: c.match_score
        }));
        
        resolve({ 
          query: { city, state, branch },
          dataset: { version: "demo_v2026", generated_at: new Date().toISOString(), age_hours: 4 },
          results 
        });
      }, 1500); 
    });
  },

  getCollegeAnalysis: async (collegeId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const college = MOCK_COLLEGES.find(c => c.id === parseInt(collegeId));
        if (!college) {
          reject(new Error("College not found"));
          return;
        }

        resolve({
          college_id: college.id,
          college_name: college.name,
          university: college.university,
          location: `${college.city}, ${college.state}`,
          department: college.branch,
          matching_score: college.match_score,
          curriculum_overview: "A strong foundational computer science curriculum covering theoretical systems and practical programming.",
          major_skill_areas: ["Software Engineering", "Algorithms", "Database Systems", "Operating Systems"],
          industry_alignment: "Strong alignment with backend engineering and systems programming roles in the Pune tech sector.",
          matched_skills: [
            { curriculum_skill: "Java Programming", industry_skill: "Java Development", similarity: 0.92, demand: 28.5 },
            { curriculum_skill: "Database Management", industry_skill: "PostgreSQL", similarity: 0.88, demand: 22.1 },
            { curriculum_skill: "Data Structures", industry_skill: "Algorithms & DS", similarity: 0.95, demand: 18.0 }
          ],
          partial_skills: [
            { curriculum_skill: "Computer Networks", industry_skill: "Cloud Architecture", similarity: 0.65, demand: 15.4 },
            { curriculum_skill: "Software Testing", industry_skill: "CI/CD Pipelines", similarity: 0.55, demand: 12.0 }
          ],
          potential_gaps: [
            { curriculum_skill: "N/A", industry_skill: "Kubernetes", similarity: 0.1, demand: 10.5 },
            { curriculum_skill: "N/A", industry_skill: "React.js", similarity: 0.2, demand: 14.0 }
          ],
          relevant_subjects: ["CS-301 Java", "CS-402 Database Systems"],
          industry_skill_demand: []
        });
      }, 1000);
    });
  }
};
