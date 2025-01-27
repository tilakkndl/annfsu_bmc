import Notice from "../model/noticeModel.js"; 


// Create a new notice
const createNotice = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ msg: "Name and description are required." });
    }

    const newNotice = new Notice({
      name,
      description,
    });

    const savedNotice = await newNotice.save();
    res.status(201).json({
      status: "success",
      message: "Notice created successfully.",
      notice: savedNotice,
    });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong. Please try again." });
  }
};

// Get all notices
const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find();
    res.status(200).json({
      status: "success",
      notices,
    });
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch notices. Please try again." });
  }
};

// Get a single notice by ID
const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ msg: "Notice not found." });
    }
    res.status(200).json({
      status: "success",
      notice,
    });
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch notice. Please try again." });
  }
};

// Update notice by ID
const updateNotice = async (req, res) => {
  try {
    const { name, description } = req.body;
    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!updatedNotice) {
      return res.status(404).json({ msg: "Notice not found." });
    }

    res.status(200).json({
      status: "success",
      message: "Notice updated successfully.",
      notice: updatedNotice,
    });
  } catch (error) {
    res.status(500).json({ msg: "Failed to update notice. Please try again." });
  }
};

// Delete a notice by ID
const deleteNotice = async (req, res) => {
  try {
    const deletedNotice = await Notice.findByIdAndDelete(req.params.id);

    if (!deletedNotice) {
      return res.status(404).json({ msg: "Notice not found." });
    }

    res.status(200).json({
      status: "success",
      message: "Notice deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ msg: "Failed to delete notice. Please try again." });
  }
};

export { createNotice, getAllNotices, getNoticeById, updateNotice, deleteNotice };  