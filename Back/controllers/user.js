const User = require("../models/user");

exports.getUser = async (req, res, next) => {
    const userId = req.params.id;
    console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }
    res.status(200).json({ user: user.toObject({ getters: true }) });
};

exports.updateUserBalance = async (req, res, next) => {
    const userId = req.body.id;
    const updatedBalance = req.body.balance;
    const user = await User.findByIdAndUpdate(userId, { balance: updatedBalance }, { new: true });
    if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }
    res.status(200).json({ message: "User balance updated successfully" });
}
exports.updateUserVip = async (req, res, next) => {
    const userId = req.body.id;
    const updatedBalance = req.body.balance;
    const { level, expireDate } = req.body.vip
    const user = await User.findByIdAndUpdate(userId, {
        balance: updatedBalance,
        vip: {
            level,
            expireDate
        }
    }, { new: true });
    if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }
    res.status(200).json({ message: "User VIP updated successfully" });
}