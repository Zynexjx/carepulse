const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Rehab = require("../models/Rehab");
const Emergency = require("../models/Emergency");
const Patient = require("../models/Patient");

exports.getWeeklyStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $match: {
          lastLogin: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: "$role",
          total: { $sum: 1 }
        }
      }
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const [users, activeUsers, appointments, rehab, emergency, patients, roleStats, recentLogins] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ active: true }),
      Appointment.countDocuments(),
      Rehab.countDocuments(),
      Emergency.countDocuments(),
      Patient.countDocuments(),
      User.aggregate([
        {
          $group: {
            _id: "$role",
            total: { $sum: 1 }
          }
        }
      ]),
      User.find({ lastLogin: { $ne: null } })
        .select("username role lastLogin")
        .sort({ lastLogin: -1 })
        .limit(7)
    ]);

    res.json({
      stats: {
        users,
        activeUsers,
        appointments,
        rehab,
        emergency,
        patients
      },
      roleStats,
      recentLogins
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
