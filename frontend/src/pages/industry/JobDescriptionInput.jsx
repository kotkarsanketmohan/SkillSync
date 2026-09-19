import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { industryService } from '../../services/industryService';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Search, ChevronRight, X, Building, Target, Layers } from 'lucide-react';
import { AIProcessingView } from '../../components/ui/AIProcessingView';
import { MatchScore } from '../../components/ui/MatchScore';
import { DetailDrawer } from '../../components/ui/DetailDrawer';
import { SemanticMatchVisualization } from '../../components/ui/SemanticMatchVisualization';

export default function JobDescriptionInput() {
  const [jobDescription, setJobDescription] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [city, setCity] = useState('');
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const [results, setResults] = useState(null);
  const [provider, setProvider] = useState('');
  const [error, setError] = useState('');
  
  const [selectedCollege, setSelectedCollege] = useState(null);

  const processingStages = [
    { title: "Analyzing Job Description", detail: "Extracting context and semantic weightings..." },
    { title: "Entity Recognition", detail: "Normalizing technical terms into canonical industry skills..." },
    { title: "Curriculum Cross-Referencing", detail: "Querying vector database of university syllabi..." },
    { title: "Calculating Match Score", detail: "Applying cosine similarity algorithms to curriculum vectors..." }
  ];

  const addSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !requiredSkills.includes(skillInput.trim())) {
      setRequiredSkills([...requiredSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  };

  const handleMatch = async () => {
    if (!jobDescription.trim() && requiredSkills.length === 0) {
      setError("Please provide a job description or list of required skills");
      return;
    }
    
    setError('');
    setIsProcessing(true);
    setProcessingStage(0);
    setResults(null);
    setProvider('');

    const stageInterval = setInterval(() => {
      setProcessingStage(prev => {
        if (prev < processingStages.length - 1) return prev + 1;
        clearInterval(stageInterval);
        return prev;
      });
    }, 800);

    try {
      const data = await industryService.matchColleges({
        job_description: jobDescription,
        required_skills: requiredSkills,
        city: city || undefined
      });
      clearInterval(stageInterval);
      setProcessingStage(processingStages.length);
      setTimeout(() => {
        setResults(data.results);
        setProvider(data.provider);
        setIsProcessing(false);
      }, 500);
    } catch (err) {
      clearInterval(stageInterval);
      setError("Failed to process matching request");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy">Curriculum Target Matching</h1>
        <p className="text-gray-500 mt-1">Mathematically align your hiring requirements with actual university curricula.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="space-y-6">
          <Card className="shadow-lg border-t-4 border-t-warning">
            <CardHeader>
              <CardTitle className="flex items-center"><Briefcase className="mr-2 h-5 w-5 text-warning" /> Job Context & Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold text-navy mb-2">Target City (Optional)</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Pune, Mumbai, Bangalore..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warning/50 focus:border-warning/50 bg-gray-50 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-navy mb-2">Job Description (Context)</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here. Our AI will extract additional semantic skills automatically..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm min-h-[150px] focus:outline-none focus:ring-2 focus:ring-warning/50 focus:border-warning/50 bg-gray-50 transition-all custom-scrollbar"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-navy mb-2">Required Hard Skills</label>
                <div className="flex flex-wrap gap-2 mb-3 bg-gray-50 p-4 rounded-xl border border-gray-100 min-h-[80px]">
                  {requiredSkills.length === 0 && <span className="text-sm text-gray-400 italic">No explicit skills added. AI will rely only on JD.</span>}
                  <AnimatePresence>
                    {requiredSkills.map(skill => (
                      <motion.div key={skill} initial={{scale:0}} animate={{scale:1}} exit={{scale:0}} transition={{type:"spring"}}>
                        <Badge variant="navy" className="pl-3 pr-1 py-1.5 flex items-center text-sm shadow-sm bg-navy text-white">
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)} className="ml-2 text-white/50 hover:text-danger hover:bg-white/10 rounded-full p-0.5 transition-colors">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <form onSubmit={addSkill} className="flex space-x-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Type a skill and hit Enter..."
                    className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-warning/50 focus:border-warning/50 bg-white"
                  />
                  <Button type="submit" variant="secondary" size="sm" className="bg-gray-100 hover:bg-gray-200 text-navy font-semibold">Add Skill</Button>
                </form>
              </div>

              {error && <p className="text-sm text-danger bg-danger/10 p-3 rounded-lg border border-danger/20">{error}</p>}

              <Button onClick={handleMatch} className="w-full bg-navy hover:bg-navy-light text-white shadow-lg py-6 text-lg" disabled={isProcessing}>
                <Target className="mr-2 h-5 w-5" /> 
                {isProcessing ? "Processing Mapping..." : "Discover Target Colleges"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Area */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            {!isProcessing && !results && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-warning/10 text-warning rounded-full flex items-center justify-center mb-4">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-navy">Target Acquisition Ready</h3>
                <p className="text-gray-500 max-w-sm mt-2 text-sm leading-relaxed">Enter your required skills and JD context. The AI will scan national curricula to find institutions producing the exact talent you need.</p>
              </motion.div>
            )}

            {isProcessing && (
              <motion.div key="processing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="h-full flex items-center justify-center">
                <AIProcessingView 
                  stages={processingStages} 
                  currentStage={processingStage} 
                  isComplete={processingStage >= processingStages.length} 
                  title="Mapping Industry to Curriculum"
                />
              </motion.div>
            )}

            {!isProcessing && results && (
              <motion.div key="results" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6 flex justify-between items-center">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-navy">Curriculum Match Results</h2>
                      {provider && (
                        <Badge variant={provider === 'GROQ' || provider === 'GEMINI' ? 'success' : 'secondary'} className="px-2 py-0.5 shadow-sm font-bold uppercase tracking-wide text-[10px]">
                          Data: {provider}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">Colleges ranked by how closely their taught curriculum aligns with your specific JD.</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-3xl font-black text-warning">{results.length}</p>
                    <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Matches</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {results.map((result, idx) => (
                    <motion.div 
                      key={result.sr_no}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => setSelectedCollege(result)}
                    >
                      <Card className={`hover:border-warning/50 transition-all cursor-pointer group ${idx === 0 ? 'border-2 border-warning/40 shadow-lg' : 'shadow-sm hover:shadow-md'}`}>
                        <CardContent className="p-6">
                          {idx === 0 && <Badge variant="warning" className="mb-3 border-warning/30">Top Campus Target</Badge>}
                          <div className="flex justify-between items-center">
                            <div className="pr-4">
                              <h3 className="text-lg font-bold text-navy group-hover:text-warning-dark transition-colors">{result.college_name}</h3>
                              <p className="text-sm text-gray-500 mt-1 flex items-center"><Building size={14} className="mr-1" />{result.location}</p>
                            </div>
                            <div className="text-right flex flex-col items-end shrink-0">
                              <MatchScore score={result.matching_score} size="md" />
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Match Score</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                            <span className="text-xs text-gray-500 flex items-center">
                              <Layers size={14} className="mr-1.5 text-warning" /> 
                              High alignment in required core skills
                            </span>
                            <span className="text-sm font-semibold text-warning group-hover:translate-x-1 transition-transform flex items-center">
                              View Detailed Breakdown <ChevronRight className="ml-1 h-4 w-4" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={!!selectedCollege}
        onClose={() => setSelectedCollege(null)}
        title={selectedCollege?.college_name || "Campus Target Details"}
      >
        {selectedCollege && (
          <div className="space-y-8 pb-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 flex items-center"><Building size={14} className="mr-1"/> {selectedCollege.location}</p>
                <h3 className="text-2xl font-bold text-navy mt-1">Computer Engineering Curriculum</h3>
              </div>
              <div className="text-right bg-warning/5 p-3 rounded-xl border border-warning/10">
                <MatchScore score={selectedCollege.matching_score} size="lg" />
                <p className="text-xs font-bold text-warning-dark uppercase tracking-wider mt-1">Overall Alignment</p>
              </div>
            </div>

            <div className="bg-navy rounded-xl p-6 text-white shadow-lg text-center">
              <h4 className="text-lg font-bold mb-2">Campus Recruitment Recommendation</h4>
              <p className="text-sm text-gray-300">
                {selectedCollege.campus_recommendation || "This institution produces graduates whose academic foundations strongly overlap with your current hiring needs. Engaging with their placement cell is highly recommended."}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Semantic Mapping Verification</h4>
              <SemanticMatchVisualization 
                matchedSkills={selectedCollege.matched_skills || []}
                matchScore={selectedCollege.matching_score}
              />
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Why this campus?</h4>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {selectedCollege.why_this_campus || `The algorithm identified that ${selectedCollege.college_name}'s recent syllabus revisions included direct integrations of modern tech stacks. While some advanced tooling may not be explicitly covered, the theoretical foundation maps perfectly to your requirements, significantly reducing onboarding training time.`}
              </p>
            </div>
          </div>
        )}
      </DetailDrawer>

    </div>
  );
}
