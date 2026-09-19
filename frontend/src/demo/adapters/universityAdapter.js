export const universityDemoAdapter = {
  fetchSyllabus: async (institution_name, department) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Complete 8-Semester Syllabus fetched and processed successfully.",
          institution_name,
          department,
          extracted_subjects: 42,
          extracted_skills: 146,
          program: "B.E. Computer Engineering",
          academic_year: "2026-27",
          total_credits: 160,
          total_teaching_hours: 1280
        });
      }, 3000); 
    });
  },

  getCurriculumAnalysis: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          overall_alignment: 72.8,
          projected_alignment: 84.6,
          skill_coverage: 104,
          total_industry_skills: 146,
          projected_skill_coverage: 131,
          critical_skill_gaps: 18,
          projected_critical_skill_gaps: 7,
          job_roles_covered: 12,
          projected_job_roles_covered: 20,
          placement_readiness: 68,
          projected_placement_readiness: 82,
          high_priority_subjects: 11,
          projected_high_priority_subjects: 4,
          heatmap: [
            { category: "Programming", s1: 72, s2: 81, s3: 88, s4: 91, s5: 94, s6: 95, s7: 95, s8: 95 },
            { category: "Data Structures", s1: 0, s2: 0, s3: 82, s4: 86, s5: 90, s6: 92, s7: 92, s8: 92 },
            { category: "Cloud", s1: 0, s2: 0, s3: 0, s4: 12, s5: 24, s6: 51, s7: 68, s8: 72 },
            { category: "AI/ML", s1: 0, s2: 0, s3: 0, s4: 0, s5: 34, s6: 56, s7: 72, s8: 76 },
            { category: "Cybersecurity", s1: 0, s2: 0, s3: 0, s4: 21, s5: 35, s6: 47, s7: 61, s8: 65 }
          ],
          semesters: [
            { id: "I", name: "Semester I", alignment: 85, credits: 20, hours: 160, subjects_count: 5, gaps: 0 },
            { id: "II", name: "Semester II", alignment: 82, credits: 20, hours: 160, subjects_count: 5, gaps: 0 },
            { id: "III", name: "Semester III", alignment: 78, credits: 22, hours: 176, subjects_count: 6, gaps: 2 },
            { id: "IV", name: "Semester IV", alignment: 75, credits: 22, hours: 176, subjects_count: 6, gaps: 3 },
            { id: "V", name: "Semester V", alignment: 58, credits: 22, hours: 180, subjects_count: 6, gaps: 5 },
            { id: "VI", name: "Semester VI", alignment: 62, credits: 22, hours: 180, subjects_count: 6, gaps: 4 },
            { id: "VII", name: "Semester VII", alignment: 55, credits: 20, hours: 160, subjects_count: 5, gaps: 4 },
            { id: "VIII", name: "Semester VIII", alignment: 68, credits: 12, hours: 96, subjects_count: 3, gaps: 0 }
          ],
          subjects: [
            // Semester III
            { id: 1, code: "CS301", name: "Discrete Mathematics", semester: "III", credits: 4, teaching_hours: 60, current_alignment: 80, priority: "Low" },
            { id: 2, code: "CS302", name: "Data Structures", semester: "III", credits: 4, teaching_hours: 60, current_alignment: 82, priority: "Medium" },
            // Semester IV
            { id: 3, code: "CS401", name: "Algorithms", semester: "IV", credits: 4, teaching_hours: 60, current_alignment: 85, priority: "Low" },
            // Semester V
            { id: 4, code: "CS501", name: "Computer Networks", semester: "V", credits: 4, teaching_hours: 60, current_alignment: 65, priority: "High" },
            { id: 5, code: "CS502", name: "Operating Systems", semester: "V", credits: 4, teaching_hours: 60, current_alignment: 75, priority: "Medium" },
            { id: 6, code: "CS503", name: "Web Technologies", semester: "V", credits: 3, teaching_hours: 45, current_alignment: 58, priority: "High" },
            { id: 7, code: "CS504", name: "Software Engineering", semester: "V", credits: 3, teaching_hours: 45, current_alignment: 72, priority: "Medium" },
            // Semester VI
            { id: 8, code: "CS601", name: "Distributed Systems", semester: "VI", credits: 4, teaching_hours: 60, current_alignment: 55, priority: "High" }
          ]
        });
      }, 500);
    });
  },

  getIndustryAlignment: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { skill: "Cloud Computing", demand: 88, coverage: 24, gap: 64, severity: "High", affected_subjects: ["Computer Networks", "Operating Systems"], affected_roles: ["Cloud Engineer", "DevOps Engineer"], recommended_action: "Introduce Cloud Computing (Sem VI)" },
          { skill: "REST APIs", demand: 81, coverage: 42, gap: 39, severity: "Medium", affected_subjects: ["Web Technologies"], affected_roles: ["Backend Developer"], recommended_action: "Modify Web Technologies (Sem V)" },
          { skill: "System Design", demand: 75, coverage: 15, gap: 60, severity: "High", affected_subjects: ["Software Engineering"], affected_roles: ["Software Engineer", "Backend Developer"], recommended_action: "Introduce System Design (Sem VII)" },
          { skill: "Docker & Containers", demand: 72, coverage: 10, gap: 62, severity: "High", affected_subjects: ["Software Engineering", "Distributed Systems"], affected_roles: ["DevOps Engineer"], recommended_action: "Add DevOps Module (Sem VII)" }
        ]);
      }, 500);
    });
  },

  getSkillGaps: async () => {
    return universityDemoAdapter.getIndustryAlignment();
  },

  getSubjectGaps: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 6, subject: "Web Technologies", current_alignment: 58, missing_skills: ["REST APIs", "Authentication", "Cloud Deployment"], outdated_topics: ["Extensive PHP Focus"], recommended_action: "Update existing course (Sem V)", severity: "High", expected_improvement: "+23%" },
          { id: 8, subject: "Distributed Systems", current_alignment: 55, missing_skills: ["Cloud Architecture", "Containers"], outdated_topics: ["Legacy RPC"], recommended_action: "Replace/Update with Cloud Native (Sem VI)", severity: "High", expected_improvement: "+25%" }
        ]);
      }, 500);
    });
  },

  getJobRoles: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { role: "Software Engineer", required_skills: ["Java/Python", "DSA", "System Design"], covered_skills: ["Java/Python", "DSA"], partial_skills: [], missing_skills: ["System Design"], current_match: 84, projected_match: 92, action: "Introduce System Design (Sem VII)" },
          { role: "Backend Developer", required_skills: ["Java/Python", "REST APIs", "SQL", "Cloud"], covered_skills: ["Java/Python", "SQL"], partial_skills: ["REST APIs"], missing_skills: ["Cloud"], current_match: 72, projected_match: 88, action: "Modify Web Tech (Sem V), Add Cloud (Sem VI)" },
          { role: "Cloud Engineer", required_skills: ["Cloud Architecture", "AWS/Azure", "Containers", "CI/CD"], covered_skills: [], partial_skills: [], missing_skills: ["Cloud Architecture", "AWS/Azure", "Containers", "CI/CD"], current_match: 41, projected_match: 76, action: "Introduce Cloud Computing (Sem VI), Add DevOps Module (Sem VII)" },
          { role: "DevOps Engineer", required_skills: ["Linux", "Networking", "Containers", "CI/CD"], covered_skills: ["Linux", "Networking"], partial_skills: [], missing_skills: ["Containers", "CI/CD"], current_match: 37, projected_match: 80, action: "Add DevOps Module (Sem VII)" }
        ]);
      }, 500);
    });
  },

  getRecommendations: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            type: "MODIFY_EXISTING",
            target: "Web Technologies",
            semester: "V",
            priority: "High",
            severity: "High",
            improvement: "+23%",
            effort: "Medium",
            prerequisites: ["Programming Fundamentals"],
            why: "Web tech is rapidly evolving; current syllabus lacks modern API design.",
            placement_relevance: "High",
            current_coverage: 58,
            expected_alignment_after: 81,
            evidence: "Industry job postings require REST API and modern frameworks over legacy PHP.",
            student_benefit: "Students will be immediately employable for Backend Developer roles."
          },
          {
            id: 2,
            type: "NEW_COURSE",
            target: "Cloud Computing",
            semester: "VI",
            priority: "High",
            severity: "High",
            improvement: "+60%",
            effort: "High",
            prerequisites: ["Computer Networks", "Operating Systems"],
            why: "Required foundational subjects are completed by Sem V before this course.",
            placement_relevance: "Very High",
            current_coverage: 0,
            expected_alignment_after: 60,
            evidence: "Cloud architecture is now a mandatory skill for 80% of backend and devops roles.",
            student_benefit: "Enables students to clear cloud certifications and apply for Cloud Engineer positions."
          },
          {
            id: 3,
            type: "NEW_COURSE",
            target: "DevOps and CI/CD",
            semester: "VII",
            priority: "Medium",
            severity: "High",
            improvement: "+45%",
            effort: "High",
            prerequisites: ["Cloud Computing", "Software Engineering"],
            why: "Builds on cloud fundamentals taught in Sem VI.",
            placement_relevance: "Very High",
            current_coverage: 0,
            expected_alignment_after: 45,
            evidence: "Docker, Kubernetes, and CI/CD pipelines are ubiquitous in modern software engineering.",
            student_benefit: "Significantly boosts hireability by reducing onboarding time for tech companies."
          }
        ]);
      }, 500);
    });
  },

  getCoursePlan: async (courseId, type) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (type === "MODIFY_EXISTING") {
          resolve({
            type: "MODIFY",
            course_name: "Web Technologies",
            course_code: "CS503",
            semester: "V",
            current_alignment: 58,
            proposed_alignment: 81,
            improvement: 23,
            current_hours: 42,
            proposed_hours: 45,
            hours_diff: "+3 Hours",
            retain: ["HTML/CSS fundamentals", "JavaScript basics"],
            update: ["JavaScript to ES6+"],
            add: ["REST APIs", "Authentication/JWT", "API Security"],
            remove: ["PHP basics"],
            placement_impact: "High"
          });
        } else {
          resolve({
            type: "NEW",
            course_name: "Cloud Computing",
            course_code: "CS602",
            course_type: "Core",
            semester: "VI",
            academic_year: "2026-27",
            credits: 3,
            teaching_scheme: { theory: 3, practical: 0, tutorial: 0, total_hours: 45 },
            examination_scheme: { internal: 30, external: 70, practical: 0, total: 100 },
            prerequisites: ["Computer Networks", "Operating Systems"],
            companion_course: "Cloud Computing Lab (CS602L)",
            objectives: [
              "To understand fundamental concepts of cloud computing.",
              "To apply core cloud services to build scalable architectures.",
              "To evaluate cloud security and deployment models."
            ],
            cos: [
              "CO1: Explain cloud service and deployment models.",
              "CO2: Deploy applications using IaaS/PaaS.",
              "CO3: Design microservices architectures.",
              "CO4: Evaluate cloud security measures."
            ],
            units: [
              { 
                number: "I", 
                title: "Foundations of Cloud Computing", 
                hours: 7, 
                topics: ["Introduction to Cloud", "Service Models (IaaS, PaaS, SaaS)", "Deployment Models"], 
                subtopics: ["Public, Private, Hybrid Clouds", "Cloud Characteristics"],
                examples: ["AWS, Azure, GCP Comparison"],
                skills: ["Cloud Fundamentals"], 
                co_mapping: ["CO1"], 
                po_mapping: ["PO1", "PO2"], 
                industry_skills: ["Cloud Computing"], 
                industry_relevance: "High" 
              },
              { 
                number: "II", 
                title: "Core Cloud Services", 
                hours: 8, 
                topics: ["Compute Services", "Storage Solutions", "Networking", "IAM"], 
                subtopics: ["EC2, S3, VPC equivalents", "Role-based Access Control"],
                examples: ["Setting up a VPC"],
                skills: ["Cloud Architecture", "IAM"], 
                co_mapping: ["CO2"], 
                po_mapping: ["PO2", "PO3", "PO5"], 
                industry_skills: ["AWS/Azure", "Cloud Architecture"], 
                industry_relevance: "High" 
              },
              { 
                number: "III", 
                title: "Microservices & Serverless", 
                hours: 8, 
                topics: ["Microservices Architecture", "Serverless Computing", "API Gateway"], 
                subtopics: ["Monolith vs Microservices", "Lambda functions"],
                examples: ["Serverless Image Processing"],
                skills: ["Microservices", "Serverless"], 
                co_mapping: ["CO2", "CO3"], 
                po_mapping: ["PO3", "PO4", "PO5"], 
                industry_skills: ["Microservices", "REST APIs"], 
                industry_relevance: "High" 
              },
              { 
                number: "IV", 
                title: "Cloud Security", 
                hours: 7, 
                topics: ["Data Security", "Network Security", "Compliance"], 
                subtopics: ["Encryption at rest/transit", "DDoS mitigation"],
                examples: ["Configuring WAF"],
                skills: ["Cloud Security"], 
                co_mapping: ["CO4"], 
                po_mapping: ["PO6", "PO7"], 
                industry_skills: ["Cybersecurity"], 
                industry_relevance: "Medium" 
              },
              { 
                number: "V", 
                title: "Cloud Migration", 
                hours: 7, 
                topics: ["Migration Strategies (6 Rs)", "Assessment", "Planning"], 
                subtopics: ["Rehosting, Refactoring", "TCO Analysis"],
                examples: ["Legacy to Cloud Case Study"],
                skills: ["Cloud Migration"], 
                co_mapping: ["CO1", "CO4"], 
                po_mapping: ["PO1", "PO11"], 
                industry_skills: ["Cloud Architecture"], 
                industry_relevance: "High" 
              },
              { 
                number: "VI", 
                title: "Emerging Cloud Trends", 
                hours: 8, 
                topics: ["Edge Computing", "Cloud Native", "Green Cloud"], 
                subtopics: ["IoT and Edge", "Sustainability"],
                examples: ["IoT Edge Deployment"],
                skills: ["Edge Computing"], 
                co_mapping: ["CO3"], 
                po_mapping: ["PO12"], 
                industry_skills: ["IoT"], 
                industry_relevance: "Medium" 
              }
            ],
            placement_impact: "Very High"
          });
        }
      }, 500);
    });
  },

  getSubjectDetails: async (subjectId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: subjectId,
          name: subjectId === 8 ? "Distributed Systems" : "Data Structures",
          code: subjectId === 8 ? "CS601" : "CS302",
          semester: subjectId === 8 ? "VI" : "III",
          credits: 4,
          teaching_scheme: { theory: 3, practical: 2, tutorial: 0, total_hours: 60 },
          examination_scheme: { internal: 30, external: 70, practical: 50, total: 150 },
          prerequisites: subjectId === 8 ? ["Operating Systems", "Computer Networks"] : ["Programming Fundamentals", "Discrete Math"],
          companion_course: subjectId === 8 ? "Distributed Systems Lab" : "Data Structures Lab",
          current_alignment: subjectId === 8 ? 55 : 82,
          objectives: [
            "To understand core concepts of the subject.",
            "To apply algorithms to solve complex problems."
          ],
          cos: [
            "CO1: Define fundamental structures.",
            "CO2: Apply techniques to real-world problems."
          ],
          units: [
            { 
              number: "I", title: "Foundations", hours: 10, 
              topics: ["Basic Concepts", "Architecture"], subtopics: ["Models", "Topologies"], examples: ["Case Study 1"],
              co_mapping: ["CO1"], po_mapping: ["PO1", "PO2"], industry_skills: ["Fundamentals"], industry_relevance: "High"
            },
            { 
              number: "II", title: "Advanced Topics", hours: 10, 
              topics: ["Algorithms", "Performance"], subtopics: ["Complexity", "Optimization"], examples: ["Case Study 2"],
              co_mapping: ["CO2"], po_mapping: ["PO3", "PO4"], industry_skills: ["Optimization"], industry_relevance: "Medium"
            }
          ],
          industry_relevance: "High",
          missing_skills: subjectId === 8 ? ["Cloud Architecture", "Containers"] : [],
          outdated_topics: subjectId === 8 ? ["Legacy RPC"] : [],
          recommended_modifications: subjectId === 8 ? "Replace with Cloud Native Course" : "None"
        });
      }, 300);
    });
  },

  generateReport: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          report_url: "/dummy_8_semester_report.pdf",
          message: "Complete 8-Semester Report generated successfully."
        });
      }, 2000);
    });
  }
};
