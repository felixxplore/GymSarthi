const Plan = require("../models/Plan");
const Trainer = require("../models/Trainer");
const User = require("../models/User");
 const sendConfirmationEmail = require("../utils/emailService");
const multer = require("multer");

const createPlan = async (req, res) => {
  try {
    // if (req.user.role != "admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }
    const { name, description, price, duration, trainerId } = req.body;

    console.log("verfiy trainer id :", trainerId);
    const trainerData = await Trainer.findById(trainerId);
    console.log("Trainer  data :", trainerData);
    if (!trainerData) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    const plan = new Plan({
      name,
      description,
      price: Number(price),
      duration,
      trainerId,
      users: [],
    });

    const planMake = await plan.save();
    trainerData.plans.push(plan._id);
    await trainerData.save();
    console.log("created Plan successfully : ", planMake);
    res.status(201).json(plan);
  } catch (err) {
    console.log("Error from planController in createPlan : ", err);
    res.status(500).json({ message: err.message });
  }
};

const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
     res.status(200).json(plans);
  } catch (err) {
    console.log("Error from planController in getAllPlans : ", err);
    res.status(500).json({ message: err.message });
  }
};

const updatePlan = async (req, res) => {
  try {
    // if (req.user.role != "admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }

    const { name, description, price, duration } = req.body;

    console.log("updated info varify : ", name, description, price, duration);

    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const trainerId = plan.trainerId;
    if (trainerId) {
      const trainer = await Trainer.findById(trainerId);
      if (!trainer) {
        return res.status(404).json({ message: "Trainer not found" });
      }
      plan.trainerId = trainerId;
    }

    const updatePlan = await Plan.findByIdAndUpdate(req.params.id, {
      name,
      description,
      price,
      duration,
    });

    console.log("Plan :", updatePlan);

    res.status(200).json(plan);
  } catch (err) {
    console.log("Error frm planController in updatePlan : ", err);
    res.status(500).json({ message: err.message });
  }
};

const getPlanById = async (req, res) => {
  try {
    const userId = req.params.id;

    const plan = await Plan.find({ users: userId }).populate("trainerId");
    console.log("plan info from getPlanId :", plan);
    if (!plan) {
      return res.status(404).json({
        status: "fail",
        message: "No plan found with that ID",
      });
    }
    res.status(200).json(plan);
  } catch (err) {
    console.log("Error from getPlanId...");
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// Delete a plan (admin only)
const deletePlan = async (req, res) => {
  try {
    // Check if the user is an admin
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }

    // Find the plan by ID
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Find the trainer associated with the plan
    const trainerInfo = await Trainer.findById(plan.trainerId);
    if (trainerInfo) {
      // Remove all assigned members from the trainer
      trainerInfo.assignedMembers = trainerInfo.assignedMembers.filter(
        (memberId) => !plan.users.includes(memberId)
      );

      // Remove the plan ID from the trainer's plans array
      trainerInfo.plans = trainerInfo.plans.filter(
        (planId) => planId.toString() !== req.params.id
      );

      await trainerInfo.save();
    }

    // Update each user associated with the plan
    await Promise.all(
      plan.users.map(async (userId) => {
        const userData = await User.findById(userId);
        if (userData) {
          if (userData.planName && userData.trainerName) {
            userData.planName = "";
            userData.trainerName = "";
            await userData.save();
          }
        }
      })
    );

    // Delete the plan
    const deletedPlan = await Plan.findByIdAndDelete(req.params.id);
    console.log("Deleted Plan:", deletedPlan);
    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (err) {
    console.log("Error from plan controller in deletePlan:", err);
    res.status(500).json({ message: err.message });
  }
};

// upload plan photo :
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads")); // Save files in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file to avoid conflicts
  },
});

const upload = multer({ storage: storage });

const uploadPlanPhoto = async (req, res) => {
  try {
    const userId = req.params.planId;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Construct the photo URL
    const photoUrl = `/uploads/${req.file.filename}`;

    // Update the Admin document with the photo URL
    const updatedAdmin = await Plan.findByIdAndUpdate(
      userId,
      { photoUrl: photoUrl },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    res.json(updatedAdmin.photoUrl);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
};

module.exports = {
  deletePlan,
  createPlan,
  updatePlan,
  getAllPlans,
  getPlanById,
  uploadPlanPhoto,
};
