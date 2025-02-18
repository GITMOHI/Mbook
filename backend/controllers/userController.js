const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Update user details
exports.updateUserDetails = async (req, res) => {
  const { userId } = req.params; // Get the user ID from the URL params
  const { bornIn, currentCity, school, college, description } = req.body; // Get the updated details from the request body

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's details
    user.details = {
      bornIn: bornIn || user.details.bornIn, // Use the new value or keep the existing one
      currentCity: currentCity || user.details.currentCity,
      school: school || user.details.school,
      college: college || user.details.college,
      description: description || user.details.description,
    };

    // Save the updated user to the database
    const updatedUser = await user.save();

    // Return the updated user details
    res.status(200).json(updatedUser.details);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//profilePicture..

exports.setProfilePicture = async (req, res) => {
  const { userId } = req.params; // Get the user ID from the URL params
  const { profilePicture } = req.body; // Get the updated details from the request body
  
  console.log("profile=",req.body)
  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    user.profilePicture = profilePicture || ' ';
    console.log(user.profilePicture);


    const updatedUser = await user.save();
    console.log(updatedUser);
    console.log(updatedUser.profilePicture);

    // Return the new profile picture..
    res.status(200).json({ profilePicture: updatedUser.profilePicture });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};