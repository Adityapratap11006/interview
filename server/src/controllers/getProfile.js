"use strict";

const getProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

module.exports = getProfile;