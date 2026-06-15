import OpenAI from 'openai';

// Initialize OpenAI client (will throw if key is missing and we actually try to use it)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

export const generateScreeningQuestions = async (jobDescription: string) => {
  try {
    // Check if API key exists, otherwise return mock data
    if (!process.env.OPENAI_API_KEY) {
      return [
        "Can you describe your experience relevant to this role?",
        "What are your salary expectations?",
        "Why do you want to work here?"
      ];
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert technical recruiter." },
        { role: "user", content: `Generate 3 screening questions for a candidate applying to this job description: ${jobDescription}` }
      ],
    });

    const questionsText = response.choices[0].message.content || "";
    return questionsText.split('\n').filter(q => q.trim().length > 0);
  } catch (error) {
    console.error('Error generating questions:', error);
    return [];
  }
};

export const extractResumeDetails = async (resumeText: string) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      // Mock parsing for testing without an API key
      return {
        skills: "Mock Skill 1, Mock Skill 2",
        experience: "5 years (Mock)",
        location: "Mock City, USA"
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert recruiter AI. Extract the candidate's top 5 skills, total years of experience, and their location from the resume text. Return ONLY a JSON object with keys: 'skills' (comma separated string), 'experience' (string, e.g. '5 years'), 'location' (string)." },
        { role: "user", content: resumeText }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content || "{}");
  } catch (error) {
    console.error('Error extracting resume:', error);
    return { skills: "Unknown", experience: "Unknown", location: "Unknown" };
  }
};

export const generateCandidateEmail = async (
  candidateName: string,
  candidateSkills: string,
  matchScore: number,
  jobTitle: string,
  jobDescription: string
): Promise<{ subject: string; body: string }> => {
  const isInvite = matchScore >= 85;
  const emailType = isInvite ? 'interview invitation' : 'polite rejection';

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy_key') {
    if (isInvite) {
      return {
        subject: `Interview Invitation – ${jobTitle}`,
        body: `Dear ${candidateName},\n\nWe were thoroughly impressed by your background and skills (${candidateSkills}). Your profile is an excellent match for the ${jobTitle} role and we'd love to invite you for an interview.\n\nPlease reply to this email to schedule a time that works for you.\n\nBest regards,\nThe Recruiting Team`,
      };
    } else {
      return {
        subject: `Your Application for ${jobTitle}`,
        body: `Dear ${candidateName},\n\nThank you for applying for the ${jobTitle} position. After careful review, we've decided to move forward with other candidates whose experience more closely aligns with our current needs.\n\nWe encourage you to apply for future openings that match your profile.\n\nBest regards,\nThe Recruiting Team`,
      };
    }
  }

  try {
    const prompt = isInvite
      ? `Write an enthusiastic interview invitation email to ${candidateName} for the ${jobTitle} role. Their skills are: ${candidateSkills}. Their match score is ${matchScore}%. Keep it professional, warm, and under 150 words.`
      : `Write a polite, empathetic rejection email to ${candidateName} for the ${jobTitle} role. Their skills are: ${candidateSkills}. Their match score was only ${matchScore}%. Mention 1-2 specific skill gaps based on this job description: "${jobDescription.substring(0, 300)}". Keep it under 150 words.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a professional recruiter writing emails. Return ONLY a JSON object with keys "subject" (string) and "body" (string). The body should use \\n for line breaks.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content || '{}');
  } catch (error) {
    console.error('Error generating email:', error);
    return { subject: `Regarding your application for ${jobTitle}`, body: 'Please contact us regarding your application.' };
  }
};

export const scoreCandidate = async (candidateSkills: string, jobDescription: string): Promise<number> => {
  // If no real API key is provided, we simulate the AI scoring logic
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy_key') {
    console.log("Mocking AI Score due to missing OPENAI_API_KEY");
    // Return a random score between 60 and 99 for demonstration
    return Math.floor(Math.random() * (99 - 60 + 1) + 60);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert technical recruiter AI. You must analyze the candidate's skills against the job description and output ONLY a single integer score between 0 and 100 representing their match percentage."
        },
        {
          role: "user",
          content: `Job Description: ${jobDescription}\nCandidate Skills: ${candidateSkills}`
        }
      ],
      temperature: 0.1,
      max_tokens: 10,
    });

    const scoreString = response.choices[0].message.content?.trim() || "0";
    const score = parseInt(scoreString, 10);
    return isNaN(score) ? 0 : score;
  } catch (error) {
    console.error("Error connecting to OpenAI:", error);
    return 0; // Safe fallback
  }
};
