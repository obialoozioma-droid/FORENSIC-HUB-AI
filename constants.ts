
import { Article, Case, Note } from './types';

export const ARTICLES: Article[] = [
  {
    id: 'art-101',
    title: 'Introduction to Forensic Science (FSC 111)',
    category: 'General',
    description: 'A comprehensive full-course note covering the foundation, history, principles, and professional ethics of Forensic Science.',
    content: `## CHAPTER 1: THE FOUNDATION OF FORENSIC SCIENCE

Forensic science is the application of scientific principles and techniques to matters of criminal and civil law that are enforced by police agencies in a criminal justice system. It is an umbrella term that encompasses a multitude of scientific disciplines.

### 1.1 The Locard Exchange Principle
Postulated by Edmond Locard, the "Sherlock Holmes of France," this principle states that **"Every contact leaves a trace."** Whenever two objects come into contact with one another, there is an exchange of materials between them. This is the cornerstone of all forensic investigation. If a criminal enters a scene, they bring something and they take something away.

### 1.2 The Seven Fundamental Principles
1. **Law of Individuality:** Every object, natural or man-made, has an individuality which is not duplicated in any other object. Even identical twins have different fingerprints.
2. **Principle of Analysis:** The quality of analysis is only as good as the sample found. Contamination at the scene destroys the validity of laboratory findings.
3. **Law of Progressive Change:** Everything changes with time. The evidence at a scene degrades over time—blood dries, odors dissipate, and biological material rots.
4. **Principle of Comparison:** Only like can be compared with like. You cannot compare a 9mm bullet striation with a .45 ACP barrel.
5. **Law of Probability:** All identifications are made based on the probability of a match. A DNA profile match is expressed as a 1 in billions chance.
6. **Principle of Circumstantial Facts:** Eyewitnesses may lie or be mistaken, but physical evidence is a silent witness that speaks only the truth.
7. **Law of Correlation:** The more evidence items pointing in one direction, the higher the certainty of the conclusion.

---

## CHAPTER 2: HISTORICAL EVOLUTION

The development of forensic science is credited to several pioneers:
- **Mathieu Orfila (1787–1853):** The father of forensic toxicology. He published the first scientific treatise on the detection of poisons and their effects on animals.
- **Alphonse Bertillon (1853–1914):** Developed Anthropometry, the first scientific system of personal identification using body measurements. It was later replaced by fingerprinting.
- **Francis Galton (1822–1911):** Conducted the first definitive study of fingerprints and their classification. He proved that fingerprints are permanent and unique.
- **Leone Lattes (1887–1954):** Developed a procedure to determine blood type from dried bloodstains, a system still relevant for exclusionary purposes.
- **Calvin Goddard (1891–1955):** Used a comparison microscope to determine if a particular gun fired a bullet, revolutionizing firearms identification.
- **Albert S. Osborn (1858–1946):** Developed the fundamental principles of document examination, making it possible for documents to be accepted as scientific evidence in court.

---

## CHAPTER 3: BRANCHES OF FORENSIC SCIENCE

### 3.1 Forensic Biology & Serology
Analysis of biological fluids (blood, semen, saliva) and DNA profiling. It is used to link suspects to crime scenes or victims through genetic material. Modern STR (Short Tandem Repeat) analysis allows for identification from just a few skin cells.

### 3.2 Forensic Chemistry & Toxicology
Identification of unknown substances, analysis of drugs, and detection of poisons in biological samples. Toxicologists look for metabolites in the blood, liver, or vitreous humor of the eye to determine if drugs contributed to a death.

### 3.3 Questioned Document Examination (QDE)
Analysis of handwriting, ink, paper, and printing processes to determine the authenticity of documents or detect forgeries. This includes analyzing the indentation left on a notepad by a pen used on the previous page.

### 3.4 Forensic Ballistics (FSC 411)
The study of projectiles and firearms. Investigators analyze striations on bullets and tool marks on cartridge cases to link a weapon to a crime. They also perform trajectory analysis to determine where a shooter was standing.

### 3.5 Digital & Multimedia Forensics
Recovery and investigation of material found in digital devices, often in relation to computer crime. This involves bypassing encryption and recovering deleted data from hard drives and cloud storage.

---

## CHAPTER 4: THE FORENSIC PROCESS

1. **Crime Scene Investigation:** Secure the scene, document (photography/sketches), and collect evidence using appropriate tools (swabs, bags, tweezers).
2. **Chain of Custody:** Maintaining a chronological written record of all individuals who had possession of an item of evidence. If the chain is broken, the evidence is inadmissible in court.
3. **Laboratory Analysis:** Applying scientific methods—GC-MS, PCR, Microscopy—to extract data from evidence.
4. **Interpretation & Reporting:** Translating data into a formal expert witness report that is understandable to a jury.
5. **Expert Testimony:** Presenting findings in a court of law and withstanding cross-examination from the defense.

---

## CHAPTER 5: ETHICS & THE NIGERIAN LEGAL CONTEXT

In Nigeria, forensic evidence must comply with the **Evidence Act (2011)**. Admissibility depends on:
- Relevance of the evidence to the case.
- The competence of the expert witness (qualification and experience).
- The reliability of the scientific method used.

**Professional Ethics:**
A forensic scientist must remain neutral. Their duty is to the truth, not to the prosecution or the defense. Bias—whether conscious or unconscious—is the greatest enemy of forensic integrity. You must report what you find, even if it clears the suspect.`,
    isPremium: false,
    author: 'Dr. Kunle Adeleke',
    readTime: '25 min',
    image: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=800&auto=format&fit=crop',
    level: 100,
    semester: 1
  },
  {
    id: 'art-203',
    title: 'Fingerprint Classification (Henry System)',
    category: 'Physical',
    description: 'Mastering the identification of loops, whorls, and arches for manual and AFIS database searches.',
    content: `## MODULE: DACTYLOSCOPY & HUMAN IDENTIFICATION

Fingerprints are the most commonly used forensic evidence worldwide. Their reliability is based on two properties: **Permanence** (they don't change from birth to death) and **Uniqueness** (no two people, even identical twins, have the same pattern).

### 1. THE BIOLOGY OF RIDGES
Ridges are formed in the fetal stage (about the 12th week of gestation) and are influenced by genetic factors and the movement of the fetus in the womb. The pattern is located in the dermal papillae, the layer of skin just below the epidermis. Because the pattern is so deep, minor cuts or burns do not change it.

### 2. PATTERN CLASSIFICATION
#### 2.1 Loops (60-65% of Population)
- **Ulnar Loop:** Opens toward the pinky finger (ulna bone).
- **Radial Loop:** Opens toward the thumb (radius bone).
- Must have one delta and at least one ridge passing between the delta and core.

#### 2.2 Whorls (30-35% of Population)
- **Plain Whorl:** At least one ridge makes a complete circuit (circle or spiral).
- **Central Pocket Loop Whorl:** At least one ridge makes a complete circuit but the delta is further away, making it look like a loop with a whorl in the center.
- **Double Loop Whorl:** Two separate loop formations in one print.
- **Accidental Whorl:** Contains two or more patterns or doesn't fit other categories.
- Whorls must have at least two deltas.

#### 2.3 Arches (5% of Population)
- **Plain Arch:** Ridges enter one side and exit the other with a slight rise in the middle.
- **Tented Arch:** Similar to plain arch but with a sharp spike or central thrust.
- Arches have no deltas or cores.

### 3. MINUTIAE (RIDGE CHARACTERISTICS)
Individualization is not based on the general pattern (loops/whorls) but on the minutiae. In a typical fingerprint, there are over 150 minutiae. A "match" usually requires 8 to 16 points of similarity.
- **Ridge Ending:** Where a ridge suddenly stops.
- **Bifurcation:** A single ridge splitting into two.
- **Island (Short Ridge):** A ridge that is as long as it is wide.
- **Enclosure:** A ridge that splits and then joins back together, forming a hole.
- **Ridge Crossing:** Two ridges crossing over each other.

### 4. THE HENRY SYSTEM
Developed by Sir Edward Henry in 1896, this system allowed ten-print cards to be indexed. It assigns numerical values to whorls:
- Fingers 1 & 2: Value 16
- Fingers 3 & 4: Value 8
- Fingers 5 & 6: Value 4
- Fingers 7 & 8: Value 2
- Fingers 9 & 10: Value 1
- The sum of the even-numbered finger values is the numerator, and the odd-numbered is the denominator. We add 1 to both to avoid a zero.

### 5. LATENT FINGERPRINT DEVELOPMENT
- **Physical Methods:** Using volcanic, magnetic, or fluorescent powders on non-porous surfaces like glass or polished wood.
- **Chemical Methods:**
  - **Ninhydrin:** Reacts with amino acids in sweat. It turns purple (Ruhemann's purple) and is ideal for paper and cardboard.
  - **Cyanoacrylate (Superglue):** Fuming used for plastics and metals. It creates a hard, white coating on the ridges.
  - **Silver Nitrate:** Reacts with chlorides (salt) in sweat. It turns dark when exposed to light.
  - **DFO:** A chemical similar to ninhydrin that is much more sensitive.`,
    isPremium: true,
    author: 'Agent Sarah Paul',
    readTime: '18 min',
    image: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?q=80&w=800&auto=format&fit=crop',
    level: 200,
    semester: 2
  },
  {
    id: 'art-311',
    title: 'Forensic Serology & DNA Profiling (FSC 311)',
    category: 'Biological',
    description: 'Advanced study of biological fluid identification and the mechanics of STR-based DNA profiling.',
    content: `## THE REVOLUTION OF BIOLOGICAL EVIDENCE

Forensic serology involves the identification and characterization of biological fluids. While DNA provides individualization, serology provides the necessary preliminary identification—knowing *what* the fluid is before knowing *who* it belongs to.

### 1. BLOOD IDENTIFICATION
#### 1.1 Presumptive Tests
These tests indicate that a stain might be blood. They are highly sensitive but can produce false positives with plant materials.
- **Kastle-Meyer (KM) Test:** Uses phenolphthalein. Turns brilliant pink in the presence of hemoglobin.
- **Luminol:** Produces chemiluminescence in the dark. Used for detecting invisible bloodstains that have been cleaned or painted over.
- **Hemastix:** A plastic strip with a chemical pad that turns green-blue.

#### 1.2 Confirmatory Tests
- **Teichmann & Takayama Tests:** Microcrystalline tests that form specific crystals with blood under a microscope.
- **RSID (Rapid Stain Identification):** Immunochromatographic strips for human-specific blood.

### 2. SEMEN & OTHER FLUIDS
- **Acid Phosphatase (AP) Test:** Presumptive for semen. It reacts with an enzyme secreted by the prostate.
- **Christmas Tree Stain:** Microscopic confirmation of spermatozoa. The heads are stained red and the tails are stained green.
- **Amylase Test:** For saliva identification. It detects the enzyme that breaks down starch.

### 3. THE SCIENCE OF DNA PROFILING
Discovered for forensic use by Sir Alec Jeffreys in 1984. DNA is found in the nucleus of almost every cell in the body.

#### 3.1 STR (Short Tandem Repeats)
Modern forensics uses STRs—locations on the chromosome that contain short sequences (2-6 base pairs) that repeat. The number of repeats varies between individuals. For example, at one location, Person A might have 10 repeats, and Person B might have 14. By looking at 13-20 different locations, the chance of two people matching is astronomically low.

#### 3.2 PCR (Polymerase Chain Reaction)
PCR is a molecular "photocopying" technique. It allows forensic scientists to take a tiny, degraded sample of DNA (from a cigarette butt or a single hair) and amplify it millions of times so it can be analyzed.
- **Step 1: Denaturation:** Heating to separate the double-stranded DNA into single strands.
- **Step 2: Annealing:** Cooling so primers can bind to specific sequences flanking the STR.
- **Step 3: Extension:** DNA polymerase adds bases to create new strands.

#### 3.4 Y-STR & Mitochondrial DNA
- **Y-STR:** Only analyzes the Y-chromosome (passed from father to son). It is extremely useful in gang rape cases to determine how many males were involved.
- **mtDNA:** Found in the mitochondria. Inherited only from the mother. Useful for old skeletal remains, teeth, or hair shafts without roots.`,
    isPremium: false,
    author: 'Prof. Amaka Nwosu',
    readTime: '35 min',
    image: 'https://images.unsplash.com/photo-1579154273821-4a181fc7f3b7?q=80&w=800&auto=format&fit=crop',
    level: 300,
    semester: 1
  },
  {
    id: 'art-411',
    title: 'Forensic Ballistics & Firearms Identification (FSC 411)',
    category: 'Ballistics',
    description: 'Technical analysis of firearms, ammunition, and the physics of projectile motion in criminal investigation.',
    content: `## MODULE: FORENSIC BALLISTICS

Ballistics is the science of mechanics that deals with the flight, behavior, and effects of projectiles. Forensic ballistics involves the analysis of firearm use in crimes.

### 1. CATEGORIES OF BALLISTICS
1. **Internal Ballistics:** What happens inside the firearm from the moment the trigger is pulled until the bullet leaves the barrel. This includes the mechanical movement of the firing pin and the burning of propellant.
2. **External Ballistics:** The flight of the bullet through the air. This is governed by physics—gravity pulls it down, air resistance slows it, and wind can blow it off course.
3. **Terminal Ballistics:** The effect of the bullet on the target. This includes wounding patterns in human tissue or the penetration of materials like car doors or body armor.

### 2. FIREARM MECHANICS & RIFLING
The barrel of a gun is not smooth. Modern firearms have **Rifling**—spiral grooves cut into the inner surface.
- **Lands:** The raised portions between the grooves.
- **Grooves:** The low portions.
Rifling imparts spin to the bullet, like a quarterback throwing a football. This spin ensures stability in flight. As the bullet travels down the barrel, the hard metal lands and grooves leave unique marks (striations) on the softer bullet.

### 3. INDIVIDUALIZATION OF FIREARMS
No two firearms—even of the same make and model—produce the same markings. Microscopic imperfections in the manufacturing tools create a "fingerprint" inside the gun.
- **Breech Face Marks:** Impressions left on the base of the cartridge case by the rear wall of the firing chamber.
- **Firing Pin Impressions:** The specific shape and depth of the mark left by the firing pin hitting the primer.
- **Ejector & Extractor Marks:** Scratches made on the casing as it is pulled from the chamber and thrown out of the gun.

### 4. THE COMPARISON MICROSCOPE
The most important tool in ballistics. It allows two bullets or two cartridge cases to be viewed side-by-side in a single field of view. The goal is to align the striations. If the lines continue perfectly from one bullet to the other, it is a positive match.

### 5. GSR (GUNSHOT RESIDUE)
WHEN A GUN IS FIRED, A CLOUD OF VAPORIZED PRIMER AND POWDER IS RELEASED. THIS RESIDUE (CONTAINING LEAD, BARIUM, AND ANTIMONY) SETTLES ON THE HANDS AND CLOTHES OF THE SHOOTER.
- **Detection:** SEM-EDX (Scanning Electron Microscopy with Energy Dispersive X-ray) is the gold standard for GSR analysis because it can identify individual particles by their chemical composition and shape.

### 6. NIGERIAN CONTEXT: THE FIREARMS ACT
FORENSIC BALLISTICS IN NIGERIA IS GOVERNED BY THE FIREARMS ACT, WHICH REGULATES LICENSING AND PROHIBITS CERTAIN CATEGORIES OF WEAPONS. A MAJOR CHALLENGE IN NIGERIA IS THE RISE OF LOCALLY MANUFACTURED "HAND-MADE" GUNS, WHICH OFTEN HAVE SMOOTH BORES AND REQUIRE DIFFERENT IDENTIFICATION TECHNIQUES THAN FACTORY-MADE RIFLED WEAPONS.`,
    isPremium: true,
    author: 'Dr. Kunle Adeleke',
    readTime: '40 min',
    image: 'https://images.unsplash.com/photo-1585061648936-6551846b0a23?q=80&w=800&auto=format&fit=crop',
    level: 400,
    semester: 2
  }
];

export const LECTURER_NOTES: Note[] = [
  {
    id: 'note-001',
    title: 'Ballistics & Internal Rifling Mechanics',
    lecturer: 'Dr. Kunle Adeleke',
    level: 400,
    description: 'Advanced technical guide covering the physics of rifling, striation formation, and the use of IBIS (Integrated Ballistics Identification System).',
    isVerified: true,
    courseCode: 'FSC 411',
    content: `FORENSIC BALLISTICS LECTURE NOTES (FSC 411)
DR. KUNLE ADELEKE - SENIOR LECTURER

I. THE PHYSICS OF RIFLING
Rifling consists of spiral grooves cut into the bore of a firearm barrel. Its purpose is to impart a gyroscopic spin to the projectile, which stabilizes it in flight and improves accuracy. 
- Twist Rate: The distance the bullet must travel to make one full revolution (e.g., 1:7 means 1 turn in 7 inches).
- Broach Cutting vs. Button Rifling: Broach cutting uses a series of cutting teeth, while button rifling involves pushing a hardened tool through the barrel to displace metal.

II. STRIATION FORMATION (THE MICRO-PRINT)
As a bullet is forced through the barrel under immense pressure (often exceeding 30,000 PSI), the microscopic imperfections on the lands and grooves scratch the bullet's surface. These scratches, or "striations," are unique to every single gun. 
- Class Characteristics: Caliber, number of lands/grooves, direction of twist (Left or Right).
- Individual Characteristics: The specific striations within the lands and grooves.

III. IBIS (INTEGRATED BALLISTICS IDENTIFICATION SYSTEM)
IBIS is the automated database used to store images of spent bullets and cartridge cases. 
- BRASSTRAX: Captures high-resolution images of the breech face and firing pin marks.
- BULLETTRAX: Captures 3D images of the circumference of a bullet to analyze striations.
IBIS does not make a final "match"—it provides a list of potential candidates that a human examiner must then verify using a comparison microscope.

IV. TERMINAL EFFECTS & WOUNDING
- Temporary Cavity: The rapid stretching of tissue caused by the bullet's pressure wave.
- Permanent Cavity: The actual hole left by the bullet's path.
- Yaw: The tumbling of a bullet as it enters a denser medium (like the human body), which increases tissue damage.

========================================================================
END OF ADVANCED BALLISTICS NOTE
========================================================================`,
    price: 1000,
    timestamp: Date.now() - 86400000
  },
  {
    id: 'note-002',
    title: 'Introduction to Serology',
    lecturer: 'Prof. Amaka Nwosu',
    level: 200,
    description: 'Foundation module for blood identification, including enzymatic tests, crystal tests, and the history of ABO typing.',
    isVerified: true,
    courseCode: 'FSC 211',
    content: `FUNDAMENTALS OF FORENSIC SEROLOGY (FSC 211)
PROF. AMAKA NWOSU

I. BIOLOGICAL FLUID IDENTIFICATION
Forensic serologists are tasked with finding and identifying biological fluids at crime scenes.
- Visual Inspection: Using High-Intensity Light Sources (ALS) to find stains.
- Presumptive Testing: The first step in identification. High sensitivity, low specificity.

II. BLOOD ANALYSIS PROTOCOLS
1. Visual Examination: Determine color and shape (spatter analysis).
2. Presumptive Test: Kastle-Meyer (KM) is the standard. A positive result is a deep pink color appearing within 2 seconds.
3. Confirmatory Test: RSID-Blood or Takayama test. The Takayama test produces pink, feathery pyridine ferroprotoporphyrin crystals.
4. Species Origin: The Ouchterlony Double Diffusion test is used to determine if the blood is human or animal using antibodies.

III. THE ABO BLOOD GROUP SYSTEM
While DNA has replaced blood typing for individualization, the ABO system remains crucial for quick exclusions.
- Type A: Has A antigens and B antibodies.
- Type B: Has B antigens and A antibodies.
- Type AB: Has both A and B antigens, no antibodies.
- Type O: Has no antigens, both A and B antibodies.
Approximately 80% of the population are "Secretors," meaning their blood type can be found in other fluids like saliva and semen.

IV. ALTERNATIVE FLUIDS
- Saliva: Identified by the presence of Amylase.
- Urine: Identified by Urea or Creatinine.
- Semen: Identified by Acid Phosphatase (AP) and the microscopic presence of spermatozoa.

========================================================================
END OF SEROLOGY FOUNDATION NOTE
========================================================================`,
    price: 0,
    timestamp: Date.now() - 172800000
  },
  {
    id: 'note-003',
    title: 'Forensic Toxicology: Post-Mortem Analysis',
    lecturer: 'Dr. Bamidele Silas',
    level: 300,
    description: 'Comprehensive guide to screening for poisons, drugs of abuse, and alcohol in biological specimens.',
    isVerified: true,
    courseCode: 'FSC 321',
    content: `FORENSIC TOXICOLOGY & POISONS (FSC 321)
DR. BAMIDELE SILAS

I. ROLE OF THE TOXICOLOGIST
The toxicologist determines if chemicals (drugs, toxins, poisons) contributed to death or impairment.
- Post-Mortem Toxicology: Determining cause of death.
- Workplace Testing: Screening for drugs of abuse.
- Human Performance: Analyzing blood-alcohol levels in drivers.

II. SPECIMEN COLLECTION
Samples must be collected before the body is embalmed.
- Peripheral Blood: The gold standard for quantitative analysis.
- Vitreous Humor: The fluid from the eye. It is resistant to putrefaction and is the best sample for testing alcohol or glucose levels in a decomposing body.
- Liver: Where drugs are metabolized.
- Hair: Provides a "timeline" of drug use (hair grows 1cm per month).

III. ANALYTICAL TECHNIQUES
1. Screening: Fast and cheap. Usually Immunoassays (ELISA).
2. Confirmation: Expensive and precise. Gas Chromatography-Mass Spectrometry (GC-MS) or LC-MS. GC-MS is the "gold standard" because it provides a unique "fingerprint" for every chemical compound.

IV. COMMON TOXINS IN NIGERIA
- Carbon Monoxide: Often from faulty generators in poorly ventilated rooms.
- Pesticides: Paraquat and organophosphates are common in rural poisoning cases.
- Alcohol: Ethanol levels above 0.08% indicate legal impairment.
- Heavy Metals: Lead and Mercury.

VI. INTERPRETATION
- Therapeutic Dose: The amount needed for a medical effect.
- Toxic Dose: The amount that causes harm.
- Lethal Dose (LD50): The amount that kills 50% of the population.

========================================================================
END OF TOXICOLOGY MODULE
========================================================================`,
    price: 1000,
    timestamp: Date.now() - 43200000
  }
];

export const CASES: Case[] = [
  {
    id: 'case-NG-2024-001',
    title: 'The Obalende Arson & Accelerant Trail',
    difficulty: 'Intermediate',
    summary: 'A luxury warehouse in Obalende was razed. Investigators suspect professional sabotage using high-grade accelerants. Analyze pour patterns and residue samples.',
    evidence: ['Charred wood samples', 'V-pattern charring', 'Security metadata', 'Hydrocarbon detector logs'],
    location: 'Obalende, Lagos State',
    date: 'March 14, 2024',
    content: `## INVESTIGATIVE DOSSIER: CASE NG-2024-001

### SCENE SUMMARY
On March 14, 2024, at approximately 02:45 hrs, a structural fire was reported at the Horizon Logistics Warehouse in Obalende. The fire consumed 80% of the facility within 45 minutes, suggesting an unusually high rate of heat release.

### PRELIMINARY OBSERVATIONS
Initial walkthrough by Arson Investigators revealed multiple "Points of Origin" located in the northern storage wing. Distinct "V-patterns" were observed on load-bearing pillars, pointing toward the floor. In arson, fire typically burns upward and outward; the bottom of the V is the origin.

### FORENSIC CHALLENGE: ACCELERANT DETECTION
The floor was concrete but showed signs of "spalling"—the chipping of concrete due to intense heat in localized areas. This often indicates where an accelerant was poured. 

#### LAB DATA:
- **Sample 01-A (Debris):** Gas Chromatography-Mass Spectrometry (GC-MS) identified traces of C8-C12 hydrocarbons, consistent with industrial-grade kerosene.
- **Ignition Source:** No faulty wiring was found. However, a melted plastic container was recovered near the north entrance, suspiciously distant from any electrical equipment.

### THE saboteurs' SIGNATURE
Chemical markers in the kerosene match a specific batch distributed to a nearby maritime fueling station. Students must use the **Lab Terminal** to verify if the spalling patterns match the pour rate of 5 liters of kerosene.`
  },
  {
    id: 'case-NG-2023-088',
    title: 'The Lekki Ballistics Trajectory',
    difficulty: 'Expert',
    summary: 'A high-profile vehicle ambush on Lekki Expressway. Determine the shooter\'s position based on glass fracture patterns and bullet entry angles.',
    evidence: ['Shattered tempered glass', 'Spent 9mm casings', 'Trajectory rods', 'Vehicle telemetry'],
    location: 'Lekki-Epe Expressway, Lagos',
    date: 'November 22, 2023',
    content: `## CASE FILE: THE LEKKI EXPRESSWAY AMBUSH

### INCIDENT REPORT
A black SUV was targeted in a precision ambush while merging onto the Lekki-Epe Expressway. Three shots were fired. The occupants survived, but the vehicle was disabled.

### BALLISTIC RECONSTRUCTION
We have three distinct bullet strikes:
1. **Entry 01:** Passenger side door (perpendicular).
2. **Entry 02:** Front windshield (oblique angle).
3. **Entry 03:** Rear-view mirror (grazing).

### FRACTURE ANALYSIS
The windshield glass shows "Radial" and "Concentric" fractures. By applying the **4R Rule** (Radial cracks form Right angles on the Reverse side of the force), we have determined the bullet originated from an elevated position. 

### FORENSIC ANALYSIS TASK
Using the **3D Reconstruction Engine**, students must map the trajectory rods. 
- The 9mm casings found 40 meters away have "Circular" firing pin impressions.
- Strike 02 shows a 15-degree downward angle.
- This suggests the shooter was likely positioned on the pedestrian bridge overlooking the expressway.

### CHEMICAL DATA:
Scanning Electron Microscopy (SEM) on the victim's jacket revealed Lead, Antimony, and Barium (GSR), confirming the weapon was fired within a 5-meter radius or the wind carried the residue.`
  },
  {
    id: 'case-NG-2024-012',
    title: 'The Port Harcourt Cold Case DNA',
    difficulty: 'Expert',
    summary: 'Skeletal remains found at a construction site in PH. Use mitochondrial DNA and familial searching to identify a victim missing since 1998.',
    evidence: ['Femur fragment', 'Tattered fabric', 'Soil pH records', 'Dental records'],
    location: 'Diobu, Port Harcourt',
    date: 'January 10, 2024',
    content: `## COLD CASE ANALYSIS: PH-DIOBU REMAINS

### RECOVERY
During excavation for a new drainage system in Diobu, construction workers uncovered human skeletal remains buried approximately 2.5 meters deep.

### OSTEOLOGICAL PROFILE
- **Sex:** Likely Female (based on pelvic inlet width).
- **Age at Death:** 22-26 years (epiphyseal fusion of the clavicle).
- **Stature:** 165cm +/- 3cm.

### THE DNA CHALLENGE
Due to high humidity and soil acidity (pH 4.5) in the Niger Delta, nuclear DNA in the bone marrow was severely degraded. 

#### MITOCHONDRIAL DNA (mtDNA) ANALYSIS:
We successfully sequenced the Hypervariable Region 1 (HV1) of the mtDNA. This DNA is inherited maternally. We cross-referenced this with the "Missing Persons DNA Database" of the 1990s.

### FAMILIAL SEARCHING
A partial match was found with a woman currently living in Enugu. She reported her sister missing in 1998 during a period of civil unrest.

### INVESTIGATIVE TASK
Use the **AI Anatomist** to reconstruct the skull's facial features based on the recovered cranium. Compare the 3D render with archived missing person photos from the 1990s.`
  }
];

export const PREMIUM_PRICE_NGN = 1700;
