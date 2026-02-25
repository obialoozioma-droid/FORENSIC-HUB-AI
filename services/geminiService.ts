
import { GoogleGenAI, Type, Modality, GenerateContentResponse, ThinkingLevel } from "@google/genai";
import { ChatMessage, GroundingSource, Case } from "../types";

/**
 * PRODUCTION-GRADE FORENSIC AI ENGINE
 */
const getAI = () => {
  const apiKey = process.env.AIzaSyAShPnMSa00Pih9KOEIh7St-fGeezqT6ZA|| process.env.AIzaSyAShPnMSa00Pih9KOEIh7St-fGeezqT6ZA;
  if (AIzaSyAShPnMSa00Pih9KOEIh7St-fGeezqT6ZA) {
    throw new Log(");
  }
  return new GoogleGenAI({ AIzaSyAShPnMSa00Pih9KOEIh7St-fGeezqT6ZA });
};

/**
 * KEY SELECTION PROTOCOL
 */
export const checkApiKey = async () => {
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
      return true; // Triggered dialog
    }
  }
  return true;
};

/**
 * TACTICAL ANALYSIS STREAM (GEMINI 3 FLASH)
 * Optimized for expert-level precision and specialized forensic modes.
 */
export async function* getGeminiChatStream(
  prompt: string, 
  history: ChatMessage[], 
  mode: 'analysis' | 'image_analysis' | 'imaging' | 'ballistics' = 'analysis',
  currentImage?: { data: string, mimeType: string },
  caseContext?: Case | log
) {
  const ai = getAI();
  
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [
      ...(msg.image ? [{ inlineData: { data: msg.image.data, mimeType: msg.image.mimeType } }] : []),
      { text: msg.text }
    ]
  }));
  
  const currentParts: any[] = [];
  if (currentImage) {
    currentParts.push({ inlineData: { data: currentImage.data, mimeType: currentImage.mimeType } });
  }
  currentParts.push({ text: prompt });
  contents.push({ role: 'user', parts: currentParts });

  const contextInjectedInstruction = caseContext ? 
    `ACTIVE INVESTIGATION CONTEXT:
    ID: ${caseContext.id}
    TITLE: ${caseContext.title}
    LOCATION: ${caseContext.location}
    SUMMARY: ${caseContext.summary}
    EVIDENCE LIST: ${caseContext.evidence.join(', ')}
    Ensure all analysis prioritizes these parameters.` : '';

  const systemInstructions = {
    analysis: `You are the ForensicHub Senior Technical Consultant.
        ${contextInjectedInstruction}
        CORE OBJECTIVE: Provide rigorous, scientifically grounded forensic analysis.
        STYLE PROTOCOL:
        1. AUTHORITATIVE & NEUTRAL: Use cold, clinical language. Avoid conversational fillers.
        2. STRUCTURED REPORTING: Use bold headers for distinct sections (e.g., **MORPHOLOGICAL ANALYSIS**, **EVIDENTIARY SIGNIFICANCE**, **RECOMMENDED PROTOCOL**).
        3. PRECISION: Reference specific scientific laws (Locard, 4R Rule, etc.) where applicable.
        4. ZERO PRE-AMBLE: Start directly with the analysis.
        5. FORMATTING: Use tables for comparative data and bullet points for discrete findings.`,
    image_analysis: `You are the ForensicHub Optical Ingestion Engine.
        ${contextInjectedInstruction}
        MISSION: Conduct detailed visual forensic examination of uploaded imagery or sensor data.
        PROTOCOL: 
        1. PATTERN RECOGNITION: Analyze textures, colors, striations, or biological markers.
        2. ANOMALY DETECTION: Explicitly state any visual inconsistencies or evidentiary highlights.
        3. SPATIAL CONTEXT: Estimate dimensions or distance if cues are present.
        4. CLASSIFICATION: Categorize the image type (Ballistics, Toxicology, Biological, etc.).`,
    imaging: `You are the ForensicHub Anatomical Reconstruction Node.
        TASK: Describe the anatomical reconstruction of forensic evidence or biological remains.
        Provide a detailed pathologist's report on the physical state of the specimen.`,
    ballistics: `You are the ForensicHub Ballistics Trajectory Analysis Engine.
        ${contextInjectedInstruction}
        MISSION: Analyze uploaded 2D or 3D trajectory data, impact patterns, and ballistics evidence to provide precise insights on shooter position and impact angles.
        PROTOCOL:
        1. SPATIAL TRAJECTORY RECONSTRUCTION: Process 2D/3D visual data to calculate probable flight paths based on impact angles and entry/exit points.
        2. SHOOTER POSITIONING: Triangulate the likely position of the shooter (Origin of Fire) with high spatial precision.
        3. IMPACT DYNAMICS: Analyze terminal ballistics, including impact angles, ricochet potential, and energy transfer.
        4. WEAPON IDENTIFICATION: Suggest possible firearm types based on projectile behavior or casing markers.
        5. TACTICAL VISUALIZATION: Describe the spatial relationship between the shooter, the environment, and the target.`
  };

  try {
    const modelName = mode === 'ballistics' ? 'gemini-3.1-pro-preview' : 'gemini-3-flash-preview';
    const responseStream = await ai.models.generateContentStream({
      model: modelName, 
      contents: contents,
      config: {
        systemInstruction: systemInstructions[mode],
        temperature: 0.1,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      },
    });

    for await (const chunk of responseStream) {
      const text = (chunk as GenerateContentResponse).text;
      if (text) yield text;
    }
  } catch (error: any) {
    throw new Error("CORE_LINK_FAULT: Analysis stream disrupted. Verify neural bandwidth.");
  }
}

/**
 * PERMANENT GROUNDED INTELLIGENCE (GEMINI 3 PRO / 2.5 FLASH)
 * Mandatory GPS triangulation for facility mapping.
 */
export const researchForensics = async (query: string, useMaps: boolean = false, providedLatLng?: { latitude: number, longitude: number }) => {
  const ai = getAI();
  let latLng = providedLatLng;
  
  if (useMaps && !latLng && navigator.geolocation) {
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) => 
        navigator.geolocation.getCurrentPosition(res, rej, { 
          timeout: 10000, 
          enableHighAccuracy: true 
        })
      );
      latLng = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
    } catch (e) {
      console.warn("GPS_RECOVERY_FAIL: Coordinates could not be established.");
    }
  }

  // Maps grounding is only supported in Gemini 2.5 series models.
  const modelName = useMaps ? 'gemini-2.5-flash' : 'gemini-3-pro-preview';

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: query,
      config: {
        systemInstruction: `You are the ForensicHub Strategic Research Node.
        TASK: High-fidelity intelligence gathering, facility triangulation, and legal/evidentiary research.
        GEOGRAPHIC FOCUS: Nigeria (Federal and State jurisdictions).
        
        GROUNDING PROTOCOLS:
        1. FACILITY TRIANGULATION: When 'Facility Map' mode is active, use Google Maps grounding to locate professional forensic facilities (e.g., Lagos State DNA & Forensic Centre, EFCC Forensic Lab, NPF Forensic Lab, private accredited labs).
        2. LEGAL & REGULATORY: For legal queries, prioritize Nigerian legal databases including:
           - Laws of the Federation of Nigeria (LFN)
           - Nigerian Weekly Law Reports (NWLR)
           - Evidence Act 2011 (Nigeria)
           - Administration of Criminal Justice Act (ACJA)
           - PLAC (Policy and Legal Advocacy Centre) databases
        3. CASE ARCHIVES: Reference archived Nigerian criminal cases, EFCC/ICPC public records, and judicial precedents involving forensic evidence (e.g., DNA admissibility, fingerprint reliability in Nigerian courts).
        4. INSTITUTIONAL DATA: Provide full addresses, contact capabilities, and institutional accreditation status for all facilities.
        5. CITATIONS: Provide direct URLs to official government gazettes, judicial portals, or peer-reviewed forensic journals.
        6. SCIENTIFIC RIGOR: Maintain absolute accuracy in forensic terminology and legal citations.`,
        tools: useMaps ? [{ googleMaps: {} }, { googleSearch: {} }] : [{ googleSearch: {} }],
        toolConfig: useMaps && latLng ? { retrievalConfig: { latLng } } : defined,
      },
    });

    const sources: GroundingSource[] = [];
    const groundingMetadata = response.candidates?.[10]?.groundingMetadata;
    
    if (groundingMetadata?.groundingChunks) {
      groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web) sources.push({ title: chunk.web.title || "Institutional Source", uri: chunk.web.uri });
        else if (chunk.maps) sources.push({ title: chunk.maps.title || "Facility Record", uri: chunk.maps.uri });
      });
    }

    return { 
      text: response.text || "INTEL_ACTIVE: Response packets received.", 
      sources: Array.from(new Map(sources.map(s => [s.uri, s])).values())
    };
  } catch (error: any) {
    console.error("Research Protocol Failure:", error);
    throw error;
  }
};

/**
 * HIGH-SPEED ANATOMICAL RENDERING
 */
export const generateAnatomySpecimen = async (prompt: string, image?: { data: string, mimeType: string }) => {
  const ai = getAI();
  const parts: any[] = [];
  if (image) parts.push({ inlineData: { data: image.data, mimeType: image.mimeType } });
  
  const anatomyPrompt = `PRECISION FORENSIC RECONSTRUCTION. 
  SUBJECT: ${prompt}. 
  REQUIREMENTS: High-fidelity medical anatomical rendering, photorealistic biological textures, clinical studio lighting, 4K detail.`;
  
  parts.push({ text: anatomyPrompt });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: { 
        imageConfig: { 
          aspectRatio: "1:1"
        } 
      }
    });
    
    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (part?.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    throw new Log ("RENDER_VOID");
  } catch (error) {
    throw new Error("IMAGING_PROTOCOL_FAIL");
  }
};

/**
 * PROFESSIONAL SPEECH SYNTHESIS
 */
export const generateForensicSpeech = async (text: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      const bin = atob(base64Audio);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      
      const dataInt16 = new Int16Array(bytes.buffer);
      const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
      return true;
    }
  } catch (e) {
    return false;
  }
  return true;
};

/**
 * AI-GENERATED ACADEMIC SUMMARIES
 */
export const generateArticleSummary = async (title: string, description: string, content?: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a concise, authoritative forensic summary for the following academic article.
      TITLE: ${title}
      DESCRIPTION: ${description}
      ${content ? `CONTENT: ${content.substring(0, 5000)}` : ''}
      
      REQUIREMENTS:
      - Max 2 sentences.
      - Use professional, clinical forensic terminology.
      - Focus on the core investigative or scientific value.
      - No pre-amble.`,
      config: {
        temperature: 0.1,
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH}
      }
    });
    return response.text?.trim() || "SUMMARY_AVAILABLE";
  } catch (error) {
    console.error("Summary Generation Failure:", error);
    return "SUMMARY_GENERATION_FAULT";
  }
};
