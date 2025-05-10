const axios = require("axios");
require("dotenv").config();

exports.generatePlan = async (req, res) => {

  console.log("Start woring ---------------------------------------------")
  try {


    const {
      name,
      gender,
      weight,
      height,
      age,
      goal,
      experience,
      daysPerWeek,
      workoutType,
      trainingMethod,
      injuries,
      dietPreference,
    } = req.body;

    const prompt = `
Generate a structured ${daysPerWeek}-day fitness workout + diet plan for:
- Name: ${name}
- Gender: ${gender}
- Weight: ${weight}
- Height : ${height}
- Age: ${age}
- Goal: ${goal}
- Experience: ${experience}
- Workout Days: ${daysPerWeek}
- Workout Type: ${workoutType}
- Training Method: ${trainingMethod}
- Injuries/Health Conditions: ${injuries}
- Diet Preference: ${dietPreference}

Make the output clean and organized by day.
    `;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const generatedText =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    res.status(200).json({ success: true, data: generatedText });
  } catch (error) {
    console.error("Gemini error -----------------------------------------------------------------------:", error);
    res.status(500).json({
      success: false,
      message: "Gemini AI generation failed",
      error: error.response?.data || error.message,
    });
  }
};
