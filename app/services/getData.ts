import axios from "axios";

export const GetResume = async () => {
  try {
    const response = await axios.get("/api/resume");
    const data = await response.data;
    const latestResume = data.allResumes[data.allResumes.length - 1];
    return latestResume;
  } catch (error) {
    console.error("Error fetching resume data:", error);
    throw error;
  }
};

export const GetResumeById = async (id: string) => {
  try {
    const response = await axios.get(`/api/resume/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching resume data:", error);
    throw error;
  }
};

export const getAnalyzedResume = async () => {
  try {
    const response = await axios.get("/api/analyzer");
    const list = response.data.anaylzedResume ?? [];
    // Return the most recent analysis (last item in the list).
    return list[list.length - 1] ?? null;
  } catch (error) {
    console.error("Error analyzing resume data:", error);
    throw error;
  }
};

export const getTemplates = async () => {
  try {
    const response = await axios.get("/api/templates");
    return response.data.templates ?? [];
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw error;
  }
};
