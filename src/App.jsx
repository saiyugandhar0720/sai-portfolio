import { Mail, Linkedin, MapPin, Phone, Sparkles, Loader2, MessageSquare } from "lucide-react";
import { useState, useCallback, useMemo } from 'react';

// --- Static Resume Content for Prompt Generation ---
const resumeSections = {
  summary: "Results-driven Data Engineering Associate at Accenture with over 1 year of hands-on experience in data management, ETL pipeline development, and cloud-based analytics. Proficient in Databricks, Informatica, Python, SQL, and Big Data ecosystems, with a strong ability to design scalable, automated data workflows that enhance operational performance and decision-making efficiency. Certified Databricks Data Engineer Professional & Associate, with a passion for building high-performance data systems that bridge business strategy and data-driven insights.",
  experience: [
    "Engineered and optimized ETL pipelines using Informatica BDM and Databricks.",
    "Automated workflows, reducing manual intervention by 40% and improving refresh speed by 30%.",
    "Maintained Big Data Lake architecture on Azure and HDFS for scalability and accuracy.",
    "Improved SQL performance via optimization, achieving 25% faster processing.",
  ],
  projects: [
    "Designed ETL workflows to process 1M+ daily transactions.",
    "Leveraged HDFS for distributed storage, reducing query latency by 20%.",
    "Automated reporting pipelines using Python, increasing insight speed by 35%.",
  ],
  skills: {
    programming: "Python, C++, SQL",
    dataEngineering: "Databricks, Informatica BDM, Hadoop, PySpark",
    cloud: "Azure (ADF, ADLS), AWS (S3, EC2)",
    devops: "Docker, Git, Power BI, Tableau",
    coreConcepts: "ETL, Data Modeling, Data Governance, Big Data Analytics",
  },
  // Flattened skill array for tag rendering in the UI
  skillTags: ["Python", "SQL", "PySpark", "Databricks", "Informatica", "Azure", "Hadoop", "C++", "Docker", "Git", "Power BI"],
};

// Utility for fetching with exponential backoff
const fetchWithBackoff = async (url, options, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429 && i < retries - 1) {
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};


export default function App() { // Renamed from Portfolio to App
  const [critiqueText, setCritiqueText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCritique, setShowCritique] = useState(false);
  const [error, setError] = useState(null);

  // Gemini API Configuration
  const apiKey = "";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  // Assemble the resume content into a single string for the prompt
  const fullResumeText = useMemo(() => {
    const skillsList = Object.entries(resumeSections.skills).map(([key, value]) => 
      `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`
    ).join(' | ');

    return `
      --- PROFESSIONAL SUMMARY ---
      ${resumeSections.summary}

      --- EXPERIENCE HIGHLIGHTS (Accenture) ---
      - ${resumeSections.experience.join('\n- ')}

      --- PROJECTS (Bank of Baroda) ---
      - ${resumeSections.projects.join('\n- ')}

      --- TECHNICAL SKILLS ---
      ${skillsList}
    `;
  }, []);

  const systemPrompt = `You are a world-class HR Recruiter and Data Engineering expert. Your task is to provide a concise, constructive critique of the provided portfolio content.

  Your feedback must cover three specific areas, formatted using markdown headers:
  1. **Impact and Quantifiability:** Assess how well the achievements use metrics (e.g., percentages, volumes, quantities). Suggest specific improvements to make them more results-oriented.
  2. **Keyword Optimization:** Identify missing or underutilized industry keywords crucial for a Data Engineer (e.g., Data Mesh, Data Vault, specific cloud services like Synapse/Redshift, CI/CD, Terraform). Suggest which ones should be integrated.
  3. **Clarity and Focus:** Provide a general assessment of the professional summary's focus and whether the entire profile is tailored for a Data Engineering role.`;

  const userQuery = `Critique the following Data Engineer Portfolio content:
  ${fullResumeText}`;

  const generateCritique = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setShowCritique(true);
    setCritiqueText("");

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      tools: [{ "google_search": {} }], 
    };

    try {
      const response = await fetchWithBackoff(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate critique. Please try again.";
      setCritiqueText(text);

    } catch (e) {
      console.error("Gemini API call failed:", e);
      setError("Failed to get critique from AI. Check the console for details.");
    } finally {
      setIsLoading(false);
    }
  }, [userQuery, systemPrompt, apiUrl]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      
      {/* Container */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          <div className="flex-none">
            {/* Profile image (placeholder provided, as external files are not supported) */}
            <div className="w-28 h-28 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <img
                    src="https://placehold.co/112x112/A3A3A3/FFFFFF?text=Sai"
                    alt="Sai Yugandhar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback ensures image always displays something
                        (e.currentTarget).src = "https://placehold.co/112x112/A3A3A3/FFFFFF?text=Sai";
                    }}
                />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold">Kammari Sai Yugandhar</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-300">
              Data Engineering Associate @ Accenture
            </p>

            <div className="mt-4 flex flex-wrap gap-3 items-center text-sm text-gray-700 dark:text-gray-300">
              
              {/* Location */}
              <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 py-2 px-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <MapPin className="w-4 h-4 text-blue-500"/>
                Navi Mumbai
              </div>

              {/* Phone */}
              <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 py-2 px-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <Phone className="w-4 h-4 text-blue-500"/>
                +91 93817 59232
              </div>

              {/* Email */}
              <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 py-2 px-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <Mail className="w-4 h-4 text-blue-500"/>
                saiyugandhar0720@gmail.com
              </div>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/sai-yugandhar-kammari-a63530200"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
              >
                <Linkedin className="w-4 h-4" fill="currentColor"/>
                LinkedIn
              </a>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="mailto:saiyugandhar0720@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                Contact
              </a>

              {/* Note: Cannot access local file "resume.pdf" in this environment */}
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); console.log("Download resume functionality disabled in this sandbox."); }}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition"
              >
                Download Resume (Link Placeholder)
              </a>
            </div>
          </div>
        </header>

        {/* Content grid */}
        <main className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left column (main) */}
          <section className="md:col-span-2 space-y-6">
            
            {/* Summary card & AI Critique Button */}
            <article className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-3">Professional Summary</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {resumeSections.summary}
              </p>

              <button 
                onClick={generateCritique} 
                disabled={isLoading}
                className="mt-6 w-full inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-colors h-10 px-4 py-2 
                           bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 shadow-md disabled:bg-purple-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin"/> Generating Feedback...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="mr-2"/> Get AI Resume Feedback
                  </>
                )}
              </button>
            </article>

            {/* AI Critique Section */}
            {showCritique && (
              <article className="p-6 bg-purple-50 dark:bg-purple-950 rounded-xl shadow-lg border-2 border-purple-300 dark:border-purple-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-purple-800 dark:text-purple-300 flex items-center">
                        <MessageSquare size={20} className="mr-2"/> AI Feedback
                    </h2>
                    <button 
                      onClick={() => setShowCritique(false)}
                      className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 font-semibold"
                    >
                      {isLoading ? "" : "Hide Feedback"}
                    </button>
                </div>
                {error && <p className="text-red-600 font-semibold">{error}</p>}
                
                {isLoading && !error && (
                  <div className="flex items-center justify-center space-x-2 text-purple-600 dark:text-purple-400">
                    <Loader2 size={24} className="animate-spin"/>
                    <p>Analyzing content for impact, keywords, and clarity...</p>
                  </div>
                )}

                {!isLoading && critiqueText && (
                    <div className="text-gray-700 dark:text-gray-300 space-y-3">
                        {/* Render markdown content; replace newlines with <br/> and handle bold/headers */}
                        <div dangerouslySetInnerHTML={{ __html: critiqueText.replace(/\n/g, '<br/>').replace(/### (.*)/g, '<h4>$1</h4>') }} />
                    </div>
                )}
              </article>
            )}

            {/* Experience card */}
            <article className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">Professional Experience</h2>
                <span className="text-sm text-gray-500">Since Jul 2024</span>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <h3 className="font-semibold">Accenture — Data Engineering, Management & Governance Associate</h3>
                  <p className="text-sm text-gray-500">Navi Mumbai | July 2024 – Present</p>
                  <ul className="mt-2 list-disc ml-5 text-gray-700 dark:text-gray-300 space-y-1">
                    {resumeSections.experience.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-sm text-gray-500">Technologies: Databricks, Informatica BDM, Azure Data Factory, SQL, PySpark, Hadoop, Python</p>
                </div>
              </div>
            </article>

            {/* Projects card */}
            <article className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-3">Projects</h2>
              <div>
                <h4 className="font-semibold">Bank of Baroda Analytics and Reporting System</h4>
                <p className="text-sm text-gray-500">Informatica BDM, HDFS, Python, SQL</p>
                <ul className="mt-2 list-disc ml-5 text-gray-700 dark:text-gray-300 space-y-1">
                    {resumeSections.projects.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>
              </div>
            </article>
          </section>

          {/* Right column (sidebar) */}
          <aside className="space-y-6">
            
            {/* Certifications card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold mb-2">Certifications</h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Databricks Certified Data Engineer Professional</li>
                <li>Databricks Certified Data Engineer Associate</li>
                <li>From Data to Insights with Google Cloud (Coursera)</li>
                <li>Agentic AI — Accenture TQ</li>
              </ul>
            </div>

            {/* Skills card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2 text-sm">
                {resumeSections.skillTags.map((skill) => (
                  <span key={skill} className="inline-flex items-center justify-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Achievements card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold mb-2">Achievements</h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Technovanza 2.0 Hackathon Finalist (Smart India Hackathon)</li>
                <li>Information Security Advocate — Accenture</li>
                <li>Technical Lead, AI Club — CMRTC</li>
                <li>Represented college in Badminton and Cricket at inter-college level.</li>
              </ul>
            </div>
          </aside>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Kammari Sai Yugandhar — Built with Next.js & Tailwind
        </footer>
      </div>
    </div>
  );
}