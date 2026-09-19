import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { studentService } from '../../services/studentService';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ChevronRight, BookOpen, Clock } from 'lucide-react';
import { AIProcessingView } from '../../components/ui/AIProcessingView';
import { MatchScore } from '../../components/ui/MatchScore';

export default function CollegeSearch() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ cities: [], state: '', branch_interest: '' });
  const [cityInput, setCityInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [availableBranches, setAvailableBranches] = useState([]);
  
  useEffect(() => {
    studentService.getBranches().then(branches => setAvailableBranches(branches));
    studentService.getProfile()
      .then(profile => {
        if (profile?.city || profile?.state || profile?.branch_interest) {
          setFormData({
            cities: profile.city ? [profile.city] : [],
            state: profile.state || '',
            branch_interest: profile.branch_interest || ''
          });
        }
      })
      .catch(err => console.error("Could not fetch profile:", err));
      
    // Load cached search results if available to prevent losing data on back navigation
    const cachedResult = sessionStorage.getItem('cachedSearchResult');
    if (cachedResult) {
      try {
        setResponse(JSON.parse(cachedResult));
      } catch (e) {
        console.error("Error parsing cached search results", e);
      }
    }
  }, []);
  
  const isDemo = import.meta.env.VITE_DATA_MODE !== 'api';

  const processingStages = [
    { title: "Analyzing location", detail: "Identifying engineering institutions in the target area..." },
    { title: "Identifying relevant colleges", detail: "Structuring college data and university affiliations..." },
    { title: "Analyzing curriculum", detail: "Extracting major subjects and curriculum skills..." },
    { title: "Mapping industry skills", detail: "Cross-referencing current job roles and skill gaps..." },
    { title: "Calculating alignment", detail: "Estimating Curriculum-Industry Skill Match Score..." }
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Front-end validation
    if (formData.cities.length === 0 || !formData.state.trim() || !formData.branch_interest.trim()) {
      setError("Please add at least one city and fill out all search fields.");
      return;
    }

    setError('');
    setResponse(null);
    setIsProcessing(true);
    setProcessingStage(0);

    const stageInterval = setInterval(() => {
      setProcessingStage(prev => {
        if (prev < processingStages.length - 1) return prev + 1;
        clearInterval(stageInterval);
        return prev;
      });
    }, 800);

    try {
      const data = await studentService.searchColleges({
        cities: formData.cities,
        state: formData.state.trim(),
        branch_interest: formData.branch_interest.trim()
      });
      clearInterval(stageInterval);
      setProcessingStage(processingStages.length);
      setTimeout(() => {
        if (data.status === "FAILED") {
          setError(`College discovery could not be completed. Error: ${data.error || 'Unable to retrieve external college data. Try again.'}`);
          setResponse(null);
          setIsProcessing(false);
        } else {
          setResponse(data);
          sessionStorage.setItem('cachedSearchResult', JSON.stringify(data));
          setIsProcessing(false);
        }
      }, 500);
    } catch (err) {
      clearInterval(stageInterval);
      setProcessingStage(processingStages.length);
      
      let errorMessage = "Unable to connect to SkillSync. Please try again.";
      if (err.message) {
        if (err.message.includes("GEMINI_QUOTA_EXHAUSTED")) {
          errorMessage = "Gemini Free-Tier Quota Exhausted. Please try again after the quota resets.";
        } else if (err.message.includes("GEMINI_API_ERROR")) {
          errorMessage = "AI Analysis failed to extract colleges from search results. Please try again later.";
        } else if (err.message.includes("EXTERNAL_DISCOVERY_ERROR")) {
          errorMessage = "Failed to retrieve external college data. The search service might be down.";
        } else if (err.message !== "Search job failed") {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  const openCollegeDetail = (result) => {
    navigate(`/student/colleges/ai-research-${result.rank}`, { state: { collegeData: result } });
  };

  const results = response?.colleges || response?.results;
  const dataset = response?.dataset;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-navy">Find Colleges by Curriculum–Industry Alignment</h1>
          <p className="text-gray-500 mt-1 max-w-2xl">Discover colleges based on your location and branch interest, then compare how their curricula align with current industry skill requirements.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Input Area */}
        <div className="xl:col-span-4 space-y-6">
          <Card className="shadow-lg border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle>Search Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-navy">Target Cities</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.cities.map((c, idx) => (
                      <span key={idx} className="bg-primary/10 text-primary-dark px-3 py-1 rounded-full text-sm flex items-center">
                        {c}
                        <button type="button" onClick={() => setFormData({...formData, cities: formData.cities.filter((_, i) => i !== idx)})} className="ml-2 font-bold hover:text-danger">&times;</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      icon={MapPin}
                      placeholder="e.g. Pune"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (cityInput.trim() && !formData.cities.includes(cityInput.trim())) {
                            setFormData({...formData, cities: [...formData.cities, cityInput.trim()]});
                            setCityInput('');
                          }
                        }
                      }}
                    />
                    <Button type="button" onClick={() => {
                        if (cityInput.trim() && !formData.cities.includes(cityInput.trim())) {
                          setFormData({...formData, cities: [...formData.cities, cityInput.trim()]});
                          setCityInput('');
                        }
                    }} variant="outline">Add</Button>
                  </div>
                  {formData.cities.length > 0 && (
                    <div className="text-right">
                       <button type="button" onClick={() => setFormData({...formData, cities: []})} className="text-xs text-gray-500 hover:text-danger">Clear All</button>
                    </div>
                  )}
                </div>
                <Input
                  label="Target State"
                  placeholder="e.g. Maharashtra"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-navy">Branch Interest</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                    value={formData.branch_interest}
                    onChange={(e) => setFormData({ ...formData, branch_interest: e.target.value })}
                    required
                  >
                    <option value="" disabled>Select a branch...</option>
                    {availableBranches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>
                
                {error && <p className="text-sm text-danger bg-danger/10 p-2 rounded">{error}</p>}

                <Button type="submit" className="w-full mt-6 shadow-md" disabled={isProcessing}>
                  <Search className="mr-2 h-4 w-4" /> 
                  Find Matching Colleges
                </Button>
              </form>
            </CardContent>
          </Card>

          {dataset && (
            <Card className="bg-slate-50 border-dashed shadow-sm">
              <CardContent className="p-4 text-sm text-gray-500">
                <h4 className="font-bold text-gray-700 flex items-center mb-1">
                  <Clock size={14} className="mr-1" /> Industry Data
                </h4>
                {dataset.status === "NOT_AVAILABLE" ? (
                  <p>Industry dataset not available</p>
                ) : (
                  <>
                    <p>Dataset v{dataset.version?.replace('dataset_', '') || 'Current'}</p>
                    <p>Updated {dataset.age_hours !== undefined ? `${dataset.age_hours} hours ago` : 'recently'}</p>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Area */}
        <div className="xl:col-span-8 min-h-[500px]">
          <AnimatePresence mode="wait">
            {!isProcessing && !results && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-navy">Ready for Analysis</h3>
                <p className="text-gray-500 max-w-sm mt-2 text-sm leading-relaxed">Enter your location and branch preferences to trigger our semantic mapping engine and find the highest aligned institutions.</p>
              </motion.div>
            )}

            {isProcessing && (
              <motion.div key="processing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="h-full flex items-center justify-center bg-white rounded-2xl border border-gray-100 p-8">
                <AIProcessingView 
                  stages={processingStages} 
                  currentStage={processingStage} 
                  isComplete={processingStage >= processingStages.length} 
                  title="AI is researching colleges..."
                />
              </motion.div>
            )}

            {!isProcessing && results && results.length === 0 && (
              <motion.div key="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
                <h3 className="text-xl font-bold text-navy">No matching colleges found.</h3>
                <p className="text-gray-500 max-w-sm mt-2 text-sm">Modify your search to try different locations or branches.</p>
              </motion.div>
            )}

            {!isProcessing && results && results.length > 0 && (
              <motion.div key="results" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-navy">Curriculum Target Matches</h2>
                    <p className="text-sm text-gray-500 mt-1">Ranked by semantic alignment with current industry demands.</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-3xl font-black text-navy">{results.length}</p>
                    <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Matches</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {results.map((result, idx) => (
                    <motion.div 
                      key={result.college_id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                    >
                      <Card className={`hover:border-primary transition-all group ${idx === 0 ? 'border-2 border-primary/40 shadow-lg bg-blue-50/10' : 'shadow-sm hover:shadow-md'}`}>
                        <CardContent className="p-6">
                          {idx === 0 && <Badge variant="warning" className="mb-3">Highest Alignment</Badge>}
                          
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-400 font-bold">#{result.rank}</span>
                                <h3 className="text-lg font-bold text-navy">{result.college_name}</h3>
                                {result.source_verified && (
                                  <Badge variant="success" className="ml-2 bg-teal/10 text-teal border-teal/20 text-[10px]">Verified Source</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-1 ml-5">{result.city} • {result.university}</p>
                            </div>
                            
                            <div className="text-right flex flex-col items-end shrink-0 bg-slate-50 p-3 rounded-lg border border-slate-100 min-w-[120px]" title="The score represents estimated semantic alignment between the described curriculum skills and current general industry skills for the selected branch.">
                              {result.curriculum_status === "AI_RESEARCHED" || result.curriculum_status === "AVAILABLE" ? (
                                <>
                                  <MatchScore score={result.curriculum_industry_match_score || result.matching_score || 0} size="md" />
                                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1 text-right">AI-estimated Curriculum–<br/>Industry Match</p>
                                </>
                              ) : result.curriculum_status === "PENDING" ? (
                                <div className="text-center w-full py-1">
                                  <span className="text-xs font-bold text-warning-dark block">Curriculum analysis pending</span>
                                </div>
                              ) : (
                                <div className="text-center w-full py-1">
                                  <span className="text-xs font-bold text-gray-400 block">Curriculum not available</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-xs text-gray-500 flex items-center">
                              <BookOpen size={14} className="mr-1.5 text-teal" /> 
                              {formData.branch_interest}
                              {result.data_confidence && (
                                <span className={`ml-3 px-2 py-0.5 rounded text-[10px] font-bold ${result.data_confidence === 'LOW' ? 'bg-warning/20 text-warning-dark' : 'bg-gray-100 text-gray-600'}`}>
                                  Confidence: {result.data_confidence}
                                </span>
                              )}
                            </span>
                            <Button 
                              variant="ghost" 
                              onClick={() => openCollegeDetail(result)}
                              className="text-primary hover:bg-primary/5 hover:text-primary-dark"
                            >
                              View Analysis <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
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
    </div>
  );
}
