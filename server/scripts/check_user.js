(async () => {
  require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
  const mongoose = require('mongoose');
  const User = require('../src/models/User');
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const email = process.argv[2];
    if (!email) {
      console.error('Usage: node check_user.js user@example.com');
      process.exit(2);
    }
    const user = await User.findOne({ email: email.toLowerCase() }).lean();
    if (!user) {
      console.log('User not found');
      process.exit(0);
    }
    console.log('User:', JSON.stringify({ _id: user._id, email: user.email, password: user.password, name: user.name, role: user.role }, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('ERR', err);
    process.exit(2);
  }
})();
