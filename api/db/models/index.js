const User = require('./user');
const Route = require('./route');
const ServiceUpdate = require('./serviceUpdate');
const Invite = require('./invite');
const FullRun = require('./fullRun');
const DispatchReport = require('./dispatchReport');
const Resource = require('./resource');
const ResourceAttachment = require('./resourceAttachment');
const Permission = require('./permission');
const Image = require('./image');
const TrainerResource = require('./trainerResource');
const TrainerResourceAttachment = require('./trainerResourceAttachment');
const DispatchRouteLog = require('./dispatchRouteLog');

Route.hasMany(ServiceUpdate, { onDelete: 'CASCADE' });
ServiceUpdate.belongsTo(Route);

User.hasMany(Invite, { foreignKey: 'userId' });
Invite.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(DispatchReport, { onDelete: 'CASCADE' });
DispatchReport.belongsTo(User);

User.hasMany(FullRun, { onDelete: 'CASCADE' });
FullRun.belongsTo(User);
User.hasMany(Permission, { onDelete: 'CASCADE' });
Permission.belongsTo(User, { foreignKey: 'userId' });

Resource.hasMany(ResourceAttachment, {
  as: 'attachments',
  foreignKey: 'resourceId',
  onDelete: 'CASCADE',
});
ResourceAttachment.belongsTo(Resource, { foreignKey: 'resourceId' });

TrainerResource.hasMany(TrainerResourceAttachment, {
  as: 'attachments',
  foreignKey: 'trainerResourceId',
  onDelete: 'CASCADE',
});
TrainerResourceAttachment.belongsTo(TrainerResource, {
  foreignKey: 'trainerResourceId',
});
User.hasMany(DispatchRouteLog, {
  foreignKey: 'userId',
});
DispatchRouteLog.belongsTo(User, {
  foreignKey: 'userId',
});
Route.hasMany(DispatchRouteLog, {
  foreignKey: 'routeId',
});
DispatchRouteLog.belongsTo(Route, {
  foreignKey: 'routeId',
});

module.exports = {
  User,
  Route,
  ServiceUpdate,
  Invite,
  FullRun,
  DispatchReport,
  Resource,
  ResourceAttachment,
  Permission,
  Image,
  TrainerResource,
  TrainerResourceAttachment,
  DispatchRouteLog,
};
