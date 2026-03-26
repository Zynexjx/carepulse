const Opd = require("../models/Opd");
const Theater = require("../models/Theater");
const Maternity = require("../models/Maternity");
const Radiology = require("../models/Radiology");

const createCrudHandlers = (Model, resourceName) => ({
  list: async (req, res) => {
    try {
      const records = await Model.find().sort({ createdAt: -1 });
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: `Failed to fetch ${resourceName}`, error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const record = await Model.create(req.body);
      res.status(201).json(record);
    } catch (error) {
      res.status(500).json({ message: `Failed to create ${resourceName}`, error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

      if (!updated) {
        return res.status(404).json({ message: `${resourceName} not found` });
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: `Failed to update ${resourceName}`, error: error.message });
    }
  },

  remove: async (req, res) => {
    try {
      const deleted = await Model.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ message: `${resourceName} not found` });
      }

      res.json({ message: `${resourceName} deleted successfully` });
    } catch (error) {
      res.status(500).json({ message: `Failed to delete ${resourceName}`, error: error.message });
    }
  }
});

const opdHandlers = createCrudHandlers(Opd, "OPD record");
const theaterHandlers = createCrudHandlers(Theater, "theater record");
const maternityHandlers = createCrudHandlers(Maternity, "maternity record");
const radiologyHandlers = createCrudHandlers(Radiology, "radiology record");

exports.getNurseStats = async (req, res) => {
  try {
    const [opd, theater, maternity, radiology] = await Promise.all([
      Opd.countDocuments(),
      Theater.countDocuments(),
      Maternity.countDocuments(),
      Radiology.countDocuments()
    ]);

    res.json({
      opd,
      theater,
      maternity,
      radiology,
      totalPatients: opd + theater + maternity + radiology
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOpdRecords = opdHandlers.list;
exports.createOpdRecord = opdHandlers.create;
exports.updateOpdRecord = opdHandlers.update;
exports.deleteOpdRecord = opdHandlers.remove;

exports.getTheaterRecords = theaterHandlers.list;
exports.createTheaterRecord = theaterHandlers.create;
exports.updateTheaterRecord = theaterHandlers.update;
exports.deleteTheaterRecord = theaterHandlers.remove;

exports.getMaternityRecords = maternityHandlers.list;
exports.createMaternityRecord = maternityHandlers.create;
exports.updateMaternityRecord = maternityHandlers.update;
exports.deleteMaternityRecord = maternityHandlers.remove;

exports.getRadiologyRecords = radiologyHandlers.list;
exports.createRadiologyRecord = radiologyHandlers.create;
