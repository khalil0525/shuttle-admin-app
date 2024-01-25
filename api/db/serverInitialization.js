// File: serverInitialization.js or a similar file

const { User, Permission } = require('./models'); // Adjust path as necessary

async function ensureAllUsersHavePermissions() {
  try {
    const users = await User.findAll();

    const tabs = ['dispatch', 'training', 'whiteboard', 'website'];

    for (const user of users) {
      for (const tabName of tabs) {
        // Check if the permission already exists
        const existingPermission = await Permission.findOne({
          where: { userId: user.id, tabName: tabName },
        });

        // Create permission if it doesn't exist
        if (!existingPermission) {
          await Permission.create({
            userId: user.id,
            tabName,
            canView: false,
            canAdmin: false,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error ensuring user permissions:', error);
  }
}

module.exports = {
  ensureAllUsersHavePermissions,
};
