import React, { useState, useMemo, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  Home, 
  Stethoscope, 
  BarChart2, 
  History, 
  Info, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  FileText, 
  Download, 
  RotateCcw, 
  ChevronRight, 
  Check, 
  X, 
  AlertCircle, 
  Cpu, 
  Database, 
  Code, 
  Trash2, 
  Sparkles, 
  Layers, 
  ArrowRight,
  TrendingUp,
  Sliders,
  Menu,
  Sun,
  Moon,
  Eye,
  Thermometer,
  Printer,
  ChevronDown
} from 'lucide-react';

// --- SYMPTOM & CATEGORY CATALOG ---
const CATEGORIES = [
  { id: 'all', name: 'All Categories', count: 24 },
  { id: 'general', name: 'General', count: 6 },
  { id: 'respiratory', name: 'Respiratory', count: 5 },
  { id: 'gastro', name: 'Gastrointestinal', count: 4 },
  { id: 'neuro', name: 'Neurological', count: 5 },
  { id: 'skin', name: 'Dermatological', count: 4 },
];

const SYMPTOMS_LIST = [
  { id: 'fever', name: 'Fever (+38°C)', category: 'general', popular: true, severity: 'acute' },
  { id: 'cough', name: 'Dry / Persistent Cough', category: 'respiratory', popular: true, severity: 'moderate' },
  { id: 'sore_throat', name: 'Throat Soreness / Pharyngitis', category: 'respiratory', popular: true, severity: 'mild' },
  { id: 'headache', name: 'Cephalalgia (Headache)', category: 'neuro', popular: true, severity: 'moderate' },
  { id: 'fatigue', name: 'Systemic Fatigue / Malaise', category: 'general', popular: true, severity: 'mild' },
  { id: 'body_pain', name: 'Myalgia & Body Pain', category: 'general', popular: false, severity: 'moderate' },
  { id: 'runny_nose', name: 'Rhinorrhea (Runny Nose)', category: 'respiratory', popular: true, severity: 'mild' },
  { id: 'shortness_breath', name: 'Dyspnea (Shortness of Breath)', category: 'respiratory', popular: true, severity: 'critical' },
  { id: 'nausea', name: 'Nausea & Emesis', category: 'gastro', popular: false, severity: 'moderate' },
  { id: 'diarrhea', name: 'Acute Diarrhea', category: 'gastro', popular: false, severity: 'moderate' },
  { id: 'dizziness', name: 'Postural Dizziness / Vertigo', category: 'neuro', popular: false, severity: 'mild' },
  { id: 'skin_rash', name: 'Erythematous Skin Rash', category: 'skin', popular: false, severity: 'mild' },
  { id: 'chills', name: 'Rigors & Febrile Chills', category: 'general', popular: false, severity: 'moderate' },
  { id: 'loss_of_taste', name: 'Anosmia / Loss of Taste', category: 'respiratory', popular: false, severity: 'mild' },
  { id: 'stomach_pain', name: 'Epigastric Abdominal Pain', category: 'gastro', popular: false, severity: 'moderate' },
  { id: 'joint_pain', name: 'Arthralgia (Joint Pain)', category: 'general', popular: false, severity: 'moderate' },
];

const DEMO_PRESETS = [
  {
    id: 'respiratory',
    name: 'Upper Respiratory Infection',
    symptoms: ['fever', 'cough', 'sore_throat', 'fatigue'],
    vitals: { age: 34, bp: 122, glucose: 95, chol: 185, bmi: 23.4, smoking: 0 }
  },
  {
    id: 'flu',
    name: 'Acute Influenza Syndrome',
    symptoms: ['fever', 'headache', 'body_pain', 'fatigue', 'chills'],
    vitals: { age: 48, bp: 130, glucose: 105, chol: 210, bmi: 26.2, smoking: 1 }
  },
  {
    id: 'bronchitis',
    name: 'Lower Respiratory Bronchitis',
    symptoms: ['cough', 'shortness_breath', 'fatigue'],
    vitals: { age: 62, bp: 145, glucose: 128, chol: 240, bmi: 29.1, smoking: 1 }
  },
  {
    id: 'gastro',
    name: 'Viral Enteritis / Gastroenteritis',
    symptoms: ['nausea', 'diarrhea', 'stomach_pain', 'fatigue'],
    vitals: { age: 29, bp: 115, glucose: 88, chol: 172, bmi: 22.0, smoking: 0 }
  }
];

const INITIAL_HISTORY = [
  { 
    id: 'MED-9402', 
    date: '27 Oct 2026, 10:24 AM', 
    symptoms: ['Fever (+38°C)', 'Dry / Persistent Cough', 'Throat Soreness / Pharyngitis', 'Systemic Fatigue / Malaise'], 
    disease: 'Upper Respiratory Viral Infection', 
    confidence: 87.4, 
    urgency: 'Mild / Self-Limiting',
    riskTier: 'Low Clinical Risk'
  },
  { 
    id: 'MED-9388', 
    date: '24 Oct 2026, 03:15 PM', 
    symptoms: ['Fever (+38°C)', 'Cephalalgia (Headache)', 'Myalgia & Body Pain', 'Rigors & Febrile Chills'], 
    disease: 'Seasonal Influenza (Flu)', 
    confidence: 93.1, 
    urgency: 'Moderate / Medical Rest',
    riskTier: 'Moderate Elevated Risk'
  },
  { 
    id: 'MED-9340', 
    date: '20 Oct 2026, 11:03 AM', 
    symptoms: ['Dry / Persistent Cough', 'Dyspnea (Shortness of Breath)'], 
    disease: 'Acute Bronchitis / Dyspnea Assessment', 
    confidence: 91.0, 
    urgency: 'Urgent Auscultation Advised',
    riskTier: 'High Clinical Risk'
  },
  { 
    id: 'MED-9295', 
    date: '16 Oct 2026, 02:40 PM', 
    symptoms: ['Systemic Fatigue / Malaise', 'Postural Dizziness / Vertigo'], 
    disease: 'Mild Dehydration & Orthostatic Fatigue', 
    confidence: 76.5, 
    urgency: 'Mild / Fluid Protocol',
    riskTier: 'Low Clinical Risk'
  },
];

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('healthai-theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  // Navigation & intake state
  const [activeTab, setActiveTab] = useState('home');
  const [selectedSymptoms, setSelectedSymptoms] = useState(['fever', 'cough', 'sore_throat', 'fatigue']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [historyList, setHistoryList] = useState(INITIAL_HISTORY);
  const [historySearch, setHistorySearch] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCaseModal, setSelectedCaseModal] = useState(null);

  // Vitals Biometrics state
  const [vitals, setVitals] = useState({
    age: 45,
    bp: 125,
    glucose: 98,
    chol: 195,
    bmi: 24.8,
    smoking: 0,
    activity: 4.0
  });

  // Dynamic calculated result
  const [currentResult, setCurrentResult] = useState({
    disease: 'Upper Respiratory Viral Infection',
    type: 'Acute Upper Respiratory Tract Pathology',
    confidence: 87.4,
    urgency: 'Mild / Self-Limiting',
    resolution: '7 – 10 Days',
    riskLevel: 'Low Clinical Risk',
    overview: 'Clinical signals strongly correlate with seasonal viral respiratory tract infection. Core markers suggest mild viral replication without lower tract consolidation.',
    correlations: [
      { name: 'Fever (+38°C)', match: 91, color: 'bg-cyan-500' },
      { name: 'Dry / Persistent Cough', match: 88, color: 'bg-blue-500' },
      { name: 'Throat Soreness / Pharyngitis', match: 84, color: 'bg-indigo-500' },
      { name: 'Systemic Fatigue / Malaise', match: 78, color: 'bg-teal-500' },
    ],
    differentials: [
      { name: 'Seasonal Influenza (Flu)', prob: '11.8%', tier: 'Moderate' },
      { name: 'Allergic Rhinitis / Sinusitis', prob: '1.2%', tier: 'Low' },
      { name: 'Bacterial Pharyngitis', prob: '0.4%', tier: 'Very Low' }
    ],
    vitalEvaluations: [
      { marker: 'Systolic Blood Pressure', value: '125 mmHg', status: 'Pre-hypertension', level: 'warning' },
      { marker: 'Fasting Blood Glucose', value: '98 mg/dL', status: 'Normal Baseline', level: 'optimal' },
      { marker: 'Total Cholesterol', value: '195 mg/dL', status: 'Optimal Threshold', level: 'optimal' },
      { marker: 'Body Mass Index (BMI)', value: '24.8 kg/m²', status: 'Healthy Weight', level: 'optimal' },
    ]
  });

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('healthai-theme', theme);
  }, [theme]);

  // Scroll listener for translucent header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Filter symptoms
  const filteredSymptoms = useMemo(() => {
    return SYMPTOMS_LIST.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleSymptom = (id) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  const handleClearSelected = () => {
    setSelectedSymptoms([]);
  };

  const loadPreset = (preset) => {
    setSelectedSymptoms(preset.symptoms);
    setVitals(preset.vitals);
  };

  // Clinical calculation engine
  const handleRunAssessment = () => {
    const count = selectedSymptoms.length;
    const names = selectedSymptoms.map(id => SYMPTOMS_LIST.find(s => s.id === id)?.name || id);

    let resDisease = 'Upper Respiratory Viral Infection';
    let resType = 'Acute Upper Respiratory Tract Pathology';
    let resConfidence = 87.4;
    let resUrgency = 'Mild / Self-Limiting';
    let resResolution = '7 – 10 Days';
    let resRiskLevel = 'Low Clinical Risk';
    let resOverview = 'Viral upper respiratory tract infection. Standard symptomatic rest and oral hydration protocol advised.';
    let resDifferentials = [
      { name: 'Seasonal Influenza (Flu)', prob: '11.8%', tier: 'Moderate' },
      { name: 'Allergic Rhinitis / Sinusitis', prob: '1.2%', tier: 'Low' },
      { name: 'Bacterial Pharyngitis', prob: '0.4%', tier: 'Very Low' }
    ];

    if (selectedSymptoms.includes('shortness_breath') || (selectedSymptoms.includes('cough') && vitals.bp > 140)) {
      resDisease = 'Acute Bronchitis & Lower Respiratory Dyspnea';
      resType = 'Lower Respiratory Tract Involvement';
      resConfidence = 91.2;
      resUrgency = 'Urgent Clinical Auscultation Recommended';
      resResolution = '14 – 21 Days';
      resRiskLevel = 'Elevated Clinical Risk';
      resOverview = 'Reported shortness of breath paired with elevated respiratory biomarkers indicates potential lower tract bronchial inflammation requiring certified auscultation.';
      resDifferentials = [
        { name: 'Viral Pneumonia Profile', prob: '26.4%', tier: 'High' },
        { name: 'Bronchial Asthmatic Spasm', prob: '12.8%', tier: 'Moderate' },
        { name: 'Reactive Airway Distress', prob: '4.2%', tier: 'Low' }
      ];
    } else if (selectedSymptoms.includes('nausea') || selectedSymptoms.includes('diarrhea') || selectedSymptoms.includes('stomach_pain')) {
      resDisease = 'Acute Viral Gastroenteritis';
      resType = 'Gastrointestinal Enteric Infection';
      resConfidence = 89.0;
      resUrgency = 'Moderate / Rehydration Therapy Advised';
      resResolution = '3 – 7 Days';
      resRiskLevel = 'Moderate Clinical Risk';
      resOverview = 'Enteric digestive presentation with nausea or acute stool changes. Oral rehydration electrolyte solutions and bland dietary transition indicated.';
      resDifferentials = [
        { name: 'Foodborne Toxin Enteritis', prob: '21.5%', tier: 'Moderate' },
        { name: 'Gastric Acid Reflux Dyspepsia', prob: '7.2%', tier: 'Low' },
        { name: 'Bacterial Salmonella Marker', prob: '2.1%', tier: 'Low' }
      ];
    } else if (selectedSymptoms.includes('headache') && selectedSymptoms.includes('fever') && selectedSymptoms.includes('body_pain')) {
      resDisease = 'Seasonal Influenza Syndrome (Flu)';
      resType = 'Systemic Febrile Viral Illness';
      resConfidence = 93.1;
      resUrgency = 'Moderate / Monitoring & Antipyretic Rest';
      resResolution = '7 – 14 Days';
      resRiskLevel = 'Moderate Clinical Risk';
      resOverview = 'High systemic inflammatory signals with severe cephalalgia and febrile onset strongly match seasonal influenza virus profiles.';
      resDifferentials = [
        { name: 'SARS-CoV-2 Variant Pattern', prob: '28.6%', tier: 'High' },
        { name: 'Arboviral Febrile Syndrome', prob: '6.4%', tier: 'Low' },
        { name: 'Acute Mononucleosis Onset', prob: '1.8%', tier: 'Low' }
      ];
    }

    // Evaluate vitals against clinical ranges
    const bpStatus = vitals.bp > 140 ? 'Stage 2 Hypertension' : (vitals.bp > 130 ? 'Stage 1 Hypertension' : (vitals.bp > 120 ? 'Pre-hypertension' : 'Normal Baseline'));
    const bpLevel = vitals.bp > 140 ? 'critical' : (vitals.bp > 120 ? 'warning' : 'optimal');

    const glucStatus = vitals.glucose >= 126 ? 'Hyperglycemic (Diabetic Range)' : (vitals.glucose >= 100 ? 'Impaired Fasting Glucose' : 'Normal Baseline');
    const glucLevel = vitals.glucose >= 126 ? 'critical' : (vitals.glucose >= 100 ? 'warning' : 'optimal');

    const cholStatus = vitals.chol >= 240 ? 'High Hypercholesterolemia' : (vitals.chol >= 200 ? 'Borderline High' : 'Desirable Threshold');
    const cholLevel = vitals.chol >= 240 ? 'critical' : (vitals.chol >= 200 ? 'warning' : 'optimal');

    const bmiStatus = vitals.bmi >= 30 ? 'Obesity Category 1' : (vitals.bmi >= 25 ? 'Overweight Threshold' : (vitals.bmi >= 18.5 ? 'Normal Healthy Weight' : 'Underweight'));
    const bmiLevel = vitals.bmi >= 30 ? 'critical' : (vitals.bmi >= 25 ? 'warning' : 'optimal');

    const calculatedResult = {
      disease: resDisease,
      type: resType,
      confidence: resConfidence,
      urgency: resUrgency,
      resolution: resResolution,
      riskLevel: resRiskLevel,
      overview: resOverview,
      correlations: names.slice(0, 4).map((name, idx) => ({
        name,
        match: Math.max(72, Math.min(96, Math.round(resConfidence - idx * 4.2))),
        color: idx === 0 ? 'bg-cyan-500' : idx === 1 ? 'bg-blue-500' : idx === 2 ? 'bg-indigo-500' : 'bg-teal-500'
      })),
      differentials: resDifferentials,
      vitalEvaluations: [
        { marker: 'Systolic Blood Pressure', value: `${vitals.bp} mmHg`, status: bpStatus, level: bpLevel },
        { marker: 'Fasting Blood Glucose', value: `${vitals.glucose} mg/dL`, status: glucStatus, level: glucLevel },
        { marker: 'Total Serum Cholesterol', value: `${vitals.chol} mg/dL`, status: cholStatus, level: cholLevel },
        { marker: 'Body Mass Index (BMI)', value: `${vitals.bmi} kg/m²`, status: bmiStatus, level: bmiLevel },
      ]
    };

    setCurrentResult(calculatedResult);

    // Append to audit log
    const newEntry = {
      id: `MED-${Math.floor(9000 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      symptoms: names,
      disease: resDisease,
      confidence: resConfidence,
      urgency: resUrgency,
      riskTier: resRiskLevel
    };
    setHistoryList([newEntry, ...historyList]);
    setActiveTab('result');
  };

  const handleExportReport = () => {
    const reportText = `=============================================================================
HEALTHAI CLINICAL DECISION-SUPPORT DIAGNOSTIC SUMMARY
Generated: ${new Date().toLocaleString()} | Engine: Calibrated XGBoost & RF v2.4
=============================================================================

1. PRIMARY DIAGNOSTIC FINDING
-----------------------------------------------------------------------------
Condition Assessed:   ${currentResult.disease}
Classification Type:  ${currentResult.type}
Model Confidence:     ${currentResult.confidence}%
Clinical Severity:    ${currentResult.urgency}
Expected Trajectory:  ${currentResult.resolution}

2. CLINICAL OVERVIEW & TRIAGE IMPLICATIONS
-----------------------------------------------------------------------------
${currentResult.overview}

3. REPORTED PATIENT SYMPTOM SIGNALS
-----------------------------------------------------------------------------
${selectedSymptoms.map(id => ` * ${SYMPTOMS_LIST.find(s => s.id === id)?.name || id}`).join('\n')}

4. BIOMETRIC EVALUATION AUDIT
-----------------------------------------------------------------------------
${currentResult.vitalEvaluations.map(v => ` * ${v.marker}: ${v.value} [${v.status}]`).join('\n')}

5. DIFFERENTIAL DIAGNOSIS ALTERNATIVES
-----------------------------------------------------------------------------
${currentResult.differentials.map(d => ` * ${d.name}: ${d.prob} (${d.tier} likelihood)`).join('\n')}

=============================================================================
REGULATORY & CLINICAL SAFETY NOTICE:
HealthAI is an algorithmic decision-support tool. It does not replace 
formal in-person diagnosis by a certified medical practitioner.
=============================================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HealthAI_Clinical_Summary_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredHistory = historyList.filter(h => 
    h.disease.toLowerCase().includes(historySearch.toLowerCase()) ||
    h.id.toLowerCase().includes(historySearch.toLowerCase()) ||
    h.symptoms.some(s => s.toLowerCase().includes(historySearch.toLowerCase()))
  );

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'symptoms', label: 'Predict Disease', icon: Stethoscope, badge: selectedSymptoms.length > 0 ? selectedSymptoms.length : null },
    { id: 'result', label: 'Analytics & Result', icon: BarChart2 },
    { id: 'history', label: 'History', icon: History },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] font-sans flex flex-col relative transition-colors duration-200">
      
      {/* AMBIENT BACKGROUND DEPTH GRADIENT */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[500px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-1/4 w-[700px] h-[600px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[160px] pointer-events-none -z-10"></div>

      {/* =========================================================================
          PHASE 3: REDESIGNED FROSTED TRANSLUCENT NAVIGATION HEADER
         ========================================================================= */}
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-[var(--header-bg)] backdrop-blur-xl border-b border-[var(--header-border)] shadow-sm dark:shadow-2xl py-3' 
            : 'bg-[var(--header-bg)] backdrop-blur-md border-b border-[var(--border-subtle)] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Brand Wordmark & Icon */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group" 
            onClick={() => setActiveTab('home')}
            role="button"
            tabIndex={0}
            aria-label="HealthAI Home"
          >
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">Health</span>
                <span className="font-extrabold text-lg tracking-tight text-cyan-600 dark:text-cyan-400">AI</span>
              </div>
              <p className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase mt-0.5">
                Clinical Intelligence
              </p>
            </div>
          </div>

          {/* Center Navigation Pill Bar */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-slate-100 dark:bg-[#0c1421] border border-slate-200 dark:border-slate-800 shadow-inner">
            {navItems.map((nav) => {
              const Icon = nav.icon;
              const isActive = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveTab(nav.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-xs transition-all duration-200 relative ${
                    isActive
                      ? 'bg-rose-500 text-white font-bold shadow-[0_2px_12px_rgba(244,63,94,0.45)]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{nav.label}</span>
                  {nav.badge !== null && (
                    <span className={`ml-0.5 px-1.5 py-0.2 text-[10px] font-extrabold rounded-full ${
                      isActive 
                        ? 'bg-white/25 text-white' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                    }`}>
                      {nav.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Controls: Light/Dark Mode Toggle & System Badge */}
          <div className="flex items-center gap-3">
            
            {/* Live Engine Online Badge */}
            <div className="hidden lg:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#0c1421] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></span>
              <span>v2.4 Engine Online</span>
            </div>

            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#0c1421] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Open navigation menu"
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden max-w-7xl mx-auto px-4 pt-3 pb-4 space-y-1 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] shadow-xl">
            {navItems.map((nav) => {
              const Icon = nav.icon;
              const isActive = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => {
                    setActiveTab(nav.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-rose-500 text-white font-semibold' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{nav.label}</span>
                  </div>
                  {nav.badge !== null && (
                    <span className="px-2 py-0.5 text-xs bg-black/10 dark:bg-white/20 rounded-full font-bold">
                      {nav.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* =========================================================================
          MAIN APPLICATION VIEWPORT
         ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* =========================================================================
            PHASE 4: REIMAGINED HERO WITH INTERACTIVE CLINICAL TELEMETRY CENTERPIECE
           ========================================================================= */}
        {activeTab === 'home' && (
          <div className="space-y-16">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-2">
              
              {/* Left Column: Bold Editorial Presentation */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Clinical Platform Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-950/40 border border-cyan-500/30 text-cyan-700 dark:text-cyan-400 text-xs font-semibold">
                  <Sparkles className="h-3.5 w-3.5" /> AI Clinical Decision Support System
                </div>

                {/* Editorial Typography Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                  Smarter Predictions <br className="hidden sm:inline" />
                  for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-sky-500 to-indigo-600 dark:from-cyan-400 dark:via-sky-300 dark:to-indigo-400">Healthier You</span>
                </h1>

                {/* Specific, Value-Driven Description */}
                <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
                  Our AI model analyzes your symptoms and provides reliable disease predictions to help you take the next step towards better health.
                </p>

                {/* Primary & Secondary Action CTAs */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => setActiveTab('symptoms')}
                    className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-[0_4px_20px_rgba(6,182,212,0.35)] hover:shadow-[0_6px_25px_rgba(6,182,212,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    Start Diagnostic Check <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('result')}
                    className="px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-[#0c1421] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold text-sm border border-slate-300 dark:border-slate-800 transition-all cursor-pointer"
                  >
                    Explore Model Metrics
                  </button>
                </div>

                {/* Core Technical Proof Metrics */}
                <div className="pt-8 grid grid-cols-3 gap-6 max-w-lg border-t border-slate-200 dark:border-slate-800/80">
                  <div>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white">98.4%</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Analysis Accuracy</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white">120K+</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Scans Analyzed</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white">&lt;0.4s</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Instant Diagnosis</p>
                  </div>
                </div>

              </div>

              {/* Right Column: Interactive Clinical Telemetry Centerpiece */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-lg rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-6 shadow-2xl backdrop-blur-2xl space-y-5">
                  
                  {/* Telemetry Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 dark:bg-[#092230] border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Neural Health Scan</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Diagnostic Simulation</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-[#0d2a20] text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                      Live Assessment
                    </span>
                  </div>

                  {/* Frequency Wave Visualizer Box */}
                  <div className="p-4 rounded-2xl bg-[var(--bg-surface-inset)] border border-[var(--border-subtle)] space-y-3">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Primary AI Detection</span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Upper Respiratory Match</span>
                    </div>
                    
                    {/* 16 Audio / Frequency Bars with Dual-Mode Gradient */}
                    <div className="h-20 flex items-end justify-between gap-1.5 pt-2">
                      {[25, 45, 30, 70, 85, 65, 55, 75, 90, 70, 50, 80, 35, 85, 90, 60].map((h, i) => (
                        <div 
                          key={i} 
                          className="w-full bg-gradient-to-t from-cyan-600 via-sky-500 to-indigo-500 dark:from-cyan-500 dark:via-sky-400 dark:to-indigo-400 rounded-t-sm transition-all duration-500" 
                          style={{ height: `${h}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Input Signals Tag Pills */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Detected Input Signals:</p>
                    <div className="flex flex-wrap gap-2">
                      {['Fever (+38°C)', 'Dry Cough', 'Throat Soreness', 'Fatigue'].map((tag, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#0e1726] border border-slate-200 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Prediction Confidence Bar */}
                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-[#0e1726]/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Prediction Confidence</span>
                    <span className="text-sm font-extrabold text-cyan-600 dark:text-cyan-400">87.4% Match</span>
                  </div>

                </div>
              </div>

            </div>

            {/* Architecture Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
              {[
                {
                  icon: Zap,
                  title: "Instant AI Analysis",
                  desc: "High-speed multi-parameter prediction algorithms trained on verified diagnostic records.",
                  color: "text-cyan-600 dark:text-cyan-400",
                  bg: "bg-cyan-500/10 dark:bg-cyan-950/40 border-cyan-500/20"
                },
                {
                  icon: Layers,
                  title: "Differential Matching",
                  desc: "Evaluates overlapping conditions to provide clear probability rankings for accurate triage.",
                  color: "text-blue-600 dark:text-blue-400",
                  bg: "bg-blue-500/10 dark:bg-blue-950/40 border-blue-500/20"
                },
                {
                  icon: BarChart2,
                  title: "Confidence Metrics",
                  desc: "Transparent accuracy scores and feature importance breakdowns for every diagnostic run.",
                  color: "text-indigo-600 dark:text-indigo-400",
                  bg: "bg-indigo-500/10 dark:bg-indigo-950/40 border-indigo-500/20"
                },
                {
                  icon: ShieldCheck,
                  title: "Private & Encrypted",
                  desc: "Zero persistent personal identifier storage ensures complete confidentiality of your symptoms.",
                  color: "text-emerald-600 dark:text-emerald-400",
                  bg: "bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500/20"
                }
              ].map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div key={idx} className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 hover:scale-[1.01] group shadow-sm dark:shadow-xl">
                    <div className={`w-12 h-12 rounded-xl ${feat.bg} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-6 w-6 ${feat.color}`} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Medical Ethics & Clinical Notice */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed">
                <strong>Medical Notice:</strong> HealthAI provides pre-diagnostic screening based on machine learning probability models. It is intended strictly for informational purposes and does not constitute a certified medical diagnosis. Always consult a qualified medical professional for health emergencies.
              </p>
            </div>

          </div>
        )}

        {/* =========================================================================
            PHASE 6: SCREEN 2 — SYMPTOM ASSESSMENT STUDIO (PREDICT DISEASE)
           ========================================================================= */}
        {activeTab === 'symptoms' && (
          <div className="space-y-6">
            
            {/* Header & Quick Archetype Presets */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm dark:shadow-xl">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-cyan-600 dark:text-cyan-400" /> Patient Symptom Assessment
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Select all active patient symptoms or load a clinical archetype to run predictive modeling.
                </p>
              </div>

              {/* Quick Preset Selector Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 mr-1">Presets:</span>
                {DEMO_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => loadPreset(preset)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 transition-all cursor-pointer"
                  >
                    {preset.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Assessment Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Search, Categories & Symptom Cards */}
              <div className="lg:col-span-8 space-y-5">
                
                {/* Search Bar */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search symptom (e.g. Fever, Cough, Dyspnea, Fatigue)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-[var(--bg-surface-inset)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-all"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')} 
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {selectedSymptoms.length > 0 && (
                    <button
                      onClick={handleClearSelected}
                      className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-[#0c1421] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-all shrink-0 cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                {/* Categories Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_2px_12px_rgba(6,182,212,0.35)]'
                          : 'bg-[var(--bg-surface)] text-slate-600 dark:text-slate-300 border border-[var(--border-subtle)] hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cat.name} ({cat.count})
                    </button>
                  ))}
                </div>

                {/* Symptoms Multi-Select Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredSymptoms.map((symptom) => {
                    const isSelected = selectedSymptoms.includes(symptom.id);
                    return (
                      <div
                        key={symptom.id}
                        onClick={() => toggleSymptom(symptom.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between select-none ${
                          isSelected
                            ? 'bg-cyan-500/10 dark:bg-cyan-950/40 border-cyan-500 dark:border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                            : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                            isSelected 
                              ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold' 
                              : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
                          }`}>
                            {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                          </div>
                          <span className={`text-sm font-medium ${isSelected ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                            {symptom.name}
                          </span>
                        </div>
                        {symptom.severity === 'critical' ? (
                          <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                            Acute
                          </span>
                        ) : symptom.popular ? (
                          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                            Common
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                {/* Patient Biometric Vitals Expansion Section */}
                <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm dark:shadow-xl">
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-rose-500" />
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">Patient Vitals & Biometric Panel (Optional)</h3>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Fine-tune Clinical Accuracy</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Patient Age</label>
                      <input 
                        type="number" 
                        value={vitals.age} 
                        onChange={(e) => setVitals({...vitals, age: Number(e.target.value)})}
                        className="w-full px-3 py-2 bg-[var(--bg-surface-inset)] border border-[var(--border-subtle)] rounded-lg text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Systolic BP (mmHg)</label>
                      <input 
                        type="number" 
                        value={vitals.bp} 
                        onChange={(e) => setVitals({...vitals, bp: Number(e.target.value)})}
                        className="w-full px-3 py-2 bg-[var(--bg-surface-inset)] border border-[var(--border-subtle)] rounded-lg text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Blood Glucose (mg/dL)</label>
                      <input 
                        type="number" 
                        value={vitals.glucose} 
                        onChange={(e) => setVitals({...vitals, glucose: Number(e.target.value)})}
                        className="w-full px-3 py-2 bg-[var(--bg-surface-inset)] border border-[var(--border-subtle)] rounded-lg text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Cholesterol (mg/dL)</label>
                      <input 
                        type="number" 
                        value={vitals.chol} 
                        onChange={(e) => setVitals({...vitals, chol: Number(e.target.value)})}
                        className="w-full px-3 py-2 bg-[var(--bg-surface-inset)] border border-[var(--border-subtle)] rounded-lg text-xs font-semibold"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Sticky Summary & Evaluation CTA */}
              <div className="lg:col-span-4">
                <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-6 sticky top-24 space-y-5 shadow-sm dark:shadow-2xl">
                  
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Selected Indicators</h3>
                    <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 text-xs font-bold border border-cyan-500/30">
                      {selectedSymptoms.length} Selected
                    </span>
                  </div>

                  {selectedSymptoms.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                      <Stethoscope className="h-10 w-10 text-slate-400 dark:text-slate-600 mx-auto" />
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No symptoms selected yet.</p>
                      <p className="text-xs text-slate-400">
                        Choose symptoms from the grid or load a clinical archetype above.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      
                      {/* Active Tag Chips */}
                      <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
                        {selectedSymptoms.map((id) => {
                          const sym = SYMPTOMS_LIST.find(s => s.id === id);
                          return (
                            <span
                              key={id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 dark:bg-cyan-950/50 border border-cyan-500/30 text-cyan-800 dark:text-cyan-300 text-xs font-medium"
                            >
                              {sym?.name || id}
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleSymptom(id); }}
                                className="hover:text-rose-500 cursor-pointer"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          );
                        })}
                      </div>

                      {/* Diagnostic Engine Parameters */}
                      <div className="p-3.5 rounded-xl bg-[var(--bg-surface-inset)] border border-[var(--border-subtle)] space-y-2 text-xs">
                        <div className="flex justify-between text-slate-500 dark:text-slate-400">
                          <span>Inference Engine:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">XGBoost & RF Ensemble</span>
                        </div>
                        <div className="flex justify-between text-slate-500 dark:text-slate-400">
                          <span>Execution Latency:</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">~0.28 seconds</span>
                        </div>
                      </div>

                      {/* Execute Prediction Button */}
                      <button
                        onClick={handleRunAssessment}
                        className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-[0_4px_20px_rgba(6,182,212,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Run Disease Prediction <ArrowRight className="h-4 w-4" />
                      </button>

                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            PHASE 6: SCREEN 3 — CLINICAL ANALYTICS & DIAGNOSTIC REPORT SUITE
           ========================================================================= */}
        {activeTab === 'result' && (
          <div className="space-y-8">
            
            {/* Header with Navigation & Re-run */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-5 rounded-2xl shadow-sm dark:shadow-xl">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Assessment Result & Clinical Insights
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Multi-parameter diagnostic analysis completed across certified disease classifications
                </p>
              </div>

              <button 
                onClick={() => setActiveTab('symptoms')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 flex items-center gap-2 transition-all self-start sm:self-auto cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" /> Adjust Symptoms & Re-run
              </button>
            </div>

            {/* Main Clinical Finding Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Primary Condition Details */}
              <div className="lg:col-span-7 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-sm dark:shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-950/50 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                      Primary Match Condition
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
                      {currentResult.disease}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{currentResult.type}</p>
                  </div>

                  {/* Circular Radial Donut Score */}
                  <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-200 dark:text-slate-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-cyan-500"
                        strokeDasharray={`${currentResult.confidence}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-lg font-black text-slate-900 dark:text-white">{currentResult.confidence}%</span>
                      <span className="block text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase">Confidence</span>
                    </div>
                  </div>
                </div>

                {/* Clinical Overview Panel */}
                <div className="p-4 rounded-xl bg-[var(--bg-surface-inset)] border border-[var(--border-subtle)] text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Clinical Overview:</p>
                  <p>{currentResult.overview}</p>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-[var(--bg-surface-inset)] border border-[var(--border-subtle)]">
                    <span className="text-slate-500 dark:text-slate-400 block">Condition Urgency</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{currentResult.urgency}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[var(--bg-surface-inset)] border border-[var(--border-subtle)]">
                    <span className="text-slate-500 dark:text-slate-400 block">Expected Resolution</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{currentResult.resolution}</span>
                  </div>
                </div>

                {/* Export Report Action */}
                <button
                  onClick={handleExportReport}
                  className="w-full py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 transition-all text-xs cursor-pointer"
                >
                  <Download className="h-4 w-4 text-cyan-600 dark:text-cyan-400" /> Export Full Diagnostic Report (.txt)
                </button>

              </div>

              {/* Symptom Match Correlation & Differentials */}
              <div className="lg:col-span-5 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-6 space-y-5 shadow-sm dark:shadow-2xl">
                <h3 className="font-bold text-slate-900 dark:text-white text-base border-b border-[var(--border-subtle)] pb-3">
                  Symptom Match Correlation
                </h3>
                
                <div className="space-y-4">
                  {currentResult.correlations.map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                        <span className="text-slate-500 dark:text-slate-400">{item.match}% correlation</span>
                      </div>
                      <div className="w-full bg-[var(--bg-surface-inset)] h-2 rounded-full overflow-hidden border border-[var(--border-subtle)]">
                        <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.match}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Differential Diagnosis Alternatives */}
                <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
                  <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-300">Differential Diagnosis Alternatives:</h4>
                  <div className="space-y-2">
                    {currentResult.differentials.map((diff, i) => (
                      <div key={i} className="flex justify-between items-center text-xs p-3 rounded-xl bg-[var(--bg-surface-inset)] border border-[var(--border-subtle)]">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{diff.name}</span>
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">{diff.prob}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* MODEL PERFORMANCE METRICS SECTION */}
            <div className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Model Performance & Dataset Accuracy</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full">
                  Test Benchmark: 5,000 Verified Cases
                </span>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Accuracy Score", value: "96.0%", change: "+7.0%", color: "text-cyan-600 dark:text-cyan-400" },
                  { label: "Model Precision", value: "97.8%", change: "+4.1%", color: "text-blue-600 dark:text-blue-400" },
                  { label: "Recall Rate", value: "96.3%", change: "+6.9%", color: "text-indigo-600 dark:text-indigo-400" },
                  { label: "F1-Score Metric", value: "97.0%", change: "+5.5%", color: "text-teal-600 dark:text-teal-400" }
                ].map((kpi, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2 shadow-sm dark:shadow-lg">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{kpi.label}</span>
                    <div className="flex items-baseline justify-between">
                      <span className={`text-2xl sm:text-3xl font-black ${kpi.color}`}>{kpi.value}</span>
                      <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Confusion Matrix & Algorithm Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Confusion Matrix Heatmap */}
                <div className="lg:col-span-7 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-6 space-y-4 shadow-sm dark:shadow-xl">
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Confusion Matrix Heatmap</h4>
                    <span className="text-xs text-slate-500">Predicted vs Actual</span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 text-center text-xs pt-2">
                    <div></div>
                    <div className="font-semibold text-slate-500 dark:text-slate-400">Cold</div>
                    <div className="font-semibold text-slate-500 dark:text-slate-400">Flu</div>
                    <div className="font-semibold text-slate-500 dark:text-slate-400">Covid</div>
                    <div className="font-semibold text-slate-500 dark:text-slate-400">Pneum</div>

                    <div className="font-semibold text-slate-500 dark:text-slate-400 text-left self-center">Cold</div>
                    <div className="p-3 rounded-lg bg-cyan-500 text-slate-950 font-black">940</div>
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">32</div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500">12</div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500">16</div>

                    <div className="font-semibold text-slate-500 dark:text-slate-400 text-left self-center">Flu</div>
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">28</div>
                    <div className="p-3 rounded-lg bg-cyan-500 text-slate-950 font-black">890</div>
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">40</div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500">10</div>

                    <div className="font-semibold text-slate-500 dark:text-slate-400 text-left self-center">Covid</div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500">15</div>
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">35</div>
                    <div className="p-3 rounded-lg bg-cyan-500 text-slate-950 font-black">910</div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500">20</div>

                    <div className="font-semibold text-slate-500 dark:text-slate-400 text-left self-center">Pneum</div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500">10</div>
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">14</div>
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">22</div>
                    <div className="p-3 rounded-lg bg-cyan-500 text-slate-950 font-black">860</div>
                  </div>
                </div>

                {/* Algorithm Accuracy Comparison */}
                <div className="lg:col-span-5 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-6 space-y-4 shadow-sm dark:shadow-xl">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm border-b border-[var(--border-subtle)] pb-3">
                    Algorithm Comparison
                  </h4>
                  <div className="space-y-4">
                    {[
                      { algo: 'XGBoost Machine Classifier', score: 96.0, best: true },
                      { algo: 'Random Forest Ensemble', score: 92.5, best: false },
                      { algo: 'Support Vector Machine (SVM)', score: 88.5, best: false },
                      { algo: 'Original KNN Baseline (k=6)', score: 87.0, best: false },
                    ].map((a, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-800 dark:text-slate-200 font-medium">
                            {a.algo} {a.best && <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold ml-1.5">[Selected Active]</span>}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">{a.score}%</span>
                        </div>
                        <div className="w-full bg-[var(--bg-surface-inset)] h-2 rounded-full overflow-hidden border border-[var(--border-subtle)]">
                          <div className={`h-full rounded-full ${a.best ? 'bg-cyan-500' : 'bg-slate-400 dark:bg-slate-700'}`} style={{ width: `${a.score}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* =========================================================================
            PHASE 6: SCREEN 4 — CLINICAL AUDIT TRAIL (HISTORY)
           ========================================================================= */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            
            {/* Search & Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-surface)] p-5 rounded-2xl border border-[var(--border-subtle)] shadow-sm dark:shadow-xl">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search history by disease, case ID, or symptom..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-surface-inset)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-primary)] placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setHistoryList([])}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" /> Clear History Log
                </button>
              </div>
            </div>

            {/* Audit Logs Table */}
            <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden shadow-sm dark:shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--bg-surface-inset)] border-b border-[var(--border-subtle)] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="p-4">Case ID & Date</th>
                      <th className="p-4">Symptoms Reported</th>
                      <th className="p-4">Predicted Outcome</th>
                      <th className="p-4">Confidence</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)] text-slate-700 dark:text-slate-300">
                    {filteredHistory.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">
                          No diagnostic history logs found matching search.
                        </td>
                      </tr>
                    ) : (
                      filteredHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-4">
                            <span className="font-mono text-[11px] font-bold text-cyan-600 dark:text-cyan-400 block">{item.id}</span>
                            <span className="text-slate-400 text-[10px]">{item.date}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {item.symptoms.map((s, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded-md bg-[var(--bg-surface-inset)] text-slate-700 dark:text-slate-300 border border-[var(--border-subtle)] text-[10px]">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 font-bold text-slate-900 dark:text-white">{item.disease}</td>
                          <td className="p-4">
                            <span className="px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 font-bold border border-cyan-500/30">
                              {item.confidence}% Match
                            </span>
                          </td>
                          <td className="p-4">
                            <button 
                              onClick={() => {
                                setSelectedCaseModal(item);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                            >
                              Inspect Case
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Case Details Modal / Drawer */}
            {selectedCaseModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Case Inspection: {selectedCaseModal.id}</h3>
                    <button onClick={() => setSelectedCaseModal(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Assessed Condition:</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedCaseModal.disease}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Timestamp:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-mono">{selectedCaseModal.date}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">Reported Symptoms:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedCaseModal.symptoms.map((s, idx) => (
                          <span key={idx} className="px-2 py-1 rounded bg-[var(--bg-surface-inset)] border border-[var(--border-subtle)] text-[11px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-slate-400">Match Confidence:</span>
                      <span className="font-bold text-cyan-600 dark:text-cyan-400 text-sm">{selectedCaseModal.confidence}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCaseModal(null);
                      setActiveTab('result');
                    }}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                  >
                    View in Full Analytics Studio
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            PHASE 6: SCREEN 5 — CLINICAL ARCHITECTURE & SPECIFICATIONS (ABOUT)
           ========================================================================= */}
        {activeTab === 'about' && (
          <div className="space-y-8">
            
            {/* Architecture Card */}
            <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-8 space-y-6 shadow-sm dark:shadow-2xl">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">HealthAI Clinical Architecture</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-3xl">
                  HealthAI is designed as an intelligent pre-clinical diagnostic framework. It processes multi-label symptom correlation matrices alongside physiological biomarkers using scikit-learn and XGBoost models, delivering instant predictions with high clinical specificity.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Machine Learning", desc: "Calibrated XGBoost & Random Forest Ensembles with 96.0% accuracy", icon: Cpu },
                  { title: "Medical Dataset", desc: "5,000+ validated physiological and biometric clinical records", icon: Database },
                  { title: "UI Architecture", desc: "Accessible design system with CSS custom property tokenization", icon: Code },
                  { title: "Inference Engine", desc: "Sub-0.3s execution latency with FastAPI backend endpoints", icon: FileText },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="p-5 rounded-xl bg-[var(--bg-surface-inset)] border border-[var(--border-subtle)] space-y-2">
                      <Icon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                      <h3 className="font-bold text-slate-900 dark:text-white text-xs">{item.title}</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Regulatory & Safety Standards */}
            <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-8 space-y-4 shadow-sm dark:shadow-2xl">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" /> Clinical Safety & Ethical Standards
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Algorithmic Transparency</h4>
                  <p>All predictions include differential alternatives and confidence thresholds to eliminate black-box opacity in triage.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Zero Persistent PII</h4>
                  <p>No patient identifiers, IP addresses, or personal medical histories are stored permanently on server infrastructure.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Continuous Calibration</h4>
                  <p>Models are evaluated using 5-fold cross-validation against held-out clinical cohorts with sensitivity tracking.</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* =========================================================================
          FOOTER WITH CLINICAL GUIDELINES
         ========================================================================= */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-8 px-4 sm:px-6 lg:px-8 mt-auto text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 HealthAI Decision-Support System. Engineered for clinical accuracy.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-cyan-500 cursor-pointer">Clinical Guidelines</span>
            <span className="hover:text-cyan-500 cursor-pointer">Security Protocol</span>
            <span className="hover:text-cyan-500 cursor-pointer">API Documentation</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
