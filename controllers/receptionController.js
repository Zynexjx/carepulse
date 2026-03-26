const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Rehab = require("../models/Rehab");
const Emergency = require("../models/Emergency");

const getModelBySection = (section) => {
  switch (section?.toLowerCase()) {
    case "appointment":
      return Appointment;
    case "rehab":
      return Rehab;
    case "emergency":
      return Emergency;
    case "general":
    case "patient":
      return Patient;
    default:
      return null;
  }
};

const generateCode = (prefix) => `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

const preparePayload = (section, body) => {
  const payload = { ...body };

  switch (section?.toLowerCase()) {
    case "appointment":
      payload.appointment_id = payload.appointment_id || generateCode("APT");
      break;
    case "rehab":
      payload.rehab_id = payload.rehab_id || generateCode("REH");
      payload.dateOfAdmission = payload.dateOfAdmission || new Date();
      break;
    case "emergency":
      payload.codeid = payload.codeid || generateCode("EMG");
      payload.date = payload.date || new Date();
      break;
    default:
      payload.section = payload.section || "general";
      break;
  }

  return payload;
};

exports.registerPatient = async (req, res) => {
  try {
    const section = req.body.section || req.path.replace("/", "");
    const Model = getModelBySection(section) || Patient;
    const payload = preparePayload(section, req.body);

    const record = await Model.create(payload);
    res.status(201).json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRehabs = async (req, res) => {
  try {
    const rehabs = await Rehab.find().sort({ createdAt: -1 });
    res.status(200).json(rehabs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmergencies = async (req, res) => {
  try {
    const emergencies = await Emergency.find().sort({ createdAt: -1 });
    res.status(200).json(emergencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const [patients, appointments, rehabs, emergencies] = await Promise.all([
      Patient.find(),
      Appointment.find(),
      Rehab.find(),
      Emergency.find()
    ]);

    const allPatients = [
      ...patients.map((patient) => ({
        ...patient.toObject(),
        type: "General",
        section: patient.section || "general"
      })),
      ...appointments.map((appointment) => ({
        ...appointment.toObject(),
        type: "Appointment",
        section: "appointment"
      })),
      ...rehabs.map((rehab) => ({
        ...rehab.toObject(),
        type: "Rehab",
        section: "rehab"
      })),
      ...emergencies.map((emergency) => ({
        ...emergency.toObject(),
        type: "Emergency",
        section: "emergency"
      }))
    ];

    res.status(200).json(allPatients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateRecord = async (req, res) => {
  try {
    const Model = getModelBySection(req.params.section);

    if (!Model) {
      return res.status(400).json({ message: "Invalid section" });
    }

    const updated = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    const Model = getModelBySection(req.params.section);

    if (!Model) {
      return res.status(400).json({ message: "Invalid section" });
    }

    const deleted = await Model.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReceptionStats = async (req, res) => {
  try {
    const [patients, appointments, rehab, emergency] = await Promise.all([
      Patient.countDocuments(),
      Appointment.countDocuments(),
      Rehab.countDocuments(),
      Emergency.countDocuments()
    ]);

    res.status(200).json({
      patients,
      appointments,
      rehab,
      emergency
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
