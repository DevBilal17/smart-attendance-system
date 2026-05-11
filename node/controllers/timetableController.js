import Timetable from "../models/Timetable.js";

export const createTimetable = async (req, res) => {
    try {
        const { classId, subject, teacher, sessions, room } = req.body;

        if (!classId || !subject || !teacher || !sessions?.length) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        const timetable = await Timetable.create({
            classId,
            subject,
            teacher,
            sessions,
            room,
        });

        return res.json({
            success: true,
            message: "Timetable created",
            data: timetable,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getTimetables = async (req, res) => {
    try {
        const { classId, teacher } = req.query;

        let filter = {};

        if (classId) filter.classId = classId;
        if (teacher) filter.teacher = teacher;


        const data = await Timetable.find(filter)
            .populate("classId")
            .populate("subject")
            .populate({
                path: "teacher",
                populate: {
                    path: "user",
                    select: "name"
                }
            });
        return res.json({
            success: true,
            data,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getTimetableById = async (req, res) => {
    try {
        const timetable = await Timetable.findById(req.params.id)
            .populate("classId")
            .populate("subject")
            .populate("teacher");

        return res.json({
            success: true,
            data: timetable,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateTimetable = async (req, res) => {
    try {
        const { classId, subject, teacher, sessions, room } = req.body;

        const updated = await Timetable.findByIdAndUpdate(
            req.params.id,
            {
                classId,
                subject,
                teacher,
                sessions,
                room,
            },
            { new: true }
        );

        return res.json({
            success: true,
            message: "Updated successfully",
            data: updated,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const deleteTimetable = async (req, res) => {
    try {
        await Timetable.findByIdAndDelete(req.params.id);

        return res.json({
            success: true,
            message: "Deleted successfully",
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};