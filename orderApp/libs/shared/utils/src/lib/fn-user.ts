import { User, UserForm } from '@spbogui-openmrs/shared/model';
import { personToForm } from './fn-patient';

export const userToForm = (user: User): UserForm => {
  return {
    username: user.username,
    person: personToForm(user.person),
    roles: user.roles.map((r) => r.uuid),
    systemId: user.systemId,
    userProperties: {
      defaultLocation: user?.userProperties?.defaultLocation,
    },
    uuid: user.uuid,
  };
};
