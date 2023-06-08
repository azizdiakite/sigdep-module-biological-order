import React from 'react';
import { Privilege, Role } from '@spbogui-openmrs/shared/model';

export interface HasAuthorityProps {
  authorities: string[];
  children: JSX.Element | JSX.Element[] | string | string[];
}

export const HasAuthority: React.FC<HasAuthorityProps> = ({
  authorities,
  children,
}) => {
  // const { user } = encryptStorage.getItem('session');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = {};
  const [privilegesLoaded, setPrivilegesLoaded] = React.useState(false);
  const [hasAuthority, setHasAuthority] = React.useState(false);

  React.useEffect(() => {
    if (user && !privilegesLoaded) {
      setHasAuthority(
        authorities.every(
          (p: string) =>
            user.privileges.findIndex(
              (privilege: Privilege) => privilege.name === p
            ) !== -1
        ) ||
          user.roles.findIndex((r: Role) => r.name === 'System Developer') !==
            -1
      );
      setPrivilegesLoaded(true);
    }
  }, [authorities, privilegesLoaded, user]);
  return <div>{hasAuthority && children}</div>;
};

export default HasAuthority;
